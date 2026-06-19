import { getArchetypeProfile, getDailyPathContent } from '@/content';
import { fixedClock } from '@/shared/lib';

import { buildReminderPlan, REMINDER_WINDOW_DAYS } from './reminder-plan';

const MS_PER_DAY = 24 * 60 * 60 * 1000;
// 5 AM, just before the 6 AM fire, so "today" is still scheduled.
const now = new Date(2024, 0, 15, 5, 0, 0);
const clock = fixedClock(now);

const isMorning = (id: string) => id.startsWith('manforge-day-');
const isEvening = (id: string) => id.startsWith('manforge-evening-day-');
const dayOf = (identifier: string) => Number(identifier.replace(/^manforge-(evening-)?day-/, ''));

describe('buildReminderPlan', () => {
  it('returns nothing when reminders are disabled', () => {
    expect(buildReminderPlan(false, now.toISOString(), clock)).toEqual([]);
  });

  it('returns nothing when no path is running', () => {
    expect(buildReminderPlan(true, null, clock)).toEqual([]);
  });

  it('titles each morning with the day count + archetype and bodies it with the day text', () => {
    const plan = buildReminderPlan(true, now.toISOString(), clock).filter((d) => isMorning(d.identifier));
    expect(plan.length).toBeGreaterThan(0);

    // Derive expectations from the descriptor's own day so this holds in any timezone.
    for (const descriptor of plan) {
      const day = dayOf(descriptor.identifier);
      const content = getDailyPathContent(day)!;
      const archetypeName = getArchetypeProfile(content.archetype)?.name ?? content.archetype;
      expect(descriptor.title).toBe(`Day ${day} · ${archetypeName}`);
      expect(descriptor.body).toContain(content.title);
      expect(descriptor.body).toContain(content.openingLine);
      expect(descriptor.date.getHours()).toBe(6);
    }
  });

  it('adds an evening account touchpoint carrying the day reflection', () => {
    const plan = buildReminderPlan(true, now.toISOString(), clock).filter((d) => isEvening(d.identifier));
    expect(plan.length).toBeGreaterThan(0);

    for (const descriptor of plan) {
      const day = dayOf(descriptor.identifier);
      const content = getDailyPathContent(day)!;
      expect(descriptor.title).toBe(`Day ${day} · Evening account`);
      expect(descriptor.body).toBe(content.eveningAccount);
      expect(descriptor.date.getHours()).toBe(21);
    }
  });

  it('schedules consecutive ascending days within the window (mornings)', () => {
    const days = buildReminderPlan(true, now.toISOString(), clock)
      .filter((d) => isMorning(d.identifier))
      .map((d) => dayOf(d.identifier));
    expect(days.length).toBeLessThanOrEqual(REMINDER_WINDOW_DAYS);
    expect(days).toEqual([...days].sort((a, b) => a - b));
    days.forEach((d, i) => {
      if (i > 0) expect(d).toBe(days[i - 1]! + 1);
    });
  });

  it('stops at day 90 and never schedules beyond it', () => {
    // Started 88 days ago → the remaining in-range days end at day 90.
    const startedAt = new Date(now.getTime() - 88 * MS_PER_DAY).toISOString();
    const days = buildReminderPlan(true, startedAt, clock).map((d) => dayOf(d.identifier));

    expect(days.length).toBeGreaterThan(0);
    expect(Math.max(...days)).toBe(90);
    expect(days.every((d) => d >= 1 && d <= 90)).toBe(true);
  });

  it('emits unique identifiers', () => {
    const plan = buildReminderPlan(true, now.toISOString(), clock);
    const ids = plan.map((d) => d.identifier);
    expect(new Set(ids).size).toBe(ids.length);
  });
});
