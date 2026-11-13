const DAILY_API_URL = 'https://api.daily.co/v1';

export function isDailyConfigured(): boolean {
  return Boolean(process.env.DAILY_API_KEY);
}

export function getDailyDomain(): string | undefined {
  return process.env.DAILY_DOMAIN;
}

export function generateRoomName(prefix = 'yuvabot'): string {
  return `${prefix}-${Date.now().toString(36)}-${Math.random().toString(36).slice(2, 8)}`;
}

export function buildRoomUrl(roomName: string): string {
  const domain = getDailyDomain();
  if (domain) {
    const host = domain.includes('.') ? domain : `${domain}.daily.co`;
    return `https://${host}/${roomName}`;
  }
  return `https://${roomName}.daily.co`;
}

interface CreateRoomOptions {
  name?: string;
  /** Hard expiry for the room in minutes from now (0 = never). */
  expiresInMinutes?: number;
  maxParticipants?: number;
}

interface DailyRoom {
  name: string;
  url: string;
  id?: string;
  configured: boolean;
}

/**
 * Creates a Daily.co room.
 * - With DAILY_API_KEY: a real, joinable room via the Daily REST API.
 * - Without a key: returns a fallback URL so dev flows still work. `configured`
 *   is false so the UI can warn that joining needs a Daily account + key.
 */
export async function createRoom(options: CreateRoomOptions = {}): Promise<DailyRoom> {
  const roomName = options.name || generateRoomName();
  const apiKey = process.env.DAILY_API_KEY;

  if (!apiKey) {
    return { name: roomName, url: buildRoomUrl(roomName), configured: false };
  }

  const properties: Record<string, unknown> = {
    enable_prejoin_ui: true,
    enable_screenshare: true,
    enable_chat: true,
    enable_recording: 'cloud',
    start_audio_off: true,
    start_video_off: true,
    max_participants: options.maxParticipants ?? 100,
    eject_at_room_exp: true,
  };

  if (options.expiresInMinutes && options.expiresInMinutes > 0) {
    properties.exp = Math.floor(Date.now() / 1000) + options.expiresInMinutes * 60;
  }

  const response = await fetch(`${DAILY_API_URL}/rooms`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${apiKey}`,
    },
    body: JSON.stringify({ name: roomName, privacy: 'private', properties }),
  });

  if (!response.ok) {
    const detail = await response.text();
    throw new Error(`Daily.co room creation failed (${response.status}): ${detail}`);
  }

  const data = await response.json();
  return { name: data.name, url: data.url, id: data.id, configured: true };
}

export async function deleteRoom(roomName: string): Promise<void> {
  const apiKey = process.env.DAILY_API_KEY;
  if (!apiKey) return;
  try {
    await fetch(`${DAILY_API_URL}/rooms/${encodeURIComponent(roomName)}`, {
      method: 'DELETE',
      headers: { Authorization: `Bearer ${apiKey}` },
    });
  } catch (error) {
    console.error('Failed to delete Daily.co room:', error);
  }
}

/** Returns the most recent cloud recording URL for a room, if any. */
export async function getLatestRecording(roomName: string): Promise<string | null> {
  const apiKey = process.env.DAILY_API_KEY;
  if (!apiKey) return null;
  try {
    const response = await fetch(
      `${DAILY_API_URL}/recordings?room_name=${encodeURIComponent(roomName)}`,
      { headers: { Authorization: `Bearer ${apiKey}` } }
    );
    if (!response.ok) return null;
    const data = await response.json();
    const latest = (data.data || [])[0];
    return latest?.download_url || null;
  } catch (error) {
    console.error('Failed to fetch Daily.co recordings:', error);
    return null;
  }
}
