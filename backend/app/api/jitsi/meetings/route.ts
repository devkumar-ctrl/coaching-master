import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/auth";
import { getDatabase } from "@/lib/db";
import { v4 as uuidv4 } from "uuid";
import { ObjectId } from "mongodb";

// Generate unique Jitsi room ID
function generateRoomId(): string {
  return `coaching-${Date.now()}-${uuidv4().slice(0, 8)}`;
}

export async function POST(req: NextRequest) {
  try {
    const session = await auth();
    
    if (!session?.user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    if (session.user.role !== "COACH") {
      return NextResponse.json({ error: "Only teachers can create meetings" }, { status: 403 });
    }

    const body = await req.json();
    const {
      topic,
      courseId,
      agenda,
      duration = 60,
      isInstant = false,
      start_time,
      enableRecording = true,
      enableChat = true,
      enableScreenShare = true
    } = body;

    if (!topic?.trim()) {
      return NextResponse.json({ error: "Meeting topic is required" }, { status: 400 });
    }

    const db = await getDatabase();
    
    // Verify course ownership if courseId is provided
    if (courseId && courseId !== "none") {
      try {
        const course = await db.collection("courses").findOne({
          _id: new ObjectId(courseId),
          teacherId: session.user.id
        });
        
        if (!course) {
          return NextResponse.json({ error: "Course not found or not owned by teacher" }, { status: 404 });
        }
      } catch (error) {
        console.error("Invalid courseId format:", courseId);
        return NextResponse.json({ error: "Invalid course ID format" }, { status: 400 });
      }
    }

    // Generate Jitsi room configuration - no passwords, no authentication
    const roomId = generateRoomId();
    
    const jitsiConfig = {
      roomName: roomId,
      domain: process.env.JITSI_DOMAIN || "meet.jit.si",
      enableRecording,
      enableChat,
      enableScreenShare,
      maxParticipants: 100, // Default limit
      requireAuth: false,
      allowGuests: true,
      moderatorRequired: false,
      lobbyEnabled: false
    };

    // Create meeting document
    const meetingData = {
      _id: new ObjectId(),
      topic: topic.trim(),
      courseId: courseId && courseId !== "none" ? new ObjectId(courseId) : null,
      teacherId: session.user.id,
      teacherName: session.user.name,
      scheduledAt: isInstant ? new Date() : new Date(start_time),
      duration,
      status: isInstant ? "live" : "scheduled",
      isInstant,
      agenda: agenda?.trim() || "",
      jitsiRoomId: roomId,
      jitsiConfig,
      enrollmentRequired: !!courseId && courseId !== "none",
      paymentRequired: true, // Default to requiring payment
      createdAt: new Date(),
      updatedAt: new Date(),
      // For compatibility with existing code
      meetingId: roomId,
      zoomData: null // Will be removed in migration
    };

    // Insert meeting into database
    await db.collection("meetings").insertOne(meetingData);

    // Return meeting data with join URLs
    const response = {
      id: meetingData._id,
      meetingId: roomId,
      topic: meetingData.topic,
      roomName: roomId,
      jitsi: {
        roomId,
        domain: jitsiConfig.domain,
        url: `https://${jitsiConfig.domain}/${roomId}#config.startWithAudioMuted=false&config.startWithVideoMuted=false&userInfo.displayName="${session.user.name || 'Host'}"`,
        embedUrl: `https://${jitsiConfig.domain}/${roomId}`,
        config: jitsiConfig
      },
      scheduledAt: meetingData.scheduledAt,
      duration: meetingData.duration,
      status: meetingData.status,
      isInstant: meetingData.isInstant
    };

    return NextResponse.json(response);

  } catch (error) {
    console.error("Error creating Jitsi meeting:", error);
    return NextResponse.json(
      { error: "Failed to create meeting" },
      { status: 500 }
    );
  }
}

export async function GET(req: NextRequest) {
  try {
    const session = await auth();
    
    if (!session?.user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { searchParams } = new URL(req.url);
    const courseId = searchParams.get("courseId");
    const teacherId = searchParams.get("teacherId");
    const type = searchParams.get("type"); // 'upcoming', 'past', 'all'

    const db = await getDatabase();
    
    // Build query based on user role and parameters
    let query: any = {};
    
    if (session.user.role === "COACH") {
      // Teachers can see their own meetings
      query.teacherId = session.user.id;
    } else if (session.user.role === "STUDENT") {
      // Students can only see meetings for courses they're enrolled in
      const enrollments = await db.collection("enrollments").find({
        studentId: session.user.id,
        status: "active"
      }).toArray();
      
      const enrolledCourseIds = enrollments.map(e => new ObjectId(e.courseId));
      query.courseId = { $in: enrolledCourseIds };
      
      // Also check payment status for access
      query.paymentRequired = { $ne: true }; // For now, simplified logic
    }

    if (courseId && courseId !== "none") {
      query.courseId = new ObjectId(courseId);
    }

    if (teacherId) {
      query.teacherId = teacherId;
    }

    // Filter by time if type is specified
    const now = new Date();
    if (type === "upcoming") {
      query.$or = [
        { status: "live" },
        { status: "started" },
        { scheduledAt: { $gt: now } }
      ];
    } else if (type === "past") {
      query.status = "ended";
    }

    // Get meetings with course information
    const meetings = await db.collection("meetings").aggregate([
      { $match: query },
      {
        $lookup: {
          from: "courses",
          localField: "courseId",
          foreignField: "_id",
          as: "course"
        }
      },
      {
        $addFields: {
          courseTitle: { $arrayElemAt: ["$course.title", 0] }
        }
      },
      { $project: { course: 0 } }, // Remove the course array
      { $sort: { scheduledAt: -1 } }
    ]).toArray();

    // Format meetings for frontend
    const formattedMeetings = meetings.map(meeting => ({
      id: meeting._id,
      meetingId: meeting.jitsiRoomId || meeting.meetingId,
      topic: meeting.topic,
      courseId: meeting.courseId ? meeting.courseId.toString() : null,
      courseTitle: meeting.courseTitle,
      scheduledAt: meeting.scheduledAt,
      duration: meeting.duration,
      status: meeting.status,
      isInstant: meeting.isInstant,
      teacherId: meeting.teacherId,
      teacherName: meeting.teacherName,
      createdAt: meeting.createdAt,
      // Provide access URLs based on user role
      jitsiData: session.user.role === "COACH" ? {
        roomId: meeting.jitsiRoomId,
        domain: meeting.jitsiConfig?.domain || "meet.jit.si",
        moderatorUrl: `https://${meeting.jitsiConfig?.domain || "meet.jit.si"}/${meeting.jitsiRoomId}`,
        participantUrl: `https://${meeting.jitsiConfig?.domain || "meet.jit.si"}/${meeting.jitsiRoomId}`,
        embedUrl: `https://${meeting.jitsiConfig?.domain || "meet.jit.si"}/${meeting.jitsiRoomId}`
      } : {
        roomId: meeting.jitsiRoomId,
        domain: meeting.jitsiConfig?.domain || "meet.jit.si",
        participantUrl: `https://${meeting.jitsiConfig?.domain || "meet.jit.si"}/${meeting.jitsiRoomId}`,
        embedUrl: `https://${meeting.jitsiConfig?.domain || "meet.jit.si"}/${meeting.jitsiRoomId}`
      }
    }));

    return NextResponse.json(formattedMeetings);

  } catch (error) {
    console.error("Error fetching Jitsi meetings:", error);
    return NextResponse.json(
      { error: "Failed to fetch meetings" },
      { status: 500 }
    );
  }
}
