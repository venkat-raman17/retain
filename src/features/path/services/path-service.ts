import type { PathRepository, UserProfileRepository } from '@/db';
import type { Clock } from '@/shared/lib';
import { addDays } from '@/shared/utils';

import { createPathEvent } from '../domain/path-event';
import { currentPathDay, isPathRunning } from '../domain/practice';
import type { UserProfile } from '../domain/user-profile';

/** Reads the practice identity and starts/continues the Path. */
export class PathService {
  constructor(
    private readonly profiles: UserProfileRepository,
    private readonly path: PathRepository,
    private readonly clock: Clock,
  ) {}

  getProfile(): Promise<UserProfile> {
    return this.profiles.get();
  }

  currentDay(profile: UserProfile): number {
    return currentPathDay(profile, this.clock);
  }

  isRunning(profile: UserProfile): boolean {
    return isPathRunning(profile);
  }

  /** Start (or restart) the path. Pass offsetDays > 0 to backdate (e.g. Day 14 → offsetDays=13). */
  async startPath(offsetDays = 0): Promise<UserProfile> {
    const profile = await this.profiles.get();
    const base = this.clock.now();
    const startedAt = offsetDays > 0 ? addDays(base, -offsetDays) : base;
    const isoStart = startedAt.toISOString();
    const next = await this.profiles.update({
      currentPathStartedAt: isoStart,
      pathStartedAt: profile.pathStartedAt ?? isoStart,
      startDayOffset: offsetDays,
    });
    await this.path.addEvent(createPathEvent('path_started', this.clock));
    return next;
  }
}
