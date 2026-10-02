import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/auth";
import { getDatabase } from "@/lib/db";
import { ObjectId } from "mongodb";

export async function GET(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const session = await auth();
    
    if (!session?.user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { id: meetingId } = await params;
    const db = await getDatabase();

    // Get meeting details - handle both ObjectId and string IDs
    let meeting;
    try {
      meeting = await db.collection("meetings").findOne({
        $or: [
          { _id: new ObjectId(meetingId) },
          { jitsiRoomId: meetingId },
          { meetingId: meetingId }
        ]
      });
    } catch {
      // If ObjectId conversion fails, search by string fields only
      meeting = await db.collection("meetings").findOne({
        $or: [
          { jitsiRoomId: meetingId },
          { meetingId: meetingId }
        ]
      });
    }

    if (!meeting) {
      return NextResponse.json({ error: "Meeting not found" }, { status: 404 });
    }

    // Allow anyone to join - no authentication barriers
    let canJoin = true;
    let role = "participant"; // Everyone joins as participant
    let accessUrl = `https://${meeting.jitsiConfig?.domain || "meet.jit.si"}/${meeting.jitsiRoomId}`;
    
    // Simple access - everyone can join, no barriers

    if (!canJoin) {
      return NextResponse.json(
        { error: "Access denied" },
        { status: 403 }
      );
    }

    // Log participant join attempt
    await db.collection("meeting_participants").insertOne({
      _id: new ObjectId(),
      meetingId: meeting._id,
      userId: session.user.id,
      userName: session.user.name,
      userRole: role,
      joinedAt: new Date(),
      leftAt: null,
      durationMinutes: 0
    });

    // Return access information
    const response = {
      canJoin: true,
      role,
      meeting: {
        id: meeting._id,
        topic: meeting.topic,
        roomId: meeting.jitsiRoomId,
        domain: meeting.jitsiConfig?.domain || "meet.jit.si",
        scheduledAt: meeting.scheduledAt,
        duration: meeting.duration,
        status: meeting.status
      },
      access: {
        url: accessUrl,
        embedUrl: `https://${meeting.jitsiConfig?.domain || "meet.jit.si"}/${meeting.jitsiRoomId}`,
        roomName: meeting.jitsiRoomId,
        userInfo: {
          displayName: session.user.name,
          email: session.user.email,
          role: role
        },
        config: {
          startWithAudioMuted: role === "participant",
          startWithVideoMuted: false,
          enableRecording: meeting.jitsiConfig?.enableRecording && role === "moderator",
          enableChat: meeting.jitsiConfig?.enableChat,
          enableScreenShare: meeting.jitsiConfig?.enableScreenShare
        }
      }
    };

    return NextResponse.json(response);

  } catch (error) {
    console.error("Error verifying meeting access:", error);
    return NextResponse.json(
      { error: "Failed to verify meeting access" },
      { status: 500 }
    );
  }
}

export async function POST(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const session = await auth();
    
    if (!session?.user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { id: meetingId } = await params;
    const body = await req.json();
    const { action, duration } = body; // action: 'join', 'leave', 'update'

    const db = await getDatabase();

    if (action === "leave" && duration) {
      // Update participant record when they leave
      await db.collection("meeting_participants").updateOne(
        {
          meetingId: meetingId,
          userId: session.user.id,
          leftAt: null
        },
        {
          $set: {
            leftAt: new Date(),
            durationMinutes: Math.round(duration / 60) // Convert seconds to minutes
          }
        }
      );
    }

    return NextResponse.json({ success: true });

  } catch (error) {
    console.error("Error updating meeting participation:", error);
    return NextResponse.json(
      { error: "Failed to update participation" },
      { status: 500 }
    );
  }
}
