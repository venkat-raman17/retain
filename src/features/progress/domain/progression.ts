import type { Station, Trial } from '@/content/schemas';

/**
 * Pure derivations — all progression facts come from existing data.
 * Embers and rank can never decrease (monotonic by construction).
 */

/** Days that close an arc and earn a milestone rite/key. */
export const MILESTONE_DAYS = [7, 14, 21, 30, 45, 60, 75, 90] as const;

/** Whether a given day is a milestone (rite) day. */
export function isMilestoneDay(day: number): boolean {
  return (MILESTONE_DAYS as readonly number[]).includes(day);
}

/** Total embers from all cleared days (days with completed content_progress). */
export function embersForCompletedDays(
  trials: readonly Trial[],
  completedDayNumbers: number[],
  crownReceived: boolean,
): number {
  const daySet = new Set(completedDayNumbers);
  let total = trials
    .filter((t) => typeof t.dayNumber === 'number' && daySet.has(t.dayNumber as number))
    .reduce((sum, t) => sum + t.rewardEmbers, 0);
  if (crownReceived) {
    const crown = trials.find((t) => t.dayNumber === 'crown');
    if (crown) total += crown.rewardEmbers;
  }
  return total;
}

/** Number of complete arcs (all 10 days in the arc finished). */
export function arcsCleared(completedDayNumbers: number[]): number {
  const daySet = new Set(completedDayNumbers);
  let count = 0;
  for (let arc = 1; arc <= 9; arc++) {
    const start = (arc - 1) * 10 + 1;
    const end = arc * 10;
    let allDone = true;
    for (let d = start; d <= end; d++) {
      if (!daySet.has(d)) { allDone = false; break; }
    }
    if (allDone) count++;
  }
  return count;
}

/** Station (rank title) for the given number of cleared arcs. */
export function stationForArcsCleared(
  stations: readonly Station[],
  cleared: number,
): Station | undefined {
  // Find the highest station the user has reached (arcsCleared <= cleared).
  return [...stations]
    .filter((s) => s.arcsCleared <= cleared)
    .sort((a, b) => b.arcsCleared - a.arcsCleared)[0];
}

/** Whether a given arc number (1-9) is fully complete. */
export function isArcCleared(completedDayNumbers: number[], arcNumber: number): boolean {
  const start = (arcNumber - 1) * 10 + 1;
  const end = arcNumber * 10;
  const daySet = new Set(completedDayNumbers);
  for (let d = start; d <= end; d++) {
    if (!daySet.has(d)) return false;
  }
  return true;
}
