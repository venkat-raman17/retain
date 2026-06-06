import { useMemo } from 'react';

import { systemClock } from '@/shared/lib';
import { useRepositories } from '@/shared/storage';

import type { OnboardingDraft } from '../domain/onboarding';
import { OnboardingService } from '../services/onboarding-service';

/**
 * Hook boundary over {@link OnboardingService}. The onboarding screen commits
 * its draft through this callback rather than constructing the service itself.
 */
export interface UseOnboarding {
  complete: (draft: OnboardingDraft) => Promise<void>;
}

export function useOnboarding(): UseOnboarding {
  const repos = useRepositories();
  const service = useMemo(
    () =>
      new OnboardingService(
        repos.profile,
        repos.path,
        repos.boundary,
        repos.settings,
        systemClock,
      ),
    [repos],
  );

  return useMemo(() => ({ complete: (draft: OnboardingDraft) => service.complete(draft) }), [service]);
}
