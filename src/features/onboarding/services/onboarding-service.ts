import { createBoundary } from '@/features/boundaries/domain/boundary';
import { PathService } from '@/features/path/services/path-service';
import type {
  BoundaryRepository,
  PathRepository,
  SettingsRepository,
  UserProfileRepository,
} from '@/db';
import type { Clock } from '@/shared/lib';

import { BOUNDARY_CUSTOM, BOUNDARY_SKIP, type OnboardingDraft } from '../domain/onboarding';

/**
 * Persists onboarding choices, creates first boundary if chosen, starts the path.
 */
export class OnboardingService {
  private readonly pathService: PathService;
  private readonly profiles: UserProfileRepository;
  private readonly boundaries: BoundaryRepository;
  private readonly settings: SettingsRepository;
  private readonly clock: Clock;

  constructor(
    profiles: UserProfileRepository,
    path: PathRepository,
    boundaries: BoundaryRepository,
    settings: SettingsRepository,
    clock: Clock,
  ) {
    this.profiles = profiles;
    this.boundaries = boundaries;
    this.settings = settings;
    this.clock = clock;
    this.pathService = new PathService(profiles, path, clock);
  }

  async complete(draft: OnboardingDraft): Promise<void> {
    const selectedVow = draft.vowPresetId === 'custom' ? null : draft.vowPresetId;
    const customVow = draft.vowPresetId === 'custom' ? (draft.customVow ?? null) : null;

    await this.profiles.update({
      selectedVow,
      customVow,
      onboardingCompleted: true,
    });

    await this.settings.updatePreferences({
      primaryIntention: draft.intention,
      preferredForgeCategory: draft.forgeCategory,
      safetyAcknowledged: true,
    });

    if (
      draft.boundaryChoice !== null &&
      draft.boundaryChoice !== BOUNDARY_SKIP &&
      draft.boundaryChoice !== ''
    ) {
      const title =
        draft.boundaryChoice === BOUNDARY_CUSTOM
          ? (draft.customBoundaryTitle ?? '').trim()
          : draft.boundaryChoice;

      if (title.length > 0) {
        const boundary = createBoundary({ title, description: null }, this.clock);
        await this.boundaries.save(boundary);
      }
    }

    await this.pathService.startPath();
  }
}
