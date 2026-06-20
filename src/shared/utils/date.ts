import type { IsoDate, IsoDateTime } from '@/shared/types';

const MS_PER_DAY = 24 * 60 * 60 * 1000;

/**
 * Day-boundary math uses UTC so streaks are deterministic and timezone-stable
 * (and unit-testable). A future iteration may capture the device-local calendar
 * day at write time if local-midnight semantics become important to users.
 */

export function toIsoDateTime(date: Date): IsoDateTime {
  return date.toISOString();
}

export function toIsoDate(date: Date): IsoDate {
  const year = date.getUTCFullYear();
  const month = String(date.getUTCMonth() + 1).padStart(2, '0');
  const day = String(date.getUTCDate()).padStart(2, '0');
  return `${year}-${month}-${day}`;
}

export function startOfUtcDay(date: Date): Date {
  return new Date(Date.UTC(date.getUTCFullYear(), date.getUTCMonth(), date.getUTCDate()));
}

/** Whole-day difference (a − b), positive when `a` is later than `b`. */
export function differenceInDays(a: Date, b: Date): number {
  return Math.round((startOfUtcDay(a).getTime() - startOfUtcDay(b).getTime()) / MS_PER_DAY);
}

/**
 * Midnight of the device-LOCAL calendar day containing `date`. Used for the
 * "what day of the practice is it for the user" math (path day, the daily quest
 * window), so the count flips at the user's local midnight — not UTC midnight.
 * Streak/trend math stays on `startOfUtcDay` for timezone-stable history.
 */
export function startOfLocalDay(date: Date): Date {
  return new Date(date.getFullYear(), date.getMonth(), date.getDate());
}

/** Whole local-calendar-day difference (a − b), positive when `a` is later. */
export function differenceInCalendarDaysLocal(a: Date, b: Date): number {
  return Math.round((startOfLocalDay(a).getTime() - startOfLocalDay(b).getTime()) / MS_PER_DAY);
}

export function addDays(date: Date, days: number): Date {
  return new Date(date.getTime() + days * MS_PER_DAY);
}

export function isSameUtcDay(a: Date, b: Date): boolean {
  return differenceInDays(a, b) === 0;
}

/** Start of the week (Sunday 00:00 UTC) containing `date`. */
export function startOfWeek(date: Date): Date {
  const day = startOfUtcDay(date);
  return addDays(day, -day.getUTCDay());
}
