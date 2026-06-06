import { z } from 'zod';

import { createId, type Clock } from '@/shared/lib';
import { toIsoDateTime } from '@/shared/utils';

/**
 * Journal domain model (pure, platform-free). Structured and prompt-led: every
 * entry has a type, and may reference a bundled prompt. Lapse entries are never
 * shamed (see docs/CONTENT_SAFETY.md).
 */
export const JOURNAL_TYPES = [
  'morning',
  'evening',
  'urge',
  'lapse',
  'return',
  'freeform',
  'study_reflection',
] as const;
export const journalTypeSchema = z.enum(JOURNAL_TYPES);
export type JournalType = z.infer<typeof journalTypeSchema>;

export const journalEntrySchema = z.object({
  id: z.string().min(1),
  createdAt: z.string().datetime(),
  updatedAt: z.string().datetime(),
  type: journalTypeSchema,
  promptId: z.string().min(1).nullable(),
  title: z.string().max(200).nullable(),
  body: z.string().min(1).max(10000),
  mood: z.number().int().min(1).max(5).nullable(),
});
export type JournalEntry = z.infer<typeof journalEntrySchema>;

export const journalEntryDraftSchema = z.object({
  type: journalTypeSchema.default('freeform'),
  promptId: z.string().min(1).nullable().default(null),
  title: z.string().trim().max(200).nullable().default(null),
  body: z.string().trim().min(1, 'Write a few words first.').max(10000),
  mood: z.number().int().min(1).max(5).nullable().default(null),
});
export type JournalEntryDraft = z.input<typeof journalEntryDraftSchema>;

export function createJournalEntry(draft: JournalEntryDraft, clock: Clock): JournalEntry {
  const parsed = journalEntryDraftSchema.parse(draft);
  const now = toIsoDateTime(clock.now());
  return journalEntrySchema.parse({
    id: createId(),
    createdAt: now,
    updatedAt: now,
    type: parsed.type,
    promptId: parsed.promptId,
    title: parsed.title,
    body: parsed.body,
    mood: parsed.mood,
  });
}

export function updateJournalEntry(
  entry: JournalEntry,
  patch: { title?: string | null; body?: string; mood?: number | null },
  clock: Clock,
): JournalEntry {
  return journalEntrySchema.parse({
    ...entry,
    ...patch,
    updatedAt: toIsoDateTime(clock.now()),
  });
}
