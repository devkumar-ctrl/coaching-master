import { NextRequest, NextResponse } from 'next/server';

const DAILY_API_URL = 'https://api.daily.co/v1';

function getApiKey(): string | undefined {
  return process.env.DAILY_API_KEY;
}

function getDailyDomain(): string | undefined {
  return process.env.DAILY_DOMAIN;
}

function generateRoomId(): string {
  return `yuvabot-${Date.now()}-${Math.random().toString(36).slice(2, 10)}`;
}

// Create a Daily.co room.
// - With DAILY_API_KEY: real room created via Daily REST API (free tier included).
// - Without API key: falls back to a prebuilt-style URL using DAILY_DOMAIN so local/dev
//   flows can still share a link. Room won't be joinable on Daily's servers until a key is set.
export async function POST(request: NextRequest) {
  try {
    const { topic, agenda, duration = 60, isInstant = false } = await request.json();

    const roomId = generateRoomId();
    const apiKey = getApiKey();
    const domain = getDailyDomain(); // e.g. "yuvabot" -> https://yuvabot.daily.co/...

    let room: { id: string; name: string; url: string; privacy: string } | null = null;

    if (apiKey) {
      const properties: Record<string, unknown> = {
        enable_prejoin_ui: true,
        enable_screenshare: true,
        enable_chat: true,
        start_audio_off: true,
        start_video_off: true,
        max_participants: 100,
        eject_at_room_exp: true,
      };
      if (duration > 0) {
        properties.exp = Math.floor(Date.now() / 1000) + duration * 60;
      }

      const dailyResponse = await fetch(`${DAILY_API_URL}/rooms`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${apiKey}`,
        },
        body: JSON.stringify({
          name: roomId,
          privacy: 'public' as const,
          properties,
        }),
      });

      if (!dailyResponse.ok) {
        const detail = await dailyResponse.text();
        console.error('Daily.co room creation failed:', dailyResponse.status, detail);
        return NextResponse.json(
          { error: 'Failed to create Daily.co room', details: detail },
          { status: dailyResponse.status }
        );
      }

      const data = await dailyResponse.json();
      room = {
        id: data.id,
        name: data.name,
        url: data.url,
        privacy: data.privacy,
      };
    } else {
      const base = domain ? `https://${domain}.daily.co` : `https://${roomId}.daily.co`;
      const fallbackUrl = `${base}/${roomId}`;
      console.warn(
        'DAILY_API_KEY not set — returning fallback room URL. Real join requires a Daily.co (free) account + API key.'
      );
      room = {
        id: roomId,
        name: roomId,
        url: fallbackUrl,
        privacy: 'public',
      };
    }

    const meetingData = {
      id: room.id,
      roomName: room.name,
      topic: topic || 'Daily.co Live Class',
      agenda: agenda || '',
      duration,
      isInstant,
      status: 'scheduled',
      createdAt: new Date().toISOString(),
      daily: {
        roomId: room.name,
        roomUrl: room.url,
        url: room.url,
        privacy: room.privacy,
        domain: getDailyDomain() || null,
      },
    };

    return NextResponse.json(meetingData);
  } catch (error) {
    console.error('Error creating Daily.co meeting:', error);
    return NextResponse.json(
      { error: 'Failed to create meeting' },
      { status: 500 }
    );
  }
}

// GET endpoint for retrieving meeting info
export async function GET(request: NextRequest) {
  try {
    const url = new URL(request.url);
    const meetingId = url.searchParams.get('id');

    if (!meetingId) {
      return NextResponse.json(
        { error: 'Meeting ID is required' },
        { status: 400 }
      );
    }

    const apiKey = getApiKey();
    const domain = getDailyDomain();

    if (apiKey) {
      // Look up the real room by name on Daily.co
      const dailyResponse = await fetch(`${DAILY_API_URL}/rooms`, {
        headers: { Authorization: `Bearer ${apiKey}` },
      });

      if (dailyResponse.ok) {
        const data = await dailyResponse.json();
        const matched = (data.rooms || []).find(
          (r: { name?: string; url?: string }) =>
            r.name === meetingId || (r.url || '').endsWith(`/${meetingId}`)
        );
        if (matched) {
          return NextResponse.json({
            id: matched.id,
            roomName: matched.name,
            status: 'active',
            daily: {
              roomId: matched.name,
              roomUrl: matched.url,
              url: matched.url,
              privacy: matched.privacy || 'unknown',
              domain: domain || null,
            },
          });
        }
      }
    }

    // Fallback: construct a room URL from the known meeting id
    const base = domain ? `https://${domain}.daily.co` : `https://${meetingId}.daily.co`;
    const fallbackUrl = `${base}/${meetingId}`;

    return NextResponse.json({
      id: meetingId,
      roomName: meetingId,
      status: 'active',
      daily: {
        roomId: meetingId,
        roomUrl: fallbackUrl,
        url: fallbackUrl,
        privacy: 'unknown',
        domain: domain || null,
      },
    });
  } catch (error) {
    console.error('Error fetching Daily.co meeting:', error);
    return NextResponse.json(
      { error: 'Failed to fetch meeting' },
      { status: 500 }
    );
  }
}