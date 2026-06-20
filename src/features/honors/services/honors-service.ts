import {
  getAllAchievements,
  getAllTrials,
  getStationForArcsCleared,
} from '@/content';
import type { Achievement, Station } from '@/content/schemas';
import type { EarnedAchievement, Repositories } from '@/db';
import type { Clock } from '@/shared/lib';

import { evaluateAchievements, type AchievementSignals } from '../domain/achievement-evaluation';
import {
  arcsCleared as calcArcsCleared,
  embersForCompletedDays,
} from '@/features/progress/domain/progression';

export interface HonorsSummary {
  earned: EarnedAchievement[];
  catalog: readonly Achievement[];
  station: Station | undefined;
  totalEmbers: number;
  arcsCleared: number;
  completedDays: number[];
}

type HonorsRepos = Pick<
  Repositories,
  'forge' | 'urge' | 'contentProgress' | 'path' | 'profile' | 'achievements'
>;

export class HonorsService {
  constructor(
    private readonly repos: HonorsRepos,
    private readonly clock: Clock,
  ) {}

  async getSummary(): Promise<HonorsSummary> {
    const [completedDays, earned, profile] = await Promise.all([
      this.getCompletedDays(),
      this.repos.achievements.getEarned(),
      this.repos.profile.get(),
    ]);

    const catalog = getAllAchievements();
    const trials = getAllTrials();
    const crownReceived = Boolean(profile.crownReceivedAt);
    const cleared = calcArcsCleared(completedDays);
    const totalEmbers = embersForCompletedDays(trials, completedDays, crownReceived);
    const station = getStationForArcsCleared(cleared);

    return { earned, catalog, station, totalEmbers, arcsCleared: cleared, completedDays };
  }

  /** Evaluate, persist newly-earned, return the newly-earned Achievement objects. */
  async checkAndAward(): Promise<Achievement[]> {
    const signals = await this.buildSignals();
    const catalog = getAllAchievements();
    const candidateIds = evaluateAchievements(catalog, signals, this.clock);
    const newIds = await this.repos.achievements.filterNotYetEarned(candidateIds);

    if (newIds.length === 0) return [];

    const now = this.clock.now().toISOString();
    await Promise.all(newIds.map((id) => this.repos.achievements.markEarned(id, now)));

    return catalog.filter((a) => newIds.includes(a.id));
  }

  private async getCompletedDays(): Promise<number[]> {
    const all = await this.repos.contentProgress.list();
    return all
      .filter((p) => p.contentType === 'daily_path' && p.status === 'completed')
      .map((p) => parseInt(p.contentId.replace('day-', ''), 10))
      .filter((n) => !isNaN(n));
  }

  private async buildSignals(): Promise<AchievementSignals> {
    const [
      completedDays,
      pauseCount,
      forgeActCount,
      forgeCategoryCounts,
      returnCount,
      profile,
    ] = await Promise.all([
      this.getCompletedDays(),
      this.repos.urge.count(),
      this.repos.forge.count(),
      this.repos.forge.categoryCounts(),
      this.repos.path.countByType('return_recorded'),
      this.repos.profile.get(),
    ]);

    const crownReceived = Boolean(profile.crownReceivedAt);
    const trials = getAllTrials();
    const totalEmbers = embersForCompletedDays(trials, completedDays, crownReceived);
    const forgeCategoriesUsed = new Set(
      forgeCategoryCounts.filter((c) => c.count > 0).map((c) => c.category),
    );

    return {
      completedDays,
      pauseCount,
      forgeActCount,
      forgeCategoriesUsed,
      returnCount,
      crownReceived,
      totalEmbers,
    };
  }
}
