import { Link, Stack } from 'expo-router';
import { StyleSheet, View } from 'react-native';

import { Routes } from '@/navigation';
import { AppText } from '@/shared/components';
import { theme } from '@/shared/design';

export default function NotFoundRoute() {
  return (
    <>
      <Stack.Screen options={{ title: 'Not found' }} />
      <View style={styles.container}>
        <AppText variant="heading" align="center">
          This page wandered off.
        </AppText>
        <Link href={Routes.path}>
          <AppText color="energy">Return to the Path</AppText>
        </Link>
      </View>
    </>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    gap: theme.spacing.lg,
    padding: theme.spacing.xl,
    backgroundColor: theme.colors.background,
  },
});
