import { getAllDailyPath } from '@/content';
import {
  FORGE_CATEGORIES,
  FORGE_CATEGORY_LABELS,
  type ForgeAct,
  type ForgeCategory,
} from '@/features/forge/domain/forge-act';
import type { PathEvent } from '@/features/path/domain/path-event';
import { currentPathDay, daysSince } from '@/features/path/domain/practice';
import type { UserProfile } from '@/features/path/domain/user-profile';
import {
  TRIGGER_LABELS,
  TRIGGER_TYPES,
  type TriggerType,
  type UrgeLog,
} from '@/features/pause/domain/urge-log';
import type { Repositories } from '@/db';
import { createLogger, type Clock } from '@/shared/lib';
import { addDays, differenceInDays, startOfWeek, toIsoDateTime } from '@/shared/utils';

import { buildUrgeTrend, type TrendSeries } from '../domain/trends';

const log = createLogger('progress');

// ─── Public types ────────────────────────────────────────────────────────────

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

export interface WeeklySummary {
  forgeActsThisWeek: number;
  urgesThisWeek: number;
}

export interface TriggerCount {
  triggerType: TriggerType;
  label: string;
  count: number;
}

export interface ForgeCategoryCount {
  category: ForgeCategory;
  label: string;
  count: number;
}

export interface WeeklyPattern {
  mostCommonTrigger: TriggerType | null;
  mostCommonTriggerLabel: string | null;
  strongestUrgeHour: number | null;
  strongestUrgeHourLabel: string | null;
  mostCommonResponse: string | null;
  strongestForgeCategory: ForgeCategory | null;
  strongestForgeCategoryLabel: string | null;
}

export interface ReturnRecord {
  lapsesStudied: number;
  returnsRecorded: number;
  averageReturnTime: string;
  currentPosture: string;
}

export interface PracticeRhythm {
  activeDaysThisWeek: number;
  urgesThisWeek: number;
  forgeActsThisWeek: number;
}

export interface NextCommand {
  title: string;
  body: string;
}

/** The lead synthesis — the single takeaway the record reveals. Null until there is data. */
export interface Reveal {
  title: string;
  body: string;
}

/**
 * The arc of the current 90-day rite: when Day 1 began and when Day 90 (the Crown)
 * is reached. Driven by `currentPathStartedAt`, so a lapse honestly restarts the arc
 * while all practice history is preserved elsewhere.
 */
export interface PathArc {
  started: boolean;
  complete: boolean;
  /** ISO timestamp of Day 1 of the current run (null when no path is running). */
  startDateISO: string | null;
  /** ISO timestamp of Day `totalDays` — the Crown horizon (null when not started). */
  endDateISO: string | null;
  currentDay: number;
  totalDays: number;
  daysRemaining: number;
  /** 0..1, current day over total — for the timeline fill. */
  progress: number;
}

export interface RecordData {
  hasEnoughData: boolean;
  arc: PathArc;
  reveal: Reveal | null;
  triggerCounts: TriggerCount[];
  forgeCategoryCounts: ForgeCategoryCount[];
  forgeBalance: string | null;
  weeklyPattern: WeeklyPattern;
  returnRecord: ReturnRecord;
  practiceRhythm: PracticeRhythm;
  nextCommand: NextCommand;
  /** Urge frequency + intensity over recent weeks — is the fire easing? */
  urgeTrend: TrendSeries;
}

// ─── Pure helpers (no DB access) ─────────────────────────────────────────────

function formatUrgeHour(hour: number): string {
  if (hour >= 22 || hour < 4) return 'After 10 PM';
  if (hour >= 18) return 'Evening';
  if (hour >= 14) return 'Afternoon';
  if (hour >= 11) return 'Late morning';
  return 'Morning';
}

function topKey<T extends string>(freq: Partial<Record<T, number>>): T | null {
  const entries = Object.entries(freq) as [T, number][];
  return entries.sort((a, b) => b[1] - a[1])[0]?.[0] ?? null;
}

