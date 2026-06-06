import type { Repositories } from '@/db';
import { currentPathDay, daysSince } from '@/features/path/domain/practice';
import type { Clock } from '@/shared/lib';
import { differenceInDays } from '@/shared/utils';

export interface ProgressSummary {
  currentPathDays: number;
  longestPathDays: number;
  totalPracticeDays: number;
  urgesObserved: number;
  forgeActs: number;
  lapsesStudied: number;
  returnsRecorded: number;
  mostCommonTrigger: string | null;
  strongestForgeCategory: string | null;
}

export interface DayMarker {
  date: string;
  hasForgeAct: boolean;
  hasUrge: boolean;
  hasJournal: boolean;
  hasLapse: boolean;
}

export interface WeeklySummary {
  forgeActsThisWeek: number;
  urgesThisWeek: number;
  journalEntriesThisWeek: number;
}

/**
 * Aggregates practice stats. Measures *practice, not perfection*: history
 * is preserved across lapses, and a lapse is studied, never worshiped.
 */
export class ProgressService {
  constructor(
    private readonly repos: Repositories,
    private readonly clock: Clock,
  ) {}

  async getSummary(): Promise<ProgressSummary> {
    const profile = await this.repos.profile.get();
    const [
      urgesObserved,
      forgeActs,
      lapsesStudied,
      returnsRecorded,
      mostCommonTrigger,
      categoryCounts,
      longestPathDays,
    ] = await Promise.all([
      this.repos.urge.count(),
      this.repos.forge.count(),
      this.repos.lapse.count(),
      this.repos.path.countByType('return_recorded'),
      this.repos.urge.mostCommonTrigger(),
      this.repos.forge.categoryCounts(),
      this.getLongestPathDays(),
    ]);

    // 1-indexed from the first-ever start: a man on day 1 has 1 practice day, not 0.
    const totalPracticeDays = profile.pathStartedAt
      ? daysSince(profile.pathStartedAt, this.clock) + 1
      : 0;

    return {
      currentPathDays: currentPathDay(profile, this.clock),
      longestPathDays,
      totalPracticeDays,
      urgesObserved,
      forgeActs,
      lapsesStudied,
      returnsRecorded,
      mostCommonTrigger,
      strongestForgeCategory: categoryCounts[0]?.category ?? null,
    };
  }

  /** Longest completed run (reconstructed from path events) vs. the current run. */
  async getLongestPathDays(): Promise<number> {
    const events = await this.repos.path.listEvents(1000);
    const ascending = [...events].reverse();
    let longest = 0;
    let runStart: Date | null = null;

    for (const event of ascending) {
      if (event.type === 'path_started' || event.type === 'return_recorded') {
        runStart = new Date(event.occurredAt);
      } else if (event.type === 'lapse_recorded' && runStart) {
        const length = differenceInDays(new Date(event.occurredAt), runStart) + 1;
        if (length > longest) longest = length;
        runStart = null;
      }
    }

    const profile = await this.repos.profile.get();
    return Math.max(longest, currentPathDay(profile, this.clock));
  }

  /** Activity markers for the past N days (default 28 = 4 weeks). */
  async getCalendarMarkers(days = 28): Promise<DayMarker[]> {
    const now = this.clock.now();
    const cutoff = new Date(now.getTime() - days * 24 * 60 * 60 * 1000).toISOString();

    const [forgeActs, urgeLogs, journalEntries, pathEvents] = await Promise.all([
      this.repos.forge.list(500),
      this.repos.urge.list(500),
      this.repos.journal.list(500),
      this.repos.path.listEvents(500),
    ]);

    const markers = new Map<string, DayMarker>();

    const ensure = (dateStr: string): DayMarker => {
      let m = markers.get(dateStr);
      if (!m) {
        m = { date: dateStr, hasForgeAct: false, hasUrge: false, hasJournal: false, hasLapse: false };
        markers.set(dateStr, m);
      }
      return m;
    };

    for (const act of forgeActs) {
      if (act.occurredAt >= cutoff) {
        ensure(act.occurredAt.slice(0, 10)).hasForgeAct = true;
      }
    }
    for (const log of urgeLogs) {
      if (log.occurredAt >= cutoff) {
        ensure(log.occurredAt.slice(0, 10)).hasUrge = true;
      }
    }
    for (const entry of journalEntries) {
      if (entry.createdAt >= cutoff) {
        ensure(entry.createdAt.slice(0, 10)).hasJournal = true;
      }
    }
    for (const event of pathEvents) {
      if (event.type === 'lapse_recorded' && event.occurredAt >= cutoff) {
        ensure(event.occurredAt.slice(0, 10)).hasLapse = true;
      }
    }

    return [...markers.values()].sort((a, b) => a.date.localeCompare(b.date));
  }

  /** Counts for the current week (starting Sunday). */
  async getWeeklySummary(): Promise<WeeklySummary> {
    const now = this.clock.now();
    const weekStart = new Date(now);
    weekStart.setDate(weekStart.getDate() - weekStart.getDay());
    weekStart.setHours(0, 0, 0, 0);
    const iso = weekStart.toISOString();

    const [forgeActsThisWeek, urgeLogs, journalEntries] = await Promise.all([
      this.repos.forge.countSince(iso),
      this.repos.urge.list(200),
      this.repos.journal.list(200),
    ]);

    const urgesThisWeek = urgeLogs.filter((l) => l.occurredAt >= iso).length;
    const journalEntriesThisWeek = journalEntries.filter((e) => e.createdAt >= iso).length;

    return { forgeActsThisWeek, urgesThisWeek, journalEntriesThisWeek };
  }
}
