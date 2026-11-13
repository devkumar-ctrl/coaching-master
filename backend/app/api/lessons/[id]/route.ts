import { NextRequest, NextResponse } from 'next/server';
import { auth } from '@/auth';
import { getDatabase } from '@/lib/db';
import { ObjectId } from 'mongodb';
import { deleteRoom } from '@/lib/daily';
import {
  LESSONS_COLLECTION,
  LESSON_ATTENDANCE_COLLECTION,
  serializeLesson,
  type LessonDocument,
} from '@/lib/lessons';

export const runtime = 'nodejs';

type Params = { params: Promise<{ id: string }> };

async function loadLesson(id: string): Promise<LessonDocument | null> {
  if (!ObjectId.isValid(id)) return null;
  const db = await getDatabase();
  return (await db
    .collection(LESSONS_COLLECTION)
    .findOne({ _id: new ObjectId(id) })) as unknown as LessonDocument | null;
}

// GET /api/lessons/[id]
export async function GET(_request: NextRequest, { params }: Params) {
  try {
    const session = await auth();
    if (!session?.user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

    const { id } = await params;
    const db = await getDatabase();
    const lesson = await loadLesson(id);
    if (!lesson) return NextResponse.json({ error: 'Lesson not found' }, { status: 404 });

    const isAdmin = session.user.role === 'ADMIN';
    const isOwner = lesson.teacherId === session.user.id;
    let isEnrolled = false;
    if (!isAdmin && !isOwner) {
      const enrollment = await db
        .collection('enrollments')
        .findOne({ studentId: session.user.id, courseId: lesson.courseId, status: 'active' });
      isEnrolled = Boolean(enrollment);
    }
    if (!isAdmin && !isOwner && !isEnrolled) {
      return NextResponse.json({ error: 'Forbidden' }, { status: 403 });
    }

    return NextResponse.json(serializeLesson(lesson, { includeHost: isAdmin || isOwner }));
  } catch (error) {
    console.error('Error fetching lesson:', error);
    return NextResponse.json({ error: 'Failed to fetch lesson' }, { status: 500 });
  }
}

// PATCH /api/lessons/[id]
export async function PATCH(request: NextRequest, { params }: Params) {
  try {
    const session = await auth();
    if (!session?.user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

    const { id } = await params;
    const db = await getDatabase();
    const lesson = await loadLesson(id);
    if (!lesson) return NextResponse.json({ error: 'Lesson not found' }, { status: 404 });

    const isAdmin = session.user.role === 'ADMIN';
    if (!isAdmin && lesson.teacherId !== session.user.id) {
      return NextResponse.json({ error: 'Forbidden' }, { status: 403 });
    }

    const body = await request.json();
    const update: Record<string, unknown> = { updatedAt: new Date() };

    if (typeof body.title === 'string' && body.title.trim()) update.title = body.title.trim();
    if (typeof body.description === 'string') update.description = body.description.trim();
    if (typeof body.moduleTitle === 'string') update.moduleTitle = body.moduleTitle.trim() || 'Lessons';
    if (Number.isFinite(Number(body.order))) update.order = Number(body.order);
    if (typeof body.isPublished === 'boolean') update.isPublished = body.isPublished;
    if (typeof body.videoUrl === 'string' && body.videoUrl.trim()) update.videoUrl = body.videoUrl.trim();
    if (Number.isFinite(Number(body.duration))) update.duration = Number(body.duration);
    if (typeof body.scheduledAt === 'string') {
      const scheduledAt = new Date(body.scheduledAt);
      if (!Number.isNaN(scheduledAt.getTime())) update.scheduledAt = scheduledAt;
    }
    if (typeof body.status === 'string' && ['scheduled', 'live', 'completed', 'cancelled'].includes(body.status)) {
      update.status = body.status;
    }
    if (typeof body.timezone === 'string') update.timezone = body.timezone;

    await db.collection(LESSONS_COLLECTION).updateOne({ _id: new ObjectId(id) }, { $set: update });
    const updated = (await db
      .collection(LESSONS_COLLECTION)
      .findOne({ _id: new ObjectId(id) })) as unknown as LessonDocument;

    return NextResponse.json({ message: 'Lesson updated', lesson: serializeLesson(updated, { includeHost: true }) });
  } catch (error) {
    console.error('Error updating lesson:', error);
    return NextResponse.json({ error: 'Failed to update lesson' }, { status: 500 });
  }
}

// DELETE /api/lessons/[id]
export async function DELETE(_request: NextRequest, { params }: Params) {
  try {
    const session = await auth();
    if (!session?.user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

    const { id } = await params;
    const db = await getDatabase();
    const lesson = await loadLesson(id);
    if (!lesson) return NextResponse.json({ error: 'Lesson not found' }, { status: 404 });

    const isAdmin = session.user.role === 'ADMIN';
    if (!isAdmin && lesson.teacherId !== session.user.id) {
      return NextResponse.json({ error: 'Forbidden' }, { status: 403 });
    }

    if (lesson.platform === 'daily' && lesson.roomName) {
      await deleteRoom(lesson.roomName);
    }

    await db.collection(LESSONS_COLLECTION).deleteOne({ _id: new ObjectId(id) });
    await db.collection(LESSON_ATTENDANCE_COLLECTION).deleteMany({ lessonId: id });

    return NextResponse.json({ message: 'Lesson deleted' });
  } catch (error) {
    console.error('Error deleting lesson:', error);
    return NextResponse.json({ error: 'Failed to delete lesson' }, { status: 500 });
  }
}
