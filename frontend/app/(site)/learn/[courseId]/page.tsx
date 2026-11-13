"use client";

import { useCallback, useEffect, useMemo, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { useSession } from "next-auth/react";
import Link from "next/link";
import {
  ArrowLeft,
  CalendarDays,
  FileVideo,
  ListVideo,
  Loader2,
  Radio,
} from "lucide-react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";
import { ClassCalendar, type ClassCalendarEvent } from "@/components/lms/class-calendar";
import { LiveSessionCard, type LiveSession } from "@/components/lms/live-session-card";

interface Course {
  id: string;
  title: string;
  description?: string;
  teacherName?: string;
  category?: string;
  image?: string;
}

interface Lesson {
  id: string;
  title: string;
  type: "live" | "recorded";
  description?: string;
  moduleTitle: string;
  scheduledAt: string | null;
  duration: number | null;
  joinState: "upcoming" | "open" | "ended" | "cancelled" | "on-demand";
  canJoin: boolean;
  videoUrl: string | null;
  teacherName: string;
  courseTitle: string;
  order: number;
}

export default function LearnPage() {
  const params = useParams<{ courseId: string }>();
  const courseId = params?.courseId;
  const router = useRouter();
  const { status } = useSession();

  const [course, setCourse] = useState<Course | null>(null);
  const [lessons, setLessons] = useState<Lesson[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [selectedId, setSelectedId] = useState<string | null>(null);
  const [view, setView] = useState<"content" | "schedule">("content");
  const [liveUrl, setLiveUrl] = useState<string | null>(null);
  const [liveLessonId, setLiveLessonId] = useState<string | null>(null);
  const [joining, setJoining] = useState(false);

  useEffect(() => {
    if (status === "unauthenticated") {
      router.push(`/auth/signin?callbackUrl=/learn/${courseId}`);
    }
  }, [status, router, courseId]);

  const load = useCallback(async () => {
    if (!courseId) return;
    try {
      setLoading(true);
      const [courseRes, lessonsRes] = await Promise.all([
        fetch(`/api/courses/${courseId}`),
        fetch(`/api/lessons?courseId=${courseId}`),
      ]);

      if (!courseRes.ok) throw new Error("Course not found");
      setCourse(await courseRes.json());

      if (lessonsRes.status === 403) {
        setError("You are not enrolled in this course yet.");
        setLessons([]);
        return;
      }
      if (!lessonsRes.ok) throw new Error("Failed to load lessons");
      setLessons(await lessonsRes.json());
      setError(null);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Something went wrong");
    } finally {
      setLoading(false);
    }
  }, [courseId]);

  useEffect(() => {
    void load();
  }, [load]);

  useEffect(() => {
    const timer = setInterval(() => void load(), 60_000);
    return () => clearInterval(timer);
  }, [load]);

  useEffect(() => {
    if (selectedId || lessons.length === 0) return;
    const liveNow = lessons.find((l) => l.canJoin && l.type === "live");
    setSelectedId(liveNow?.id || lessons[0].id);
  }, [lessons, selectedId]);

  const modules = useMemo(() => {
    const map = new Map<string, Lesson[]>();
    [...lessons]
      .sort((a, b) => a.order - b.order)
      .forEach((lesson) => {
        const key = lesson.moduleTitle || "Lessons";
        if (!map.has(key)) map.set(key, []);
        map.get(key)!.push(lesson);
      });
    return Array.from(map.entries());
  }, [lessons]);

  const selected = lessons.find((l) => l.id === selectedId) || null;

  const liveEvents: ClassCalendarEvent[] = useMemo(
    () =>
      lessons
        .filter((l) => l.type === "live" && l.scheduledAt)
        .map((l) => ({
          id: l.id,
          title: l.title,
          courseTitle: l.courseTitle,
          scheduledAt: l.scheduledAt as string,
          duration: l.duration,
          joinState: l.joinState,
          canJoin: l.canJoin,
        })),
    [lessons]
  );

  const handleJoin = useCallback(async (lessonId: string) => {
    setJoining(true);
    try {
      const res = await fetch(`/api/lessons/${lessonId}/join`, { method: "POST" });
      const data = await res.json();
      if (!res.ok) {
        toast.error(data?.error || "Unable to join right now");
        return;
      }
      setSelectedId(lessonId);
      setView("content");
      setLiveLessonId(lessonId);
      if (data.type === "recorded") {
        const lesson = lessons.find((l) => l.id === lessonId);
        if (lesson) setLiveUrl(lesson.videoUrl);
      } else {
        setLiveUrl(data.url);
      }
    } catch {
      toast.error("Unable to join right now");
    } finally {
      setJoining(false);
    }
  }, [lessons]);

  if (status === "loading" || loading) {
    return (
      <div className="flex min-h-[60vh] items-center justify-center">
        <Loader2 className="h-6 w-6 animate-spin text-primary" />
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-7xl px-4 py-6">
      <div className="mb-6 flex flex-wrap items-center justify-between gap-3">
        <div className="flex items-center gap-3">
          <Button variant="ghost" size="sm" asChild>
            <Link href="/dashboard">
              <ArrowLeft className="mr-1 h-4 w-4" /> Dashboard
            </Link>
          </Button>
          <div>
            <h1 className="text-lg font-semibold text-foreground">{course?.title || "Course"}</h1>
            {course?.teacherName && <p className="text-xs text-muted-foreground">{course.teacherName}</p>}
          </div>
        </div>
        <div className="flex items-center gap-2">
          <Button
            variant={view === "schedule" ? "default" : "outline"}
            size="sm"
            onClick={() => setView(view === "schedule" ? "content" : "schedule")}
          >
            <CalendarDays className="mr-1.5 h-4 w-4" /> {view === "schedule" ? "Content" : "Schedule"}
          </Button>
          <Button variant="outline" size="sm" asChild>
            <a href="/api/calendar/ics">Subscribe (.ics)</a>
          </Button>
        </div>
      </div>

      {error ? (
        <div className="rounded-lg border border-border/60 bg-card p-10 text-center">
          <p className="text-sm text-muted-foreground">{error}</p>
          <Button className="mt-4" asChild>
            <Link href={`/courses/${courseId}`}>View course</Link>
          </Button>
        </div>
      ) : view === "schedule" ? (
        <ClassCalendar events={liveEvents} onJoin={handleJoin} />
      ) : (
        <div className="grid gap-6 lg:grid-cols-[300px_minmax(0,1fr)]">
          <aside className="rounded-lg border border-border/60 bg-card p-3">
            <div className="mb-2 flex items-center gap-2 px-2 py-1.5 text-sm font-semibold text-foreground">
              <ListVideo className="h-4 w-4 text-primary" /> Course content
            </div>
            {modules.length === 0 && (
              <p className="px-2 py-6 text-center text-sm text-muted-foreground">No lessons published yet.</p>
            )}
            <div className="space-y-3">
              {modules.map(([moduleTitle, items]) => (
                <div key={moduleTitle}>
                  <p className="px-2 py-1 text-xs font-semibold uppercase tracking-wide text-muted-foreground">
                    {moduleTitle}
                  </p>
                  <ul className="space-y-0.5">
                    {items.map((lesson) => (
                      <li key={lesson.id}>
                        <button
                          type="button"
                          onClick={() => {
                            setSelectedId(lesson.id);
                            setLiveUrl(null);
                            setLiveLessonId(null);
                          }}
                          className={cn(
                            "flex w-full items-start gap-2 rounded-md px-2 py-2 text-left text-sm transition-colors",
                            selectedId === lesson.id ? "bg-accent text-accent-foreground" : "hover:bg-muted"
                          )}
                        >
                          {lesson.type === "live" ? (
                            <Radio className={cn("mt-0.5 h-4 w-4 shrink-0", lesson.joinState === "open" ? "text-destructive" : "text-primary")} />
                          ) : (
                            <FileVideo className="mt-0.5 h-4 w-4 shrink-0 text-muted-foreground" />
                          )}
                          <span className="min-w-0 flex-1">
                            <span className="line-clamp-2 text-foreground">{lesson.title}</span>
                            {lesson.type === "live" && lesson.joinState === "open" && (
                              <span className="text-xs font-semibold text-destructive">Live now</span>
                            )}
                          </span>
                        </button>
                      </li>
                    ))}
                  </ul>
                </div>
              ))}
            </div>
          </aside>

          <main className="min-w-0">
            {!selected ? (
              <div className="rounded-lg border border-border/60 bg-card p-10 text-center text-sm text-muted-foreground">
                Select a lesson to begin.
              </div>
            ) : (
              <div className="space-y-4">
                <div>
                  <div className="flex items-center gap-2">
                    <Badge variant="secondary" className="text-xs">
                      {selected.type === "live" ? "Live class" : "Recorded"}
                    </Badge>
                    {selected.duration ? (
                      <span className="text-xs text-muted-foreground">{selected.duration} min</span>
                    ) : null}
                  </div>
                  <h2 className="mt-1.5 text-base font-semibold text-foreground">{selected.title}</h2>
                  {selected.description && (
                    <p className="mt-1 text-sm text-muted-foreground">{selected.description}</p>
                  )}
                </div>

                {selected.type === "recorded" ? (
                  selected.videoUrl ? (
                    <video
                      key={selected.videoUrl}
                      className="w-full rounded-lg border border-border/60 bg-black"
                      src={selected.videoUrl}
                      controls
                      controlsList="nodownload"
                    />
                  ) : (
                    <div className="rounded-lg border border-border/60 bg-card p-10 text-center text-sm text-muted-foreground">
                      Recording is not available yet.
                    </div>
                  )
                ) : liveUrl && liveLessonId === selected.id ? (
                  <div className="aspect-video w-full overflow-hidden rounded-lg border border-border/60">
                    <iframe
                      src={liveUrl}
                      allow="camera; microphone; fullscreen; display-capture; autoplay"
                      className="h-full w-full"
                      title={selected.title}
                    />
                  </div>
                ) : (
                  <LiveSessionCard
                    session={
                      {
                        id: selected.id,
                        title: selected.title,
                        courseTitle: selected.courseTitle,
                        teacherName: selected.teacherName,
                        scheduledAt: selected.scheduledAt,
                        duration: selected.duration,
                        joinState: selected.joinState,
                        canJoin: selected.canJoin,
                      } as LiveSession
                    }
                    onJoin={handleJoin}
                  />
                )}

                {selected.type === "live" && !liveUrl && joining && (
                  <p className="flex items-center gap-2 text-sm text-muted-foreground">
                    <Loader2 className="h-4 w-4 animate-spin" /> Preparing your class...
                  </p>
                )}
              </div>
            )}
          </main>
        </div>
      )}
    </div>
  );
}
