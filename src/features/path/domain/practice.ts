import type { Clock } from '@/shared/lib';
import { differenceInDays } from '@/shared/utils';

import type { UserProfile } from './user-profile';

/** Whole days elapsed since an ISO timestamp (0 when null or in the future). */
export function daysSince(iso: string | null, clock: Clock): number {
  if (!iso) return 0;
  const days = differenceInDays(clock.now(), new Date(iso));
  return days < 0 ? 0 : days;
}

/**
 * The current path day, 1-indexed for display (day 1 the moment a path begins;
 * 0 when no path is running). Driven by `currentPathStartedAt`, which a lapse
 * resets — while `pathStartedAt` and all history are preserved.
 */
export function currentPathDay(
  profile: Pick<UserProfile, 'currentPathStartedAt'>,
  clock: Clock,
): number {
  if (!profile.currentPathStartedAt) return 0;
  return daysSince(profile.currentPathStartedAt, clock) + 1;
}

export function isPathRunning(profile: Pick<UserProfile, 'currentPathStartedAt'>): boolean {
  return profile.currentPathStartedAt != null;
}
