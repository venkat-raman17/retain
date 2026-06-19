import { useCallback, useMemo } from 'react';

import type { Achievement } from '@/content/schemas';
import { useAsyncResource } from '@/shared/hooks';
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

  const load = useCallback(() => service.getSummary(), [service]);
  const { data: summary, loading, refresh } = useAsyncResource(load, { scope: 'honors' });

  const checkAndAward = useCallback(() => service.checkAndAward(), [service]);

  return { summary, loading, refresh, checkAndAward };
}
