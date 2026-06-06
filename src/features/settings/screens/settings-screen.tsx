import { useRouter } from 'expo-router';
import { StyleSheet, Switch, View } from 'react-native';

import { copy } from '@/content';
import { AppText, AppButton, AppCard, AppDivider, AppScreen, AppHeader } from '@/shared/components';
import { theme } from '@/shared/design';
import { haptics, setHapticsEnabled } from '@/shared/lib';
import { Routes } from '@/navigation';

import { useSettings } from '../hooks/use-settings';

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
        trackColor={{ true: theme.colors.primary, false: theme.colors.surfaceOverlay }}
        thumbColor={theme.colors.textPrimary}
      />
    </View>
  );
}

export function SettingsScreen() {
  const router = useRouter();
  const { preferences, update } = useSettings();

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
              setHapticsEnabled(next); // take effect immediately, before the async write
              if (next) haptics.selection(); // a confirming tick when turning on
              void update({ hapticsEnabled: next });
            }}
          />
          <AppDivider inset />
          <ToggleRow
            label="Gentle reminders"
            description="Local nudges to return to the practice"
            value={preferences?.remindersEnabled ?? false}
            onValueChange={(next) => void update({ remindersEnabled: next })}
          />
        </AppCard>

        <AppButton
          label="Guard the gates"
          variant="secondary"
          fullWidth
          onPress={() => router.push(Routes.boundaries)}
        />

        <AppButton
          label={copy.actions.viewSafety}
          variant="ghost"
          fullWidth
          onPress={() => router.push(Routes.safety)}
        />

        <AppText variant="caption" color="muted" align="center">
          No account · No tracking · Fully offline · v1
        </AppText>
      </View>
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
