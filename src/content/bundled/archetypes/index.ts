import type { ArchetypeProfile } from '../../schemas';

import { archetypes01to15 } from './arch-01-15';
import { archetypes16to30 } from './arch-16-30';
import { archetypes31to60 } from './arch-31-60';
import { archetypes61to90 } from './arch-61-90';

/**
 * One unique archetype per path day (90 total). Each is the identity the man
 * "becomes" that day and never repeats. Referenced by slug (`arch-01`…`arch-90`)
 * from the matching daily-path entry; the per-day color and focal sigil are
 * derived from the day/arc, so a profile is pure copy. The shadow is named
 * honestly but never endorsed (see docs/CONTENT_SAFETY.md).
 */
export const archetypeProfiles: readonly ArchetypeProfile[] = [
  ...archetypes01to15,
  ...archetypes16to30,
  ...archetypes31to60,
  ...archetypes61to90,
];
