import { createForgeAct, type ForgeCategory } from '@/features/forge/domain/forge-act';
import { createJournalEntry } from '@/features/journal/domain/journal-entry';
import { createPathEvent } from '@/features/path/domain/path-event';
import type { UserProfile } from '@/features/path/domain/user-profile';
import { createUrgeLog, type TriggerType } from '@/features/pause/domain/urge-log';
import { fixedClock } from '@/shared/lib';
import { addDays, toIsoDateTime } from '@/shared/utils';
import { createFakeRepositories } from '@/testing/fakes/in-memory-repositories';

import {
  buildForgeBalanceInsight,
  buildPathArc,
  buildReveal,
  ProgressService,
  type ForgeCategoryCount,
  type ReturnRecord,
  type WeeklyPattern,
} from './progress-service';

const EMPTY_PATTERN: WeeklyPattern = {
  mostCommonTrigger: null,
  mostCommonTriggerLabel: null,
  strongestUrgeHour: null,
  strongestUrgeHourLabel: null,
  mostCommonResponse: null,
  strongestForgeCategory: null,
  strongestForgeCategoryLabel: null,
};

const NO_RETURNS: ReturnRecord = {
  lapsesStudied: 0,
  returnsRecorded: 0,
  averageReturnTime: '—',
  currentPosture: 'On the path',
};

function pattern(over: Partial<WeeklyPattern>): WeeklyPattern {
  return { ...EMPTY_PATTERN, ...over };
}

function forge(counts: Partial<Record<ForgeCategory, number>>): ForgeCategoryCount[] {
  const labels: Record<ForgeCategory, string> = {
    body: 'Body',
    mind: 'Mind',
    spirit: 'Spirit',
    order: 'Order',
    creation: 'Creation',
    brotherhood: 'Brotherhood',
  };
  return (Object.keys(labels) as ForgeCategory[])
    .map((category) => ({ category, label: labels[category], count: counts[category] ?? 0 }))
    .sort((a, b) => b.count - a.count);
}

describe('buildReveal', () => {
  it('returns null when nothing has been observed', () => {
    expect(buildReveal(EMPTY_PATTERN, NO_RETURNS)).toBeNull();
  });

  it('leads with the most common trigger as the headline', () => {
    const reveal = buildReveal(
      pattern({ mostCommonTrigger: 'loneliness' as TriggerType, mostCommonTriggerLabel: 'Loneliness' }),
      NO_RETURNS,
    );
    expect(reveal?.title).toContain('Loneliness');
  });

  it('phrases an unnamed urge gently for the unknown trigger', () => {
    const reveal = buildReveal(
      pattern({ mostCommonTrigger: 'unknown' as TriggerType, mostCommonTriggerLabel: "I don't know yet" }),
      NO_RETURNS,
    );
    // Never echoes the raw "I don't know yet" label mid-sentence.
    expect(reveal?.title).not.toContain("I don't know yet");
    expect(reveal?.title.toLowerCase()).toContain('name');
  });

  it('speaks to the speed of the return when returns exist', () => {
    const reveal = buildReveal(
      pattern({ mostCommonTrigger: 'stress' as TriggerType, mostCommonTriggerLabel: 'Stress' }),
      { lapsesStudied: 1, returnsRecorded: 1, averageReturnTime: 'Same day', currentPosture: 'On the path' },
    );
    expect(reveal?.body.toLowerCase()).toContain('same day');
  });
});

describe('buildForgeBalanceInsight', () => {
  it('returns null when nothing has been forged', () => {
    expect(buildForgeBalanceInsight(forge({}))).toBeNull();
  });

  it('names the leading direction and suggests an unused one', () => {
    const insight = buildForgeBalanceInsight(forge({ body: 3, mind: 1 }));
    expect(insight).toContain('body');
    // Suggests adding one of the still-empty categories.
    expect(insight?.toLowerCase()).toContain('add one act of');
  });

  it('acknowledges breadth when every direction has been forged', () => {
    const insight = buildForgeBalanceInsight(
      forge({ body: 3, mind: 2, spirit: 1, order: 1, creation: 2, brotherhood: 1 }),
    );
    expect(insight?.toLowerCase()).toContain('all directions');
  });
});

