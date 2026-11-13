import { NextRequest, NextResponse } from 'next/server';
import { getDatabase } from '@/lib/db';
import { sendLessonReminder } from '@/lib/email';
import { LESSONS_COLLECTION, learnerJoinUrl, type LessonDocument } from '@/lib/lessons';

export const runtime = 'nodejs';

const APP_URL = process.env.NEXT_PUBLIC_APP_URL || '';

function unauthorized() {
  return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
}

// GET /api/cron/reminders — sends 24h and 1h reminders for upcoming live classes.
// Protect with CRON_SECRET (Vercel Cron sends it as a Bearer token automatically).
export async function GET(request: NextRequest) {
  const secret = process.env.CRON_SECRET;
  if (secret) {
    const authHeader = request.headers.get('authorization');
    const provided = authHeader?.replace('Bearer ', '') || new URL(request.url).searchParams.get('secret');
    if (provided !== secret) return unauthorized();
  }

  try {
    const db = await getDatabase();
    const now = new Date();
    const window = (fromHours: number, toHours: number) => ({
      $gte: new Date(now.getTime() + fromHours * 3_600_000),
      $lte: new Date(now.getTime() + toHours * 3_600_000),
    });

    const buckets: { kind: '24h' | '1h'; field: 't24' | 't1'; from: number; to: number }[] = [
      { kind: '24h', field: 't24', from: 23.5, to: 24.5 },
      { kind: '1h', field: 't1', from: 0.5, to: 1.5 },
    ];

    let sent = 0;
    let scanned = 0;

    for (const bucket of buckets) {
      const lessons = (await db
        .collection(LESSONS_COLLECTION)
        .find({
          type: 'live',
          isPublished: { $ne: false },
          status: { $ne: 'cancelled' },
          scheduledAt: window(bucket.from, bucket.to),
          [`remindersSent.${bucket.field}`]: { $exists: false },
        })
        .toArray()) as unknown as LessonDocument[];

      for (const lesson of lessons) {
        scanned += 1;
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
                  kind: bucket.kind,
                })
              : Promise.resolve(null)
          )
        );

        await db
          .collection(LESSONS_COLLECTION)
          .updateOne(
            { _id: lesson._id },
            { $set: { [`remindersSent.${bucket.field}`]: new Date(), updatedAt: new Date() } }
          );
        sent += 1;
      }
    }

    console.log(`Reminder run complete: ${sent} lesson(s) processed, ${scanned} scanned.`);
    return NextResponse.json({ ok: true, processed: sent, scanned });
  } catch (error) {
    console.error('Error running reminder cron:', error);
    return NextResponse.json({ error: 'Failed to run reminders' }, { status: 500 });
  }
}
