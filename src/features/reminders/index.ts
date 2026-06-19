export { useReminders } from './hooks/use-reminders';
export type { UseReminders, ReminderState } from './hooks/use-reminders';
export { RemindersHydrator } from './components/reminders-hydrator';
export {
  buildReminderPlan,
  REMINDER_HOUR,
  EVENING_HOUR,
  REMINDER_WINDOW_DAYS,
} from './domain/reminder-plan';
export type { ReminderDescriptor } from './domain/reminder-plan';
export {
  requestNotificationPermission,
  cancelAllNotifications,
  rescheduleNotifications,
} from './services/notification-scheduler';
export type { PermissionResult } from './services/notification-scheduler';
