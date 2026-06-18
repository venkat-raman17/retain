import { useEffect } from 'react';

import { systemClock } from '@/shared/lib';
import { useRepositories } from '@/shared/storage';

import { buildReminderPlan } from '../domain/reminder-plan';
import { rescheduleNotifications } from '../services/notification-scheduler';

/**
 * Refreshes the rolling window of scheduled notifications at app start. The OS
 * clears scheduled local notifications after a reboot, and the per-day window
 * needs recomputing as the path advances, so this re-schedules once on mount
 * from the persisted reminder preference + the current path. Renders nothing.
 */
export function RemindersHydrator() {
  const { settings, profile: profileRepo } = useRepositories();

  useEffect(() => {
    async function hydrate() {
      const [prefs, profile] = await Promise.all([settings.getPreferences(), profileRepo.get()]);
      const plan = buildReminderPlan(
        prefs.remindersEnabled,
        profile.currentPathStartedAt,
        systemClock,
      );
      await rescheduleNotifications(plan);
    }
    void hydrate();
  }, [settings, profileRepo]);

  return null;
}
