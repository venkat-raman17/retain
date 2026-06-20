import { useMemo } from 'react';

import { systemClock } from '@/shared/lib';
import { useRepositories } from '@/shared/storage';

import type { ContentStatus } from '@/features/codex/domain/content-progress';

import type { UserProfile } from '../domain/user-profile';
import { DailyPathService, type DayStatus } from '../services/daily-path-service';

/**
 * Hook boundary over {@link DailyPathService}. Screens consume these bound
 * callbacks instead of constructing the service — keeping the
 * screen → hook → service chain intact (see docs/ARCHITECTURE.md).
 */
export interface UseDailyPath {
  isCrownUnlocked: (profile: UserProfile, currentDay: number) => boolean;
  markDayOpened: (day: number) => Promise<void>;
  markDaySecretRevealed: (day: number) => Promise<void>;
  getDayProgressStatus: (day: number) => Promise<ContentStatus>;
  markDayCompleted: (day: number) => Promise<void>;
  getDayStatusList: () => Promise<DayStatus[]>;
  getCollectedCrownFragments: () => Promise<string[]>;
  receiveCrown: () => Promise<UserProfile>;
}

export function useDailyPath(): UseDailyPath {
  const repos = useRepositories();
  const service = useMemo(
    () => new DailyPathService(repos.profile, repos.path, repos.contentProgress, systemClock),
    [repos],
  );

  return useMemo(
    () => ({
      isCrownUnlocked: (profile: UserProfile, currentDay: number) =>
        service.isCrownUnlocked(profile, currentDay),
      markDayOpened: (day: number) => service.markDayOpened(day),
      markDaySecretRevealed: (day: number) => service.markDaySecretRevealed(day),
      getDayProgressStatus: (day: number) => service.getDayProgressStatus(day),
      markDayCompleted: (day: number) => service.markDayCompleted(day),
      getDayStatusList: () => service.getDayStatusList(),
      getCollectedCrownFragments: () => service.getCollectedCrownFragments(),
      receiveCrown: () => service.receiveCrown(),
    }),
    [service],
  );
}
