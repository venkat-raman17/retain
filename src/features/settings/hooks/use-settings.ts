import { useCallback, useEffect, useState } from 'react';

import { useRepositories } from '@/shared/storage';

import type { AppPreferences, AppPreferencesPatch } from '../domain/settings';

export interface UseSettings {
  preferences: AppPreferences | null;
  loading: boolean;
  update: (patch: AppPreferencesPatch) => Promise<AppPreferences>;
  refresh: () => void;
}

export function useSettings(): UseSettings {
  const { settings } = useRepositories();
  const [preferences, setPreferences] = useState<AppPreferences | null>(null);
  const [loading, setLoading] = useState(true);
  const [reloadToken, setReloadToken] = useState(0);

  const refresh = useCallback(() => setReloadToken((token) => token + 1), []);

  useEffect(() => {
    let active = true;
    settings
      .getPreferences()
      .then((value) => {
        if (!active) return;
        setPreferences(value);
        setLoading(false);
      })
      .catch(() => {
        if (active) setLoading(false);
      });
    return () => {
      active = false;
    };
  }, [settings, reloadToken]);

  const update = useCallback(
    async (patch: AppPreferencesPatch) => {
      const next = await settings.updatePreferences(patch);
      setPreferences(next);
      return next;
    },
    [settings],
  );

  return { preferences, loading, update, refresh };
}
