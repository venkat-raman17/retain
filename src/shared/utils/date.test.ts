import { addDays, differenceInDays, toIsoDate } from './date';

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
});