function buildTriggerCounts(logs: UrgeLog[]): TriggerCount[] {
  const freq: Partial<Record<TriggerType, number>> = {};
  for (const log of logs) {
    freq[log.triggerType] = (freq[log.triggerType] ?? 0) + 1;
  }
  return TRIGGER_TYPES.map((t) => ({ triggerType: t, label: TRIGGER_LABELS[t], count: freq[t] ?? 0 })).sort(
    (a, b) => b.count - a.count,
  );
}

function buildForgeCategoryCounts(acts: ForgeAct[]): ForgeCategoryCount[] {
  const freq: Partial<Record<ForgeCategory, number>> = {};
  for (const act of acts) {
    freq[act.category] = (freq[act.category] ?? 0) + 1;
  }
  return FORGE_CATEGORIES.map((c) => ({
    category: c,
    label: FORGE_CATEGORY_LABELS[c],
    count: freq[c] ?? 0,
  })).sort((a, b) => b.count - a.count);
}

function buildWeeklyPattern(urgeLogs: UrgeLog[], forgeActs: ForgeAct[]): WeeklyPattern {
  const triggerFreq: Partial<Record<TriggerType, number>> = {};
  const hourFreq: Partial<Record<number, number>> = {};
  const responseFreq: Record<string, number> = {};

  for (const log of urgeLogs) {
    triggerFreq[log.triggerType] = (triggerFreq[log.triggerType] ?? 0) + 1;
    const hour = new Date(log.occurredAt).getHours();
    hourFreq[hour] = (hourFreq[hour] ?? 0) + 1;
    if (log.selectedResponse) {
      responseFreq[log.selectedResponse] = (responseFreq[log.selectedResponse] ?? 0) + 1;
    }
  }

  const catFreq: Partial<Record<ForgeCategory, number>> = {};
  for (const act of forgeActs) {
    catFreq[act.category] = (catFreq[act.category] ?? 0) + 1;
  }

  const mostCommonTrigger = topKey(triggerFreq);
  const hourEntries = Object.entries(hourFreq) as [string, number][];
  const strongestHourEntry = hourEntries.sort((a, b) => b[1] - a[1])[0];
  const strongestUrgeHour = strongestHourEntry ? parseInt(strongestHourEntry[0]) : null;
  const responseEntries = Object.entries(responseFreq).sort((a, b) => b[1] - a[1]);
  const mostCommonResponse = responseEntries[0]?.[0] ?? null;
  const strongestForgeCategory = topKey(catFreq);

  return {
    mostCommonTrigger,
    mostCommonTriggerLabel: mostCommonTrigger ? TRIGGER_LABELS[mostCommonTrigger] : null,
    strongestUrgeHour,
    strongestUrgeHourLabel: strongestUrgeHour !== null ? formatUrgeHour(strongestUrgeHour) : null,
    mostCommonResponse,
    strongestForgeCategory,
    strongestForgeCategoryLabel: strongestForgeCategory ? FORGE_CATEGORY_LABELS[strongestForgeCategory] : null,
  };
}

function buildReturnRecord(pathEvents: PathEvent[]): ReturnRecord {
  const sorted = [...pathEvents].sort((a, b) => a.occurredAt.localeCompare(b.occurredAt));
  const lapsesStudied = sorted.filter((e) => e.type === 'lapse_recorded').length;
  const returnsRecorded = sorted.filter((e) => e.type === 'return_recorded').length;

  let totalDays = 0;
  let pairs = 0;
  let lastLapse: PathEvent | null = null;
  for (const event of sorted) {
    if (event.type === 'lapse_recorded') {
      lastLapse = event;
    } else if (event.type === 'return_recorded' && lastLapse) {
      const diff = differenceInDays(new Date(event.occurredAt), new Date(lastLapse.occurredAt));
      totalDays += diff;
      pairs++;
      lastLapse = null;
    }
  }

  let averageReturnTime = '—';
  if (pairs > 0) {
    const avg = Math.round(totalDays / pairs);
    averageReturnTime = avg === 0 ? 'Same day' : avg === 1 ? 'Next day' : `${avg} days`;
  }

  const latest = sorted[sorted.length - 1];
  const currentPosture = latest?.type === 'lapse_recorded' ? 'Returning' : 'On the path';

  return { lapsesStudied, returnsRecorded, averageReturnTime, currentPosture };
}

