import { NextRequest, NextResponse } from 'next/server';
import { requireAdmin } from '@/lib/api-guard';

// Simple in-memory storage for signaling
// In production, use Redis or a proper database
const rooms = new Map<string, Map<string, any>>();
const participants = new Map<string, { roomId: string; peerId: string; joinedAt: number }>();

export async function POST(request: NextRequest) {
  try {
    const denied = await requireAdmin();
    if (denied) return denied;

    const { type, roomId, peerId, data } = await request.json();

    // Initialize room if doesn't exist
    if (!rooms.has(roomId)) {
      rooms.set(roomId, new Map());
    }

    const room = rooms.get(roomId)!;

    switch (type) {
      case 'join':
        // Add participant to room
        room.set(peerId, {
          peerId,
          joinedAt: Date.now(),
          offers: [],
          answers: [],
          iceCandidates: []
        });
        participants.set(peerId, { roomId, peerId, joinedAt: Date.now() });

        // Return list of existing participants
        const existingParticipants = Array.from(room.keys()).filter(id => id !== peerId);
        return NextResponse.json({ 
          success: true, 
          participants: existingParticipants,
          message: `Joined room ${roomId}` 
        });

      case 'offer':
        // Store offer for target peer
        const targetPeer = room.get(data.targetPeerId);
        if (targetPeer) {
          targetPeer.offers.push({
            from: peerId,
            offer: data.offer,
            timestamp: Date.now()
          });
        }
        return NextResponse.json({ success: true });

      case 'answer':
        // Store answer for target peer
        const answerTargetPeer = room.get(data.targetPeerId);
        if (answerTargetPeer) {
          answerTargetPeer.answers.push({
            from: peerId,
            answer: data.answer,
            timestamp: Date.now()
          });
        }
        return NextResponse.json({ success: true });

      case 'ice-candidate':
        // Store ICE candidate for target peer
        const icePeer = room.get(data.targetPeerId);
        if (icePeer) {
          icePeer.iceCandidates.push({
            from: peerId,
            candidate: data.candidate,
            timestamp: Date.now()
          });
        }
        return NextResponse.json({ success: true });

      case 'poll':
        // Get pending messages for this peer
        const peer = room.get(peerId);
        if (peer) {
          const messages = {
            offers: peer.offers.splice(0), // Remove after reading
            answers: peer.answers.splice(0),
            iceCandidates: peer.iceCandidates.splice(0)
          };
          return NextResponse.json({ success: true, messages });
        }
        return NextResponse.json({ success: true, messages: { offers: [], answers: [], iceCandidates: [] } });

      case 'leave':
        // Remove participant
        room.delete(peerId);
        participants.delete(peerId);
        
        // Clean up empty rooms
        if (room.size === 0) {
          rooms.delete(roomId);
        }
        
        return NextResponse.json({ success: true });

      default:
        return NextResponse.json({ error: 'Unknown type' }, { status: 400 });
    }
  } catch (error) {
    console.error('Signaling error:', error);
    return NextResponse.json({ error: 'Signaling failed' }, { status: 500 });
  }
}

export async function GET(request: NextRequest) {
  try {
    const denied = await requireAdmin();
    if (denied) return denied;

    const url = new URL(request.url);
    const roomId = url.searchParams.get('roomId');
    
    if (!roomId) {
      return NextResponse.json({ error: 'Room ID required' }, { status: 400 });
    }

    const room = rooms.get(roomId);
    const participantCount = room ? room.size : 0;
    const participantList = room ? Array.from(room.keys()) : [];

    return NextResponse.json({ 
      roomId,
      participantCount,
      participants: participantList
    });
  } catch (error) {
    console.error('Get room info error:', error);
    return NextResponse.json({ error: 'Failed to get room info' }, { status: 500 });
  }
}
