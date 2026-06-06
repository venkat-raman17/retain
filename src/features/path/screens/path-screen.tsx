import { useRouter } from 'expo-router';
import { StyleSheet, View } from 'react-native';

import { copy, principles } from '@/content';
import { AppText, Button, Card, Screen, ScreenHeader } from '@/shared/components';
import { theme } from '@/shared/design';
import { Routes } from '@/navigation';

import { usePracticeState } from '../hooks/use-practice-state';

export function PathScreen() {
  const router = useRouter();
  const { streakDays, isRunning, loading, begin } = usePracticeState();
  const principle = principles[0];

  return (
    <Screen
      scroll
      footer={
        <Button
          label={copy.actions.pause}
          variant="support"
          fullWidth
          onPress={() => router.push(Routes.pause)}
        />
      }
    >
      <View style={styles.container}>
        <ScreenHeader
          eyebrow={copy.path.eyebrow}
          title={copy.path.title}
          subtitle={copy.path.description}
        />

        <Card tone="overlay" style={styles.streakCard}>
          <AppText variant="caption" color="muted" uppercase>
            Current streak
          </AppText>
          <AppText variant="display" color="energy">
            {isRunning ? `Day ${streakDays + 1}` : 'Not started'}
          </AppText>
          {!isRunning && !loading ? (
            <Button label="Begin the practice" onPress={() => void begin()} />
          ) : null}
        </Card>

        {principle ? (
          <Card>
            <AppText variant="caption" color="accent" uppercase>
              Principle
            </AppText>
            <AppText variant="subheading" style={styles.principleTitle}>
              {principle.title}
            </AppText>
            <AppText variant="body" color="secondary">
              {principle.body}
            </AppText>
          </Card>
        ) : null}

        <View style={styles.actions}>
          <Button
            label="Forge energy"
            variant="secondary"
            fullWidth
            onPress={() => router.push(Routes.forge)}
          />
          <Button
            label="Open journal"
            variant="secondary"
            fullWidth
            onPress={() => router.push(Routes.journal)}
          />
        </View>
      </View>
    </Screen>
  );
}

const styles = StyleSheet.create({
  container: { gap: theme.spacing.lg },
  streakCard: { gap: theme.spacing.sm, alignItems: 'flex-start' },
  principleTitle: { marginTop: theme.spacing.xs, marginBottom: theme.spacing.xs },
  actions: { gap: theme.spacing.md },
});
