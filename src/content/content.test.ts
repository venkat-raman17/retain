import { scanForUnsafeLanguage } from '@/testing/content-safety';

import {
  archetypeProfiles,
  arcs,
  codexDays,
  copy,
  crownCodex,
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
    expect(dailyPath.length).toBe(90);
    expect(studies).toHaveLength(3);
    expect(rituals).toHaveLength(3);
    expect(journalPrompts.length).toBeGreaterThanOrEqual(12);
    expect(rites).toHaveLength(8);
    expect(getSafetyDisclaimer().version).toBeGreaterThanOrEqual(1);
    expect(getSafetyResources().items.length).toBeGreaterThan(0);
  });

  it('has 9 arcs covering days 1-90', () => {
    expect(arcs).toHaveLength(9);
    expect(arcs[0]?.dayStart).toBe(1);
    expect(arcs[8]?.dayEnd).toBe(90);
  });

  it('has Crown Codex content', () => {
    expect(crownCodex.length).toBeGreaterThanOrEqual(5);
  });

  it('has unique day numbers in the daily path', () => {
    const dayNumbers = dailyPath.map((day) => day.dayNumber);
    const unique = new Set(dayNumbers);
    expect(unique.size).toBe(dayNumbers.length);
  });

  it('daily path covers days 1-90 without gaps', () => {
    const dayNumbers = new Set(dailyPath.map((d) => d.dayNumber));
    for (let d = 1; d <= 90; d++) {
      expect(dayNumbers.has(d)).toBe(true);
    }
  });
});

describe('bundled content — loaders', () => {
  it('getDailyPathContent returns the right day', () => {
    expect(getDailyPathContent(1)?.dayNumber).toBe(1);
    expect(getDailyPathContent(30)?.dayNumber).toBe(30);
    expect(getDailyPathContent(90)?.dayNumber).toBe(90);
    expect(getDailyPathContent(91)).toBeUndefined();
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

  it('every daily path entry has an arc number 1-9', () => {
    for (const day of dailyPath) {
      expect(day.arcNumber).toBeGreaterThanOrEqual(1);
      expect(day.arcNumber).toBeLessThanOrEqual(9);
    }
  });

  it('final days have crown fragment', () => {
    const day1 = getDailyPathContent(1);
    expect(day1?.crownFragment).toBeTruthy();
    const day90 = getDailyPathContent(90);
    expect(day90?.crownFragment).toBeTruthy();
  });

  it('all 9 arcs have required fields', () => {
    for (const arc of arcs) {
      expect(arc.centralQuestion.length).toBeGreaterThan(0);
      expect(arc.completionCopy.length).toBeGreaterThan(0);
    }
  });

  it('Crown Codex entries have required fields', () => {
    for (const item of crownCodex) {
      expect(item.body.length).toBeGreaterThan(0);
      expect(item.reflectionPrompt.length).toBeGreaterThan(0);
      expect(item.seal.length).toBeGreaterThan(0);
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

    collectStrings([arcs, crownCodex], strings);

    const offenders = strings.flatMap((text) =>
      scanForUnsafeLanguage(text).map((term) => `"${term}" found in: ${text.slice(0, 80)}`),
    );

    expect(offenders).toEqual([]);
  });
});
