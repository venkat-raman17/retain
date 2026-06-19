import { achievements as achievementsData } from './bundled/achievements';
import { archetypeProfiles as archetypeData } from './bundled/archetypes';
import { arcs as arcsData } from './bundled/arcs';
import { codexDays as codexData } from './bundled/codex';
import { crownCodex as crownCodexData } from './bundled/crown-codex';
import { dailyPathContent as dailyPathData } from './bundled/daily-path';
import { lineagePassages as lineageData } from './bundled/lineage';
import { onboardingSteps as onboardingData } from './bundled/onboarding';
import { principles as principlesData } from './bundled/principles';
import { rites as ritesData } from './bundled/rites';
import { rituals as ritualsData } from './bundled/rituals';
import { safetyContent as safetyData } from './bundled/safety';
import { stations as stationsData } from './bundled/stations';
import { studies as studiesData } from './bundled/studies';
import { trials as trialsData } from './bundled/trials';
import {
  achievementsSchema,
  archetypeProfilesSchema,
  arcsSchema,
  codexSchema,
  crownCodexSchema,
  dailyPathContentsSchema,
  lineagePassagesSchema,
  onboardingSchema,
  principlesSchema,
  ritesSchema,
  ritualsSchema,
  safetyContentSchema,
  stationsSchema,
  studiesSchema,
  trialsSchema,
  type Achievement,
  type Arc,
  type ArchetypeProfile,
  type CodexDay,
  type CrownCodexItem,
  type DailyPathContent,
  type LineagePassage,
  type OnboardingStep,
  type PathSeason,
  type Principle,
  type Rite,
  type Ritual,
  type SafetyDisclaimer,
  type SafetyResources,
  type Station,
  type Study,
  type Trial,
} from './schemas';

/**
 * Single entry point for bundled content. Every collection is validated against
 * its Zod schema at load time so malformed content fails fast and is caught by
 * the content test. Content is read ONLY through these loaders — never the DB.
 */
export const principles: readonly Principle[] = principlesSchema.parse(principlesData);
export const archetypeProfiles: readonly ArchetypeProfile[] =
  archetypeProfilesSchema.parse(archetypeData);
export const codexDays: readonly CodexDay[] = codexSchema.parse(codexData);
export const dailyPath: readonly DailyPathContent[] = dailyPathContentsSchema.parse(dailyPathData);
export const arcs: readonly Arc[] = arcsSchema.parse(arcsData);
export const lineagePassages: readonly LineagePassage[] = lineagePassagesSchema.parse(lineageData);
export const crownCodex: readonly CrownCodexItem[] = crownCodexSchema.parse(crownCodexData);
export const studies: readonly Study[] = studiesSchema.parse(studiesData);
export const rituals: readonly Ritual[] = ritualsSchema.parse(ritualsData);
export const rites: readonly Rite[] = ritesSchema.parse(ritesData);
export const onboardingSteps: readonly OnboardingStep[] = onboardingSchema.parse(onboardingData);
const safety = safetyContentSchema.parse(safetyData);
export const trials: readonly Trial[] = trialsSchema.parse(trialsData);
export const achievements: readonly Achievement[] = achievementsSchema.parse(achievementsData);
export const stations: readonly Station[] = stationsSchema.parse(stationsData);

// --- Daily path loaders ---

export function getPrinciples(): readonly Principle[] {
  return principles;
}

export function getArchetypeProfile(id: string): ArchetypeProfile | undefined {
  return archetypeProfiles.find((a) => a.id === id);
}

export function getAllDailyPath(): readonly DailyPathContent[] {
  return dailyPath;
}

export function getDailyPathContent(dayNumber: number): DailyPathContent | undefined {
  return dailyPath.find((day) => day.dayNumber === dayNumber);
}

export function getDailyPathForSeason(season: PathSeason): readonly DailyPathContent[] {
  return dailyPath.filter((day) => day.season === season);
}

export function getArcForDay(dayNumber: number): Arc | undefined {
  return arcs.find((a) => dayNumber >= a.dayStart && dayNumber <= a.dayEnd);
}

