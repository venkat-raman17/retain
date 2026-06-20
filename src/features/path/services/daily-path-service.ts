import { getDailyPathContent } from '@/content';
import type { ContentProgressRepository, PathRepository, UserProfileRepository } from '@/db';
import type { ContentStatus } from '@/features/codex/domain/content-progress';
import type { Clock } from '@/shared/lib';

import { currentPathDay } from '../domain/practice';
import type { PathPhase, UserProfile } from '../domain/user-profile';
import { createPathEvent } from '../domain/path-event';

export type UnlockState = 'locked' | 'available_today' | 'completed' | 'revisit';

export interface DayStatus {
  dayNumber: number;
  unlockState: UnlockState;
  title: string;
  arcNumber: number;
  arcTitle: string;
}

/**
 * Governs the 90-day rite: which days are locked/available/completed,
 * Crown unlock, and Long Path transition.
 *
 * Rules:
 * - Days 1..currentDay-1 → 'revisit' (completed path days, can re-read)
 * - Day currentDay → 'available_today'
 * - Days currentDay+1..90 → 'locked'
 * - After Crown received → all 90 days are 'revisit'; Long Path active
 * - Crown unlocked when currentDay >= 90 and crownReceivedAt is null
 */
export class DailyPathService {
  constructor(
    private readonly profiles: UserProfileRepository,
    private readonly path: PathRepository,
    private readonly contentProgress: ContentProgressRepository,
    private readonly clock: Clock,
  ) {}

  async getProfile(): Promise<UserProfile> {
    return this.profiles.get();
  }

  getPathPhase(profile: UserProfile): PathPhase {
    return profile.currentPathPhase ?? 'initiation_90';
  }

  getCurrentDay(profile: UserProfile): number {
    return currentPathDay(profile, this.clock);
  }

  isCrownUnlocked(profile: UserProfile, currentDay: number): boolean {
    return (
      this.getPathPhase(profile) === 'initiation_90' &&
      currentDay >= 90 &&
      profile.crownReceivedAt === null
    );
  }

  getUnlockState(dayNumber: number, currentDay: number, profile: UserProfile): UnlockState {
    if (this.getPathPhase(profile) === 'crowned_long_path') return 'revisit';
    if (dayNumber > currentDay) return 'locked';
    if (dayNumber === currentDay) return 'available_today';
    return 'revisit';
  }

  async getTodayContent(): Promise<ReturnType<typeof getDailyPathContent>> {
    const profile = await this.profiles.get();
    const day = this.getCurrentDay(profile);
    return getDailyPathContent(day);
  }

  async markDayOpened(dayNumber: number): Promise<void> {
    const now = this.clock.now().toISOString();
    await this.contentProgress.markStatus('daily_path', `day-${dayNumber}`, 'opened', now);
  }

  /** Persist that the day's hidden instruction was revealed, so it survives navigation. */
  async markDaySecretRevealed(dayNumber: number): Promise<void> {
    const now = this.clock.now().toISOString();
    await this.contentProgress.markStatus('daily_path', `day-${dayNumber}`, 'revealed', now);
  }

  /** The persisted progress status for a day ('unread' when never touched). */
  async getDayProgressStatus(dayNumber: number): Promise<ContentStatus> {
    const progress = await this.contentProgress.get('daily_path', `day-${dayNumber}`);
    return progress?.status ?? 'unread';
  }

  async markDayCompleted(dayNumber: number): Promise<void> {
    const now = this.clock.now().toISOString();
    await this.contentProgress.markStatus('daily_path', `day-${dayNumber}`, 'completed', now);
  }

  async getCompletedDays(): Promise<number[]> {
    const all = await this.contentProgress.list();
    return all
      .filter((p) => p.contentType === 'daily_path' && p.status === 'completed')
      .map((p) => parseInt(p.contentId.replace('day-', ''), 10))
      .filter((n) => !isNaN(n))
      .sort((a, b) => a - b);
  }

  async getCollectedCrownFragments(): Promise<string[]> {
    const completedDays = await this.getCompletedDays();
    return completedDays
      .map((day) => getDailyPathContent(day)?.crownFragment ?? null)
      .filter((f): f is string => f !== null);
  }

  async receiveCrown(): Promise<UserProfile> {
    const now = this.clock.now().toISOString();
    const profile = await this.profiles.update({
      crownReceivedAt: now,
      currentPathPhase: 'crowned_long_path',
      longPathStartedAt: now,
    });
    await this.path.addEvent(createPathEvent('crown_received', this.clock));
    await this.path.addEvent(createPathEvent('long_path_started', this.clock));
    return profile;
  }

  /**
   * Post-crown lapse: does NOT reset the path phase or remove the crown.
   * Records the lapse as a Long Path repair event only.
   */
  async recordPostCrownLapse(): Promise<void> {
    await this.path.addEvent(createPathEvent('lapse_recorded', this.clock));
  }

  async getDayStatusList(): Promise<DayStatus[]> {
    const profile = await this.profiles.get();
    const currentDay = this.getCurrentDay(profile);
    const statuses: DayStatus[] = [];

    for (let d = 1; d <= 90; d++) {
      const content = getDailyPathContent(d);
      if (!content) continue;
      statuses.push({
        dayNumber: d,
        unlockState: this.getUnlockState(d, currentDay, profile),
        title: content.title,
        arcNumber: content.arcNumber,
        arcTitle: content.arcTitle,
      });
    }
    return statuses;
  }
}
