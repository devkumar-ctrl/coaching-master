import { NextResponse } from 'next/server';

export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';

/**
 * Socket.IO endpoint — INTENTIONALLY DISABLED.
 *
 * This previously booted a raw `http.Server` on port 3002 inside a Next.js
 * route handler. That is impossible on Vercel: each route runs as a short-lived
 * serverless function that cannot listen on a port or hold a long-lived
 * WebSocket connection. The route was also never used — the frontend has no
 * `socket.io-client` dependency and all meeting links go through Daily.co /
 * Jitsi instead (see /api/daily/meetings and /api/jitsi/meetings).
 *
 * If real-time messaging is ever needed, run a standalone Socket.IO service
 * (Fly.io / Railway / a VPS) and point the frontend at it with
 * NEXT_PUBLIC_SOCKET_URL, rather than hosting it inside this app.
 */
export async function GET() {
  return NextResponse.json(
    {
      error: 'Socket.IO is not hosted by this deployment',
      detail:
        'In-process Socket.IO cannot run on serverless functions. Use the Daily.co/Jitsi meeting endpoints, or deploy a dedicated realtime service.',
    },
    { status: 501 }
  );
}