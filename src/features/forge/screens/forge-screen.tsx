import { StyleSheet, View } from 'react-native';

import { copy } from '@/content';
import { AppText, AppCard, AppScreen, AppHeader } from '@/shared/components';
import { theme } from '@/shared/design';

export function ForgeScreen() {
  return (
    <AppScreen scroll>
      <View style={styles.container}>
        <AppHeader
          eyebrow={copy.forge.eyebrow}
          eyebrowColor="energy"
          title={copy.forge.title}
          subtitle={copy.forge.description}
        />
        <View style={styles.list}>
          {copy.forge.categories.map((category) => (
            <AppCard key={category.name}>
              <AppText variant="caption" color="energy" uppercase>
                {category.name}
              </AppText>
              <AppText variant="body" color="secondary" style={styles.example}>
                {category.example}
              </AppText>
            </AppCard>
          ))}
        </View>
      </View>
    </AppScreen>
  );
}

const styles = StyleSheet.create({
  container: { gap: theme.spacing.xl },
  list: { gap: theme.spacing.md },
  example: { marginTop: theme.spacing.xs },
});
