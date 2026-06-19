import type { UrgeLog } from '@/features/pause/domain/urge-log';
import type { Clock } from '@/shared/lib';
import { addDays, differenceInDays, startOfUtcDay, toIsoDateTime } from '@/shared/utils';

/**
 * Practice trends over time — the signals retention practitioners value most:
 * is the fire meeting them less often (urge frequency + intensity declining),
 * and how have the days felt (mood). Pure and clock-injected so the bucketing is
 * deterministic and unit-testable; the screen stays presentational.
 *
 * Framed as *felt experience*, never a medical or abstinence claim (see
 * docs/CONTENT_SAFETY.md): mood is the user's own 1–5 journal mood, not a
 * diagnosis, and a hard week is never shamed.
 */

export interface TrendBucket {
  /** ISO timestamp of the first day in the bucket (UTC). */
  startISO: string;
  /** Short axis label, e.g. "Jun 2". */
  label: string;
  /** How many records fell in the bucket. */
  count: number;
  /** Mean of the metric within the bucket (rounded 1dp); null when no value. */
  average: number | null;
}

/** Direction over the series. Meaning is metric-specific (see the copy blocks). */
export type TrendDirection = 'easing' | 'steady' | 'rising';

export interface TrendSeries {
  /** Oldest → newest, exactly `bucketCount` entries. */
  buckets: TrendBucket[];
  /** True once there are ≥2 buckets to compare, so a trend exists. */
  hasEnoughData: boolean;
  direction: TrendDirection | null;
}

export interface TrendOptions {
  bucketCount?: number;
  bucketDays?: number;
}

const DEFAULT_BUCKET_COUNT = 6;
const DEFAULT_BUCKET_DAYS = 7;

const MONTHS = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];

function shortLabel(date: Date): string {
  return `${MONTHS[date.getUTCMonth()] ?? ''} ${date.getUTCDate()}`;
}

interface Datum {
  occurredAt: string;
  value: number | null;
}

/**
 * Buckets data into `bucketCount` periods of `bucketDays`, the most recent
 * ending today. Returns buckets oldest → newest with per-bucket count and the
 * mean of present values (`average`, null when no value landed in the bucket).
 */
function buildBuckets(
  data: Datum[],
  clock: Clock,
  bucketCount: number,
  bucketDays: number,
): TrendBucket[] {
  const now = startOfUtcDay(clock.now());

  const buckets: TrendBucket[] = Array.from({ length: bucketCount }, (_, i) => {
    // i is oldest-first; `fromEnd` counts back from the most recent bucket.
    const fromEnd = bucketCount - 1 - i;
    const start = addDays(now, -((fromEnd + 1) * bucketDays - 1));
    return { startISO: toIsoDateTime(start), label: shortLabel(start), count: 0, average: null };
  });

  const sums = Array.from({ length: bucketCount }, () => 0);
  const valueCounts = Array.from({ length: bucketCount }, () => 0);

  for (const datum of data) {
    const daysAgo = differenceInDays(now, new Date(datum.occurredAt));
    if (daysAgo < 0) continue; // future record — ignore
    const fromEnd = Math.floor(daysAgo / bucketDays);
    if (fromEnd >= bucketCount) continue; // older than the window
    const idx = bucketCount - 1 - fromEnd;
    const bucket = buckets[idx];
    if (!bucket) continue;
    bucket.count += 1;
    if (datum.value !== null) {
      sums[idx] = (sums[idx] ?? 0) + datum.value;
      valueCounts[idx] = (valueCounts[idx] ?? 0) + 1;
    }
  }

  for (let i = 0; i < bucketCount; i++) {
    const vc = valueCounts[i] ?? 0;
    const bucket = buckets[i];
    if (bucket && vc > 0) {
      bucket.average = Math.round(((sums[i] ?? 0) / vc) * 10) / 10;
    }
  }

  return buckets;
}

/** Mean of the first vs. second half of a series (drops the middle on odd lengths). */
function halfMeans(values: number[]): { first: number; second: number } | null {
  if (values.length < 2) return null;
  const half = Math.floor(values.length / 2);
  const mean = (xs: number[]) => xs.reduce((a, b) => a + b, 0) / xs.length;
  return { first: mean(values.slice(0, half)), second: mean(values.slice(values.length - half)) };
}

/**
 * Urge trend: count per bucket with mean `intensityBefore`. Fewer urges over the
 * window → `'easing'` (good), more → `'rising'`. Empty (zero-urge) buckets are
 * real signal for frequency, so they count toward the direction.
 */
export function buildUrgeTrend(logs: UrgeLog[], clock: Clock, options?: TrendOptions): TrendSeries {
  const bucketCount = options?.bucketCount ?? DEFAULT_BUCKET_COUNT;
  const bucketDays = options?.bucketDays ?? DEFAULT_BUCKET_DAYS;

  const buckets = buildBuckets(
    logs.map((l) => ({ occurredAt: l.occurredAt, value: l.intensityBefore })),
    clock,
    bucketCount,
    bucketDays,
  );

  const nonEmpty = buckets.filter((b) => b.count > 0).length;
  const hasEnoughData = nonEmpty >= 2;

  let direction: TrendDirection | null = null;
  if (hasEnoughData) {
    const means = halfMeans(buckets.map((b) => b.count));
    if (means) {
      const delta = means.second - means.first;
      direction = delta <= -0.5 ? 'easing' : delta >= 0.5 ? 'rising' : 'steady';
    }
  }

  return { buckets, hasEnoughData, direction };
}

