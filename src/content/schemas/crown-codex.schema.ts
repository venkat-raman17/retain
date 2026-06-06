import { z } from 'zod';

/** Post-90 Long Path static content. Unlocked after the Crown is received. */
export const CROWN_CODEX_CATEGORIES = [
  'what_next',
  'maintenance',
  'warning',
  'service',
  'return',
  'long_path',
] as const;
export const crownCodexCategorySchema = z.enum(CROWN_CODEX_CATEGORIES);
export type CrownCodexCategory = z.infer<typeof crownCodexCategorySchema>;

export const crownCodexItemSchema = z.object({
  id: z.string().min(1),
  title: z.string().min(1),
  category: crownCodexCategorySchema,
  body: z.string().min(1),
  practice: z.string().min(1),
  reflectionPrompt: z.string().min(1),
  seal: z.string().min(1),
});
export type CrownCodexItem = z.infer<typeof crownCodexItemSchema>;

export const crownCodexSchema = z.array(crownCodexItemSchema).min(1);
