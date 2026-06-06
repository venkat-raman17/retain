import { useCallback, useEffect, useMemo, useState } from 'react';

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

  const [summary, setSummary] = useState<ProgressSummary | null>(null);
  const [loading, setLoading] = useState(true);
  const [reloadToken, setReloadToken] = useState(0);
  const refresh = useCallback(() => setReloadToken((t) => t + 1), []);

  useEffect(() => {
    let active = true;
    service
      .getSummary()
      .then((value) => {
        if (active) {
          setSummary(value);
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

  return { summary, loading, refresh };
}
