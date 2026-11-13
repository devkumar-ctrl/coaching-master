import { NextRequest, NextResponse } from 'next/server';
import { auth } from '@/auth';
import { getDatabase } from '@/lib/db';
import { LESSONS_COLLECTION, serializeLesson, type LessonDocument } from '@/lib/lessons';

export const runtime = 'nodejs';

// GET /api/students/[id]/schedule?range=upcoming|past|all
// Calendar feed of the learner's live classes across enrolled courses.
export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const session = await auth();
    if (!session?.user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

    const { id: studentId } = await params;
    if (session.user.role === 'STUDENT' && session.user.id !== studentId) {
      return NextResponse.json({ error: 'Forbidden' }, { status: 403 });
    }

    const { searchParams } = new URL(request.url);
    const range = searchParams.get('range') || 'all';
    const now = new Date();

    const db = await getDatabase();
    const enrollments = (await db
      .collection('enrollments')
      .find({ studentId, status: 'active' })
      .toArray()) as unknown as Array<{ courseId: string }>;
    const courseIds = enrollments.map((e) => e.courseId);
    if (courseIds.length === 0) {
      return NextResponse.json({ events: [], courseIds: [] });
    }

    const query: Record<string, unknown> = {
      courseId: { $in: courseIds },
      type: 'live',
      isPublished: { $ne: false },
      status: { $ne: 'cancelled' },
    };
    if (range === 'upcoming') query.scheduledAt = { $gte: now };
    if (range === 'past') query.scheduledAt = { $lt: now };

    const lessons = (await db
      .collection(LESSONS_COLLECTION)
      .find(query)
      .sort({ scheduledAt: range === 'past' ? -1 : 1 })
      .toArray()) as unknown as LessonDocument[];

    return NextResponse.json({
      events: lessons.map((l) => serializeLesson(l, { includeHost: false, now })),
      courseIds,
    });
  } catch (error) {
    console.error('Error fetching student schedule:', error);
    return NextResponse.json({ error: 'Failed to fetch schedule' }, { status: 500 });
  }
}
