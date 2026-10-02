import { NextRequest, NextResponse } from 'next/server'
// Zoom integration is DISABLED. Live classes now use Daily.co (free tier).
// import { zoomAPI } from '@/lib/zoom'

export const runtime = 'nodejs'

// Zoom webhooks are DISABLED. Daily.co does not need this endpoint.
export async function POST(request: NextRequest) {
  void request
  return NextResponse.json(
    { error: 'Zoom webhooks are disabled. Live classes use Daily.co now.' },
    { status: 501 }
  )
}

export async function GET(request: NextRequest) {
  void request
  return NextResponse.json({ message: 'Zoom webhook endpoint is disabled.' })
}