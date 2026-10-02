import { NextRequest, NextResponse } from 'next/server';
import { auth } from '@/auth';
import { getDatabase } from '@/lib/db';
import { ObjectId } from 'mongodb';

export const runtime = 'nodejs';

// GET /api/meetings/analytics?courseId=xxx&teacherId=xxx - Get meeting analytics
export async function GET(request: NextRequest) {
  try {
    const session = await auth();
    
    if (!session?.user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { searchParams } = new URL(request.url);
    const courseId = searchParams.get('courseId');
    const teacherId = searchParams.get('teacherId');
    const timeRange = searchParams.get('timeRange') || '30'; // days

    const db = await getDatabase();

    // Determine query filters
    let meetingsQuery: any = {};
    let attendanceQuery: any = {};

    if (courseId) {
      meetingsQuery.courseId = courseId;
      attendanceQuery.courseId = courseId;
      
      // Verify access to course
      if (session.user.role === 'COACH') {
        const course = await db.collection("courses").findOne({
          _id: new ObjectId(courseId),
          teacherId: session.user.id
        });
        if (!course) {
          return NextResponse.json({ error: 'Unauthorized access to course' }, { status: 403 });
        }
      }
    }

    if (teacherId) {
      meetingsQuery.teacherId = teacherId;
      
      // Teachers can only access their own analytics
      if (session.user.role === 'COACH' && session.user.id !== teacherId) {
        return NextResponse.json({ error: 'Unauthorized' }, { status: 403 });
      }
    }

    // Add time range filter
    const startDate = new Date();
    startDate.setDate(startDate.getDate() - parseInt(timeRange));
    meetingsQuery.createdAt = { $gte: startDate };
    attendanceQuery.joinTime = { $gte: startDate };

    // Get meetings data
    const meetings = await db.collection("course_meetings")
      .find(meetingsQuery)
      .toArray();

    // Get attendance data
    const attendance = await db.collection("meeting_attendance")
      .find(attendanceQuery)
      .toArray();

    // Get enrollment data for courses
    const courseIds = [...new Set(meetings.map(m => m.courseId))];
    const enrollments = await db.collection("enrollments")
      .find({ 
        courseId: { $in: courseIds },
        status: 'active'
      })
      .toArray();

    // Calculate analytics
    const totalMeetings = meetings.length;
    const totalAttendees = attendance.length;
    const uniqueAttendees = [...new Set(attendance.map(a => a.participantId))].length;
    
    // Average attendance per meeting
    const averageAttendancePerMeeting = totalMeetings > 0 ? totalAttendees / totalMeetings : 0;
    
    // Meeting status distribution
    const meetingStatusCounts = meetings.reduce((acc, meeting) => {
      acc[meeting.status] = (acc[meeting.status] || 0) + 1;
      return acc;
    }, {} as Record<string, number>);

    // Daily meeting activity
    const dailyActivity = meetings.reduce((acc, meeting) => {
      const date = meeting.createdAt.toISOString().split('T')[0];
      acc[date] = (acc[date] || 0) + 1;
      return acc;
    }, {} as Record<string, number>);

    // Course-wise statistics
    const courseStats = courseIds.map(courseId => {
      const courseMeetings = meetings.filter(m => m.courseId === courseId);
      const courseAttendance = attendance.filter(a => a.courseId === courseId);
      const courseEnrollments = enrollments.filter(e => e.courseId === courseId);
      
      return {
        courseId,
        courseName: courseMeetings[0]?.courseTitle || 'Unknown Course',
        totalMeetings: courseMeetings.length,
        totalAttendees: courseAttendance.length,
        enrolledStudents: courseEnrollments.length,
        averageAttendance: courseMeetings.length > 0 ? courseAttendance.length / courseMeetings.length : 0,
        attendanceRate: courseEnrollments.length > 0 ? 
          ([...new Set(courseAttendance.map(a => a.participantId))].length / courseEnrollments.length) * 100 : 0
      };
    });

    // Top performing meetings
    const meetingPerformance = meetings.map(meeting => {
      const meetingAttendance = attendance.filter(a => a.meetingId === meeting.meetingId);
      return {
        meetingId: meeting.meetingId,
        topic: meeting.topic,
        scheduledAt: meeting.scheduledAt,
        attendeeCount: meetingAttendance.length,
        averageDuration: meetingAttendance.length > 0 ? 
          meetingAttendance.reduce((sum, a) => sum + (a.duration || 0), 0) / meetingAttendance.length : 0
      };
    }).sort((a, b) => b.attendeeCount - a.attendeeCount);

    // Recent activity
    const recentMeetings = meetings
      .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())
      .slice(0, 5)
      .map(meeting => ({
        id: meeting._id.toString(),
        topic: meeting.topic,
        courseTitle: meeting.courseTitle,
        scheduledAt: meeting.scheduledAt,
        status: meeting.status,
        attendeeCount: attendance.filter(a => a.meetingId === meeting.meetingId).length
      }));

    return NextResponse.json({
      summary: {
        totalMeetings,
        totalAttendees,
        uniqueAttendees,
        averageAttendancePerMeeting: Math.round(averageAttendancePerMeeting * 100) / 100,
        timeRange: parseInt(timeRange)
      },
      meetingStatusDistribution: meetingStatusCounts,
      dailyActivity,
      courseStats,
      topMeetings: meetingPerformance.slice(0, 10),
      recentActivity: recentMeetings
    });

  } catch (error) {
    console.error("Error fetching meeting analytics:", error);
    return NextResponse.json(
      { error: "Failed to fetch meeting analytics" },
      { status: 500 }
    );
  }
}
