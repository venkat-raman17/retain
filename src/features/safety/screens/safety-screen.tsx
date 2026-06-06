import { useRouter } from 'expo-router';
import { StyleSheet, View } from 'react-native';

import { copy, disclaimer } from '@/content';
import { AppText, Button, Card, Screen, ScreenHeader } from '@/shared/components';
import { theme } from '@/shared/design';
import { useRepositories } from '@/shared/storage';

export function SafetyScreen() {
  const router = useRouter();
  const { settings } = useRepositories();

  const acknowledge = async () => {
    await settings.update({ safetyAcknowledged: true });
    if (router.canGoBack()) router.back();
  };

  return (
    <Screen
      scroll
      footer={
        <Button label={copy.actions.acknowledge} fullWidth onPress={() => void acknowledge()} />
      }
    >
      <View style={styles.container}>
        <ScreenHeader
          eyebrow={copy.safety.eyebrow}
          eyebrowColor="support"
          title={disclaimer.title}
          subtitle={copy.safety.description}
        />
        <Card style={styles.body}>
          {disclaimer.paragraphs.map((paragraph) => (
            <AppText key={paragraph} variant="body" color="secondary">
              {paragraph}
            </AppText>
          ))}
        </Card>
        <Card tone="overlay">
          <AppText variant="body" color="calm">
            {disclaimer.supportNote}
          </AppText>
        </Card>
      </View>
    </Screen>
  );
}

const styles = StyleSheet.create({
  container: { gap: theme.spacing.lg },
  body: { gap: theme.spacing.md },
});
