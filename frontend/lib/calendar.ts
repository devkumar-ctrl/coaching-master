export interface CalendarEventInput {
  title: string;
  description?: string;
  location?: string;
  start: string | Date;
  end?: string | Date;
  durationMinutes?: number;
  uid?: string;
  url?: string;
}

function toDate(value: string | Date): Date {
  return value instanceof Date ? value : new Date(value);
}

function endOf(event: CalendarEventInput): Date {
  if (event.end) return toDate(event.end);
  const start = toDate(event.start);
  return new Date(start.getTime() + (event.durationMinutes ?? 60) * 60_000);
}

/** Compact UTC stamp used by Google/Outlook/ICS: YYYYMMDDTHHMMSSZ */
function stamp(date: Date): string {
  return date.toISOString().replace(/[-:]/g, '').replace(/\.\d{3}/, '');
}

export function googleCalendarUrl(event: CalendarEventInput): string {
  const params = new URLSearchParams({
    action: 'TEMPLATE',
    text: event.title,
    dates: `${stamp(toDate(event.start))}/${stamp(endOf(event))}`,
    details: event.description || '',
    location: event.location || 'Online',
  });
  return `https://calendar.google.com/calendar/render?${params.toString()}`;
}

export function outlookCalendarUrl(event: CalendarEventInput): string {
  const params = new URLSearchParams({
    path: '/calendar/action/compose',
    rru: 'addevent',
    subject: event.title,
    startdt: toDate(event.start).toISOString(),
    enddt: endOf(event).toISOString(),
    body: event.description || '',
    location: event.location || 'Online',
  });
  return `https://outlook.live.com/calendar/0/deeplink/compose?${params.toString()}`;
}

function escapeText(value: string): string {
  return value.replace(/\\/g, '\\\\').replace(/;/g, '\\;').replace(/,/g, '\\,').replace(/\n/g, '\\n');
}

function fold(line: string): string {
  if (line.length <= 75) return line;
  const chunks: string[] = [];
  for (let i = 0; i < line.length; i += 73) chunks.push((i === 0 ? '' : ' ') + line.slice(i, i + 73));
  return chunks.join('\r\n');
}

export function buildIcs(event: CalendarEventInput): string {
  const uid = event.uid || `evt-${Date.now()}@yuvabot`;
  const lines = [
    'BEGIN:VCALENDAR',
    'VERSION:2.0',
    'PRODID:-//YuvaBot LMS//EN',
    'CALSCALE:GREGORIAN',
    'METHOD:PUBLISH',
    'BEGIN:VEVENT',
    `UID:${uid}`,
    `DTSTAMP:${stamp(new Date())}`,
    `DTSTART:${stamp(toDate(event.start))}`,
    `DTEND:${stamp(endOf(event))}`,
    fold(`SUMMARY:${escapeText(event.title)}`),
    fold(`DESCRIPTION:${escapeText(event.description || '')}`),
    fold(`LOCATION:${escapeText(event.location || 'Online')}`),
    event.url ? fold(`URL:${event.url}`) : '',
    'END:VEVENT',
    'END:VCALENDAR',
  ].filter(Boolean);
  return lines.join('\r\n') + '\r\n';
}

export function downloadIcs(event: CalendarEventInput, filename = 'class.ics'): void {
  const blob = new Blob([buildIcs(event)], { type: 'text/calendar;charset=utf-8' });
  const url = URL.createObjectURL(blob);
  const anchor = document.createElement('a');
  anchor.href = url;
  anchor.download = filename;
  document.body.appendChild(anchor);
  anchor.click();
  document.body.removeChild(anchor);
  URL.revokeObjectURL(url);
}

export function formatClassTime(iso: string | null, timezone?: string): string {
  if (!iso) return '';
  try {
    return new Intl.DateTimeFormat(undefined, {
      weekday: 'short',
      day: 'numeric',
      month: 'short',
      hour: 'numeric',
      minute: '2-digit',
      timeZone: timezone || undefined,
    }).format(new Date(iso));
  } catch {
    return new Date(iso).toLocaleString();
  }
}
