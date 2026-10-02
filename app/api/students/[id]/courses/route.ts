import { NextRequest, NextResponse } from 'next/server';
import { auth } from '@/auth';
import { getDatabase } from '@/lib/db';
import { ObjectId } from 'mongodb';

export const runtime = 'nodejs';

// GET /api/students/[id]/courses - Get enrolled courses for student
export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const session = await auth();
    
    if (!session?.user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { id: studentId } = await params;

    // Verify the user can access this student's data
    if (session.user.role === 'STUDENT' && session.user.id !== studentId) {
      return NextResponse.json({ error: 'Forbidden' }, { status: 403 });
    }

    const db = await getDatabase();

    // Get enrolled courses for the student
    const enrollments = await db.collection("enrollments")
      .find({ 
        studentId: studentId,
        status: 'active'
      })
      .toArray();

    if (enrollments.length === 0) {
      return NextResponse.json([]);
    }

    // Get course details for each enrollment
    const coursesWithProgress = await Promise.all(
      enrollments.map(async (enrollment: any) => {
        const course = await db.collection("courses").findOne({
          _id: new ObjectId(enrollment.courseId)
        });

        if (!course) {
          return null;
        }

        // Calculate progress (you can enhance this based on your progress tracking system)
        const progress = enrollment.progress || 0;
        const completedClasses = Math.floor((progress / 100) * (course.totalClasses || 0));

        // Get next upcoming meeting for this course
        const nextMeeting = await db.collection("course_meetings")
          .findOne({
            courseId: enrollment.courseId,
            scheduledAt: { $gte: new Date() }
          }, {
            sort: { scheduledAt: 1 }
          });

        return {
          id: course._id.toString(),
          title: course.title,
          description: course.description,
          category: course.category,
          image: course.image,
          price: course.price,
          progress: progress,
          teacherName: course.teacherName || 'Unknown Teacher',
          totalClasses: course.totalClasses || 0,
          completedClasses: completedClasses,
          enrolledAt: enrollment.createdAt,
          nextClass: nextMeeting ? {
            date: nextMeeting.scheduledAt.toISOString().split('T')[0],
            time: nextMeeting.scheduledAt.toTimeString().substring(0, 5),
            topic: nextMeeting.topic
          } : null
        };
      })
    );

    // Filter out null values (courses that don't exist)
    const validCourses = coursesWithProgress.filter(course => course !== null);

    return NextResponse.json(validCourses);
  } catch (error) {
    console.error("Error fetching enrolled courses:", error);
    return NextResponse.json(
      { error: "Failed to fetch enrolled courses" },
      { status: 500 }
    );
  }
}
