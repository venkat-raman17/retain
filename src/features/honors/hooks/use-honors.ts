import { useCallback, useEffect, useMemo, useState } from 'react';

import type { Achievement } from '@/content/schemas';
import { systemClock } from '@/shared/lib';
import { useRepositories } from '@/shared/storage';

import { HonorsService, type HonorsSummary } from '../services/honors-service';

export interface UseHonors {
  summary: HonorsSummary | null;
  loading: boolean;
  refresh: () => void;
  /** Run the evaluator, persist newly-earned, return new achievements (for toasts). */
  checkAndAward: () => Promise<Achievement[]>;
}

export function useHonors(): UseHonors {
  const repos = useRepositories();
  const service = useMemo(() => new HonorsService(repos, systemClock), [repos]);

  const [summary, setSummary] = useState<HonorsSummary | null>(null);
  const [loading, setLoading] = useState(true);
  const [reloadToken, setReloadToken] = useState(0);
  const refresh = useCallback(() => setReloadToken((t) => t + 1), []);

  useEffect(() => {
    let active = true;
    service
      .getSummary()
      .then((result) => {
        if (!active) return;
        setSummary(result);
        setLoading(false);
      })
      .catch(() => {
        if (active) setLoading(false);
      });
    return () => {
      active = false;
    };
  }, [service, reloadToken]);

  const checkAndAward = useCallback(() => service.checkAndAward(), [service]);

  return { summary, loading, refresh, checkAndAward };
}