export function getArcByNumber(arcNumber: number): Arc | undefined {
  return arcs.find((a) => a.arcNumber === arcNumber);
}

// --- Lineage loaders ---

export function getAllLineagePassages(): readonly LineagePassage[] {
  return lineagePassages;
}

export function getLineagePassage(id: string): LineagePassage | undefined {
  return lineagePassages.find((p) => p.id === id);
}

// --- Codex loaders ---

export function getAllCodexDays(): readonly CodexDay[] {
  return codexDays;
}

export function getDailyCodexDay(dayNumber: number): CodexDay | undefined {
  return codexDays.find((day) => day.dayNumber === dayNumber);
}

/**
 * Codex day chosen by an arbitrary rotation index, wrapping over the cycle. Pure
 * (no clock): the caller decides whether to rotate by path day or calendar day.
 * Surfaces the otherwise-buried daily codex onto the home.
 */
export function getCodexDayByIndex(index: number): CodexDay | undefined {
  if (codexDays.length === 0) return undefined;
  const i = ((Math.trunc(index) % codexDays.length) + codexDays.length) % codexDays.length;
  return codexDays[i];
}

export function getAllStudies(): readonly Study[] {
  return studies;
}

export function getStudyById(id: string): Study | undefined {
  return studies.find((study) => study.id === id);
}

export function getAllRituals(): readonly Ritual[] {
  return rituals;
}

export function getRitualById(id: string): Ritual | undefined {
  return rituals.find((ritual) => ritual.id === id);
}

export function getMilestoneRite(dayNumber: number): Rite | undefined {
  return rites.find((rite) => rite.milestoneDay === dayNumber);
}

export function getMilestoneRiteById(id: string): Rite | undefined {
  return rites.find((rite) => rite.id === id);
}

export function getSafetyDisclaimer(): SafetyDisclaimer {
  return safety.disclaimer;
}

export function getSafetyResources(): SafetyResources {
  return safety.resources;
}

// --- Crown Codex loaders ---

export function getAllCrownCodex(): readonly CrownCodexItem[] {
  return crownCodex;
}

export function getCrownCodexById(id: string): CrownCodexItem | undefined {
  return crownCodex.find((item) => item.id === id);
}

/** Rotate the crown-codex by index (e.g. long-path day), wrapping around. */
export function getCrownCodexByIndex(index: number): CrownCodexItem | undefined {
  if (crownCodex.length === 0) return undefined;
  const i = ((Math.trunc(index) % crownCodex.length) + crownCodex.length) % crownCodex.length;
  return crownCodex[i];
}

// --- Trials / quest loaders ---

export function getAllTrials(): readonly Trial[] {
  return trials;
}

export function getTrialForDay(dayNumber: number | 'crown'): Trial | undefined {
  return trials.find((t) => t.dayNumber === dayNumber);
}

// --- Achievements loaders ---

export function getAllAchievements(): readonly Achievement[] {
  return achievements;
}

export function getAchievementById(id: string): Achievement | undefined {
  return achievements.find((a) => a.id === id);
}

// --- Stations loaders ---

export function getAllStations(): readonly Station[] {
  return stations;
}

export function getStationForArcsCleared(cleared: number): Station | undefined {
  return [...stations].reverse().find((s) => s.arcsCleared <= cleared);
}

export { copy } from './bundled/copy';
export type { Copy } from './bundled/copy';
export type {
  Achievement,
  AchievementCriteria,
  AchievementCriteriaKind,
  Arc,
  Archetype,
  ArchetypeProfile,
  ContentStatus,
  CrownCodexCategory,
  CrownCodexItem,
  DailyPathContent,
  LineagePassage,
  LineageTradition,
  ObjectiveKind,
  PathSeason,
  SecretContentType,
  Principle,
  CodexDay,
  Station,
  Study,
  StudyLineage,
  Ritual,
  RitualTime,
  Rite,
  SafetyDisclaimer,
  SafetyResources,
  SafetyContent,
  OnboardingStep,
  Trial,
  TrialObjective,
  TrialTier,
} from './schemas';
