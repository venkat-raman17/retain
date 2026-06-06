import { useCallback, useEffect, useMemo, useState } from 'react';

import type { ForgeCategoryCount } from '@/db';
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

  const [acts, setActs] = useState<ForgeAct[]>([]);
  const [categoryCounts, setCategoryCounts] = useState<ForgeCategoryCount[]>([]);
  const [loading, setLoading] = useState(true);
  const [reloadToken, setReloadToken] = useState(0);
  const refresh = useCallback(() => setReloadToken((t) => t + 1), []);

  useEffect(() => {
    let active = true;
    Promise.all([service.listRecent(50), service.categoryCounts()])
      .then(([recentActs, counts]) => {
        if (active) {
          setActs(recentActs);
          setCategoryCounts(counts);
          setLoading(false);
        }
      })
      .catch(() => {
        if (active) setLoading(false);
      });
    return () => {
      active = false;
    };
  }, [service, reloadToken]);

  const logAct = useCallback(
    async (draft: ForgeActDraft) => {
      await service.logAct(draft);
      refresh();
    },
    [service, refresh],
  );

  return { acts, categoryCounts, loading, logAct, refresh };
}
