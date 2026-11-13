"use client";

import { useMemo, useState } from "react";
import {
  addMonths,
  eachDayOfInterval,
  endOfMonth,
  endOfWeek,
  format,
  isSameDay,
  isSameMonth,
  isToday,
  startOfMonth,
  startOfWeek,
  subMonths,
} from "date-fns";
import { CalendarDays, ChevronLeft, ChevronRight, Clock, Video } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";
import { formatClassTime } from "@/lib/calendar";

export interface ClassCalendarEvent {
  id: string;
  title: string;
  courseTitle?: string;
  scheduledAt: string;
  duration?: number | null;
  joinState?: "upcoming" | "open" | "ended" | "cancelled" | "on-demand";
  canJoin?: boolean;
}

interface ClassCalendarProps {
  events: ClassCalendarEvent[];
  onJoin?: (id: string) => void;
  timezone?: string;
}

const WEEKDAYS = ["S", "M", "T", "W", "T", "F", "S"];

export function ClassCalendar({ events, onJoin, timezone }: ClassCalendarProps) {
  const [cursor, setCursor] = useState(() => new Date());
  const [selected, setSelected] = useState<Date>(() => new Date());

  const eventsByDay = useMemo(() => {
    const map = new Map<string, ClassCalendarEvent[]>();
    for (const event of events) {
      const key = format(new Date(event.scheduledAt), "yyyy-MM-dd");
      const list = map.get(key) || [];
      list.push(event);
      map.set(key, list);
    }
    return map;
  }, [events]);

  const days = useMemo(() => {
    const start = startOfWeek(startOfMonth(cursor));
    const end = endOfWeek(endOfMonth(cursor));
    return eachDayOfInterval({ start, end });
  }, [cursor]);

  const selectedEvents = eventsByDay.get(format(selected, "yyyy-MM-dd")) || [];

  return (
    <div className="grid gap-4 lg:grid-cols-[minmax(0,1fr)_minmax(0,1fr)]">
      <div className="rounded-lg border border-border/60 bg-card p-4">
        <div className="mb-4 flex items-center justify-between">
          <Button variant="outline" size="sm" onClick={() => setCursor(subMonths(cursor, 1))} aria-label="Previous month">
            <ChevronLeft className="h-4 w-4" />
          </Button>
          <h3 className="text-sm font-semibold text-foreground">{format(cursor, "MMMM yyyy")}</h3>
          <Button variant="outline" size="sm" onClick={() => setCursor(addMonths(cursor, 1))} aria-label="Next month">
            <ChevronRight className="h-4 w-4" />
          </Button>
        </div>

        <div className="grid grid-cols-7 gap-1 text-center text-xs font-medium text-muted-foreground">
          {WEEKDAYS.map((day, index) => (
            <div key={`${day}-${index}`} className="py-1">
              {day}
            </div>
          ))}
        </div>

        <div className="mt-1 grid grid-cols-7 gap-1">
          {days.map((day) => {
            const key = format(day, "yyyy-MM-dd");
            const hasEvents = eventsByDay.has(key);
            const isSelected = isSameDay(day, selected);
            return (
              <button
                key={key}
                type="button"
                onClick={() => setSelected(day)}
                className={cn(
                  "relative flex h-10 flex-col items-center justify-center rounded-md text-sm transition-colors",
                  !isSameMonth(day, cursor) && "text-muted-foreground/50",
                  isSameMonth(day, cursor) && "text-foreground hover:bg-muted",
                  isToday(day) && !isSelected && "font-semibold text-primary",
                  isSelected && "bg-primary text-primary-foreground hover:bg-primary"
                )}
              >
                <span>{format(day, "d")}</span>
                {hasEvents && (
                  <span
                    className={cn(
                      "absolute bottom-1 h-1 w-1 rounded-full",
                      isSelected ? "bg-primary-foreground" : "bg-primary"
                    )}
                  />
                )}
              </button>
            );
          })}
        </div>
      </div>

      <div className="rounded-lg border border-border/60 bg-card p-4">
        <div className="mb-3 flex items-center gap-2">
          <CalendarDays className="h-4 w-4 text-primary" />
          <h3 className="text-sm font-semibold text-foreground">{format(selected, "EEEE, d MMMM")}</h3>
        </div>

        {selectedEvents.length === 0 ? (
          <p className="py-8 text-center text-sm text-muted-foreground">No classes scheduled for this day.</p>
        ) : (
          <ul className="space-y-2">
            {selectedEvents.map((event) => (
              <li key={event.id} className="rounded-md border border-border/60 p-3">
                <div className="flex items-start justify-between gap-2">
                  <div className="min-w-0">
                    <p className="truncate text-sm font-medium text-foreground">{event.title}</p>
                    {event.courseTitle && (
                      <p className="truncate text-xs text-muted-foreground">{event.courseTitle}</p>
                    )}
                    <p className="mt-1 flex items-center gap-1 text-xs text-muted-foreground">
                      <Clock className="h-3 w-3" />
                      {formatClassTime(event.scheduledAt, timezone)}
                      {event.duration ? ` · ${event.duration} min` : ""}
                    </p>
                  </div>
                  <Badge
                    variant={event.canJoin ? "default" : "secondary"}
                    className="shrink-0 gap-1"
                  >
                    <Video className="h-3 w-3" />
                    {event.joinState === "open" ? "Live now" : event.joinState === "ended" ? "Ended" : "Scheduled"}
                  </Badge>
                </div>
                {onJoin && event.canJoin && (
                  <Button size="sm" className="mt-2 w-full" onClick={() => onJoin(event.id)}>
                    Join class
                  </Button>
                )}
              </li>
            ))}
          </ul>
        )}
      </div>
    </div>
  );
}

export default ClassCalendar;
