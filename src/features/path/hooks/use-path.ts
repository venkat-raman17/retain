import { useCallback, useEffect, useMemo, useState } from 'react';

import { createLogger, systemClock } from '@/shared/lib';
import { useRepositories } from '@/shared/storage';

import type { LapseRecordDraft } from '../domain/lapse-record';
import { currentPathDay, isPathRunning } from '../domain/practice';
import { resolveVowText, type UserProfile } from '../domain/user-profile';
import { LapseRecoveryService } from '../services/lapse-recovery-service';
import { PathService } from '../services/path-service';

const log = createLogger('path');

export interface UsePath {
  profile: UserProfile | null;
  currentDay: number;
  isRunning: boolean;
  vow: string | null;
  loading: boolean;
  beginPath: () => Promise<void>;
  recordLapse: (draft?: LapseRecordDraft) => Promise<void>;
  recordReturn: () => Promise<void>;
  refresh: () => void;
}

export function usePath(): UsePath {
  const { profile: profileRepo, path: pathRepo, lapse: lapseRepo } = useRepositories();
  const pathService = useMemo(
    () => new PathService(profileRepo, pathRepo, systemClock),
    [profileRepo, pathRepo],
  );
  const recovery = useMemo(
    () => new LapseRecoveryService(profileRepo, pathRepo, lapseRepo, systemClock),
    [profileRepo, pathRepo, lapseRepo],
  );

  const [profile, setProfile] = useState<UserProfile | null>(null);
  const [loading, setLoading] = useState(true);
  const [reloadToken, setReloadToken] = useState(0);
  const refresh = useCallback(() => setReloadToken((token) => token + 1), []);

  useEffect(() => {
    let active = true;
    pathService
      .getProfile()
      .then((value) => {
        if (!active) return;
        setProfile(value);
        setLoading(false);
      })
      .catch((error) => {
        log.error('Failed to load the profile', error);
        if (active) setLoading(false);
      });
    return () => {
      active = false;
    };
  }, [pathService, reloadToken]);

  const beginPath = useCallback(async () => {
    setProfile(await pathService.startPath());
  }, [pathService]);

  const recordLapse = useCallback(
    async (draft?: LapseRecordDraft) => {
      await recovery.recordLapse(draft ?? {});
      setProfile(await pathService.getProfile());
    },
    [recovery, pathService],
  );

  const recordReturn = useCallback(async () => {
    setProfile(await recovery.recordReturn());
  }, [recovery]);

  const currentDay = profile ? currentPathDay(profile, systemClock) : 0;
  const isRunning = profile ? isPathRunning(profile) : false;
  const vow = profile ? resolveVowText(profile) : null;

  return { profile, currentDay, isRunning, vow, loading, beginPath, recordLapse, recordReturn, refresh };
}
