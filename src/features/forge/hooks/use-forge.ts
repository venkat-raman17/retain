import { useCallback, useMemo } from 'react';

import type { ForgeCategoryCount } from '@/db';
import { useAsyncResource } from '@/shared/hooks';
import { systemClock } from '@/shared/lib';
import { useRepositories } from '@/shared/storage';

import type { ForgeAct, ForgeActDraft } from '../domain/forge-act';
import { ForgeService } from '../services/forge-service';

export interface UseForge {
  acts: ForgeAct[];
  categoryCounts: ForgeCategoryCount[];
  loading: boolean;
  logAct: (draft: ForgeActDraft) => Promise<void>;
  refresh: () => void;
}

export function useForge(): UseForge {
  const { forge: forgeRepo } = useRepositories();
  const service = useMemo(() => new ForgeService(forgeRepo, systemClock), [forgeRepo]);

  const load = useCallback(
    () =>
      Promise.all([service.listRecent(50), service.categoryCounts()]).then(
        ([acts, categoryCounts]) => ({ acts, categoryCounts }),
      ),
    [service],
  );
  const { data, loading, refresh } = useAsyncResource(load, { scope: 'forge' });

  const logAct = useCallback(
    async (draft: ForgeActDraft) => {
      await service.logAct(draft);
      refresh();
    },
    [service, refresh],
  );

  return {
    acts: data?.acts ?? [],
    categoryCounts: data?.categoryCounts ?? [],
    loading,
    logAct,
    refresh,
  };
}
