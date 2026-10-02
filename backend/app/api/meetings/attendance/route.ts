import { NextRequest, NextResponse } from 'next/server';
import { auth } from '@/auth';
import { getDatabase } from '@/lib/db';
import { ObjectId } from 'mongodb';

export const runtime = 'nodejs';

// POST /api/meetings/attendance - Record meeting attendance
export async function POST(request: NextRequest) {
  try {
    const session = await auth();
    
    if (!session?.user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { meetingId, participantId, joinTime, leaveTime, duration } = await request.json();

    if (!meetingId || !participantId) {
      return NextResponse.json({ error: 'Meeting ID and participant ID are required' }, { status: 400 });
    }

    const db = await getDatabase();

    // Find the meeting
    const meeting = await db.collection("course_meetings").findOne({
      meetingId: meetingId.toString()
    });

    if (!meeting) {
      return NextResponse.json({ error: 'Meeting not found' }, { status: 404 });
    }

    // Check if user is enrolled in the course (for students) or owns the course (for teachers)
    if (session.user.role === 'STUDENT') {
      const enrollment = await db.collection("enrollments").findOne({
        courseId: meeting.courseId,
        studentId: session.user.id,
        status: 'active'
      });
      if (!enrollment) {
        return NextResponse.json({ error: 'Not enrolled in this course' }, { status: 403 });
      }
    } else if (session.user.role === 'COACH') {
      if (meeting.teacherId !== session.user.id) {
        return NextResponse.json({ error: 'Unauthorized' }, { status: 403 });
      }
    }

    // Record attendance
    const attendance = {
      meetingId: meetingId.toString(),
      courseId: meeting.courseId,
      participantId,
      participantName: session.user.name || 'Unknown',
      participantEmail: session.user.email || '',
      participantRole: session.user.role,
      joinTime: joinTime ? new Date(joinTime) : new Date(),
      leaveTime: leaveTime ? new Date(leaveTime) : null,
      duration: duration || 0,
      createdAt: new Date()
    };

    // Check if attendance already exists (update if exists)
    const existingAttendance = await db.collection("meeting_attendance").findOne({
      meetingId: meetingId.toString(),
      participantId: participantId
    });

    if (existingAttendance) {
      await db.collection("meeting_attendance").updateOne(
        { _id: existingAttendance._id },
        { 
          $set: { 
            leaveTime: attendance.leaveTime,
            duration: attendance.duration,
            updatedAt: new Date()
          }
        }
      );
    } else {
      await db.collection("meeting_attendance").insertOne(attendance);
    }

    return NextResponse.json({ message: 'Attendance recorded successfully' });
  } catch (error) {
    console.error("Error recording attendance:", error);
    return NextResponse.json(
      { error: "Failed to record attendance" },
      { status: 500 }
    );
  }
}

// GET /api/meetings/attendance?meetingId=xxx - Get meeting attendance
export async function GET(request: NextRequest) {
  try {
    const session = await auth();
    
    if (!session?.user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { searchParams } = new URL(request.url);
    const meetingId = searchParams.get('meetingId');
    const courseId = searchParams.get('courseId');

    if (!meetingId && !courseId) {
      return NextResponse.json({ error: 'Meeting ID or Course ID is required' }, { status: 400 });
    }

    const db = await getDatabase();

    let query: any = {};
    
    if (meetingId) {
      query.meetingId = meetingId;
    }
    
    if (courseId) {
      query.courseId = courseId;
      
      // Verify access to course
      if (session.user.role === 'COACH') {
        const course = await db.collection("courses").findOne({
          _id: new ObjectId(courseId),
          teacherId: session.user.id
        });
        if (!course) {
          return NextResponse.json({ error: 'Unauthorized' }, { status: 403 });
        }
      } else if (session.user.role === 'STUDENT') {
        const enrollment = await db.collection("enrollments").findOne({
          courseId: courseId,
          studentId: session.user.id,
          status: 'active'
        });
        if (!enrollment) {
          return NextResponse.json({ error: 'Not enrolled in this course' }, { status: 403 });
        }
      }
    }

    const attendance = await db.collection("meeting_attendance")
      .find(query)
      .sort({ joinTime: 1 })
      .toArray();

    // Format response
    const formattedAttendance = attendance.map((record: any) => ({
      id: record._id.toString(),
      meetingId: record.meetingId,
      courseId: record.courseId,
      participantId: record.participantId,
      participantName: record.participantName,
      participantEmail: record.participantEmail,
      participantRole: record.participantRole,
      joinTime: record.joinTime,
      leaveTime: record.leaveTime,
      duration: record.duration,
      createdAt: record.createdAt
    }));

    return NextResponse.json(formattedAttendance);
  } catch (error) {
    console.error("Error fetching attendance:", error);
    return NextResponse.json(
      { error: "Failed to fetch attendance" },
      { status: 500 }
    );
  }
}
