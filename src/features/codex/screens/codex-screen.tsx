import { StyleSheet, View } from 'react-native';

import { codexEntries, copy } from '@/content';
import { AppText, Card, Screen, ScreenHeader } from '@/shared/components';
import { theme } from '@/shared/design';

export function CodexScreen() {
  return (
    <Screen scroll>
      <View style={styles.container}>
        <ScreenHeader
          eyebrow={copy.codex.eyebrow}
          title={copy.codex.title}
          subtitle={copy.codex.description}
        />
        <View style={styles.list}>
          {codexEntries.map((entry) => (
            <Card key={entry.id}>
              <AppText variant="caption" color="accent" uppercase>
                {`${entry.category} · ${entry.readMinutes} min read`}
              </AppText>
              <AppText variant="subheading" style={styles.title}>
                {entry.title}
              </AppText>
              <AppText variant="body" color="secondary">
                {entry.summary}
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
