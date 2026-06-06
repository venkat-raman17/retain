import { codexEntries as codexData } from './bundled/codex';
import { disclaimer as disclaimerData } from './bundled/disclaimer';
import { onboardingSteps as onboardingData } from './bundled/onboarding';
import { practices as practicesData } from './bundled/practices';
import { principles as principlesData } from './bundled/principles';
import {
  codexSchema,
  disclaimerSchema,
  onboardingSchema,
  practicesSchema,
  principlesSchema,
  type CodexEntry,
  type Disclaimer,
  type OnboardingStep,
  type Practice,
  type Principle,
} from './schemas';

/**
 * Single entry point for bundled content. Each collection is validated against
 * its schema at load time, so malformed content fails fast (and is caught by the
 * content test) rather than rendering broken UI.
 */
export const principles: readonly Principle[] = principlesSchema.parse(principlesData);
export const onboardingSteps: readonly OnboardingStep[] = onboardingSchema.parse(onboardingData);
export const codexEntries: readonly CodexEntry[] = codexSchema.parse(codexData);
export const practices: readonly Practice[] = practicesSchema.parse(practicesData);
export const disclaimer: Disclaimer = disclaimerSchema.parse(disclaimerData);

export function getCodexEntry(id: string): CodexEntry | undefined {
  return codexEntries.find((entry) => entry.id === id);
}

export function getPractice(id: string): Practice | undefined {
  return practices.find((practice) => practice.id === id);
}

export { copy } from './bundled/copy';
export type { Copy } from './bundled/copy';
export type {
  Principle,
  OnboardingStep,
  CodexEntry,
  CodexCategory,
  Practice,
  PracticeCategory,
  Disclaimer,
} from './schemas';
