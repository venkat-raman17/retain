import { z } from 'zod';

export const CONTENT_TYPES = [
  'codex_day',
  'study',
  'ritual',
  'rite',
  'principle',
  'archetype',
  'daily_path',
  'crown_codex',
] as const;
export const contentTypeSchema = z.enum(CONTENT_TYPES);
export type ContentType = z.infer<typeof contentTypeSchema>;

export const CONTENT_STATUSES = ['unread', 'opened', 'revealed', 'completed'] as const;
export const contentStatusSchema = z.enum(CONTENT_STATUSES);
export type ContentStatus = z.infer<typeof contentStatusSchema>;

/**
 * Progress only ever moves forward. `markStatus` keeps the higher rank so that,
 * e.g., re-opening a finished day (which writes 'opened') never downgrades it
 * from 'completed'. Higher = further along.
 */
export const CONTENT_STATUS_RANK: Record<ContentStatus, number> = {
  unread: 0,
  opened: 1,
  revealed: 2,
  completed: 3,
};

export const contentProgressSchema = z.object({
  id: z.string().min(1),
  contentId: z.string().min(1),
  contentType: contentTypeSchema,
  status: contentStatusSchema,
  firstOpenedAt: z.string().datetime().nullable(),
  completedAt: z.string().datetime().nullable(),
});
export type ContentProgress = z.infer<typeof contentProgressSchema>;
