import { useCallback, useMemo } from 'react';

import { useAsyncResource } from '@/shared/hooks';
import { systemClock } from '@/shared/lib';
import { useRepositories } from '@/shared/storage';

import { DailyBriefService, type DailyBrief } from '../services/daily-brief-service';

/**
 * Hook boundary over {@link DailyBriefService}. The Path screen consumes the
 * ready-made `brief` instead of hand-assembling daily content — keeping the
 * screen → hook → service chain intact (see docs/ARCHITECTURE.md).
 */
export interface UseDailyBrief {
  brief: DailyBrief | null;
  loading: boolean;
  refresh: () => void;
}

export function useDailyBrief(): UseDailyBrief {
  const repos = useRepositories();
  const service = useMemo(() => new DailyBriefService(repos.profile, systemClock), [repos]);
  const load = useCallback(() => service.getDailyBrief(), [service]);
  const { data: brief, loading, refresh } = useAsyncResource(load, { scope: 'path' });
  return { brief, loading, refresh };
}
