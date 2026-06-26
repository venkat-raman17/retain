import { useCallback } from 'react';

import { getDailyPathContent } from '@/content';

import { usePath } from '@/features/path/hooks/use-path';
import { useDayQuest } from '@/features/quest/hooks/use-day-quest';

export interface TodaysObjective {
  day: number;
  /** The day's written forge challenge — the action to take and log today. */
  forgeChallenge: string;
  arcNumber: number;
  arcTitle: string;
  /** The day's archetype slug, used as the focal-sigil seed on the objective card. */
  archetype: string | null;
  /** True once a forge act has been logged today (the day's forge objective met). */
  alreadyDoneToday: boolean;
}

export interface UseTodaysObjective {
  objective: TodaysObjective | null;
  /** Re-evaluate the day quest after logging, so the objective state flips. */
  refresh: () => void;
}

/**
 * Resolves today's forge challenge from bundled content and reports whether the
 * day's `forge_act` objective is already met. Keeps the Forge screen
 * orchestration-only: content comes through the loader, completion through the
 * quest evaluator.
 */
export function useTodaysObjective(): UseTodaysObjective {
  const { currentDay, isRunning } = usePath();
  const day = currentDay > 0 ? currentDay : 1;
  const { quest, refresh } = useDayQuest(day);

  const content = isRunning ? getDailyPathContent(day) : undefined;

  const objective: TodaysObjective | null = content
    ? {
        day,
        forgeChallenge: content.forgeChallenge,
        arcNumber: content.arcNumber,
        arcTitle: content.arcTitle,
        archetype: content.archetype ?? null,
        alreadyDoneToday:
          quest?.objectives.some((o) => o.kind === 'forge_act' && o.complete) ?? false,
      }
    : null;

  const refreshObjective = useCallback(() => refresh(), [refresh]);

  return { objective, refresh: refreshObjective };
}
