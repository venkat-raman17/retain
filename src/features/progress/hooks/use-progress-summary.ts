import { useEffect, useMemo, useState } from 'react';

import { systemClock } from '@/shared/lib';
import { useRepositories } from '@/shared/storage';

import { ProgressService, type ProgressSummary } from '../services/progress-service';

export interface UseProgressSummary {
  summary: ProgressSummary | null;
  loading: boolean;
}

export function useProgressSummary(): UseProgressSummary {
  const repositories = useRepositories();
  const service = useMemo(() => new ProgressService(repositories, systemClock), [repositories]);

  const [summary, setSummary] = useState<ProgressSummary | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let active = true;
    service
      .getSummary()
      .then((value) => {
        if (!active) return;
        setSummary(value);
        setLoading(false);
      })
      .catch(() => {
        if (active) setLoading(false);
      });
    return () => {
      active = false;
    };
  }, [service]);

  return { summary, loading };
}
