/**
 * Time-of-day + day-rotation helpers, pure and Clock-driven so the home surface
 * can change through the day and across days without storing anything. No React,
 * no DB — just the injected `Clock`.
 */
import type { Clock } from '@/shared/lib';

export type TimeOfDay = 'dawn' | 'morning' | 'midday' | 'evening' | 'night';

/** Bucket the current hour into a part of the day. */
export function timeOfDay(clock: Clock): TimeOfDay {
  const hour = clock.now().getHours();
  if (hour < 5) return 'night';
  if (hour < 8) return 'dawn';
  if (hour < 12) return 'morning';
  if (hour < 17) return 'midday';
  if (hour < 21) return 'evening';
  return 'night';
}

/** Deterministic day index since the epoch — used to rotate bundled content daily. */
export function dayOfYearIndex(clock: Clock): number {
  return Math.floor(clock.now().getTime() / 86_400_000);
}
