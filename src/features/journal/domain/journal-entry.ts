import { z } from 'zod';

import type { Clock } from '@/shared/lib';
import { createId } from '@/shared/lib';
import { toIsoDateTime } from '@/shared/utils';

/**
 * Journal domain model. Pure and platform-free: no React, no SQLite. Validation
 * lives with the model so every entry — however it enters the system — is
 * well-formed. Persistence is handled by a repository, not here.
 */

export const JOURNAL_KINDS = ['reflection', 'gratitude', 'urge', 'insight'] as const;
export const journalKindSchema = z.enum(JOURNAL_KINDS);
export type JournalKind = z.infer<typeof journalKindSchema>;

export const journalEntrySchema = z.object({
  id: z.string().min(1),
  createdAt: z.string().datetime(),
  updatedAt: z.string().datetime(),
  kind: journalKindSchema,
  /** Optional 1–5 self-ratings; null when not recorded. */
  mood: z.number().int().min(1).max(5).nullable(),
  energy: z.number().int().min(1).max(5).nullable(),
  body: z.string().min(1).max(5000),
  tags: z.array(z.string().min(1)).max(12),
});
export type JournalEntry = z.infer<typeof journalEntrySchema>;

/** What a screen/form supplies; ids and timestamps are assigned by the domain. */
export const journalEntryDraftSchema = z.object({
  kind: journalKindSchema.default('reflection'),
  mood: z.number().int().min(1).max(5).nullable().default(null),
  energy: z.number().int().min(1).max(5).nullable().default(null),
  body: z.string().trim().min(1, 'Write a few words first.').max(5000),
  tags: z.array(z.string().trim().min(1)).max(12).default([]),
});
export type JournalEntryDraft = z.input<typeof journalEntryDraftSchema>;

export function createJournalEntry(draft: JournalEntryDraft, clock: Clock): JournalEntry {
  const parsed = journalEntryDraftSchema.parse(draft);
  const now = toIsoDateTime(clock.now());
  return journalEntrySchema.parse({
    id: createId(),
    createdAt: now,
    updatedAt: now,
    kind: parsed.kind,
    mood: parsed.mood,
    energy: parsed.energy,
    body: parsed.body,
    tags: parsed.tags,
  });
}
