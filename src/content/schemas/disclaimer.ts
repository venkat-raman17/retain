import { z } from 'zod';

/**
 * The non-medical disclaimer shown in onboarding and the Safety screen. Bumping
 * `version` lets the app re-surface it for re-acknowledgement if wording changes.
 */
export const disclaimerSchema = z.object({
  version: z.number().int().min(1),
  title: z.string().min(1),
  paragraphs: z.array(z.string().min(1)).min(1),
  supportNote: z.string().min(1),
});
export type Disclaimer = z.infer<typeof disclaimerSchema>;