describe('buildPathArc', () => {
  const now = fixedClock(new Date('2026-06-06T12:00:00.000Z'));

  function arcProfile(
    currentPathStartedAt: string | null,
    phase: UserProfile['currentPathPhase'] = 'initiation_90',
  ): Pick<UserProfile, 'currentPathStartedAt' | 'currentPathPhase'> {
    return { currentPathStartedAt, currentPathPhase: phase };
  }

  it('is unstarted with the full span remaining when no path is running', () => {
    const arc = buildPathArc(arcProfile(null), 90, now);
    expect(arc.started).toBe(false);
    expect(arc.currentDay).toBe(0);
    expect(arc.daysRemaining).toBe(90);
    expect(arc.startDateISO).toBeNull();
    expect(arc.endDateISO).toBeNull();
    expect(arc.progress).toBe(0);
  });

  it('places Day 90 exactly 89 days after the start date', () => {
    const start = '2026-06-06T00:00:00.000Z';
    const arc = buildPathArc(arcProfile(start), 90, now);
    expect(arc.started).toBe(true);
    expect(arc.currentDay).toBe(1);
    expect(arc.daysRemaining).toBe(89);
    expect(arc.endDateISO).toBe(toIsoDateTime(addDays(new Date(start), 89)));
    expect(arc.endDateISO?.startsWith('2026-09-03')).toBe(true);
  });

  it('counts the current day mid-arc', () => {
    // Started 11 days ago → day 12 of 90.
    const start = '2026-05-26T12:00:00.000Z';
    const arc = buildPathArc(arcProfile(start), 90, now);
    expect(arc.currentDay).toBe(12);
    expect(arc.daysRemaining).toBe(78);
    expect(arc.complete).toBe(false);
    expect(arc.progress).toBeCloseTo(12 / 90);
  });

  it('is complete once the current day reaches the total', () => {
    const start = '2026-01-01T00:00:00.000Z'; // far past → day > 90
    const arc = buildPathArc(arcProfile(start), 90, now);
    expect(arc.complete).toBe(true);
    expect(arc.daysRemaining).toBe(0);
    expect(arc.progress).toBe(1);
  });

  it('is complete on the crowned long path regardless of day', () => {
    const arc = buildPathArc(arcProfile('2026-06-01T00:00:00.000Z', 'crowned_long_path'), 90, now);
    expect(arc.complete).toBe(true);
  });
});

describe('ProgressService.getRecord (end-to-end against fake repos)', () => {
  const clock = fixedClock(new Date('2026-06-06T12:00:00.000Z'));

  it('resolves with a valid record when there is no data', async () => {
    const repos = createFakeRepositories();
    const service = new ProgressService(repos, clock);

    const record = await service.getRecord();

    expect(record).not.toBeNull();
    expect(record.reveal).toBeNull();
    expect(record.forgeBalance).toBeNull();
    expect(record.triggerCounts).toHaveLength(9);
    expect(record.arc.started).toBe(false);
    expect(record.nextCommand.title).toBe('Build the record.');
  });

  it('resolves with a populated record once data exists', async () => {
    const repos = createFakeRepositories();
    const service = new ProgressService(repos, clock);
    await repos.profile.update({
      currentPathStartedAt: '2026-05-26T12:00:00.000Z',
      pathStartedAt: '2026-05-26T12:00:00.000Z',
    });
    await repos.urge.add(createUrgeLog({ triggerType: 'loneliness', intensityBefore: 4 }, clock));
    await repos.forge.add(createForgeAct({ category: 'body', title: 'Cold shower' }, clock));
    await repos.journal.save(createJournalEntry({ body: 'A reflection.' }, clock));
    await repos.path.addEvent(createPathEvent('path_started', clock));

    const record = await service.getRecord();

    expect(record.arc.started).toBe(true);
    expect(record.arc.currentDay).toBe(12);
    expect(record.triggerCounts.find((t) => t.triggerType === 'loneliness')?.count).toBe(1);
    expect(record.forgeBalance).toContain('body');
  });
});
