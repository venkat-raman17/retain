import { scanForUnsafeLanguage } from '@/testing/content-safety';

import { codexEntries, copy, disclaimer, onboardingSteps, practices, principles } from './index';

function collectStrings(value: unknown, out: string[]): void {
  if (typeof value === 'string') {
    out.push(value);
  } else if (Array.isArray(value)) {
    for (const item of value) collectStrings(item, out);
  } else if (value && typeof value === 'object') {
    for (const item of Object.values(value)) collectStrings(item, out);
  }
}

describe('bundled content', () => {
  it('loads and validates every collection at import time', () => {
    // Importing `./index` runs Zod validation; these assert the content is present.
    expect(principles.length).toBeGreaterThan(0);
    expect(onboardingSteps.length).toBeGreaterThan(0);
    expect(codexEntries.length).toBeGreaterThan(0);
    expect(practices.length).toBeGreaterThan(0);
    expect(disclaimer.version).toBeGreaterThanOrEqual(1);
  });

  it('contains no degrading or shaming language', () => {
    const strings: string[] = [];
    collectStrings([principles, onboardingSteps, codexEntries, practices, disclaimer, copy], strings);

    const offenders = strings.flatMap((text) =>
      scanForUnsafeLanguage(text).map((term) => `${term} :: ${text}`),
    );

    expect(offenders).toEqual([]);
  });
});
