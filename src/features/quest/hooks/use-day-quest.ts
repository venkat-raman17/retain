import { useCallback, useMemo } from 'react';

import { useAsyncResource } from '@/shared/hooks';
import { systemClock } from '@/shared/lib';
import { useRepositories } from '@/shared/storage';

import type { DayQuestResult } from '../domain/quest-evaluation';
import { QuestService } from '../services/quest-service';

export interface UseDayQuest {
  quest: DayQuestResult | null;
  loading: boolean;
  refresh: () => void;
}

export function useDayQuest(dayNumber: number): UseDayQuest {
  const repos = useRepositories();
  const service = useMemo(
    () =>
      new QuestService(
        repos.forge,
        repos.urge,
        repos.boundary,
        repos.contentProgress,
        systemClock,
      ),
    [repos],
  );

  const load = useCallback(() => service.getDayQuest(dayNumber), [service, dayNumber]);
  const { data: quest, loading, refresh } = useAsyncResource(load, { scope: 'quest' });
  return { quest, loading, refresh };
}
