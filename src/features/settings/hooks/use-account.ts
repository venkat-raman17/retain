import { useCallback, useEffect, useMemo, useState } from 'react';

import { resetAllLocalData } from '@/db';
import { resolveVowText, type UserProfile } from '@/features/path/domain/user-profile';
import { PathService } from '@/features/path/services/path-service';
import { cancelAllNotifications } from '@/features/reminders/services/notification-scheduler';
import { createLogger, systemClock } from '@/shared/lib';
import { useRepositories } from '@/shared/storage';

const log = createLogger('settings');

export interface UseAccount {
  profile: UserProfile | null;
  vow: string | null;
  /** Save the vow: pass a preset id (selectedVow) OR custom text — the other is cleared. */
  setVow: (selectedVow: string | null, customVow: string | null) => Promise<void>;
  /** Begin a new Day 1 now. Lifetime practice history is preserved. */
  restartPath: () => Promise<void>;
  /** Erase all on-device data and cancel reminders. The app returns to onboarding. */
  resetAll: () => Promise<void>;
}

/**
 * Settings-screen actions over the practice identity and on-device data. Keeps
 * the screen free of services/db access (see docs/ARCHITECTURE.md).
 */
export function useAccount(): UseAccount {
  const repos = useRepositories();
  const pathService = useMemo(
    () => new PathService(repos.profile, repos.path, systemClock),
    [repos],
  );

  const [profile, setProfile] = useState<UserProfile | null>(null);
  const [reloadToken, setReloadToken] = useState(0);

  useEffect(() => {
    let active = true;
    repos.profile
      .get()
      .then((value) => {
        if (active) setProfile(value);
      })
      .catch((error) => log.error('Failed to load the profile', error));
    return () => {
      active = false;
    };
  }, [repos, reloadToken]);

  const setVow = useCallback(
    async (selectedVow: string | null, customVow: string | null) => {
      setProfile(await repos.profile.update({ selectedVow, customVow }));
    },
    [repos],
  );

  const restartPath = useCallback(async () => {
    setProfile(await pathService.startPath());
    setReloadToken((t) => t + 1);
  }, [pathService]);

  const resetAll = useCallback(async () => {
    await resetAllLocalData();
    await cancelAllNotifications();
  }, []);

  const vow = profile ? resolveVowText(profile) : null;

  return { profile, vow, setVow, restartPath, resetAll };
}
