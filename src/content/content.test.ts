import { scanForUnsafeLanguage } from '@/testing/content-safety';

import { PUBLIC_DOMAIN_SOURCE_HOSTS } from './schemas';
import {
  achievements,
  archetypeProfiles,
  arcs,
  codexDays,
  copy,
  crownCodex,
  dailyPath,
  getLineagePassage,
  lineagePassages,
  getAllAchievements,
  getAllStations,
  getAllStudies,
  getAllTrials,
  getAchievementById,
  getArchetypeProfile,
  getDailyCodexDay,
  getDailyPathContent,
  getMilestoneRite,
  getMilestoneRiteById,
  getSafetyDisclaimer,
  getSafetyResources,
  getStationForArcsCleared,
  getTrialForDay,
  onboardingSteps,
  principles,
  rites,
  rituals,
  stations,
  studies,
  trials,
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
    expect(studies).toHaveLength(11);
    expect(rituals).toHaveLength(3);
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

describe('bundled content — trials', () => {
  it('has exactly 91 trials (90 days + crown)', () => {
    expect(trials).toHaveLength(91);
  });

  it('has unique trial ids', () => {
    const ids = trials.map((t) => t.id);
    expect(new Set(ids).size).toBe(ids.length);
  });

  it('covers days 1-90 and crown without gaps', () => {
    const dayNumbers = new Set(trials.map((t) => t.dayNumber));
    for (let d = 1; d <= 90; d++) {
      expect(dayNumbers.has(d)).toBe(true);
    }
    expect(dayNumbers.has('crown')).toBe(true);
  });

  it('all day trials have a valid arcNumber (1-9)', () => {
    const dayTrials = trials.filter((t) => t.dayNumber !== 'crown');
    for (const trial of dayTrials) {
      expect(trial.arcNumber).toBeGreaterThanOrEqual(1);
      expect(trial.arcNumber).toBeLessThanOrEqual(9);
    }
  });

  it('crown trial has arcNumber null', () => {
    const crown = trials.find((t) => t.dayNumber === 'crown');
    expect(crown?.arcNumber).toBeNull();
  });

  it('every trial has at least one objective', () => {
    for (const trial of trials) {
      expect(trial.objectives.length).toBeGreaterThanOrEqual(1);
    }
  });

  it('milestone days grant a key', () => {
    for (const day of [7, 14, 21, 30, 45, 60, 75, 90]) {
      const trial = getTrialForDay(day);
      expect(trial?.rewardKeyId).toBeTruthy();
    }
  });

  it('crown trial grants 100 embers', () => {
    const crown = getTrialForDay('crown');
    expect(crown?.rewardEmbers).toBe(100);
  });

  it('getAllTrials returns all 91', () => {
    expect(getAllTrials()).toHaveLength(91);
  });

  it('getTrialForDay returns the right trial', () => {
    expect(getTrialForDay(1)?.dayNumber).toBe(1);
    expect(getTrialForDay(90)?.dayNumber).toBe(90);
    expect(getTrialForDay('crown')?.dayNumber).toBe('crown');
    expect(getTrialForDay(91)).toBeUndefined();
  });
});

describe('bundled content — achievements', () => {
  it('has at least 10 achievements', () => {
    expect(achievements.length).toBeGreaterThanOrEqual(10);
  });

  it('has unique achievement ids', () => {
    const ids = achievements.map((a) => a.id);
    expect(new Set(ids).size).toBe(ids.length);
  });

  it('every achievement has a non-empty title and description', () => {
    for (const a of achievements) {
      expect(a.title.trim().length).toBeGreaterThan(0);
      expect(a.description.trim().length).toBeGreaterThan(0);
    }
  });

  it('every achievement has a valid criteria kind', () => {
    const VALID_KINDS = [
      'days_completed', 'arc_cleared', 'arcs_cleared', 'pause_logged', 'forge_act_logged',
      'forge_all_categories', 'return_recorded', 'crown_received', 'embers_earned',
    ];
    for (const a of achievements) {
      expect(VALID_KINDS).toContain(a.criteria.kind);
    }
  });

  it('getAllAchievements returns the full set', () => {
    expect(getAllAchievements()).toBe(achievements);
  });

  it('getAchievementById finds known achievements', () => {
    const first = achievements[0];
    if (first) {
      expect(getAchievementById(first.id)?.id).toBe(first.id);
    }
    expect(getAchievementById('nonexistent')).toBeUndefined();
  });
});

describe('bundled content — stations', () => {
  it('has exactly 10 stations', () => {
    expect(stations).toHaveLength(10);
  });

  it('has unique station ids', () => {
    const ids = stations.map((s) => s.id);
    expect(new Set(ids).size).toBe(ids.length);
  });

  it('has a station for 0 arcs cleared (initiate)', () => {
    const initiate = getStationForArcsCleared(0);
    expect(initiate?.arcsCleared).toBe(0);
  });

  it('has a station for 9 arcs cleared (crowned)', () => {
    const top = getStationForArcsCleared(9);
    expect(top?.arcsCleared).toBe(9);
  });

  it('covers arcs 0-9 without gaps', () => {
    const arcsValues = new Set(stations.map((s) => s.arcsCleared));
    for (let i = 0; i <= 9; i++) {
      expect(arcsValues.has(i)).toBe(true);
    }
  });

  it('getAllStations returns all 10', () => {
    expect(getAllStations()).toHaveLength(10);
  });
});

describe('bundled content — daily enrichment', () => {
  it('every day has a non-empty invocation and archetypeExpression', () => {
    for (const day of dailyPath) {
      expect(day.invocation.trim().length).toBeGreaterThan(0);
      expect(day.archetypeExpression.trim().length).toBeGreaterThan(0);
    }
  });

  it('every day has a non-empty crownFragment', () => {
    for (const day of dailyPath) {
      expect(day.crownFragment?.trim().length ?? 0).toBeGreaterThan(0);
    }
  });

  it('night_warning and lapse_medicine days carry a safety guardrail', () => {
    for (const day of dailyPath) {
      if (day.secretContentType === 'night_warning' || day.secretContentType === 'lapse_medicine') {
        expect(day.safetyGuardrail?.trim().length ?? 0).toBeGreaterThan(0);
      }
    }
  });

  it('every day maps to a lineage passage', () => {
    for (const day of dailyPath) {
      expect(day.lineagePassageId).toBeTruthy();
    }
  });
});

describe('bundled content — lineage passages', () => {
  it('has unique ids', () => {
    const ids = lineagePassages.map((p) => p.id);
    expect(new Set(ids).size).toBe(ids.length);
  });

  it('every day lineagePassageId resolves to a passage', () => {
    for (const day of dailyPath) {
      if (day.lineagePassageId) {
        expect(getLineagePassage(day.lineagePassageId)).toBeDefined();
      }
    }
  });

  it('verbatim passages cite a public-domain source on the allowlist', () => {
    const allow = PUBLIC_DOMAIN_SOURCE_HOSTS;
    for (const p of lineagePassages) {
      if (p.verbatim) {
        expect(p.sourceUrl).toBeTruthy();
        expect(p.work.length).toBeGreaterThan(0);
        const host = new URL(p.sourceUrl as string).host;
        expect(allow.some((h) => host === h || host.endsWith(`.${h}`))).toBe(true);
      }
    }
  });

  it('synthesis passages are never presented as a sourced quotation', () => {
    for (const p of lineagePassages) {
      if (!p.verbatim) {
        expect(p.sourceUrl).toBeNull();
        expect(p.attribution.length).toBeGreaterThan(0);
      }
    }
  });
});

describe('bundled content — crown codex', () => {
  it('every crown codex item has a Long Path touchpoint', () => {
    for (const item of crownCodex) {
      expect(item.longPathTouchpoint.trim().length).toBeGreaterThan(0);
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
        rites,
        onboardingSteps,
        getSafetyDisclaimer(),
        getSafetyResources(),
        copy,
      ],
      strings,
    );

    collectStrings([arcs, crownCodex, trials, achievements, stations, lineagePassages], strings);

    const offenders = strings.flatMap((text) =>
      scanForUnsafeLanguage(text).map((term) => `"${term}" found in: ${text.slice(0, 80)}`),
    );

    expect(offenders).toEqual([]);
  });
});
