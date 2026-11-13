import { NextRequest, NextResponse } from 'next/server';
import { auth } from '@/auth';
import { getDatabase } from '@/lib/db';
import { ObjectId } from 'mongodb';
import {
  LESSONS_COLLECTION,
  LESSON_ATTENDANCE_COLLECTION,
  getJoinInfo,
  learnerJoinUrl,
  type LessonDocument,
} from '@/lib/lessons';

export const runtime = 'nodejs';

type Params = { params: Promise<{ id: string }> };

// POST /api/lessons/[id]/join — returns the join/play URL if the learner is
// allowed in right now (enrolled + inside the join window).
export async function POST(_request: NextRequest, { params }: Params) {
  try {
    const session = await auth();
    if (!session?.user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

    const { id } = await params;
    if (!ObjectId.isValid(id)) return NextResponse.json({ error: 'Invalid lesson ID' }, { status: 400 });

    const db = await getDatabase();
    const lesson = (await db
      .collection(LESSONS_COLLECTION)
      .findOne({ _id: new ObjectId(id) })) as unknown as LessonDocument | null;
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
      return NextResponse.json({ error: 'You are not enrolled in this course' }, { status: 403 });
    }

    // Recorded lesson: playable any time it is published.
    if (lesson.type === 'recorded') {
      if (lesson.isPublished === false && !isOwner && !isAdmin) {
        return NextResponse.json({ error: 'This lesson is not available yet' }, { status: 403 });
      }
      return NextResponse.json({ type: 'recorded', url: learnerJoinUrl(lesson), state: 'on-demand', canJoin: true });
    }

    // Live lesson: enforce the join window.
    const join = getJoinInfo(lesson);
    if (!isOwner && !isAdmin && !join.canJoin) {
      return NextResponse.json(
        { error: 'The join window is not open yet', state: join.state, opensAt: join.opensAt, closesAt: join.closesAt },
        { status: 403 }
      );
    }

    const url = isOwner || isAdmin ? lesson.roomUrl || lesson.externalJoinUrl || '' : learnerJoinUrl(lesson);
    if (!url) {
      return NextResponse.json({ error: 'No meeting link is configured for this class' }, { status: 409 });
    }

    // Log attendance for students (best-effort, one open record per learner).
    if (!isOwner && !isAdmin) {
      try {
        const open = await db.collection(LESSON_ATTENDANCE_COLLECTION).findOne({
          lessonId: id,
          studentId: session.user.id,
          leftAt: null,
        });
        if (!open) {
          await db.collection(LESSON_ATTENDANCE_COLLECTION).insertOne({
            lessonId: id,
            courseId: lesson.courseId,
            studentId: session.user.id,
            studentName: session.user.name,
            studentEmail: session.user.email,
            joinedAt: new Date(),
            leftAt: null,
            durationMinutes: 0,
          });
        }
      } catch (attendanceError) {
        console.error('Failed to record lesson attendance:', attendanceError);
      }
    }

    return NextResponse.json({
      type: 'live',
      url,
      state: join.state,
      canJoin: true,
      opensAt: join.opensAt,
      closesAt: join.closesAt,
    });
  } catch (error) {
    console.error('Error joining lesson:', error);
    return NextResponse.json({ error: 'Failed to join lesson' }, { status: 500 });
  }
}
