import { NextRequest, NextResponse } from 'next/server';
import { auth } from '@/auth';
import { getDatabase } from '@/lib/db';
import { ObjectId } from 'mongodb';

export const runtime = 'nodejs';

// GET /api/students/[id]/meetings - Get meetings for enrolled courses
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
    const { searchParams } = new URL(request.url);
    const type = searchParams.get('type') || 'upcoming';

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

    const courseIds = enrollments.map(enrollment => enrollment.courseId);

    // Build meeting query based on type
    let meetingQuery: any = {
      courseId: { $in: courseIds }
    };

    const now = new Date();

    if (type === 'upcoming') {
      meetingQuery.scheduledAt = { $gte: now };
    } else if (type === 'past') {
      meetingQuery.scheduledAt = { $lt: now };
    }
    // 'all' type doesn't add time filter

    // Get meetings for enrolled courses
    const meetings = await db.collection("course_meetings")
      .find(meetingQuery)
      .sort({ scheduledAt: type === 'past' ? -1 : 1 })
      .toArray();

    // Get course details for each meeting
    const meetingsWithCourseInfo = await Promise.all(
      meetings.map(async (meeting: any) => {
        const course = await db.collection("courses").findOne({
          _id: new ObjectId(meeting.courseId)
        });

        return {
          id: meeting._id.toString(),
          meetingId: meeting.meetingId,
          courseId: meeting.courseId,
          courseTitle: course?.title || 'Unknown Course',
          teacherId: meeting.teacherId,
          teacherName: meeting.teacherName,
          topic: meeting.topic,
          description: meeting.description || '',
          scheduledAt: meeting.scheduledAt,
          duration: meeting.duration,
          isInstant: meeting.isInstant || false,
          // Zoom disabled — kept optional for legacy rows. Live classes use Daily.co.
          zoomData: meeting.zoomData || {
            join_url: meeting.joinUrl,
            start_url: meeting.startUrl,
            password: meeting.password,
            meeting_id: meeting.meetingId
          },
          daily: meeting.daily || {
            roomUrl: meeting.dailyRoomUrl || meeting.joinUrl
          },
          status: meeting.status || (new Date(meeting.scheduledAt) > now ? 'scheduled' : 'completed'),
          course: {
            id: course?._id.toString(),
            title: course?.title,
            image: course?.image,
            category: course?.category
          },
          createdAt: meeting.createdAt
        };
      })
    );

    return NextResponse.json(meetingsWithCourseInfo);
  } catch (error) {
    console.error("Error fetching student meetings:", error);
    return NextResponse.json(
      { error: "Failed to fetch meetings" },
      { status: 500 }
    );
  }
}
