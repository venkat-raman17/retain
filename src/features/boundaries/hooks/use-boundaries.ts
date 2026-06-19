import { useCallback, useMemo } from 'react';

import { useAsyncResource } from '@/shared/hooks';
import { systemClock } from '@/shared/lib';
import { useRepositories } from '@/shared/storage';

import type { Boundary } from '../domain/boundary';
import type { CheckinStatus } from '../domain/boundary-checkin';
import { BoundaryService } from '../services/boundary-service';

export interface UseBoundaries {
  boundaries: Boundary[];
  loading: boolean;
  add: (title: string, description?: string | null) => Promise<void>;
  checkin: (boundaryId: string, status: CheckinStatus, note?: string | null) => Promise<void>;
  deactivate: (id: string) => Promise<void>;
  refresh: () => void;
}

export function useBoundaries(): UseBoundaries {
  const { boundary: repo } = useRepositories();
  const service = useMemo(() => new BoundaryService(repo, systemClock), [repo]);

  const load = useCallback(() => service.listActive(), [service]);
  const { data, loading, refresh } = useAsyncResource(load, { scope: 'boundaries' });

  const add = useCallback(
    async (title: string, description: string | null = null) => {
      await service.add({ title, description });
      refresh();
    },
    [service, refresh],
  );

  const checkin = useCallback(
    async (boundaryId: string, status: CheckinStatus, note: string | null = null) => {
      await service.checkin(boundaryId, status, note);
      refresh();
    },
    [service, refresh],
  );

  const deactivate = useCallback(
    async (id: string) => {
      await service.deactivate(id);
      refresh();
    },
    [service, refresh],
  );

  return { boundaries: data ?? [], loading, add, checkin, deactivate, refresh };
}
