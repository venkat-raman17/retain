import { useCallback, useMemo } from 'react';

import { useAsyncResource } from '@/shared/hooks';
import { systemClock } from '@/shared/lib';
import { useRepositories } from '@/shared/storage';

import type { LapseRecordDraft } from '../domain/lapse-record';
import { currentPathDay, isPathRunning } from '../domain/practice';
import { resolveVowText, type UserProfile } from '../domain/user-profile';
import { LapseRecoveryService } from '../services/lapse-recovery-service';
import { PathService } from '../services/path-service';

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

  const load = useCallback(() => pathService.getProfile(), [pathService]);
  const { data: profile, loading, refresh } = useAsyncResource(load, { scope: 'path' });

  const beginPath = useCallback(async () => {
    await pathService.startPath();
    refresh();
  }, [pathService, refresh]);

  const recordLapse = useCallback(
    async (draft?: LapseRecordDraft) => {
      await recovery.recordLapse(draft ?? {});
      refresh();
    },
    [recovery, refresh],
  );

  const recordReturn = useCallback(async () => {
    await recovery.recordReturn();
    refresh();
  }, [recovery, refresh]);

  const currentDay = profile ? currentPathDay(profile, systemClock) : 0;
  const isRunning = profile ? isPathRunning(profile) : false;
  const vow = profile ? resolveVowText(profile) : null;

  return { profile, currentDay, isRunning, vow, loading, beginPath, recordLapse, recordReturn, refresh };
}
