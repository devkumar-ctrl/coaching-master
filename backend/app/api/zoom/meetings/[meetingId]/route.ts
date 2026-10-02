import { NextRequest, NextResponse } from 'next/server'
import { auth } from '@/auth'
// Zoom integration is DISABLED. Live classes now use Daily.co (free tier).
// import { zoomAPI, CreateMeetingRequest } from '@/lib/zoom'

export const runtime = 'nodejs'

const ZOOM_DISABLED_MESSAGE = 'Zoom meetings are disabled. Live classes use Daily.co now.'

interface RouteParams {
  params: Promise<{
    meetingId: string
  }>
}

// Get specific meeting
export async function GET(request: NextRequest, context: RouteParams) {
  try {
    const session = await auth()

    if (!session?.user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    await context.params
    return NextResponse.json(
      { error: ZOOM_DISABLED_MESSAGE },
      { status: 501 }
    )
  } catch (error: any) {
    console.error('Get meeting error:', error)
    return NextResponse.json(
      { error: 'Failed to get meeting', details: error.message },
      { status: 500 }
    )
  }
}

// Update meeting
export async function PATCH(request: NextRequest, context: RouteParams) {
  try {
    const session = await auth()

    if (!session?.user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    await context.params
    return NextResponse.json(
      { error: ZOOM_DISABLED_MESSAGE },
      { status: 501 }
    )
  } catch (error: any) {
    console.error('Update meeting error:', error)
    return NextResponse.json(
      { error: 'Failed to update meeting', details: error.message },
      { status: 500 }
    )
  }
}

// Delete meeting
export async function DELETE(request: NextRequest, context: RouteParams) {
  try {
    const session = await auth()

    if (!session?.user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    await context.params
    return NextResponse.json(
      { error: ZOOM_DISABLED_MESSAGE },
      { status: 501 }
    )
  } catch (error: any) {
    console.error('Delete meeting error:', error)
    return NextResponse.json(
      { error: 'Failed to delete meeting', details: error.message },
      { status: 500 }
    )
  }
}