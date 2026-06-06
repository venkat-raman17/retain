import { useCallback, useEffect, useState } from 'react';

import { systemClock } from '@/shared/lib';
import { useRepositories } from '@/shared/storage';

import { createLapse, type LapseDraft } from '../domain/lapse';
import {
  currentStreakDays,
  registerReset,
  startStreak,
  type PracticeState,
} from '../domain/practice-state';

export interface UsePracticeState {
  state: PracticeState | null;
  streakDays: number;
  isRunning: boolean;
  loading: boolean;
  begin: () => Promise<void>;
  reset: (draft?: LapseDraft) => Promise<void>;
  refresh: () => Promise<void>;
}

/**
 * Reads and mutates the practice state through the progress repository, applying
 * the pure domain transitions. Shared by Path, Progress, and Pause.
 */
export function usePracticeState(): UsePracticeState {
  const { progress } = useRepositories();
  const [state, setState] = useState<PracticeState | null>(null);
  const [loading, setLoading] = useState(true);

  const refresh = useCallback(async () => {
    setState(await progress.getPracticeState());
    setLoading(false);
  }, [progress]);

  useEffect(() => {
    void refresh();
  }, [refresh]);

  const begin = useCallback(async () => {
    const current = await progress.getPracticeState();
    const next = startStreak(current, systemClock);
    await progress.savePracticeState(next);
    setState(next);
  }, [progress]);

  const reset = useCallback(
    async (draft?: LapseDraft) => {
      const current = await progress.getPracticeState();
      const next = registerReset(current, systemClock);
      await progress.savePracticeState(next);
      if (draft) {
        await progress.addLapse(createLapse(draft, systemClock));
      }
      setState(next);
    },
    [progress],
  );

  const streakDays = state ? currentStreakDays(state, systemClock) : 0;
  const isRunning = state?.currentStreakStart != null;

  return { state, streakDays, isRunning: isRunning ?? false, loading, begin, reset, refresh };
}
