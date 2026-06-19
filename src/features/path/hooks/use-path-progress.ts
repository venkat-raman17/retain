import { useCallback, useMemo } from 'react';

import { useAsyncResource } from '@/shared/hooks';
import { systemClock } from '@/shared/lib';
import { useRepositories } from '@/shared/storage';

import type { ProgressSummary } from '../../progress/services/progress-service';
import { ProgressService } from '../../progress/services/progress-service';

export interface UsePathProgress {
  summary: ProgressSummary | null;
  loading: boolean;
  refresh: () => void;
}

export function usePathProgress(): UsePathProgress {
  const repos = useRepositories();
  const service = useMemo(() => new ProgressService(repos, systemClock), [repos]);
  const load = useCallback(() => service.getSummary(), [service]);
  const { data: summary, loading, refresh } = useAsyncResource(load, { scope: 'progress' });
  return { summary, loading, refresh };
}