function countActiveDays(
  weekStart: Date,
  now: Date,
  urgeLogs: UrgeLog[],
  forgeActs: ForgeAct[],
): number {
  const active = new Set<string>();
  for (const log of urgeLogs) active.add(log.occurredAt.slice(0, 10));
  for (const act of forgeActs) active.add(act.occurredAt.slice(0, 10));

  const from = weekStart.toISOString().slice(0, 10);
  const to = now.toISOString().slice(0, 10);
  return [...active].filter((d) => d >= from && d <= to).length;
}

/**
 * The arc of the current 90-day rite. `totalDays` is the bundled daily-path length
 * (the rite is exactly as long as its content), and `clock` drives the current day so
 * the calculation stays pure and testable.
 */
export function buildPathArc(
  profile: Pick<UserProfile, 'currentPathStartedAt' | 'currentPathPhase'>,
  totalDays: number,
  clock: Clock,
): PathArc {
  const startISO = profile.currentPathStartedAt;
  const currentDay = currentPathDay(profile, clock);

  if (!startISO) {
    return {
      started: false,
      complete: false,
      startDateISO: null,
      endDateISO: null,
      currentDay: 0,
      totalDays,
      daysRemaining: totalDays,
      progress: 0,
    };
  }

  // Day 1 is the start date; Day `totalDays` is start + (totalDays - 1) days.
  const endDateISO = toIsoDateTime(addDays(new Date(startISO), totalDays - 1));
  const complete = currentDay >= totalDays || profile.currentPathPhase === 'crowned_long_path';
  const boundedDay = Math.min(Math.max(currentDay, 0), totalDays);

  return {
    started: true,
    complete,
    startDateISO: startISO,
    endDateISO,
    currentDay,
    totalDays,
    daysRemaining: Math.max(0, totalDays - currentDay),
    progress: totalDays > 0 ? boundedDay / totalDays : 0,
  };
}

/**
 * The lead synthesis: one headline takeaway the record reveals, built from the week's
 * pattern and the return history. Null when there is nothing observed yet — the screen
 * shows a teaching promise in that case rather than an empty sentence.
 */
export function buildReveal(pattern: WeeklyPattern, returnRecord: ReturnRecord): Reveal | null {
  const hasData = pattern.mostCommonTrigger !== null || pattern.strongestForgeCategory !== null;
  if (!hasData) return null;

  let title: string;
  if (pattern.mostCommonTrigger === 'unknown') {
    title = 'The fire often rises before you can name it.';
  } else if (pattern.mostCommonTriggerLabel) {
    title = `${pattern.mostCommonTriggerLabel} is the fire you meet most often.`;
  } else {
    title = `Your energy flows mostly to ${(pattern.strongestForgeCategoryLabel ?? '').toLowerCase()}.`;
  }

  let body: string;
  if (returnRecord.returnsRecorded > 0) {
    body = `And when a streak breaks, the record shows you return — ${returnRecord.averageReturnTime.toLowerCase()}.`;
  } else if (pattern.strongestForgeCategoryLabel && pattern.mostCommonTrigger !== null) {
    body = `You turn the most energy toward ${pattern.strongestForgeCategoryLabel.toLowerCase()}.`;
  } else {
    body = 'Watch the map below — it shows where you are most tested.';
  }

  return { title, body };
}

/**
 * One interpretive line about forge direction (the Forge tab already shows the raw chart;
 * the record keeps only the *reading* of it). Null when nothing has been forged yet.
 */
export function buildForgeBalanceInsight(forgeCounts: ForgeCategoryCount[]): string | null {
  const top = forgeCounts[0];
  if (!top || top.count === 0) return null;

  const leastUsed = [...forgeCounts].reverse().find((c) => c.count === 0);
  if (leastUsed) {
    return `You forge mostly through ${top.label.toLowerCase()}. Next: add one act of ${leastUsed.label.toLowerCase()}.`;
  }
  return `You forge across all directions — ${top.label.toLowerCase()} leads.`;
}

