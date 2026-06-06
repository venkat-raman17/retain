import { z } from 'zod';

export const CONTENT_TYPES = [
  'codex_day',
  'study',
  'ritual',
  'rite',
  'principle',
  'archetype',
] as const;
export const contentTypeSchema = z.enum(CONTENT_TYPES);
export type ContentType = z.infer<typeof contentTypeSchema>;

export const CONTENT_STATUSES = ['unread', 'opened', 'completed'] as const;
export const contentStatusSchema = z.enum(CONTENT_STATUSES);
export type ContentStatus = z.infer<typeof contentStatusSchema>;

export const contentProgressSchema = z.object({
  id: z.string().min(1),
  contentId: z.string().min(1),
  contentType: contentTypeSchema,
  status: contentStatusSchema,
  firstOpenedAt: z.string().datetime().nullable(),
  completedAt: z.string().datetime().nullable(),
});
export type ContentProgress = z.infer<typeof contentProgressSchema>;
