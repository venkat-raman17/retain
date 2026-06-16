import { useCallback, useEffect, useMemo, useState } from 'react';

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

  const [brief, setBrief] = useState<DailyBrief | null>(null);
  const [loading, setLoading] = useState(true);
  const [reloadToken, setReloadToken] = useState(0);
  const refresh = useCallback(() => setReloadToken((token) => token + 1), []);

  useEffect(() => {
    let active = true;
    service
      .getDailyBrief()
      .then((value) => {
        if (!active) return;
        setBrief(value);
        setLoading(false);
      })
      .catch(() => {
        if (active) setLoading(false);
      });
    return () => {
      active = false;
    };
  }, [service, reloadToken]);

  return { brief, loading, refresh };
}
