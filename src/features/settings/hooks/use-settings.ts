import { useCallback } from 'react';

import { useAsyncResource } from '@/shared/hooks';
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
  const load = useCallback(() => settings.getPreferences(), [settings]);
  const { data: preferences, loading, refresh } = useAsyncResource(load, { scope: 'settings' });

  const update = useCallback(
    async (patch: AppPreferencesPatch) => {
      const next = await settings.updatePreferences(patch);
      refresh();
      return next;
    },
    [settings, refresh],
  );

  return { preferences, loading, update, refresh };
}
