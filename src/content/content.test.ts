import { scanForUnsafeLanguage } from '@/testing/content-safety';

import {
  archetypeProfiles,
  codexDays,
  copy,
  dailyPath,
  getAllStudies,
  getArchetypeProfile,
  getDailyCodexDay,
  getDailyPathContent,
  getMilestoneRite,
  getMilestoneRiteById,
  getPromptByType,
  getSafetyDisclaimer,
  getSafetyResources,
  journalPrompts,
  onboardingSteps,
  principles,
  rites,
  rituals,
  studies,
} from './index';

function collectStrings(value: unknown, out: string[]): void {
  if (typeof value === 'string') {
    out.push(value);
  } else if (Array.isArray(value)) {
    for (const item of value) collectStrings(item, out);
  } else if (value && typeof value === 'object') {
    for (const item of Object.values(value)) collectStrings(item, out);
  }
}

describe('bundled content — basic counts', () => {
  it('loads every collection', () => {
    expect(principles).toHaveLength(10);
    expect(archetypeProfiles).toHaveLength(12);
    expect(codexDays).toHaveLength(7);
    expect(dailyPath.length).toBeGreaterThanOrEqual(30);
    expect(studies).toHaveLength(3);
    expect(rituals).toHaveLength(3);
    expect(journalPrompts.length).toBeGreaterThanOrEqual(12);
    expect(rites).toHaveLength(8);
    expect(getSafetyDisclaimer().version).toBeGreaterThanOrEqual(1);
    expect(getSafetyResources().items.length).toBeGreaterThan(0);
  });

  it('has unique day numbers in the daily path', () => {
    const dayNumbers = dailyPath.map((day) => day.dayNumber);
    const unique = new Set(dayNumbers);
    expect(unique.size).toBe(dayNumbers.length);
  });
});

describe('bundled content — loaders', () => {
  it('getDailyPathContent returns the right day', () => {
    expect(getDailyPathContent(1)?.dayNumber).toBe(1);
    expect(getDailyPathContent(30)?.dayNumber).toBe(30);
    expect(getDailyPathContent(99)).toBeUndefined();
  });

  it('getDailyCodexDay returns the right day', () => {
    expect(getDailyCodexDay(1)?.dayNumber).toBe(1);
    expect(getDailyCodexDay(99)).toBeUndefined();
  });

  it('getAllStudies returns the full set', () => {
    expect(getAllStudies()).toBe(studies);
  });

  it('getArchetypeProfile finds all 12 archetypes', () => {
    const ids = archetypeProfiles.map((a) => a.id);
    for (const id of ids) {
      expect(getArchetypeProfile(id)).toBeDefined();
    }
  });

  it('getPromptByType returns prompts of the right type', () => {
    const lapsePrompts = getPromptByType('lapse');
    expect(lapsePrompts.length).toBeGreaterThan(0);
    for (const prompt of lapsePrompts) {
      expect(prompt.type).toBe('lapse');
    }
  });

  it('getMilestoneRite finds milestone days', () => {
    for (const day of [7, 14, 21, 30, 45, 60, 75, 90]) {
      expect(getMilestoneRite(day)?.milestoneDay).toBe(day);
    }
  });

  it('getMilestoneRiteById works', () => {
    expect(getMilestoneRiteById('rite-day-7')?.milestoneDay).toBe(7);
    expect(getMilestoneRiteById('nonexistent')).toBeUndefined();
  });
});

describe('bundled content — structural integrity', () => {
  it('every daily path entry has a season', () => {
    for (const day of dailyPath) {
      expect(day.season).toBeTruthy();
    }
  });

  it('every daily path entry references valid archetype id', () => {
    const validIds = new Set(archetypeProfiles.map((a) => a.id));
    for (const day of dailyPath) {
      expect(validIds.has(day.archetype)).toBe(true);
    }
  });

  it('every daily path entry with milestoneRiteId has a matching rite', () => {
    for (const day of dailyPath) {
      if (day.milestoneRiteId) {
        expect(getMilestoneRiteById(day.milestoneRiteId)).toBeDefined();
      }
    }
  });

  it('every study has a non-empty guardrail', () => {
    for (const study of studies) {
      expect(study.guardrail.trim().length).toBeGreaterThan(0);
    }
  });

  it('all 12 archetypes have a retain line', () => {
    for (const archetype of archetypeProfiles) {
      expect(archetype.retainLine.trim().length).toBeGreaterThan(0);
    }
  });

  it('all 8 milestone rites have audit questions', () => {
    for (const rite of rites) {
      expect(rite.selfAuditQuestions.length).toBeGreaterThan(0);
    }
  });
});

describe('bundled content — safety scan', () => {
  it('contains no degrading or shaming language', () => {
    const strings: string[] = [];
    collectStrings(
      [
        principles,
        archetypeProfiles,
        codexDays,
        dailyPath,
        studies,
        rituals,
        journalPrompts,
        rites,
        onboardingSteps,
        getSafetyDisclaimer(),
        getSafetyResources(),
        copy,
      ],
      strings,
    );

    const offenders = strings.flatMap((text) =>
      scanForUnsafeLanguage(text).map((term) => `"${term}" found in: ${text.slice(0, 80)}`),
    );

    expect(offenders).toEqual([]);
  });
});
