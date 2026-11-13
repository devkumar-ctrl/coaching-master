import { NextRequest, NextResponse } from 'next/server';
import { auth } from '@/auth';
import { getDatabase } from '@/lib/db';
import { ObjectId } from 'mongodb';
import { createRoom, isDailyConfigured } from '@/lib/daily';
import { sendLessonReminder } from '@/lib/email';
import {
  LESSONS_COLLECTION,
  serializeLesson,
  type LessonDocument,
  type LessonType,
} from '@/lib/lessons';

export const runtime = 'nodejs';

const APP_URL = process.env.NEXT_PUBLIC_APP_URL || '';

async function notifyEnrolledStudents(
  db: Awaited<ReturnType<typeof getDatabase>>,
  lesson: LessonDocument
) {
  if (lesson.type !== 'live' || lesson.isPublished === false) return;
  try {
    const enrollments = (await db
      .collection('enrollments')
      .find({ courseId: lesson.courseId, status: 'active' })
      .toArray()) as Array<{ studentName?: string; studentEmail?: string }>;

    const joinUrl = `${APP_URL}/learn/${lesson.courseId}`;
    await Promise.all(
      enrollments.map((e) =>
        e.studentEmail
          ? sendLessonReminder({
              studentName: e.studentName || 'Student',
              studentEmail: e.studentEmail,
              courseTitle: lesson.courseTitle,
              lessonTitle: lesson.title,
              teacherName: lesson.teacherName,
              startTime: new Date(lesson.scheduledAt as Date),
              joinUrl,
              kind: 'scheduled',
            })
          : Promise.resolve(null)
      )
    );
  } catch (error) {
    console.error('Failed to notify students about lesson:', error);
  }
}

