import { addDays, differenceInDays, startOfWeek, toIsoDate } from './date';

describe('date utils', () => {
  it('formats an ISO calendar date in UTC', () => {
    expect(toIsoDate(new Date('2026-06-06T23:30:00.000Z'))).toBe('2026-06-06');
  });

  it('computes whole-day differences regardless of time of day', () => {
    const later = new Date('2026-06-06T01:00:00.000Z');
    const earlier = new Date('2026-06-01T23:00:00.000Z');
    expect(differenceInDays(later, earlier)).toBe(5);
  });

  it('adds days', () => {
    expect(toIsoDate(addDays(new Date('2026-06-06T00:00:00.000Z'), 3))).toBe('2026-06-09');
  });

  it('finds the Sunday 00:00 UTC at the start of the week', () => {
    // 2026-06-06 is a Saturday → week started Sunday 2026-05-31.
    expect(startOfWeek(new Date('2026-06-06T12:00:00.000Z')).toISOString()).toBe(
      '2026-05-31T00:00:00.000Z',
    );
    // A Sunday is its own week start.
    expect(toIsoDate(startOfWeek(new Date('2026-05-31T23:00:00.000Z')))).toBe('2026-05-31');
  });
});
