import { useRouter } from 'expo-router';
import { StyleSheet, View } from 'react-native';

import { copy, getSafetyDisclaimer, getSafetyResources } from '@/content';
import { AppText, AppButton, AppCard, AppScreen, AppHeader } from '@/shared/components';
import { theme } from '@/shared/design';
import { useRepositories } from '@/shared/storage';

export function SafetyScreen() {
  const router = useRouter();
  const { settings } = useRepositories();
  const disclaimer = getSafetyDisclaimer();
  const resources = getSafetyResources();

  const acknowledge = async () => {
    await settings.updatePreferences({ safetyAcknowledged: true });
    if (router.canGoBack()) router.back();
  };

  return (
    <AppScreen
      scroll
      footer={
        <AppButton label={copy.actions.acknowledge} fullWidth onPress={() => void acknowledge()} />
      }
    >
      <View style={styles.container}>
        <AppHeader
          eyebrow={copy.safety.eyebrow}
          eyebrowColor="support"
          title={disclaimer.title}
          subtitle={copy.safety.description}
        />

        <AppCard style={styles.section}>
          {disclaimer.paragraphs.map((paragraph) => (
            <AppText key={paragraph} variant="body" color="secondary">
              {paragraph}
            </AppText>
          ))}
        </AppCard>

        <AppCard tone="overlay" style={styles.section}>
          <AppText variant="subheading" color="support">
            {resources.title}
          </AppText>
          <AppText variant="body" color="secondary">
            {resources.intro}
          </AppText>
          {resources.items.map((item) => (
            <View key={item} style={styles.row}>
              <View style={styles.dot} />
              <AppText variant="body" color="secondary" style={styles.itemText}>
                {item}
              </AppText>
            </View>
          ))}
        </AppCard>

        <AppCard tone="overlay">
          <AppText variant="body" color="calm">
            {disclaimer.supportNote}
          </AppText>
        </AppCard>
      </View>
    </AppScreen>
  );
}

const styles = StyleSheet.create({
  container: { gap: theme.spacing.lg },
  section: { gap: theme.spacing.md },
  row: { flexDirection: 'row', gap: theme.spacing.sm, alignItems: 'flex-start' },
  dot: {
    width: 6,
    height: 6,
    borderRadius: theme.radii.pill,
    backgroundColor: theme.colors.support,
    marginTop: 8,
  },
  itemText: { flex: 1 },
});
