import { NextRequest, NextResponse } from 'next/server'
import { auth } from '@/auth'
// Zoom integration is DISABLED. Live classes now use Daily.co (free tier).
// import { zoomAPI, CreateMeetingRequest } from '@/lib/zoom'
import { getDatabase } from '@/lib/db'
import { ObjectId } from 'mongodb'

export const runtime = 'nodejs'

const ZOOM_DISABLED_MESSAGE = 'Zoom meetings are disabled. Live classes use Daily.co now.'

// Get meetings
export async function GET(request: NextRequest) {
  try {
    const session = await auth()

    if (!session?.user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const { searchParams } = new URL(request.url)
    const courseId = searchParams.get('courseId')
    const studentId = searchParams.get('studentId')
    void studentId

    // If requesting meetings for a specific course or student
    if (courseId || studentId) {
      const db = await getDatabase()

      let query: any = {}

      if (courseId) {
        query.courseId = courseId
        // Ensure teacher owns the course or student is enrolled
        if (session.user.role === 'COACH') {
          const course = await db.collection("courses").findOne({
            _id: new ObjectId(courseId),
            teacherId: session.user.id
          })
          if (!course) {
            return NextResponse.json({ error: 'Unauthorized access to course meetings' }, { status: 403 })
          }
        } else if (session.user.role === 'STUDENT') {
          const enrollment = await db.collection("enrollments").findOne({
            courseId: courseId,
            studentId: session.user.id,
            status: 'active'
          })
          if (!enrollment) {
            return NextResponse.json({ error: 'Not enrolled in this course' }, { status: 403 })
          }
        }
      }

      if (studentId && session.user.role === 'STUDENT' && studentId !== session.user.id) {
        return NextResponse.json({ error: 'Unauthorized' }, { status: 403 })
      }

      // Get meetings from database
      const courseMeetings = await db.collection("course_meetings")
        .find(query)
        .sort({ scheduledAt: 1 })
        .toArray()

      return NextResponse.json(courseMeetings)
    }

    // Zoom API functionality is disabled - return empty list
    return NextResponse.json({
      meetings: [],
      message: ZOOM_DISABLED_MESSAGE,
      page_count: 0,
      page_number: 1,
      page_size: 30,
      total_records: 0
    })
  } catch (error: any) {
    console.error('Meetings error:', error)
    return NextResponse.json(
      { error: 'Failed to get meetings', details: error.message },
      { status: 500 }
    )
  }
}

// Create meeting
export async function POST(request: NextRequest) {
  try {
    const session = await auth()

    if (!session?.user || session.user.role !== 'COACH') {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    // Zoom meeting creation is disabled - return clear message
    return NextResponse.json(
      { error: ZOOM_DISABLED_MESSAGE },
      { status: 501 }
    )
  } catch (error: any) {
    console.error('Create meeting error:', error)
    return NextResponse.json(
      { error: 'Failed to create meeting', details: error.message },
      { status: 500 }
    )
  }
}