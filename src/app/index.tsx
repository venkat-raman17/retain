import { useEffect, useState } from 'react';
import { Redirect } from 'expo-router';

import { Routes } from '@/navigation';
import { useRepositories } from '@/shared/storage';

/**
 * Entry route. Decides where the user lands based on local settings: onboarding
 * on first run, otherwise the Path. The data layer is already initialized by the
 * time this renders (see AppDataProvider).
 */
export default function BootRoute() {
  const { profile } = useRepositories();
  const [target, setTarget] = useState<string | null>(null);

  useEffect(() => {
    let active = true;
    void profile.get().then((value) => {
      if (active) {
        setTarget(value.onboardingCompleted ? Routes.path : Routes.onboarding);
      }
    });
    return () => {
      active = false;
    };
  }, [profile]);

  if (!target) return null;
  return <Redirect href={target} />;
}
