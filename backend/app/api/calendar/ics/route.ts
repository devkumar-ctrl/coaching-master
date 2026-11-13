import { NextRequest, NextResponse } from 'next/server';
import { auth } from '@/auth';
import { getDatabase } from '@/lib/db';
import { LESSONS_COLLECTION, learnerJoinUrl, type LessonDocument } from '@/lib/lessons';

export const runtime = 'nodejs';

const APP_URL = process.env.NEXT_PUBLIC_APP_URL || '';

function toIcsDate(date: Date): string {
  return date.toISOString().replace(/[-:]/g, '').replace(/\.\d{3}/, '');
}

function escapeText(value: string): string {
  return value.replace(/\\/g, '\\\\').replace(/;/g, '\\;').replace(/,/g, '\\,').replace(/\n/g, '\\n');
}

// Fold long lines at 75 octets per RFC 5545.
function fold(line: string): string {
  if (line.length <= 75) return line;
  const chunks: string[] = [];
  for (let i = 0; i < line.length; i += 73) {
    chunks.push((i === 0 ? '' : ' ') + line.slice(i, i + 73));
  }
  return chunks.join('\r\n');
}

// GET /api/calendar/ics  — subscribable feed of the signed-in learner's live classes.
export async function GET(_request: NextRequest) {
  try {
    const session = await auth();
    if (!session?.user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

    const db = await getDatabase();
    const enrollments = (await db
      .collection('enrollments')
      .find({ studentId: session.user.id, status: 'active' })
      .toArray()) as unknown as Array<{ courseId: string }>;
    const courseIds = enrollments.map((e) => e.courseId);

    const lessons = courseIds.length
      ? ((await db
          .collection(LESSONS_COLLECTION)
          .find({
            courseId: { $in: courseIds },
            type: 'live',
            isPublished: { $ne: false },
            status: { $ne: 'cancelled' },
            scheduledAt: { $exists: true },
          })
          .sort({ scheduledAt: 1 })
          .toArray()) as unknown as LessonDocument[])
      : [];

    const lines: string[] = [
      'BEGIN:VCALENDAR',
      'VERSION:2.0',
      'PRODID:-//YuvaBot LMS//Live Classes//EN',
      'CALSCALE:GREGORIAN',
      'METHOD:PUBLISH',
      'X-WR-CALNAME:My Live Classes',
    ];

    const stamp = toIcsDate(new Date());
    for (const lesson of lessons) {
      const start = new Date(lesson.scheduledAt as Date);
      const end = new Date(start.getTime() + (lesson.duration ?? 60) * 60_000);
      const joinUrl = learnerJoinUrl(lesson);
      lines.push(
        'BEGIN:VEVENT',
        `UID:${lesson._id?.toString()}@yuvabot`,
        `DTSTAMP:${stamp}`,
        `DTSTART:${toIcsDate(start)}`,
        `DTEND:${toIcsDate(end)}`,
        fold(`SUMMARY:${escapeText(lesson.title)}`),
        fold(
          `DESCRIPTION:${escapeText(
            `${lesson.courseTitle} with ${lesson.teacherName}${APP_URL ? `\nOpen: ${APP_URL}/learn/${lesson.courseId}` : ''}`
          )}`
        ),
        fold(`LOCATION:${escapeText(joinUrl || 'Online')}`),
        'END:VEVENT'
      );
    }
    lines.push('END:VCALENDAR');

    const ics = lines.join('\r\n') + '\r\n';
    return new NextResponse(ics, {
      status: 200,
      headers: {
        'Content-Type': 'text/calendar; charset=utf-8',
        'Content-Disposition': 'attachment; filename="my-live-classes.ics"',
        'Cache-Control': 'no-store',
      },
    });
  } catch (error) {
    console.error('Error generating ICS feed:', error);
    return NextResponse.json({ error: 'Failed to generate calendar feed' }, { status: 500 });
  }
}
