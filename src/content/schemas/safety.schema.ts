import { z } from 'zod';

/** The non-medical disclaimer (versioned for re-acknowledgement). */
export const safetyDisclaimerSchema = z.object({
  version: z.number().int().min(1),
  title: z.string().min(1),
  paragraphs: z.array(z.string().min(1)).min(1),
  supportNote: z.string().min(1),
});
export type SafetyDisclaimer = z.infer<typeof safetyDisclaimerSchema>;

/**
 * Crisis / professional-help resources. Offline and global, so we never hardcode
 * a single country's hotline — we point to local services and trusted people.
 */
export const safetyResourcesSchema = z.object({
  title: z.string().min(1),
  intro: z.string().min(1),
  items: z.array(z.string().min(1)).min(1),
});
export type SafetyResources = z.infer<typeof safetyResourcesSchema>;

export const safetyContentSchema = z.object({
  disclaimer: safetyDisclaimerSchema,
  resources: safetyResourcesSchema,
});
export type SafetyContent = z.infer<typeof safetyContentSchema>;
