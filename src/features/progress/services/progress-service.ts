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

/**
 * Aggregates practice stats across repositories. Measures *practice, not
 * perfection*: history is preserved across lapses, and a lapse is studied, never
 * worshiped (see docs/CONTENT_SAFETY.md).
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

    return {
      currentPathDays: currentPathDay(profile, this.clock),
      longestPathDays,
      totalPracticeDays: daysSince(profile.pathStartedAt, this.clock),
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
}