// GET /api/lessons?courseId=&teacherId=&studentId=
export async function GET(request: NextRequest) {
  try {
    const session = await auth();
    if (!session?.user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const db = await getDatabase();
    const { searchParams } = new URL(request.url);
    const courseId = searchParams.get('courseId');
    const teacherId = searchParams.get('teacherId');
    const studentId = searchParams.get('studentId');

    const isAdmin = session.user.role === 'ADMIN';
    let query: Record<string, unknown> = {};
    let includeHost = isAdmin;
    let enrolledOnly = false;

    if (courseId) {
      if (!ObjectId.isValid(courseId)) {
        return NextResponse.json({ error: 'Invalid course ID' }, { status: 400 });
      }
      const course = await db.collection('courses').findOne({ _id: new ObjectId(courseId) });
      if (!course) return NextResponse.json({ error: 'Course not found' }, { status: 404 });

      const isOwner = course.teacherId === session.user.id;
      let isEnrolled = false;
      if (!isAdmin && !isOwner) {
        const enrollment = await db
          .collection('enrollments')
          .findOne({ studentId: session.user.id, courseId, status: 'active' });
        isEnrolled = Boolean(enrollment);
      }
      if (!isAdmin && !isOwner && !isEnrolled) {
        return NextResponse.json({ error: 'Forbidden' }, { status: 403 });
      }

      query.courseId = courseId;
      includeHost = isAdmin || isOwner;
      enrolledOnly = !isAdmin && !isOwner;
    } else if (teacherId) {
      if (!isAdmin && session.user.id !== teacherId) {
        return NextResponse.json({ error: 'Forbidden' }, { status: 403 });
      }
      query.teacherId = teacherId;
      includeHost = true;
    } else if (studentId) {
      if (!isAdmin && session.user.id !== studentId) {
        return NextResponse.json({ error: 'Forbidden' }, { status: 403 });
      }
      const enrollments = (await db
        .collection('enrollments')
        .find({ studentId, status: 'active' })
        .toArray()) as unknown as Array<{ courseId: string }>;
      const courseIds = enrollments.map((e) => e.courseId);
      if (courseIds.length === 0) return NextResponse.json([]);
      query.courseId = { $in: courseIds };
      includeHost = false;
      enrolledOnly = true;
    } else if (!isAdmin) {
      return NextResponse.json({ error: 'A courseId, teacherId or studentId is required' }, { status: 400 });
    }

    if (enrolledOnly) query.isPublished = { $ne: false };

    const lessons = (await db
      .collection(LESSONS_COLLECTION)
      .find(query)
      .sort({ scheduledAt: 1, order: 1 })
      .toArray()) as unknown as LessonDocument[];

    const now = new Date();
    return NextResponse.json(lessons.map((l) => serializeLesson(l, { includeHost, now })));
  } catch (error) {
    console.error('Error fetching lessons:', error);
    return NextResponse.json({ error: 'Failed to fetch lessons' }, { status: 500 });
  }
}

// POST /api/lessons  — create a live or recorded lesson
export async function POST(request: NextRequest) {
  try {
    const session = await auth();
    if (!session?.user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }
    const isAdmin = session.user.role === 'ADMIN';
    if (session.user.role !== 'COACH' && !isAdmin) {
      return NextResponse.json({ error: 'Only coaches or admins can create lessons' }, { status: 403 });
    }

    const body = await request.json();
    const courseId = String(body?.courseId || '');
    const type: LessonType = body?.type === 'recorded' ? 'recorded' : 'live';
    const title = String(body?.title || '').trim();

    if (!ObjectId.isValid(courseId)) {
      return NextResponse.json({ error: 'A valid courseId is required' }, { status: 400 });
    }
    if (!title) {
      return NextResponse.json({ error: 'Lesson title is required' }, { status: 400 });
    }

    const db = await getDatabase();
    const course = await db.collection('courses').findOne({ _id: new ObjectId(courseId) });
    if (!course) return NextResponse.json({ error: 'Course not found' }, { status: 404 });
    if (!isAdmin && course.teacherId !== session.user.id) {
      return NextResponse.json({ error: 'You do not own this course' }, { status: 403 });
    }

    const lastLesson = await db
      .collection(LESSONS_COLLECTION)
      .find({ courseId })
      .sort({ order: -1 })
      .limit(1)
      .toArray();
    const nextOrder = lastLesson.length ? (lastLesson[0].order || 0) + 1 : 1;

    const now = new Date();
    const lesson: LessonDocument = {
      courseId,
      courseTitle: course.title,
      teacherId: course.teacherId || session.user.id,
      teacherName: course.teacherName || session.user.name || 'Instructor',
      type,
      title,
      description: String(body?.description || '').trim(),
      moduleTitle: String(body?.moduleTitle || '').trim() || 'Lessons',
      order: Number.isFinite(Number(body?.order)) ? Number(body.order) : nextOrder,
      isPublished: body?.isPublished !== false,
      createdAt: now,
      updatedAt: now,
    };

    if (type === 'live') {
      const scheduledAt = body?.scheduledAt ? new Date(body.scheduledAt) : null;
      if (!scheduledAt || Number.isNaN(scheduledAt.getTime())) {
        return NextResponse.json({ error: 'A valid scheduledAt is required for live lessons' }, { status: 400 });
      }
      const duration = Number(body?.duration) > 0 ? Number(body.duration) : 60;

      lesson.scheduledAt = scheduledAt;
      lesson.duration = duration;
      lesson.timezone = String(body?.timezone || 'UTC');
      lesson.joinBeforeMinutes = Number.isFinite(Number(body?.joinBeforeMinutes))
        ? Number(body.joinBeforeMinutes)
        : undefined;
      lesson.joinAfterMinutes = Number.isFinite(Number(body?.joinAfterMinutes))
        ? Number(body.joinAfterMinutes)
        : undefined;
      lesson.status = 'scheduled';

      const externalJoinUrl = String(body?.externalJoinUrl || '').trim();
      if (externalJoinUrl && body?.platform === 'external') {
        lesson.platform = 'external';
        lesson.externalJoinUrl = externalJoinUrl;
      } else {
        const room = await createRoom({
          name: body?.roomName ? String(body.roomName) : undefined,
          expiresInMinutes: duration + 120,
        });
        lesson.platform = 'daily';
        lesson.roomName = room.name;
        lesson.roomUrl = room.url;
        lesson.roomConfigured = room.configured;
      }
    } else {
      const videoUrl = String(body?.videoUrl || '').trim();
      if (!videoUrl) {
        return NextResponse.json({ error: 'A videoUrl is required for recorded lessons' }, { status: 400 });
      }
      lesson.videoUrl = videoUrl;
      lesson.videoPublicId = String(body?.videoPublicId || '').trim() || undefined;
      lesson.duration = Number(body?.duration) > 0 ? Number(body.duration) : undefined;
      lesson.source = (body?.source as LessonDocument['source']) || 'upload';
    }

    const result = await db.collection(LESSONS_COLLECTION).insertOne(lesson as LessonDocument);
    lesson._id = result.insertedId;

    await notifyEnrolledStudents(db, lesson);

    return NextResponse.json(
      {
        message: type === 'live' ? 'Live class scheduled' : 'Lesson added',
        lesson: serializeLesson(lesson, { includeHost: true }),
        dailyConfigured: isDailyConfigured(),
      },
      { status: 201 }
    );
  } catch (error) {
    console.error('Error creating lesson:', error);
    return NextResponse.json({ error: 'Failed to create lesson' }, { status: 500 });
  }
}
