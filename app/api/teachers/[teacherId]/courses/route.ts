import { NextRequest, NextResponse } from 'next/server';
import { auth } from '@/auth';
import { getDatabase } from '@/lib/db';
import { ObjectId } from 'mongodb';

export const runtime = 'nodejs';

// GET /api/teachers/[teacherId]/courses - Get teacher's courses with full management
export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ teacherId: string }> }
) {
  try {
    const session = await auth();
    
    if (!session?.user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { teacherId } = await params;
    
    // Teachers can only access their own courses, admins can access any
    if (session.user.role === 'COACH' && session.user.id !== teacherId) {
      return NextResponse.json({ error: 'Forbidden' }, { status: 403 });
    }

    if (!['ADMIN', 'COACH'].includes(session.user.role || '')) {
      return NextResponse.json({ error: 'Forbidden' }, { status: 403 });
    }

    const db = await getDatabase();

    const courses = await db.collection("courses")
      .find({ teacherId: teacherId })
      .sort({ createdAt: -1 })
      .toArray();

    // Enrich with enrollment and meeting data
    const enrichedCourses = await Promise.all(
      courses.map(async (course) => {
        // Get enrollment count and recent enrollments
        const enrollments = await db.collection("enrollments")
          .find({ courseId: course._id.toString() })
          .sort({ enrolledAt: -1 })
          .limit(5)
          .toArray();

        // Get meetings count
        const meetingsCount = await db.collection("course_meetings")
          .countDocuments({ courseId: course._id.toString() });

        // Get payments total
        const payments = await db.collection("payments")
          .find({ courseId: course._id.toString() })
          .toArray();

        const totalRevenue = payments.reduce((sum, payment) => sum + payment.amount, 0);

        // Get reviews
        const reviews = await db.collection("reviews")
          .find({ courseId: course._id.toString() })
          .toArray();

        const avgRating = reviews.length > 0 
          ? reviews.reduce((sum, review) => sum + review.rating, 0) / reviews.length 
          : 0;

        return {
          ...course,
          id: course._id.toString(),
          enrollmentCount: enrollments.length,
          recentEnrollments: enrollments.map(e => ({
            studentName: e.studentName,
            enrolledAt: e.enrolledAt
          })),
          meetingsCount,
          totalRevenue,
          reviewsCount: reviews.length,
          averageRating: Math.round(avgRating * 10) / 10
        };
      })
    );

    return NextResponse.json(enrichedCourses);
  } catch (error) {
    console.error("Error fetching teacher courses:", error);
    return NextResponse.json(
      { error: "Failed to fetch courses" },
      { status: 500 }
    );
  }
}

// POST /api/teachers/[teacherId]/courses - Create new course
export async function POST(
  request: NextRequest,
  { params }: { params: Promise<{ teacherId: string }> }
) {
  try {
    const session = await auth();
    
    const { teacherId } = await params;
    
    if (!session?.user || session.user.role !== 'COACH' || session.user.id !== teacherId) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const courseData = await request.json();

    const db = await getDatabase();

    // Get teacher info
    const teacher = await db.collection("users").findOne({
      id: teacherId,
      role: 'COACH'
    });

    if (!teacher) {
      return NextResponse.json({ error: 'Teacher not found' }, { status: 404 });
    }

    const course = {
      ...courseData,
      teacherId: teacherId,
      teacherName: teacher.name || 'Unknown Teacher',
      teacherEmail: teacher.email,
      enrolledStudents: [],
      enrolledCount: 0,
      createdAt: new Date(),
      updatedAt: new Date()
    };

    const result = await db.collection("courses").insertOne(course);

    return NextResponse.json({
      message: 'Course created successfully',
      courseId: result.insertedId.toString()
    });
  } catch (error) {
    console.error("Error creating course:", error);
    return NextResponse.json(
      { error: "Failed to create course" },
      { status: 500 }
    );
  }
}

// DELETE /api/teachers/[teacherId]/courses - Bulk operations
export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ teacherId: string }> }
) {
  try {
    const session = await auth();
    
    const { teacherId } = await params;
    
    if (!session?.user || session.user.role !== 'COACH' || session.user.id !== teacherId) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { courseIds } = await request.json();

    if (!Array.isArray(courseIds) || courseIds.length === 0) {
      return NextResponse.json({ error: 'Course IDs are required' }, { status: 400 });
    }

    const db = await getDatabase();

    // Verify all courses belong to the teacher
    const courses = await db.collection("courses")
      .find({ 
        _id: { $in: courseIds.map(id => new ObjectId(id)) },
        teacherId: teacherId
      })
      .toArray();

    if (courses.length !== courseIds.length) {
      return NextResponse.json({ error: 'Some courses not found or unauthorized' }, { status: 403 });
    }

    // Delete related data first
    await Promise.all([
      db.collection("enrollments").deleteMany({ courseId: { $in: courseIds } }),
      db.collection("course_meetings").deleteMany({ courseId: { $in: courseIds } }),
      db.collection("reviews").deleteMany({ courseId: { $in: courseIds } }),
      db.collection("payment_intents").deleteMany({ courseId: { $in: courseIds } })
    ]);

    // Delete courses
    const result = await db.collection("courses").deleteMany({
      _id: { $in: courseIds.map(id => new ObjectId(id)) }
    });

    return NextResponse.json({
      message: `${result.deletedCount} courses deleted successfully`
    });
  } catch (error) {
    console.error("Error deleting courses:", error);
    return NextResponse.json(
      { error: "Failed to delete courses" },
      { status: 500 }
    );
  }
}
