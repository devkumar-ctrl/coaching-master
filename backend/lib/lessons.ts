import { ObjectId } from 'mongodb';

export const LESSONS_COLLECTION = 'lessons';
export const LESSON_ATTENDANCE_COLLECTION = 'lesson_attendance';

export const DEFAULT_JOIN_BEFORE_MIN = 15;
export const DEFAULT_JOIN_AFTER_MIN = 30;

export type LessonType = 'live' | 'recorded';
export type LessonStatus = 'scheduled' | 'live' | 'completed' | 'cancelled';
export type JoinState = 'upcoming' | 'open' | 'ended' | 'cancelled' | 'on-demand';

export interface LessonDocument {
  _id?: ObjectId;
  courseId: string;
  courseTitle: string;
  teacherId: string;
  teacherName: string;
  type: LessonType;
  title: string;
  description?: string;
  moduleTitle?: string;
  order: number;
  isPublished: boolean;
  // Live
  scheduledAt?: Date;
  duration?: number;
  timezone?: string;
  platform?: 'daily' | 'external';
  roomName?: string;
  roomUrl?: string;
  roomConfigured?: boolean;
  externalJoinUrl?: string;
  joinBeforeMinutes?: number;
  joinAfterMinutes?: number;
  status?: LessonStatus;
  remindersSent?: { t24?: Date | null; t1?: Date | null };
  // Recorded
  videoUrl?: string;
  videoPublicId?: string;
  source?: 'upload' | 'daily_recording' | 'external';
  // Meta
  createdAt?: Date;
  updatedAt?: Date;
}

export interface JoinInfo {
  state: JoinState;
  canJoin: boolean;
  opensAt?: Date;
  closesAt?: Date;
}

function addMinutes(date: Date, minutes: number): Date {
  return new Date(date.getTime() + minutes * 60_000);
}

/**
 * Works out whether a learner can join/play a lesson right now.
 * Live: opens `joinBeforeMinutes` before the start and stays open
 * `joinAfterMinutes` after the scheduled end (best-practice join window).
 * Recorded: playable as long as it is published.
 */
export function getJoinInfo(lesson: LessonDocument, now: Date = new Date()): JoinInfo {
  if (lesson.type === 'recorded') {
    return { state: 'on-demand', canJoin: Boolean(lesson.videoUrl) && lesson.isPublished !== false };
  }

  if (lesson.status === 'cancelled') {
    return { state: 'cancelled', canJoin: false };
  }

  const start = lesson.scheduledAt ? new Date(lesson.scheduledAt) : null;
  if (!start || Number.isNaN(start.getTime())) {
    return { state: 'upcoming', canJoin: false };
  }

  const duration = lesson.duration ?? 60;
  const opensAt = addMinutes(start, -(lesson.joinBeforeMinutes ?? DEFAULT_JOIN_BEFORE_MIN));
  const closesAt = addMinutes(start, duration + (lesson.joinAfterMinutes ?? DEFAULT_JOIN_AFTER_MIN));

  if (now < opensAt) return { state: 'upcoming', canJoin: false, opensAt, closesAt };
  if (now > closesAt) return { state: 'ended', canJoin: false, opensAt, closesAt };
  return { state: 'open', canJoin: true, opensAt, closesAt };
}

/** The learner-facing URL. Never expose the host/start URL to students. */
export function learnerJoinUrl(lesson: LessonDocument): string {
  if (lesson.type === 'recorded') return lesson.videoUrl || '';
  return lesson.externalJoinUrl || lesson.roomUrl || '';
}

/** Serializes a lesson for API responses, hiding privileged fields as needed. */
export function serializeLesson(lesson: LessonDocument, opts: { includeHost?: boolean; now?: Date } = {}) {
  const now = opts.now ?? new Date();
  const join = getJoinInfo(lesson, now);
  return {
    id: lesson._id?.toString(),
    courseId: lesson.courseId,
    courseTitle: lesson.courseTitle,
    teacherId: lesson.teacherId,
    teacherName: lesson.teacherName,
    type: lesson.type,
    title: lesson.title,
    description: lesson.description || '',
    moduleTitle: lesson.moduleTitle || 'Lessons',
    order: lesson.order ?? 0,
    isPublished: lesson.isPublished !== false,
    scheduledAt: lesson.scheduledAt ? new Date(lesson.scheduledAt).toISOString() : null,
    duration: lesson.duration ?? null,
    timezone: lesson.timezone || 'UTC',
    platform: lesson.platform || (lesson.type === 'live' ? 'daily' : undefined),
    status: lesson.status || (lesson.type === 'recorded' ? 'completed' : 'scheduled'),
    videoUrl: lesson.type === 'recorded' ? lesson.videoUrl || null : null,
    joinState: join.state,
    canJoin: join.canJoin,
    opensAt: join.opensAt ? join.opensAt.toISOString() : null,
    closesAt: join.closesAt ? join.closesAt.toISOString() : null,
    // Host-only fields
    roomUrl: opts.includeHost ? lesson.roomUrl || null : undefined,
    externalJoinUrl: opts.includeHost ? lesson.externalJoinUrl || null : undefined,
    roomConfigured: opts.includeHost ? lesson.roomConfigured : undefined,
  };
}

export function isValidObjectId(value: string): boolean {
  return ObjectId.isValid(value);
}
