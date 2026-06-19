import { useCallback, useMemo } from 'react';

import { useAsyncResource } from '@/shared/hooks';
import { systemClock } from '@/shared/lib';
import { useRepositories } from '@/shared/storage';

import { ProgressService, type RecordData } from '../services/progress-service';

export interface UseProgressSummary {
  record: RecordData | null;
  loading: boolean;
  refresh: () => void;
}

/**
 * Loads the full Record view (patterns, returns, rhythm, trends) in a single
 * service fan-out. Path Home's headline stats come from `usePathProgress`, not here.
 */
export function useProgressSummary(): UseProgressSummary {
  const repositories = useRepositories();
  const service = useMemo(() => new ProgressService(repositories, systemClock), [repositories]);
  const load = useCallback(() => service.getRecord(), [service]);
  const { data: record, loading, refresh } = useAsyncResource(load, { scope: 'progress' });
  return { record, loading, refresh };
}
