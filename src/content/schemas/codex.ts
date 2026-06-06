import { z } from 'zod';

export const CODEX_CATEGORIES = ['principle', 'practice', 'science', 'mindset'] as const;
export const codexCategorySchema = z.enum(CODEX_CATEGORIES);
export type CodexCategory = z.infer<typeof codexCategorySchema>;

export const codexEntrySchema = z.object({
  id: z.string().min(1),
  title: z.string().min(1),
  category: codexCategorySchema,
  summary: z.string().min(1),
  body: z.string().min(1),
  readMinutes: z.number().int().min(1).max(60),
});
export type CodexEntry = z.infer<typeof codexEntrySchema>;

export const codexSchema = z.array(codexEntrySchema).min(1);
