import { archetypeProfiles as archetypeData } from './bundled/archetypes';
import { codexDays as codexData } from './bundled/codex';
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
  codexSchema,
  dailyPathContentsSchema,
  journalPromptsSchema,
  onboardingSchema,
  principlesSchema,
  ritesSchema,
  ritualsSchema,
  safetyContentSchema,
  studiesSchema,
  type ArchetypeProfile,
  type CodexDay,
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
export const studies: readonly Study[] = studiesSchema.parse(studiesData);
export const rituals: readonly Ritual[] = ritualsSchema.parse(ritualsData);
export const journalPrompts: readonly JournalPrompt[] = journalPromptsSchema.parse(promptsData);
export const rites: readonly Rite[] = ritesSchema.parse(ritesData);
export const onboardingSteps: readonly OnboardingStep[] = onboardingSchema.parse(onboardingData);
const safety = safetyContentSchema.parse(safetyData);

// --- Loaders (the bundled-content API) ---

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

/** Returns all daily content for a given path season. */
export function getDailyPathForSeason(season: PathSeason): readonly DailyPathContent[] {
  return dailyPath.filter((day) => day.season === season);
}

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

export { copy } from './bundled/copy';
export type { Copy } from './bundled/copy';
export type {
  Archetype,
  ArchetypeProfile,
  DailyPathContent,
  PathSeason,
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
