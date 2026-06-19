import { useCallback, useMemo } from 'react';

import { useAsyncResource } from '@/shared/hooks';
import { systemClock } from '@/shared/lib';
import { useRepositories } from '@/shared/storage';

import type { DayQuestResult } from '../domain/quest-evaluation';
import { QuestService } from '../services/quest-service';

export interface UseTrialsOverview {
  /** Today's quest plus recent prior days, newest first. */
  quests: DayQuestResult[];
  loading: boolean;
  refresh: () => void;
}

/**
 * Hook boundary over {@link QuestService.getRecentQuests}. Mirrors
 * {@link useDayQuest} — the Trials screen consumes the ready-made list and stays
 * orchestration-only.
 */
export function useTrialsOverview(currentDay: number, count = 10): UseTrialsOverview {
  const repos = useRepositories();
  const service = useMemo(
    () =>
      new QuestService(
        repos.forge,
        repos.urge,
        repos.journal,
        repos.boundary,
        repos.contentProgress,
        systemClock,
      ),
    [repos],
  );

  const load = useCallback(
    () => service.getRecentQuests(currentDay, count),
    [service, currentDay, count],
  );
  const { data, loading, refresh } = useAsyncResource(load, { scope: 'quest' });
  return { quests: data ?? [], loading, refresh };
}
