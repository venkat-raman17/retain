import { getArchetypeProfile, getDailyPathContent } from '@/content';
import { daysSince } from '@/features/path/domain/practice';
import type { Clock } from '@/shared/lib/clock';

export interface ReminderDescriptor {
  identifier: string;
  title: string;
  body: string;
  /** One-shot delivery moment (local). */
  date: Date;
}

export const REMINDER_HOUR = 6;
export const EVENING_HOUR = 21;
export const REMINDER_WINDOW_DAYS = 14;

/**
 * Pure builder — returns the dated notification descriptors to schedule.
 *
 * Two light touchpoints per upcoming day: a morning intention (archetype + the
 * day's title/opening line) and an evening account (the day's reflection cue).
 * Each is a separate one-shot notification carrying THAT day's content, because a
 * single repeating trigger can only carry static text. The caller reschedules this
 * rolling window on every app open, so it stays fresh and well under OS
 * pending-notification limits.
 *
 * Empty when reminders are disabled or no path is running. Days outside 1–90 are
 * skipped (post-Crown long-path days have no daily-chamber content). No side-effects.
 */
export function buildReminderPlan(
  enabled: boolean,
  currentPathStartedAt: string | null,
  clock: Clock,
  windowDays: number = REMINDER_WINDOW_DAYS,
  morningHour: number = REMINDER_HOUR,
  eveningHour: number = EVENING_HOUR,
): ReminderDescriptor[] {
  if (!enabled || !currentPathStartedAt) return [];

  const now = clock.now();
  const plan: ReminderDescriptor[] = [];

  for (let i = 0; i < windowDays; i++) {
    const dayStart = new Date(now.getFullYear(), now.getMonth(), now.getDate() + i);
    const pathDay = daysSince(currentPathStartedAt, { now: () => dayStart }) + 1;
    if (pathDay < 1 || pathDay > 90) continue;

    const content = getDailyPathContent(pathDay);
    if (!content) continue;

    const archetypeName = getArchetypeProfile(content.archetype)?.name ?? content.archetype;

    const morning = new Date(now.getFullYear(), now.getMonth(), now.getDate() + i, morningHour, 0, 0, 0);
    if (morning.getTime() > now.getTime()) {
      plan.push({
        identifier: `manforge-day-${pathDay}`,
        title: `Day ${pathDay} · ${archetypeName}`,
        body: `${content.title} — ${content.openingLine}`,
        date: morning,
      });
    }

    const evening = new Date(now.getFullYear(), now.getMonth(), now.getDate() + i, eveningHour, 0, 0, 0);
    if (evening.getTime() > now.getTime()) {
      plan.push({
        identifier: `manforge-evening-day-${pathDay}`,
        title: `Day ${pathDay} · Evening account`,
        body: content.eveningAccount,
        date: evening,
      });
    }
  }

  return plan;
}
