import * as Haptics from 'expo-haptics';

import { haptics, setHapticsEnabled } from './haptics';

// jest hoists this above the imports; the mock applies to the import of `haptics`.
jest.mock('expo-haptics', () => ({
  impactAsync: jest.fn(() => Promise.resolve()),
  selectionAsync: jest.fn(() => Promise.resolve()),
  notificationAsync: jest.fn(() => Promise.resolve()),
  ImpactFeedbackStyle: { Light: 'light', Medium: 'medium', Heavy: 'heavy' },
  NotificationFeedbackType: { Success: 'success', Warning: 'warning', Error: 'error' },
}));

describe('haptics gate', () => {
  it('stays silent when the preference is off', () => {
    setHapticsEnabled(false);
    haptics.impact('light');
    haptics.selection();
    haptics.notify('success');
    expect(Haptics.impactAsync).not.toHaveBeenCalled();
    expect(Haptics.selectionAsync).not.toHaveBeenCalled();
    expect(Haptics.notificationAsync).not.toHaveBeenCalled();
  });

  it('fires the mapped feedback when the preference is on', () => {
    setHapticsEnabled(true);
    haptics.impact('medium');
    haptics.notify('success');
    expect(Haptics.impactAsync).toHaveBeenCalledWith('medium');
    expect(Haptics.notificationAsync).toHaveBeenCalledWith('success');
  });
});
