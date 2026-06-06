import { archetypeProfiles as archetypeData } from './bundled/archetypes';
import { arcs as arcsData } from './bundled/arcs';
import { codexDays as codexData } from './bundled/codex';
import { crownCodex as crownCodexData } from './bundled/crown-codex';
import { dailyPathContent as dailyPathData } from './bundled/daily-path';
import { onboardingSteps as onboardingData } from './bundled/onboarding';
import { principles as principlesData } from './bundled/principles';
import { journalPrompts as promptsData } from './bundled/prompts';
import { rites as ritesData } from './bundled/rites';
import { rituals as ritualsData } from './bundled/rituals';
import { safetyContent as safetyData } from './bundled/safety';
import { studies as studiesData } from './bundled/studies';
import {
  archetypeProfilesSchema,
  arcsSchema,
  codexSchema,
  crownCodexSchema,
  dailyPathContentsSchema,
  journalPromptsSchema,
  onboardingSchema,
  principlesSchema,
  ritesSchema,
  ritualsSchema,
  safetyContentSchema,
  studiesSchema,
  type Arc,
  type ArchetypeProfile,
  type CodexDay,
  type CrownCodexItem,
  type DailyPathContent,
  type JournalPrompt,
  type OnboardingStep,
  type PathSeason,
  type Principle,
  type PromptType,
  type Rite,
  type Ritual,
  type SafetyDisclaimer,
  type SafetyResources,
  type Study,
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
export const crownCodex: readonly CrownCodexItem[] = crownCodexSchema.parse(crownCodexData);
export const studies: readonly Study[] = studiesSchema.parse(studiesData);
export const rituals: readonly Ritual[] = ritualsSchema.parse(ritualsData);
export const journalPrompts: readonly JournalPrompt[] = journalPromptsSchema.parse(promptsData);
export const rites: readonly Rite[] = ritesSchema.parse(ritesData);
export const onboardingSteps: readonly OnboardingStep[] = onboardingSchema.parse(onboardingData);
const safety = safetyContentSchema.parse(safetyData);

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

// --- Codex loaders ---

export function getAllCodexDays(): readonly CodexDay[] {
  return codexDays;
}

export function getDailyCodexDay(dayNumber: number): CodexDay | undefined {
  return codexDays.find((day) => day.dayNumber === dayNumber);
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

export function getPromptByType(type: PromptType): readonly JournalPrompt[] {
  return journalPrompts.filter((prompt) => prompt.type === type);
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

export { copy } from './bundled/copy';
export type { Copy } from './bundled/copy';
export type {
  Arc,
  Archetype,
  ArchetypeProfile,
  ContentStatus,
  CrownCodexCategory,
  CrownCodexItem,
  DailyPathContent,
  PathSeason,
  SecretContentType,
  Principle,
  CodexDay,
  Study,
  StudyLineage,
  Ritual,
  RitualTime,
  JournalPrompt,
  PromptType,
  Rite,
  SafetyDisclaimer,
  SafetyResources,
  SafetyContent,
  OnboardingStep,
} from './schemas';
