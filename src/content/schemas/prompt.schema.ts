import { z } from 'zod';

/** Journal prompt types — aligned with the journal entry types. */
export const PROMPT_TYPES = [
  'morning',
  'evening',
  'urge',
  'lapse',
  'study_reflection',
  'freeform',
] as const;
export const promptTypeSchema = z.enum(PROMPT_TYPES);
export type PromptType = z.infer<typeof promptTypeSchema>;

export const journalPromptSchema = z.object({
  id: z.string().min(1),
  type: promptTypeSchema,
  text: z.string().min(1),
});
export type JournalPrompt = z.infer<typeof journalPromptSchema>;

export const journalPromptsSchema = z.array(journalPromptSchema).min(1);
