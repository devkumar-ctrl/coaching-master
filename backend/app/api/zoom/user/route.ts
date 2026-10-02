import { NextRequest, NextResponse } from 'next/server'
import { auth } from '@/auth'
// Zoom integration is DISABLED. Live classes now use Daily.co (free tier).
// import { zoomAPI } from '@/lib/zoom'

export const runtime = 'nodejs'

export async function GET(request: NextRequest) {
  try {
    const session = await auth()

    if (!session?.user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    return NextResponse.json(
      { error: 'Zoom meetings are disabled. Live classes use Daily.co now.' },
      { status: 501 }
    )
  } catch (error: any) {
    console.error('Zoom user error:', error)
    return NextResponse.json(
      { error: 'Failed to get user info', details: error.message },
      { status: 500 }
    )
  }
}