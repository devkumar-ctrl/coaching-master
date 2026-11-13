"use client";

import { useEffect, useState } from "react";
import { CalendarPlus, Clock, Radio, Video } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { formatClassTime, googleCalendarUrl, downloadIcs } from "@/lib/calendar";

export interface LiveSession {
  id: string;
  title: string;
  courseTitle?: string;
  teacherName?: string;
  scheduledAt: string | null;
  duration?: number | null;
  timezone?: string;
  joinState?: "upcoming" | "open" | "ended" | "cancelled" | "on-demand";
  canJoin?: boolean;
}

interface LiveSessionCardProps {
  session: LiveSession;
  onJoin: (id: string) => void;
}

function countdownLabel(target: Date, now: Date): string {
  const diff = target.getTime() - now.getTime();
  if (diff <= 0) return "Starting now";
  const totalMinutes = Math.floor(diff / 60_000);
  const days = Math.floor(totalMinutes / 1440);
  const hours = Math.floor((totalMinutes % 1440) / 60);
  const minutes = totalMinutes % 60;
  if (days > 0) return `Starts in ${days}d ${hours}h`;
  if (hours > 0) return `Starts in ${hours}h ${minutes}m`;
  return `Starts in ${minutes}m`;
}

export function LiveSessionCard({ session, onJoin }: LiveSessionCardProps) {
  const [now, setNow] = useState<Date>(() => new Date());

  useEffect(() => {
    const timer = setInterval(() => setNow(new Date()), 30_000);
    return () => clearInterval(timer);
  }, []);

  const start = session.scheduledAt ? new Date(session.scheduledAt) : null;
  const isLive = session.joinState === "open" || (start ? now >= start && !session.joinState : false);

  const calendarEvent = start
    ? {
        title: session.title,
        description: `Live class for ${session.courseTitle || "your course"}`,
        location: "Online",
        start,
        durationMinutes: session.duration ?? 60,
        uid: `${session.id}@yuvabot`,
      }
    : null;

  return (
    <div className="rounded-lg border border-border/60 bg-card p-4">
      <div className="flex items-start justify-between gap-3">
        <div className="min-w-0">
          <div className="flex items-center gap-2">
            {isLive && (
              <span className="flex items-center gap-1 text-xs font-semibold text-destructive">
                <Radio className="h-3.5 w-3.5" /> LIVE
              </span>
            )}
            <Badge variant={isLive ? "destructive" : "secondary"} className="text-xs">
              {isLive ? "Live now" : session.joinState === "ended" ? "Ended" : "Scheduled"}
            </Badge>
          </div>
          <h3 className="mt-1.5 truncate text-sm font-semibold text-foreground">{session.title}</h3>
          {session.courseTitle && <p className="truncate text-xs text-muted-foreground">{session.courseTitle}</p>}
          <p className="mt-1 flex items-center gap-1 text-xs text-muted-foreground">
            <Clock className="h-3 w-3" />
            {formatClassTime(session.scheduledAt, session.timezone)}
            {session.duration ? ` · ${session.duration} min` : ""}
          </p>
          {start && !isLive && session.joinState !== "ended" && (
            <p className="mt-1 text-xs font-medium text-primary">{countdownLabel(start, now)}</p>
          )}
        </div>
      </div>

      <div className="mt-3 flex flex-wrap items-center gap-2">
        <Button size="sm" disabled={!session.canJoin} onClick={() => onJoin(session.id)} className="gap-1.5">
          <Video className="h-4 w-4" />
          {isLive ? "Join now" : session.canJoin ? "Join class" : "Join opens soon"}
        </Button>

        {calendarEvent && (
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button size="sm" variant="outline" className="gap-1.5">
                <CalendarPlus className="h-4 w-4" />
                Add to Calendar
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuItem asChild>
                <a href={googleCalendarUrl(calendarEvent)} target="_blank" rel="noopener noreferrer">
                  Google Calendar
                </a>
              </DropdownMenuItem>
              <DropdownMenuItem onClick={() => downloadIcs(calendarEvent, `${session.title}.ics`)}>
                Apple / Outlook (.ics)
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        )}
      </div>
    </div>
  );
}

export default LiveSessionCard;
