import { useState } from 'react';
import { useRouter } from 'expo-router';
import { StyleSheet, View } from 'react-native';

import { copy, disclaimer, onboardingSteps } from '@/content';
import { AppText, Button, Card, Screen, ScreenHeader } from '@/shared/components';
import { theme } from '@/shared/design';
import { Routes } from '@/navigation';
import { useRepositories } from '@/shared/storage';

export function OnboardingScreen() {
  const router = useRouter();
  const { settings } = useRepositories();
  const [index, setIndex] = useState(0);
  const [finishing, setFinishing] = useState(false);

  const step = onboardingSteps[index];
  const isLast = index === onboardingSteps.length - 1;

  const complete = async () => {
    setFinishing(true);
    await settings.update({ onboardingCompleted: true, safetyAcknowledged: true });
    router.replace(Routes.path);
  };

  if (!step) return null;

  return (
    <Screen
      footer={
        <View style={styles.footer}>
          <Button
            label={isLast ? copy.actions.acknowledge : copy.actions.continue}
            fullWidth
            loading={finishing}
            onPress={() => (isLast ? void complete() : setIndex((current) => current + 1))}
          />
          {index > 0 ? (
            <Button
              label={copy.actions.back}
              variant="ghost"
              fullWidth
              onPress={() => setIndex((current) => current - 1)}
            />
          ) : null}
        </View>
      }
    >
      <View style={styles.container}>
        <AppText variant="caption" color="accent" uppercase>
          {`Step ${index + 1} of ${onboardingSteps.length}`}
        </AppText>
        <ScreenHeader title={step.title} subtitle={step.body} />

        {step.affirmation ? (
          <Card tone="overlay">
            <AppText variant="subheading" color="energy" align="center">
              {`“${step.affirmation}”`}
            </AppText>
          </Card>
        ) : null}

        {isLast ? (
          <Card>
            <AppText variant="label" color="secondary">
              {disclaimer.title}
            </AppText>
            {disclaimer.paragraphs.map((paragraph) => (
              <AppText key={paragraph} variant="caption" color="muted" style={styles.paragraph}>
                {paragraph}
              </AppText>
            ))}
          </Card>
        ) : null}
      </View>
    </Screen>
  );
}

const styles = StyleSheet.create({
  container: { gap: theme.spacing.lg },
  footer: { gap: theme.spacing.sm },
  paragraph: { marginTop: theme.spacing.sm },
});
