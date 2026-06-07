import { useCallback, useEffect, useMemo, useState } from 'react';

import { createLogger, systemClock } from '@/shared/lib';
import { useRepositories } from '@/shared/storage';

import { ProgressService, type RecordData } from '../services/progress-service';

const log = createLogger('progress');

export interface UseProgressSummary {
  record: RecordData | null;
  loading: boolean;
  refresh: () => void;
}

/**
 * Loads the full Record view (patterns, returns, rhythm, next command) in a single
 * service fan-out. Path Home's headline stats come from `usePathProgress`, not here.
 */
export function useProgressSummary(): UseProgressSummary {
  const repositories = useRepositories();
  const service = useMemo(() => new ProgressService(repositories, systemClock), [repositories]);

  const [record, setRecord] = useState<RecordData | null>(null);
  const [loading, setLoading] = useState(true);
  const [reloadToken, setReloadToken] = useState(0);
  const refresh = useCallback(() => setReloadToken((t) => t + 1), []);

  useEffect(() => {
    let active = true;
    service
      .getRecord()
      .then((r) => {
        if (active) setRecord(r);
      })
      .catch((error) => {
        log.error('Failed to load the record', error);
      })
      .finally(() => {
        if (active) setLoading(false);
      });
    return () => {
      active = false;
    };
  }, [service, reloadToken]);

  return { record, loading, refresh };
}
