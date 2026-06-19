import { useState } from 'react';
import { useRouter } from 'expo-router';
import { Alert, StyleSheet, Switch, View } from 'react-native';

import { copy } from '@/content';
import { useReminders } from '@/features/reminders/hooks/use-reminders';
import { AppText, AppButton, AppCard, AppDivider, AppScreen, AppHeader } from '@/shared/components';
import { theme } from '@/shared/design';
import { useTheme } from '@/shared/hooks/use-theme';
import { haptics, setHapticsEnabled } from '@/shared/lib';
import { Routes } from '@/navigation';

import { useSettings } from '../hooks/use-settings';
import { useAccount } from '../hooks/use-account';
import { VowEditorModal } from './vow-editor-modal';

function ToggleRow({
  label,
  description,
  value,
  onValueChange,
}: {
  label: string;
  description: string;
  value: boolean;
  onValueChange: (next: boolean) => void;
}) {
  const { colors } = useTheme();
  return (
    <View style={styles.row}>
      <View style={styles.rowText}>
        <AppText variant="label">{label}</AppText>
        <AppText variant="caption" color="muted">
          {description}
        </AppText>
      </View>
      <Switch
        value={value}
        onValueChange={onValueChange}
        trackColor={{ true: colors.primary, false: colors.surfaceOverlay }}
        thumbColor={colors.textPrimary}
      />
    </View>
  );
}

export function SettingsScreen() {
  const router = useRouter();
  const { preferences, update } = useSettings();
  const { state: reminderState, enable: enableReminders, disable: disableReminders } = useReminders();
  const { profile, setVow, restartPath, resetAll } = useAccount();
  const [vowOpen, setVowOpen] = useState(false);

  const remindersEnabled = reminderState?.enabled ?? preferences?.remindersEnabled ?? false;

  const confirmRestart = () => {
    Alert.alert(copy.settings.restartConfirmTitle, copy.settings.restartConfirmBody, [
      { text: copy.settings.cancel, style: 'cancel' },
      { text: copy.settings.restartConfirm, style: 'destructive', onPress: () => void restartPath() },
    ]);
  };

  const confirmDeleteAll = () => {
    Alert.alert(copy.settings.deleteConfirmTitle, copy.settings.deleteConfirmBody, [
      { text: copy.settings.cancel, style: 'cancel' },
      {
        text: copy.settings.deleteConfirm,
        style: 'destructive',
        onPress: () => {
          void (async () => {
            await resetAll();
            router.replace(Routes.onboarding);
          })();
        },
      },
    ]);
  };

  return (
    <AppScreen scroll>
      <View style={styles.container}>
        <AppHeader
          eyebrow={copy.settings.eyebrow}
          title={copy.settings.title}
          subtitle={copy.settings.description}
        />

        <AppCard padded={false} style={styles.group}>
          <ToggleRow
            label="Haptics"
            description="Subtle vibration feedback"
            value={preferences?.hapticsEnabled ?? true}
            onValueChange={(next) => {
              setHapticsEnabled(next);
              if (next) haptics.selection();
              void update({ hapticsEnabled: next });
            }}
          />
          <AppDivider inset />
          <ToggleRow
            label="Gentle reminders"
            description={copy.settings.remindersDescription}
            value={remindersEnabled}
            onValueChange={(next) => {
              if (next) {
                void enableReminders();
              } else {
                void disableReminders();
              }
            }}
          />
        </AppCard>

        {/* Practice — the vow and the path itself */}
        <AppText variant="caption" color="muted" uppercase>
          {copy.settings.practiceLabel}
        </AppText>
        <AppButton
          label={copy.settings.editVow}
          variant="secondary"
          fullWidth
          onPress={() => setVowOpen(true)}
        />
        <AppButton
          label="Guard the gates"
          variant="secondary"
          fullWidth
          onPress={() => router.push(Routes.boundaries)}
        />
        <AppButton
          label={copy.settings.restartPath}
          variant="ghost"
          fullWidth
          onPress={confirmRestart}
        />

        <AppButton
          label={copy.actions.viewSafety}
          variant="ghost"
          fullWidth
          onPress={() => router.push(Routes.safety)}
        />

        {/* Your data — fully on-device, and erasable */}
        <AppText variant="caption" color="muted" uppercase>
          {copy.settings.dataLabel}
        </AppText>
        <AppButton
          label={copy.settings.deleteAll}
          variant="ghost"
          fullWidth
          onPress={confirmDeleteAll}
        />

        <AppText variant="caption" color="muted" align="center">
          No account · No tracking · Fully offline · v1
        </AppText>
      </View>

      <VowEditorModal
        visible={vowOpen}
        profile={profile}
        onClose={() => setVowOpen(false)}
        onSave={setVow}
      />
    </AppScreen>
  );
}

const styles = StyleSheet.create({
  container: { gap: theme.spacing.lg },
  group: { paddingVertical: theme.spacing.xs },
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    gap: theme.spacing.md,
    paddingHorizontal: theme.spacing.lg,
    paddingVertical: theme.spacing.md,
  },
  rowText: { flex: 1, gap: 2 },
});
