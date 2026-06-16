import { fixedClock } from '@/shared/lib';

import { dayOfYearIndex, timeOfDay } from './time-of-day';

describe('timeOfDay', () => {
  // No 'Z' — getHours() is local, so these assert against local wall-clock hours.
  const at = (iso: string) => timeOfDay(fixedClock(new Date(iso)));

  it('buckets the hour into a part of the day', () => {
    expect(at('2024-01-15T03:00:00')).toBe('night');
    expect(at('2024-01-15T06:00:00')).toBe('dawn');
    expect(at('2024-01-15T09:00:00')).toBe('morning');
    expect(at('2024-01-15T13:00:00')).toBe('midday');
    expect(at('2024-01-15T19:00:00')).toBe('evening');
    expect(at('2024-01-15T23:00:00')).toBe('night');
  });
});

describe('dayOfYearIndex', () => {
  it('advances by one across a calendar day', () => {
    const a = dayOfYearIndex(fixedClock(new Date('2024-01-15T10:00:00Z')));
    const b = dayOfYearIndex(fixedClock(new Date('2024-01-16T10:00:00Z')));
    expect(b - a).toBe(1);
  });
});
