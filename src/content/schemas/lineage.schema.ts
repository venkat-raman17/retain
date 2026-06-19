import { z } from 'zod';

import { archetypeSchema } from './archetype.schema';

/**
 * Lineage passages — short wisdom passages from the philosophical/contemplative
 * traditions the practice draws on, mapped to a day's theme and archetype.
 *
 * Two strict rules keep this safe and lawful to bundle:
 *  1. `verbatim: true` entries are EXACT public-domain quotations. They MUST
 *     carry a real `attribution`, `work`, and a `sourceUrl` on the allowlist
 *     below (Project Gutenberg, sacred-texts, etc.). They are shown as quotes.
 *  2. `verbatim: false` entries are ORIGINAL synthesis written in the app's
 *     voice, *inspired by* a tradition — never presented as a real quotation.
 *     `attribution` is the tradition/voice, not a person; `sourceUrl` is null.
 *
 * Framed throughout as philosophical inspiration, never authority or proof, and
 * never as a medical claim. (See docs/CONTENT_SAFETY.md.)
 */
export const LINEAGE_TRADITIONS = [
  'stoic',
  'taoist',
  'buddhist',
  'monastic',
  'virtue_ethics',
  'confucian',
  'heroic',
] as const;
export const lineageTraditionSchema = z.enum(LINEAGE_TRADITIONS);
export type LineageTradition = z.infer<typeof lineageTraditionSchema>;

/**
 * Domains we trust to host genuine public-domain source texts. A verbatim
 * passage's `sourceUrl` host must end with one of these — enforced by test so a
 * copyrighted source can never slip into the bundle.
 */
export const PUBLIC_DOMAIN_SOURCE_HOSTS = [
  'gutenberg.org',
  'sacred-texts.com',
  'wikisource.org',
  'classics.mit.edu',
  'perseus.tufts.edu',
  'ccel.org',
] as const;

export const lineagePassageSchema = z
  .object({
    id: z.string().min(1),
    /** The passage text (an exact quotation when `verbatim`, else original synthesis). */
    text: z.string().min(1),
    /** Author/work for a verbatim quote, or the tradition's voice for synthesis. */
    attribution: z.string().min(1),
    /** Source work (e.g. "Meditations, 7.34"); empty for synthesis. */
    work: z.string().default(''),
    tradition: lineageTraditionSchema,
    /** Public-domain source URL — required when `verbatim`, null for synthesis. */
    sourceUrl: z.string().url().nullable().default(null),
    /** True = exact public-domain quotation; false = original, tradition-inspired. */
    verbatim: z.boolean().default(false),
    /** The day theme this passage speaks to (free text, matched to day content). */
    theme: z.string().default(''),
    archetype: archetypeSchema.nullable().default(null),
  })
  .refine((p) => !p.verbatim || (p.sourceUrl !== null && p.work.length > 0), {
    message: 'A verbatim passage must have a sourceUrl and a work citation.',
  });
export type LineagePassage = z.infer<typeof lineagePassageSchema>;

export const lineagePassagesSchema = z.array(lineagePassageSchema);