export function buildNextCommand(
  hasData: boolean,
  pattern: WeeklyPattern,
  forgeCounts: ForgeCategoryCount[],
): NextCommand {
  if (!hasData) {
    return {
      title: 'Build the record.',
      body: 'Use the Pause and Forge tools for seven days. The pattern will begin to speak.',
    };
  }

  const hour = pattern.strongestUrgeHour;
  if (hour !== null && (hour >= 22 || hour < 4)) {
    return {
      title: 'Guard the night.',
      body: 'Your record shows the fire often rises late. Set the boundary before the hour arrives.',
    };
  }

  if (pattern.mostCommonTrigger === 'loneliness') {
    return {
      title: 'Seek the forge.',
      body: 'Loneliness appears often in your record. Channel it into creation or brotherhood.',
    };
  }

  if (pattern.mostCommonTrigger === 'boredom') {
    return {
      title: 'Fill the empty hour.',
      body: 'Boredom is a signal. Have a forge act ready before the idle moment arrives.',
    };
  }

  const leastUsed = forgeCounts[forgeCounts.length - 1];
  if (leastUsed && leastUsed.count === 0) {
    return {
      title: `Add one act of ${leastUsed.label}.`,
      body: `Your forge record shows no ${leastUsed.label.toLowerCase()} acts yet. One deliberate step this week.`,
    };
  }

  return {
    title: 'Continue the practice.',
    body: 'The record is building. Return each day and the pattern will deepen.',
  };
}

// ─── Service ─────────────────────────────────────────────────────────────────

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

  async getWeeklySummary(): Promise<WeeklySummary> {
    const iso = startOfWeek(this.clock.now()).toISOString();

    const [forgeActsThisWeek, urgeLogs] = await Promise.all([
      this.repos.forge.countSince(iso),
      this.repos.urge.list(200),
    ]);

    return {
      forgeActsThisWeek,
      urgesThisWeek: urgeLogs.filter((l) => l.occurredAt >= iso).length,
    };
  }

  /** Full record data powering the Record tab. Single DB fan-out, computed in memory. */
  async getRecord(): Promise<RecordData> {
    const now = this.clock.now();
    const weekStart = startOfWeek(now);
    const weekISO = weekStart.toISOString();

    const [profile, urgeLogs, forgeActs, pathEvents] = await Promise.all([
      this.repos.profile.get().catch((error) => {
        log.warn('getRecord: profile load failed, treating the arc as not started', error);
        return null;
      }),
      this.repos.urge.list(500),
      this.repos.forge.list(500),
      this.repos.path.listEvents(500),
    ]);

    const hasEnoughData = urgeLogs.length + forgeActs.length >= 3;

    const weekUrgeLogs = urgeLogs.filter((l) => l.occurredAt >= weekISO);
    const weekForgeActs = forgeActs.filter((a) => a.occurredAt >= weekISO);

    const triggerCounts = buildTriggerCounts(urgeLogs);
    const forgeCategoryCounts = buildForgeCategoryCounts(forgeActs);
    const weeklyPattern = buildWeeklyPattern(weekUrgeLogs, weekForgeActs);
    const returnRecord = buildReturnRecord(pathEvents);

    const practiceRhythm: PracticeRhythm = {
      activeDaysThisWeek: countActiveDays(weekStart, now, weekUrgeLogs, weekForgeActs),
      urgesThisWeek: weekUrgeLogs.length,
      forgeActsThisWeek: weekForgeActs.length,
    };

    const arc = buildPathArc(
      profile ?? { currentPathStartedAt: null, currentPathPhase: 'initiation_90' },
      getAllDailyPath().length,
      this.clock,
    );
    const reveal = buildReveal(weeklyPattern, returnRecord);
    const forgeBalance = buildForgeBalanceInsight(forgeCategoryCounts);
    const nextCommand = buildNextCommand(hasEnoughData, weeklyPattern, forgeCategoryCounts);
    const urgeTrend = buildUrgeTrend(urgeLogs, this.clock);

    return {
      hasEnoughData,
      arc,
      reveal,
      triggerCounts,
      forgeCategoryCounts,
      forgeBalance,
      weeklyPattern,
      returnRecord,
      practiceRhythm,
      nextCommand,
      urgeTrend,
    };
  }
}
