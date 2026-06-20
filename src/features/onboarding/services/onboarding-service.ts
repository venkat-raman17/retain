import { PathService } from '@/features/path/services/path-service';
import type {
  PathRepository,
  SettingsRepository,
  UserProfileRepository,
} from '@/db';
import type { Clock } from '@/shared/lib';

import { type OnboardingDraft } from '../domain/onboarding';

/**
 * Persists onboarding choices and starts the path.
 */
export class OnboardingService {
  private readonly pathService: PathService;
  private readonly profiles: UserProfileRepository;
  private readonly settings: SettingsRepository;

  constructor(
    profiles: UserProfileRepository,
    path: PathRepository,
    settings: SettingsRepository,
    clock: Clock,
  ) {
    this.profiles = profiles;
    this.settings = settings;
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

    await this.pathService.startPath(draft.offsetDays);
  }
}
