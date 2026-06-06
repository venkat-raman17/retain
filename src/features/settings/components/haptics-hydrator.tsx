import { useEffect } from 'react';

import { setHapticsEnabled } from '@/shared/lib';

import { useSettings } from '../hooks/use-settings';

/**
 * Mirrors the persisted Haptics preference into the `haptics` module at startup
 * and whenever it changes, so fire-and-forget taps anywhere in the app respect
 * the user's choice without each caller touching the database. Renders nothing.
 */
export function HapticsHydrator() {
  const { preferences } = useSettings();
  const hapticsEnabled = preferences?.hapticsEnabled;

  useEffect(() => {
    if (hapticsEnabled !== undefined) {
      setHapticsEnabled(hapticsEnabled);
    }
  }, [hapticsEnabled]);

  return null;
}
