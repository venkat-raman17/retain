import { useMemo, useState } from 'react';
import { useRouter } from 'expo-router';
import { StyleSheet, View } from 'react-native';

import { copy, getSafetyDisclaimer, onboardingSteps } from '@/content';
import { PathService } from '@/features/path';
import { AppText, AppButton, AppCard, AppScreen, AppHeader } from '@/shared/components';
import { theme } from '@/shared/design';
import { systemClock } from '@/shared/lib';
import { Routes } from '@/navigation';
import { useRepositories } from '@/shared/storage';

export function OnboardingScreen() {
  const router = useRouter();
  const { profile, path, settings } = useRepositories();
  const pathService = useMemo(() => new PathService(profile, path, systemClock), [profile, path]);
  const [index, setIndex] = useState(0);
  const [finishing, setFinishing] = useState(false);

  const step = onboardingSteps[index];
  const isLast = index === onboardingSteps.length - 1;
  const disclaimer = getSafetyDisclaimer();

  const complete = async () => {
    setFinishing(true);
    await profile.update({ onboardingCompleted: true });
    await settings.updatePreferences({ safetyAcknowledged: true });
    await pathService.startPath();
    router.replace(Routes.path);
  };

  if (!step) return null;

  return (
    <AppScreen
      footer={
        <View style={styles.footer}>
          <AppButton
            label={isLast ? copy.actions.acknowledge : copy.actions.continue}
            fullWidth
            loading={finishing}
            onPress={() => (isLast ? void complete() : setIndex((current) => current + 1))}
          />
          {index > 0 ? (
            <AppButton
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
        <AppHeader title={step.title} subtitle={step.body} />

        {step.affirmation ? (
          <AppCard tone="overlay">
            <AppText variant="subheading" color="energy" align="center">
              {`“${step.affirmation}”`}
            </AppText>
          </AppCard>
        ) : null}

        {isLast ? (
          <AppCard>
            <AppText variant="label" color="secondary">
              {disclaimer.title}
            </AppText>
            {disclaimer.paragraphs.map((paragraph) => (
              <AppText key={paragraph} variant="caption" color="muted" style={styles.paragraph}>
                {paragraph}
              </AppText>
            ))}
          </AppCard>
        ) : null}
      </View>
    </AppScreen>
  );
}

const styles = StyleSheet.create({
  container: { gap: theme.spacing.lg },
  footer: { gap: theme.spacing.sm },
  paragraph: { marginTop: theme.spacing.sm },
});
