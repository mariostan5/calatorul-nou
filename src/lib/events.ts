/* Events are stored in Bucharest time; a weekly one keeps its wall-clock hour there (19:00 stays 19:00
   after the clocks change). Visitors see times in their own time zone, as on the platform. */
const TZ = 'Europe/Bucharest';
const WEEK = 7 * 864e5;

export type EventTime = { start: string; weekly: boolean };

/** Minutes east of UTC in Bucharest at the instant `t`. */
function offsetAt(t: number): number {
  const name = new Intl.DateTimeFormat('en-US', { timeZone: TZ, timeZoneName: 'longOffset' })
    .formatToParts(t).find((p) => p.type === 'timeZoneName')!.value; // "GMT+03:00"
  const m = name.match(/([+-])(\d{2}):(\d{2})/);
  return m ? (m[1] === '-' ? -1 : 1) * (+m[2] * 60 + +m[3]) : 0;
}

/** Bucharest wall-clock time → the real instant. */
function fromWall(y: number, mo: number, d: number, h: number, mi: number): Date {
  const wall = Date.UTC(y, mo, d, h, mi);
  let t = wall - offsetAt(wall) * 6e4;
  t = wall - offsetAt(t) * 6e4; // second pass settles the offset on the day of a change
  return new Date(t);
}

function wallParts(t: Date) {
  const p = Object.fromEntries(new Intl.DateTimeFormat('en-US', { timeZone: TZ, hourCycle: 'h23', year: 'numeric', month: 'numeric', day: 'numeric', hour: 'numeric', minute: 'numeric' })
    .formatToParts(t).map((x) => [x.type, +x.value]));
  return { y: p.year, mo: p.month - 1, d: p.day, h: p.hour, mi: p.minute };
}

export function nextOccurrence(ev: EventTime, now: Date): Date | null {
  const start = new Date(ev.start);
  if (start >= now) return start;
  if (!ev.weekly) return null;
  const w = wallParts(start);
  for (let k = Math.max(1, Math.floor((+now - +start) / WEEK)); ; k++) {
    const at = fromWall(w.y, w.mo, w.d + 7 * k, w.h, w.mi);
    if (at >= now) return at;
  }
}

export function upcoming<E extends EventTime>(events: E[], now: Date, limit = 3): { ev: E; at: Date }[] {
  return events
    .map((ev) => ({ ev, at: nextOccurrence(ev, now) }))
    .filter((x): x is { ev: E; at: Date } => x.at !== null)
    .sort((a, b) => +a.at - +b.at)
    .slice(0, limit);
}

export const formatLocal = (at: Date, timeZone?: string) =>
  new Intl.DateTimeFormat('ro-RO', { weekday: 'long', day: 'numeric', month: 'short', hour: '2-digit', minute: '2-digit', timeZone }).format(at);
