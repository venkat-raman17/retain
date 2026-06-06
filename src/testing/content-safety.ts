/**
 * Content-safety guardrail. Scans bundled, user-facing copy for degrading or
 * abusive language that must never appear (see the content rules in CLAUDE.md).
 *
 * The list targets words with no acceptable use in this product's voice. Note
 * that anti-shame *discussion* (e.g. "this practice refuses shame") is allowed on
 * purpose — the goal is to block contempt, not to censor the topic.
 */
export const UNSAFE_TERMS: readonly string[] = [
  'disgust',
  'disgusting',
  'filthy',
  'dirty',
  'pathetic',
  'worthless',
  'loser',
  'pervert',
  'degenerate',
  'impure',
  'unclean',
  'sinful',
  'subhuman',
  'freak',
  'slut',
  'whore',
];

/** Returns the unsafe terms found in `text` (whole-word, case-insensitive). */
export function scanForUnsafeLanguage(text: string): string[] {
  return UNSAFE_TERMS.filter((term) => new RegExp(`\\b${term}\\b`, 'i').test(text));
}
