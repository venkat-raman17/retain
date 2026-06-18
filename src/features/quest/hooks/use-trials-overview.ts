import { useCallback, useEffect, useMemo, useState } from 'react';

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

  const [quests, setQuests] = useState<DayQuestResult[]>([]);
  const [loading, setLoading] = useState(true);
  const [reloadToken, setReloadToken] = useState(0);
  const refresh = useCallback(() => setReloadToken((t) => t + 1), []);

  useEffect(() => {
    let active = true;
    service
      .getRecentQuests(currentDay, count)
      .then((result) => {
        if (!active) return;
        setQuests(result);
        setLoading(false);
      })
      .catch(() => {
        if (active) setLoading(false);
      });
    return () => {
      active = false;
    };
  }, [service, currentDay, count, reloadToken]);

  return { quests, loading, refresh };
}
