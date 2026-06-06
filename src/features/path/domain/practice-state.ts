import { z } from 'zod';

import type { Clock } from '@/shared/lib';
import { differenceInDays } from '@/shared/utils';

/**
 * The core of the practice: the current retention streak and historical bests.
 *
 * A lapse is modeled as a *reset* — never a failure. Resets preserve the best
 * streak and increment a counter that the app frames as data for learning, not
 * a scoreboard of shame (see CLAUDE.md content rules).
 */

export const practiceStateSchema = z.object({
  /** ISO timestamp the current streak began, or null when not currently running. */
  currentStreakStart: z.string().datetime().nullable(),
  bestStreakDays: z.number().int().min(0),
  totalResets: z.number().int().min(0),
  updatedAt: z.string().datetime(),
});
export type PracticeState = z.infer<typeof practiceStateSchema>;

export function initialPracticeState(clock: Clock): PracticeState {
  return practiceStateSchema.parse({
    currentStreakStart: null,
    bestStreakDays: 0,
    totalResets: 0,
    updatedAt: clock.now().toISOString(),
  });
}

/** Whole days elapsed in the current streak (0 when not running). */
export function currentStreakDays(
  state: Pick<PracticeState, 'currentStreakStart'>,
  clock: Clock,
): number {
  if (!state.currentStreakStart) return 0;
  const elapsed = differenceInDays(clock.now(), new Date(state.currentStreakStart));
  return elapsed < 0 ? 0 : elapsed;
}

export function startStreak(state: PracticeState, clock: Clock): PracticeState {
  const now = clock.now();
  return practiceStateSchema.parse({
    ...state,
    currentStreakStart: now.toISOString(),
    updatedAt: now.toISOString(),
  });
}

/** Record a reset. Keeps the best streak; clears the current run; counts it. */
export function registerReset(state: PracticeState, clock: Clock): PracticeState {
  const completed = currentStreakDays(state, clock);
  return practiceStateSchema.parse({
    currentStreakStart: null,
    bestStreakDays: Math.max(state.bestStreakDays, completed),
    totalResets: state.totalResets + 1,
    updatedAt: clock.now().toISOString(),
  });
}
