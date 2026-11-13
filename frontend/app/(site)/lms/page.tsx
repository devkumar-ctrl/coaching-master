"use client";

import { useCallback, useEffect, useState } from "react";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { BookOpen, CalendarClock, GraduationCap, Loader2, PlayCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { formatClassTime } from "@/lib/calendar";

interface EnrolledCourse {
  id: string;
  title: string;
  description?: string;
  category?: string;
  image?: string;
  progress: number;
  teacherName?: string;
  nextClass?: { date: string; time: string; topic: string } | null;
}

interface ScheduleEvent {
  id: string;
  title: string;
  courseTitle?: string;
  scheduledAt: string | null;
  duration?: number | null;
  joinState?: string;
  canJoin?: boolean;
}

export default function LmsHomePage() {
  const { data: session, status } = useSession();
  const router = useRouter();
  const [courses, setCourses] = useState<EnrolledCourse[]>([]);
  const [events, setEvents] = useState<ScheduleEvent[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (status === "unauthenticated") router.push("/auth/signin?callbackUrl=/lms");
    if (status === "authenticated" && session?.user?.role === "ADMIN") router.push("/admin");
    if (status === "authenticated" && session?.user?.role === "COACH") router.push("/dashboard");
  }, [status, session, router]);

  const load = useCallback(async () => {
    const id = session?.user?.id;
    if (!id) return;
    try {
      setLoading(true);
      const [coursesRes, scheduleRes] = await Promise.all([
        fetch(`/api/students/${id}/courses`),
        fetch(`/api/students/${id}/schedule?range=upcoming`),
      ]);
      if (coursesRes.ok) setCourses(await coursesRes.json());
      if (scheduleRes.ok) {
        const data = await scheduleRes.json();
        setEvents((data.events || []).slice(0, 5));
      }
    } finally {
      setLoading(false);
    }
  }, [session?.user?.id]);

  useEffect(() => {
    if (status === "authenticated") void load();
  }, [status, load]);

  if (status === "loading" || loading) {
    return (
      <div className="flex min-h-[50vh] items-center justify-center">
        <Loader2 className="h-6 w-6 animate-spin text-primary" />
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-6xl px-4 py-8">
      <div className="mb-8">
        <h1 className="flex items-center gap-2 text-2xl font-bold text-foreground">
          <GraduationCap className="h-6 w-6 text-primary" /> My Learning
        </h1>
        <p className="mt-1 text-sm text-muted-foreground">Welcome back. Continue where you left off.</p>
      </div>

      {events.length > 0 && (
        <Card className="mb-8 border-primary/20">
          <CardHeader className="pb-3">
            <CardTitle className="flex items-center gap-2 text-base">
              <CalendarClock className="h-4 w-4 text-primary" /> Upcoming live classes
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-2">
            {events.map((event) => (
              <div
                key={event.id}
                className="flex items-center justify-between gap-3 rounded-md border border-border/60 px-3 py-2"
              >
                <div className="min-w-0">
                  <p className="truncate text-sm font-medium text-foreground">{event.title}</p>
                  <p className="text-xs text-muted-foreground">
                    {formatClassTime(event.scheduledAt)}
                    {event.courseTitle ? ` · ${event.courseTitle}` : ""}
                  </p>
                </div>
                <Badge variant={event.canJoin ? "destructive" : "secondary"} className="shrink-0">
                  {event.joinState === "open" ? "Live now" : "Scheduled"}
                </Badge>
              </div>
            ))}
          </CardContent>
        </Card>
      )}

      <h2 className="mb-3 flex items-center gap-2 text-sm font-semibold text-foreground">
        <BookOpen className="h-4 w-4 text-primary" /> Enrolled courses
      </h2>

      {courses.length === 0 ? (
        <Card>
          <CardContent className="py-12 text-center">
            <p className="text-sm text-muted-foreground">You are not enrolled in any course yet.</p>
            <Button className="mt-4" asChild>
              <Link href="/courses">Browse courses</Link>
            </Button>
          </CardContent>
        </Card>
      ) : (
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {courses.map((course) => (
            <Card key={course.id} className="flex flex-col">
              <CardHeader>
                <CardTitle className="line-clamp-2 text-base">{course.title}</CardTitle>
                {course.teacherName && <CardDescription>{course.teacherName}</CardDescription>}
              </CardHeader>
              <CardContent className="flex flex-1 flex-col justify-between gap-4">
                <div>
                  <div className="mb-1 flex items-center justify-between text-xs text-muted-foreground">
                    <span>Progress</span>
                    <span>{Math.round(course.progress || 0)}%</span>
                  </div>
                  <Progress value={course.progress || 0} />
                </div>
                <Button asChild className="w-full gap-1.5">
                  <Link href={`/learn/${course.id}`}>
                    <PlayCircle className="h-4 w-4" /> Continue learning
                  </Link>
                </Button>
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
}
