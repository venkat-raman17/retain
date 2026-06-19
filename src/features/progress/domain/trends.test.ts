import { createJournalEntry, type JournalEntry } from '@/features/journal/domain/journal-entry';
import { createUrgeLog, type UrgeLog } from '@/features/pause/domain/urge-log';
import { fixedClock } from '@/shared/lib';

import { buildMoodTrend, buildUrgeTrend } from './trends';

const NOW = '2026-06-19T12:00:00.000Z';
const clock = fixedClock(new Date(NOW));

function urgeAt(dateISO: string, intensityBefore = 3): UrgeLog {
  return createUrgeLog({ triggerType: 'stress', intensityBefore }, fixedClock(new Date(dateISO)));
}

function moodAt(dateISO: string, mood: number | null): JournalEntry {
  return createJournalEntry({ body: 'A reflection.', mood }, fixedClock(new Date(dateISO)));
}

describe('buildUrgeTrend', () => {
  it('returns six empty buckets with no trend when there is nothing logged', () => {
    const trend = buildUrgeTrend([], clock);
    expect(trend.buckets).toHaveLength(6);
    expect(trend.buckets.every((b) => b.count === 0 && b.average === null)).toBe(true);
    expect(trend.hasEnoughData).toBe(false);
    expect(trend.direction).toBeNull();
  });

  it('orders buckets oldest → newest and counts urges into the right week', () => {
    const trend = buildUrgeTrend(
      [urgeAt('2026-05-12T12:00:00.000Z'), urgeAt('2026-06-16T12:00:00.000Z')],
      clock,
    );
    // Oldest bucket holds the May 12 urge; newest holds the Jun 16 urge.
    expect(trend.buckets[0]?.count).toBe(1);
    expect(trend.buckets[5]?.count).toBe(1);
    expect(trend.buckets[1]?.count).toBe(0);
  });

  it('reads as easing when urges decline over the window', () => {
    const logs = [
      urgeAt('2026-05-12T12:00:00.000Z'),
      urgeAt('2026-05-12T13:00:00.000Z'),
      urgeAt('2026-05-12T14:00:00.000Z'),
      urgeAt('2026-05-19T12:00:00.000Z'),
      urgeAt('2026-05-19T13:00:00.000Z'),
      urgeAt('2026-06-16T12:00:00.000Z'),
    ];
    const trend = buildUrgeTrend(logs, clock);
    expect(trend.hasEnoughData).toBe(true);
    expect(trend.direction).toBe('easing');
  });

  it('reads as rising when urges climb over the window', () => {
    const logs = [
      urgeAt('2026-05-12T12:00:00.000Z'),
      urgeAt('2026-06-16T12:00:00.000Z'),
      urgeAt('2026-06-16T13:00:00.000Z'),
      urgeAt('2026-06-16T14:00:00.000Z'),
    ];
    const trend = buildUrgeTrend(logs, clock);
    expect(trend.direction).toBe('rising');
  });

  it('averages intensityBefore within a bucket', () => {
    const trend = buildUrgeTrend(
      [urgeAt('2026-06-16T12:00:00.000Z', 2), urgeAt('2026-06-16T13:00:00.000Z', 4)],
      clock,
    );
    expect(trend.buckets[5]?.average).toBe(3);
  });

  it('ignores urges older than the window', () => {
    const trend = buildUrgeTrend([urgeAt('2026-04-01T12:00:00.000Z')], clock);
    expect(trend.buckets.every((b) => b.count === 0)).toBe(true);
    expect(trend.hasEnoughData).toBe(false);
  });

  it('honors bucketCount/bucketDays overrides', () => {
    const trend = buildUrgeTrend([], clock, { bucketCount: 3, bucketDays: 1 });
    expect(trend.buckets).toHaveLength(3);
  });

  it('buckets the same logs differently under a later clock (clock is injected)', () => {
    const logs = [urgeAt('2026-06-16T12:00:00.000Z')];
    const now = buildUrgeTrend(logs, clock);
    const aWeekLater = buildUrgeTrend(logs, fixedClock(new Date('2026-06-26T12:00:00.000Z')));
    expect(now.buckets[5]?.count).toBe(1);
    // A week later the same urge has slid into an earlier bucket.
    expect(aWeekLater.buckets[5]?.count).toBe(0);
    expect(aWeekLater.buckets[4]?.count).toBe(1);
  });
});

describe('buildMoodTrend', () => {
  it('is empty with no trend when no moods are logged', () => {
    const trend = buildMoodTrend([], clock);
    expect(trend.buckets).toHaveLength(6);
    expect(trend.hasEnoughData).toBe(false);
    expect(trend.direction).toBeNull();
  });

  it('excludes entries with no mood from the average and the count', () => {
    const trend = buildMoodTrend(
      [moodAt('2026-06-16T12:00:00.000Z', 4), moodAt('2026-06-16T13:00:00.000Z', null)],
      clock,
    );
    expect(trend.buckets[5]?.count).toBe(1);
    expect(trend.buckets[5]?.average).toBe(4);
  });

  it('reads as rising when mood climbs over the window', () => {
    const entries = [
      moodAt('2026-05-12T12:00:00.000Z', 2),
      moodAt('2026-05-19T12:00:00.000Z', 2),
      moodAt('2026-06-16T12:00:00.000Z', 5),
    ];
    const trend = buildMoodTrend(entries, clock);
    expect(trend.hasEnoughData).toBe(true);
    expect(trend.direction).toBe('rising');
  });

  it('reads as easing (heavier) when mood falls over the window', () => {
    const entries = [
      moodAt('2026-05-12T12:00:00.000Z', 5),
      moodAt('2026-05-19T12:00:00.000Z', 4),
      moodAt('2026-06-16T12:00:00.000Z', 2),
    ];
    const trend = buildMoodTrend(entries, clock);
    expect(trend.direction).toBe('easing');
  });

  it('needs at least two moods to declare a trend', () => {
    const trend = buildMoodTrend([moodAt('2026-06-16T12:00:00.000Z', 4)], clock);
    expect(trend.hasEnoughData).toBe(false);
    expect(trend.direction).toBeNull();
  });
});
