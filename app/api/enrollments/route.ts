import { NextRequest, NextResponse } from 'next/server';
import { auth } from '@/auth';
import { getDatabase } from '@/lib/db';
import { ObjectId } from 'mongodb';
import { sendEnrollmentConfirmation } from '@/lib/email';

export const runtime = 'nodejs';

// GET /api/enrollments - Get user's enrollments or course enrollments
export async function GET(request: NextRequest) {
  try {
    const session = await auth();
    if (!session?.user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { searchParams } = new URL(request.url);
    const courseId = searchParams.get('courseId');
    const studentId = searchParams.get('studentId');

    const db = await getDatabase();

    let query: any = {};

    if (courseId) {
      // Get enrollments for a specific course (for teachers)
      if (session.user.role !== 'COACH') {
        return NextResponse.json({ error: 'Unauthorized' }, { status: 403 });
      }
      query.courseId = courseId;
    } else if (studentId || session.user.role === 'STUDENT') {
      // Get enrollments for a student
      const targetStudentId = studentId || session.user.id;
      if (session.user.role === 'STUDENT' && targetStudentId !== session.user.id) {
        return NextResponse.json({ error: 'Unauthorized' }, { status: 403 });
      }
      query.studentId = targetStudentId;
    } else {
      return NextResponse.json({ error: 'Invalid request' }, { status: 400 });
    }

    const enrollments = await db.collection("enrollments")
      .find(query)
      .sort({ enrolledAt: -1 })
      .toArray();

    // If getting student enrollments, also fetch course details
    if (query.studentId) {
      const courseIds = enrollments.map(e => new ObjectId(e.courseId));
      const courses = await db.collection("courses")
        .find({ _id: { $in: courseIds }, status: 'published' })
        .toArray();

      const enrichedEnrollments = enrollments.map(enrollment => {
        const course = courses.find(c => c._id.toString() === enrollment.courseId);
        return {
          ...enrollment,
          course: course ? {
            id: course._id.toString(),
            title: course.title,
            description: course.description,
            image: course.image,
            teacherName: course.teacherName,
            category: course.category,
            totalClasses: course.totalClasses || 0
          } : null
        };
      }).filter(e => e.course); // Remove enrollments for deleted/unpublished courses

      return NextResponse.json(enrichedEnrollments);
    }

    return NextResponse.json(enrollments);
  } catch (error) {
    console.error("Error fetching enrollments:", error);
    return NextResponse.json(
      { error: "Failed to fetch enrollments" },
      { status: 500 }
    );
  }
}

// POST /api/enrollments - Enroll student in a course
export async function POST(request: NextRequest) {
  try {
    const session = await auth();
    if (!session?.user || session.user.role !== 'STUDENT') {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { courseId, paymentId } = await request.json();

    if (!courseId) {
      return NextResponse.json({ error: 'Course ID is required' }, { status: 400 });
    }

    const db = await getDatabase();

    // Check if course exists and is published
    const course = await db.collection("courses").findOne({
      _id: new ObjectId(courseId),
      status: 'published'
    });

    if (!course) {
      return NextResponse.json({ error: 'Course not found or not available' }, { status: 404 });
    }

    // Check if already enrolled
    const existingEnrollment = await db.collection("enrollments").findOne({
      studentId: session.user.id,
      courseId: courseId
    });

    if (existingEnrollment) {
      return NextResponse.json({ error: 'Already enrolled in this course' }, { status: 400 });
    }

    // Create enrollment
    const enrollment = {
      studentId: session.user.id,
      studentName: session.user.name,
      studentEmail: session.user.email,
      courseId: courseId,
      courseTitle: course.title,
      teacherId: course.teacherId,
      paymentId: paymentId || null,
      enrolledAt: new Date(),
      status: 'active',
      progress: 0,
      completedClasses: 0
    };

    const result = await db.collection("enrollments").insertOne(enrollment);

    // Update course enrolled count
    await db.collection("courses").updateOne(
      { _id: new ObjectId(courseId) },
      { 
        $inc: { enrolledCount: 1 },
        $addToSet: { 
          enrolledStudents: {
            studentId: session.user.id,
            studentName: session.user.name || 'Unknown',
            enrolledAt: new Date()
          }
        }
      }
    );

    // Send enrollment confirmation email
    try {
      if (session.user.email) {
        await sendEnrollmentConfirmation({
          studentName: session.user.name || 'Student',
          studentEmail: session.user.email,
          courseTitle: course.title,
          teacherName: course.teacherName || 'Instructor',
          enrollmentDate: new Date(),
          courseId: courseId,
          paymentId: paymentId
        });
      }
      console.log('Enrollment confirmation email sent successfully');
    } catch (emailError) {
      // Log email error but don't fail the enrollment
      console.error('Failed to send enrollment confirmation email:', emailError);
    }

    return NextResponse.json({
      message: 'Successfully enrolled in course',
      enrollmentId: result.insertedId.toString()
    });
  } catch (error) {
    console.error("Error creating enrollment:", error);
    return NextResponse.json(
      { error: "Failed to enroll in course" },
      { status: 500 }
    );
  }
}
