import { NextRequest, NextResponse } from 'next/server';
import { auth } from '@/auth';
import { getDatabase } from '@/lib/db';
import { ObjectId } from 'mongodb';

export const runtime = 'nodejs';

// GET /api/admin/courses - Get all courses with admin details
export async function GET(request: NextRequest) {
  try {
    const session = await auth();
    
    if (!session?.user || session.user.role !== 'ADMIN') {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const db = await getDatabase();

    // Get all courses with enriched data
    const courses = await db.collection("courses")
      .find({})
      .sort({ createdAt: -1 })
      .toArray();

    // Enrich with enrollment, payment, and review data
    const enrichedCourses = await Promise.all(
      courses.map(async (course) => {
        // Get enrollment count
        const enrollmentCount = await db.collection("enrollments")
          .countDocuments({ courseId: course._id.toString() });

        // Get total revenue
        const payments = await db.collection("payments")
          .find({ courseId: course._id.toString() })
          .toArray();
        
        const totalRevenue = payments.reduce((sum, payment) => sum + (payment.amount || 0), 0);

        // Get reviews and ratings
        const reviews = await db.collection("reviews")
          .find({ courseId: course._id.toString() })
          .toArray();

        const averageRating = reviews.length > 0 
          ? reviews.reduce((sum, review) => sum + (review.rating || 0), 0) / reviews.length 
          : 0;

        // Get teacher info (null-safe: seeded courses may not have a teacher yet)
        let teacherName = course.teacherName || 'Unknown Teacher';
        let teacherImage = course.teacherImage || null;
        if (course.teacherId) {
          let teacher = null;
          try {
            teacher = await db.collection("users").findOne({
              _id: new ObjectId(course.teacherId)
            });
          } catch { /* invalid ObjectId */ }
          if (!teacher) {
            teacher = await db.collection("users").findOne({ id: course.teacherId });
          }
          if (teacher) {
            teacherName = teacher.name || teacherName;
            teacherImage = teacher.image || teacher.photo || null;
          }
        }

        return {
          ...course,
          _id: course._id.toString(),
          enrollmentCount,
          totalRevenue,
          averageRating: Math.round(averageRating * 10) / 10,
          reviewsCount: reviews.length,
          teacherName,
          teacherImage,
          completionRate: enrollmentCount > 0 ? Math.round((reviews.length / enrollmentCount) * 100) : 0,
          isActive: ['published', 'PUBLISHED', 'active'].includes(course.status)
        };
      })
    );

    return NextResponse.json(enrichedCourses);
  } catch (error) {
    console.error("Error fetching admin courses:", error);
    return NextResponse.json(
      { error: "Failed to fetch courses" },
      { status: 500 }
    );
  }
}

// POST /api/admin/courses - Create a new course (ADMIN only)
export async function POST(request: NextRequest) {
  try {
    const session = await auth();

    if (!session?.user || session.user.role !== 'ADMIN') {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const body = await request.json();

    const title = typeof body.title === 'string' ? body.title.trim() : '';
    if (!title) {
      return NextResponse.json({ error: 'Course title is required' }, { status: 400 });
    }

    const category = typeof body.category === 'string' && body.category.trim() ? body.category.trim() : 'other';
    const level = typeof body.level === 'string' && body.level.trim() ? body.level.trim() : 'beginner';
    const duration = typeof body.duration === 'string' && body.duration.trim() ? body.duration.trim() : '';
    const deliveryMode = typeof body.deliveryMode === 'string' && body.deliveryMode.trim() ? body.deliveryMode.trim() : 'live-online';
    const totalClasses = parseInt(body.totalClasses) || 0;
    const status = typeof body.status === 'string' ? body.status.toLowerCase() : 'draft';

    const db = await getDatabase();

    // Resolve teacher assignment (optional; defaults to admin)
    let teacherId = session.user.id;
    let teacherName = session.user.name || 'Administrator';
    let teacherEmail = session.user.email || '';
    let teacherImage: string | null = null;
    if (typeof body.teacherId === 'string' && body.teacherId.trim()) {
      let teacher = null;
      try {
        teacher = await db.collection("users").findOne({ id: body.teacherId });
      } catch { /* not found */ }
      if (!teacher) {
        teacher = await db.collection("users").findOne({ _id: new ObjectId(body.teacherId) });
      }
      if (teacher) {
        teacherId = teacher.id || teacher._id.toString();
        teacherName = teacher.name || teacherName;
        teacherEmail = teacher.email || teacherEmail;
        teacherImage = teacher.image || teacher.photo || null;
      }
    }

    const courseData = {
      title,
      tagline: typeof body.tagline === 'string' ? body.tagline.trim() : '',
      description: typeof body.description === 'string' ? body.description.trim() : '',
      category,
      price: parseFloat(body.price) || 0,
      compareAtPrice: parseFloat(body.compareAtPrice) || 0,
      duration,
      level,
      deliveryMode,
      totalClasses,
      image: typeof body.image === 'string' && body.image.trim() ? body.image.trim() : null,
      syllabus: typeof body.syllabus === 'string' ? body.syllabus.trim() : '',
      prerequisites: typeof body.prerequisites === 'string' ? body.prerequisites.trim() : '',
      outcomes: typeof body.outcomes === 'string' ? body.outcomes.trim() : '',
      materials: typeof body.materials === 'string' ? body.materials.trim() : '',
      assessments: typeof body.assessments === 'string' ? body.assessments.trim() : '',
      tags: Array.isArray(body.tags) ? body.tags.filter((t: unknown) => typeof t === 'string').map((t: string) => t.trim()).filter(Boolean) : [],
      featured: !!body.featured,
      status,
      teacherId,
      teacherName,
      teacherEmail,
      teacherImage,
      enrolledStudents: [],
      enrolledCount: 0,
      createdBy: session.user.id,
      createdAt: new Date(),
      updatedAt: new Date()
    };

    const result = await db.collection("courses").insertOne(courseData);

    await db.collection("admin_activities").insertOne({
      type: 'course_created',
      message: `Course "${title}" created by admin`,
      courseId: result.insertedId.toString(),
      courseName: title,
      adminId: session.user.id,
      adminName: session.user.name,
      timestamp: new Date().toISOString(),
      createdAt: new Date()
    });

    return NextResponse.json(
      { message: 'Course created successfully', id: result.insertedId.toString(), ...courseData },
      { status: 201 }
    );
  } catch (error) {
    console.error("Error creating course:", error);
    return NextResponse.json(
      { error: "Failed to create course" },
      { status: 500 }
    );
  }
}
