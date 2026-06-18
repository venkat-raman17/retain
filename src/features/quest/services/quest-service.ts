import { getTrialForDay } from '@/content';
import type {
  BoundaryRepository,
  ContentProgressRepository,
  ForgeRepository,
  JournalRepository,
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
    private readonly journal: JournalRepository,
    private readonly boundary: BoundaryRepository,
    private readonly contentProgress: ContentProgressRepository,
    private readonly clock: Clock,
  ) {}

  async getDayQuest(dayNumber: number): Promise<DayQuestResult | null> {
    const trial = getTrialForDay(dayNumber);
    if (!trial) return null;

    const todayStart = toIsoDateTime(startOfUtcDay(this.clock.now()));

    const [forgeActsToday, allUrges, allJournal, boundaryCheckinsToday, progress] =
      await Promise.all([
        this.forge.countSince(todayStart),
        this.urge.list(200),
        this.journal.list(200),
        this.boundary.countCheckinsSince(todayStart),
        this.contentProgress.get('daily_path', `day-${dayNumber}`),
      ]);

    const pausesToday = allUrges.filter((u) => u.occurredAt >= todayStart).length;
    const journalEntriesToday = allJournal.filter(
      (e) => e.createdAt >= todayStart && e.type === 'morning',
    ).length;
    const eveningEntriesToday = allJournal.filter(
      (e) => e.createdAt >= todayStart && e.type === 'evening',
    ).length;

    const signals: DayQuestSignals = {
      secretRevealed: progress?.status === 'completed',
      forgeActsToday,
      pausesToday,
      journalEntriesToday,
      eveningEntriesToday,
      boundaryCheckinsToday,
    };

    return evaluateDayQuest(trial, signals, this.clock);
  }
}
