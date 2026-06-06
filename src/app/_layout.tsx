import { Stack } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import { StyleSheet } from 'react-native';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import { SafeAreaProvider } from 'react-native-safe-area-context';

import { theme } from '@/shared/design';
import { AppDataProvider } from '@/shared/storage';

/**
 * Root layout. Composes app-wide providers (gesture handler, safe area, the data
 * layer) and declares the root stack. Pause and Safety are presented modally so
 * they can be reached from anywhere without losing the underlying screen.
 */
export default function RootLayout() {
  return (
    <GestureHandlerRootView style={styles.root}>
      <SafeAreaProvider>
        <AppDataProvider>
          <StatusBar style="light" />
          <Stack
            screenOptions={{
              headerShown: false,
              contentStyle: { backgroundColor: theme.colors.background },
              animation: 'fade',
            }}
          >
            <Stack.Screen name="pause" options={{ presentation: 'modal' }} />
            <Stack.Screen name="safety" options={{ presentation: 'modal' }} />
          </Stack>
        </AppDataProvider>
      </SafeAreaProvider>
    </GestureHandlerRootView>
  );
}

const styles = StyleSheet.create({
  root: { flex: 1 },
});
