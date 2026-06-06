import { useCallback, useEffect, useState } from 'react';

import { useRepositories } from '@/shared/storage';

import type { AppSettings, AppSettingsPatch } from '../domain/settings';

export interface UseSettings {
  settings: AppSettings | null;
  loading: boolean;
  update: (patch: AppSettingsPatch) => Promise<AppSettings>;
  refresh: () => Promise<void>;
}

export function useSettings(): UseSettings {
  const { settings: repository } = useRepositories();
  const [settings, setSettings] = useState<AppSettings | null>(null);
  const [loading, setLoading] = useState(true);

  const refresh = useCallback(async () => {
    setSettings(await repository.get());
    setLoading(false);
  }, [repository]);

  useEffect(() => {
    void refresh();
  }, [refresh]);

  const update = useCallback(
    async (patch: AppSettingsPatch) => {
      const next = await repository.update(patch);
      setSettings(next);
      return next;
    },
    [repository],
  );

  return { settings, loading, update, refresh };
}
