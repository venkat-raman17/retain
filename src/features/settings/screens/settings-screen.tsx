import { useRouter } from 'expo-router';
import { StyleSheet, Switch, View } from 'react-native';

import { copy } from '@/content';
import { AppText, Button, Card, Divider, Screen, ScreenHeader } from '@/shared/components';
import { theme } from '@/shared/design';
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
  const { settings, update } = useSettings();

  return (
    <Screen scroll>
      <View style={styles.container}>
        <ScreenHeader
          eyebrow={copy.settings.eyebrow}
          title={copy.settings.title}
          subtitle={copy.settings.description}
        />

        <Card padded={false} style={styles.group}>
          <ToggleRow
            label="Haptics"
            description="Subtle vibration feedback"
            value={settings?.hapticsEnabled ?? true}
            onValueChange={(next) => void update({ hapticsEnabled: next })}
          />
          <Divider inset />
          <ToggleRow
            label="Gentle reminders"
            description="Local nudges to return to the practice"
            value={settings?.remindersEnabled ?? false}
            onValueChange={(next) => void update({ remindersEnabled: next })}
          />
        </Card>

        <Button
          label={copy.actions.viewSafety}
          variant="secondary"
          fullWidth
          onPress={() => router.push(Routes.safety)}
        />

        <AppText variant="caption" color="muted" align="center">
          No account · No tracking · Fully offline · v1
        </AppText>
      </View>
    </Screen>
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
