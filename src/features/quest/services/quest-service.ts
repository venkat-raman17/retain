import { getTrialForDay } from '@/content';
import type {
  BoundaryRepository,
  ContentProgressRepository,
  ForgeRepository,
  UrgeRepository,
} from '@/db';
import type { Clock } from '@/shared/lib';
import { startOfUtcDay, toIsoDateTime } from '@/shared/utils';

import {
  evaluateDayQuest,
  type DayQuestResult,
  type DayQuestSignals,
} from '../domain/quest-evaluation';

/**
 * Builds today's quest state by querying existing repositories. All signals are
 * derived — no new data is written here. The evaluator is pure; this service is
 * the IO boundary.
 */
export class QuestService {
  constructor(
    private readonly forge: ForgeRepository,
    private readonly urge: UrgeRepository,
    private readonly boundary: BoundaryRepository,
    private readonly contentProgress: ContentProgressRepository,
    private readonly clock: Clock,
  ) {}

  async getDayQuest(dayNumber: number): Promise<DayQuestResult | null> {
    const trial = getTrialForDay(dayNumber);
    if (!trial) return null;

    const todayStart = toIsoDateTime(startOfUtcDay(this.clock.now()));

    const [forgeActsToday, allUrges, boundaryCheckinsToday, progress] =
      await Promise.all([
        this.forge.countSince(todayStart),
        this.urge.list(200),
        this.boundary.countCheckinsSince(todayStart),
        this.contentProgress.get('daily_path', `day-${dayNumber}`),
      ]);

    const pausesToday = allUrges.filter((u) => u.occurredAt >= todayStart).length;

    const signals: DayQuestSignals = {
      secretRevealed: progress?.status === 'completed',
      forgeActsToday,
      pausesToday,
      boundaryCheckinsToday,
    };

    return evaluateDayQuest(trial, signals, this.clock);
  }

  /**
   * Today's quest plus the most recent prior days, newest first. Days without a
   * trial (e.g. before day 1) are skipped. Used by the Trials hall to show the
   * run of days as a gallery the user can revisit.
   */
  async getRecentQuests(currentDay: number, count: number): Promise<DayQuestResult[]> {
    const firstDay = Math.max(1, currentDay - count + 1);
    const days: number[] = [];
    for (let d = currentDay; d >= firstDay; d--) days.push(d);

    const results = await Promise.all(days.map((d) => this.getDayQuest(d)));
    return results.filter((r): r is DayQuestResult => r !== null);
  }
}
