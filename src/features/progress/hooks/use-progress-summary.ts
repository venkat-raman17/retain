import { useEffect, useMemo, useState } from 'react';

import { systemClock } from '@/shared/lib';
import { useRepositories } from '@/shared/storage';

import {
  ProgressService,
  type ProgressSummary,
  type WeeklySummary,
} from '../services/progress-service';

export interface UseProgressSummary {
  summary: ProgressSummary | null;
  weekSummary: WeeklySummary | null;
  loading: boolean;
}

export function useProgressSummary(): UseProgressSummary {
  const repositories = useRepositories();
  const service = useMemo(() => new ProgressService(repositories, systemClock), [repositories]);

  const [summary, setSummary] = useState<ProgressSummary | null>(null);
  const [weekSummary, setWeekSummary] = useState<WeeklySummary | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let active = true;
    Promise.all([service.getSummary(), service.getWeeklySummary()])
      .then(([s, w]) => {
        if (!active) return;
        setSummary(s);
        setWeekSummary(w);
        setLoading(false);
      })
      .catch(() => {
        if (active) setLoading(false);
      });
    return () => {
      active = false;
    };
  }, [service]);

  return { summary, weekSummary, loading };
}
