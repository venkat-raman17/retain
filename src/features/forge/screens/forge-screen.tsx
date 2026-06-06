import { StyleSheet, View } from 'react-native';

import { copy, practices } from '@/content';
import { AppText, Card, Screen, ScreenHeader } from '@/shared/components';
import { theme } from '@/shared/design';

export function ForgeScreen() {
  return (
    <Screen scroll>
      <View style={styles.container}>
        <ScreenHeader
          eyebrow={copy.forge.eyebrow}
          eyebrowColor="energy"
          title={copy.forge.title}
          subtitle={copy.forge.description}
        />
        <View style={styles.list}>
          {practices.map((practice) => (
            <Card key={practice.id}>
              <AppText variant="caption" color="energy" uppercase>
                {`${practice.category} · ${practice.durationMinutes} min`}
              </AppText>
              <AppText variant="subheading" style={styles.title}>
                {practice.title}
              </AppText>
              <AppText variant="body" color="secondary">
                {practice.intention}
              </AppText>
            </Card>
          ))}
        </View>
      </View>
    </Screen>
  );
}

const styles = StyleSheet.create({
  container: { gap: theme.spacing.xl },
  list: { gap: theme.spacing.md },
  title: { marginTop: theme.spacing.xs },
});
