import { useCallback, useEffect, useMemo, useState } from 'react';

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
        repos.journal,
        repos.boundary,
        repos.contentProgress,
        systemClock,
      ),
    [repos],
  );

  const [quest, setQuest] = useState<DayQuestResult | null>(null);
  const [loading, setLoading] = useState(true);
  const [reloadToken, setReloadToken] = useState(0);
  const refresh = useCallback(() => setReloadToken((t) => t + 1), []);

  useEffect(() => {
    let active = true;
    service
      .getDayQuest(dayNumber)
      .then((result) => {
        if (!active) return;
        setQuest(result);
        setLoading(false);
      })
      .catch(() => {
        if (active) setLoading(false);
      });
    return () => {
      active = false;
    };
  }, [service, dayNumber, reloadToken]);

  return { quest, loading, refresh };
}
