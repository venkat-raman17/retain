import { useCallback, useEffect, useMemo, useState } from 'react';

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

  const [boundaries, setBoundaries] = useState<Boundary[]>([]);
  const [loading, setLoading] = useState(true);
  const [reloadToken, setReloadToken] = useState(0);
  const refresh = useCallback(() => setReloadToken((t) => t + 1), []);

  useEffect(() => {
    let active = true;
    service
      .listActive()
      .then((data) => {
        if (active) { setBoundaries(data); setLoading(false); }
      })
      .catch(() => {
        if (active) setLoading(false);
      });
    return () => { active = false; };
  }, [service, reloadToken]);

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

  return { boundaries, loading, add, checkin, deactivate, refresh };
}
