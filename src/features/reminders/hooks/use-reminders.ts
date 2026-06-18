import { useCallback, useEffect, useState } from 'react';

import { systemClock } from '@/shared/lib';
import { useRepositories } from '@/shared/storage';

import { buildReminderPlan } from '../domain/reminder-plan';
import {
  cancelAllNotifications,
  requestNotificationPermission,
  rescheduleNotifications,
  type PermissionResult,
} from '../services/notification-scheduler';

export interface ReminderState {
  enabled: boolean;
  permissionGranted: boolean | null;
}

export interface UseReminders {
  state: ReminderState | null;
  loading: boolean;
  /** Enable reminders — requests permission, then schedules. */
  enable: () => Promise<PermissionResult>;
  /** Disable reminders and cancel all. */
  disable: () => Promise<void>;
}

export function useReminders(): UseReminders {
  const { settings, profile: profileRepo } = useRepositories();
  const [state, setState] = useState<ReminderState | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let active = true;
    settings
      .getPreferences()
      .then((prefs) => {
        if (!active) return;
        setState({ enabled: prefs.remindersEnabled, permissionGranted: null });
        setLoading(false);
      })
      .catch(() => {
        if (active) setLoading(false);
      });
    return () => {
      active = false;
    };
  }, [settings]);

  const reschedule = useCallback(
    async (enabled: boolean) => {
      const profile = await profileRepo.get();
      const plan = buildReminderPlan(enabled, profile.currentPathStartedAt, systemClock);
      await rescheduleNotifications(plan);
    },
    [profileRepo],
  );

  const enable = useCallback(async (): Promise<PermissionResult> => {
    const result = await requestNotificationPermission();
    await settings.updatePreferences({ remindersEnabled: true });
    setState({ enabled: true, permissionGranted: result.granted });
    if (result.granted) await reschedule(true);
    return result;
  }, [settings, reschedule]);

  const disable = useCallback(async (): Promise<void> => {
    await settings.updatePreferences({ remindersEnabled: false });
    await cancelAllNotifications();
    setState((prev) => (prev ? { ...prev, enabled: false } : prev));
  }, [settings]);

  return { state, loading, enable, disable };
}
