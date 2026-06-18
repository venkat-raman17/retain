import { Platform } from 'react-native';
import * as Notifications from 'expo-notifications';

import type { ReminderDescriptor } from '../domain/reminder-plan';

/**
 * Thin wrapper over expo-notifications. All scheduling is local-only and
 * opt-in. No push tokens, no project ID, no network calls ever.
 *
 * Gracefully no-ops when permission is denied — the app never blocks on this.
 */

export interface PermissionResult {
  granted: boolean;
  canAskAgain: boolean;
}

export async function requestNotificationPermission(): Promise<PermissionResult> {
  if (Platform.OS === 'web') return { granted: false, canAskAgain: false };

  const { status, canAskAgain } = await Notifications.getPermissionsAsync();
  if (status === 'granted') return { granted: true, canAskAgain: false };
  if (!canAskAgain) return { granted: false, canAskAgain: false };

  const result = await Notifications.requestPermissionsAsync();
  return {
    granted: result.status === 'granted',
    canAskAgain: result.canAskAgain,
  };
}

export async function cancelAllNotifications(): Promise<void> {
  if (Platform.OS === 'web') return;
  await Notifications.cancelAllScheduledNotificationsAsync();
}

/**
 * Cancel all existing scheduled notifications then re-schedule from the plan.
 * If the plan is empty (style 'off' or disabled), all notifications are just
 * cancelled. If permission is not granted, scheduling silently no-ops.
 */
export async function rescheduleNotifications(
  plan: ReminderDescriptor[],
): Promise<void> {
  if (Platform.OS === 'web') return;
  await cancelAllNotifications();
  if (plan.length === 0) return;

  const { status } = await Notifications.getPermissionsAsync();
  if (status !== 'granted') return;

  await Promise.all(
    plan.map((descriptor) =>
      Notifications.scheduleNotificationAsync({
        identifier: descriptor.identifier,
        content: {
          title: descriptor.title,
          body: descriptor.body,
          sound: true,
        },
        trigger: {
          type: Notifications.SchedulableTriggerInputTypes.DATE,
          date: descriptor.date,
        },
      }),
    ),
  );
}
