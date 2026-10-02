import { NextRequest, NextResponse } from 'next/server'
import { auth } from '@/auth'

export const runtime = 'nodejs'

// Zoom connectivity test is DISABLED. Live classes now use Daily.co (free tier).
export async function GET(request: NextRequest) {
  try {
    const session = await auth()

    if (!session?.user || session.user.role !== 'COACH') {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    return NextResponse.json({
      success: false,
      error: 'Zoom integration is disabled',
      message: 'Live classes use Daily.co now. Configure DAILY_API_KEY in your environment instead of Zoom credentials.',
      details: {
        enabled: false,
        provider: 'daily'
      }
    })
  } catch (error: any) {
    console.error('Zoom test error:', error)
    return NextResponse.json({
      success: false,
      error: 'Zoom API test failed',
      details: error.message
    }, { status: 500 })
  }
}