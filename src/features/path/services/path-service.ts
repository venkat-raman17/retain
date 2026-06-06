import type { PathRepository, UserProfileRepository } from '@/db';
import type { Clock } from '@/shared/lib';

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

  /** Start (or restart) the path now. Records the first-ever start if unset. */
  async startPath(): Promise<UserProfile> {
    const profile = await this.profiles.get();
    const now = this.clock.now().toISOString();
    const next = await this.profiles.update({
      currentPathStartedAt: now,
      pathStartedAt: profile.pathStartedAt ?? now,
    });
    await this.path.addEvent(createPathEvent('path_started', this.clock));
    return next;
  }
}
