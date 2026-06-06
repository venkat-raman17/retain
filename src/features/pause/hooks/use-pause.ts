import { useMemo } from 'react';

import { systemClock } from '@/shared/lib';
import { useRepositories } from '@/shared/storage';

import type { UrgeLog, UrgeLogDraft } from '../domain/urge-log';
import { PauseService } from '../services/pause-service';

/**
 * Hook boundary over {@link PauseService}. The Pause screen records urges
 * through these callbacks rather than constructing the service itself.
 */
export interface UsePause {
  recordUrge: (draft: UrgeLogDraft) => Promise<UrgeLog>;
  listRecent: (limit?: number) => Promise<UrgeLog[]>;
}

export function usePause(): UsePause {
  const { urge } = useRepositories();
  const service = useMemo(() => new PauseService(urge, systemClock), [urge]);

  return useMemo(
    () => ({
      recordUrge: (draft: UrgeLogDraft) => service.recordUrge(draft),
      listRecent: (limit?: number) => service.listRecent(limit),
    }),
    [service],
  );
}
