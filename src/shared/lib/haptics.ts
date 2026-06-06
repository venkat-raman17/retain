import * as Haptics from 'expo-haptics';

/**
 * Tactile feedback, gated by the user's Haptics preference.
 *
 * The enabled flag is a module-level mirror of the persisted setting (hydrated at
 * startup and updated when the toggle changes) so any code can fire a tap without
 * reaching into the database or causing re-renders. All calls are fire-and-forget
 * and no-op when disabled or unsupported (e.g. web).
 *
 * Intensity guide: `impact('light')` for taps, `selection()` for picking among
 * options, `impact('medium')` for a meaningful beat (a breath), `notify('success')`
 * for a completed practice act. Never fire on a lapse — the man is never the enemy.
 */
let enabled = true;

/** Sync the gate to the persisted preference. */
export function setHapticsEnabled(value: boolean): void {
  enabled = value;
}

export const haptics = {
  impact(style: 'light' | 'medium' | 'heavy' = 'light'): void {
    if (!enabled) return;
    const map = {
      light: Haptics.ImpactFeedbackStyle.Light,
      medium: Haptics.ImpactFeedbackStyle.Medium,
      heavy: Haptics.ImpactFeedbackStyle.Heavy,
    } as const;
    void Haptics.impactAsync(map[style]).catch(() => undefined);
  },

  selection(): void {
    if (!enabled) return;
    void Haptics.selectionAsync().catch(() => undefined);
  },

  notify(type: 'success' | 'warning' | 'error' = 'success'): void {
    if (!enabled) return;
    const map = {
      success: Haptics.NotificationFeedbackType.Success,
      warning: Haptics.NotificationFeedbackType.Warning,
      error: Haptics.NotificationFeedbackType.Error,
    } as const;
    void Haptics.notificationAsync(map[type]).catch(() => undefined);
  },
};
