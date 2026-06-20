import {
  Cinzel_400Regular,
  Cinzel_500Medium,
  Cinzel_600SemiBold,
  Cinzel_700Bold,
} from '@expo-google-fonts/cinzel';
import {
  Inter_400Regular,
  Inter_500Medium,
  Inter_600SemiBold,
  Inter_700Bold,
} from '@expo-google-fonts/inter';
import { useFonts } from 'expo-font';
import { Stack } from 'expo-router';
import * as SplashScreen from 'expo-splash-screen';
import { StatusBar } from 'expo-status-bar';
import { useCallback, useEffect, useState } from 'react';
import { StyleSheet } from 'react-native';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import { SafeAreaProvider } from 'react-native-safe-area-context';

import { theme } from '@/shared/design';
import { ErrorBoundary } from '@/shared/components';
import { HapticsHydrator } from '@/features/settings';
import { AppDataProvider, ThemeProvider } from '@/shared/storage';
import { RemindersHydrator } from '@/features/reminders';

// Hold the native splash so the first frame the user sees is already in the
// bundled Cinzel/Inter typefaces, with the database open — never a flash of
// system font or a loading spinner. Fade the splash out on handoff.
void SplashScreen.preventAutoHideAsync();
try {
  SplashScreen.setOptions({ fade: true, duration: 350 });
} catch {
  // setOptions is best-effort; ignore on platforms that don't support it.
}

/**
 * Root layout. Loads bundled fonts and opens the database in parallel beneath
 * the native splash, then reveals the app once both are ready. Composes the
 * app-wide providers and declares the root stack; Pause and Safety are modal so
 * they can be reached from anywhere without losing the underlying screen.
 */
export default function RootLayout() {
  const [fontsLoaded, fontError] = useFonts({
    Cinzel_400Regular,
    Cinzel_500Medium,
    Cinzel_600SemiBold,
    Cinzel_700Bold,
    Inter_400Regular,
    Inter_500Medium,
    Inter_600SemiBold,
    Inter_700Bold,
  });

  const [dataSettled, setDataSettled] = useState(false);
  const handleDataSettled = useCallback(() => setDataSettled(true), []);

  const fontsReady = fontsLoaded || fontError != null;
  const appReady = fontsReady && dataSettled;

  useEffect(() => {
    if (appReady) {
      void SplashScreen.hideAsync();
    }
  }, [appReady]);

  return (
    <GestureHandlerRootView style={styles.root}>
      <SafeAreaProvider>
        <AppDataProvider onSettled={handleDataSettled}>
          <ThemeProvider>
          <HapticsHydrator />
          <RemindersHydrator />
          <StatusBar style="light" />
          <ErrorBoundary>
            <Stack
              screenOptions={{
                headerShown: false,
                contentStyle: { backgroundColor: theme.colors.background },
                animation: 'fade',
              }}
            >
              <Stack.Screen name="pause" options={{ presentation: 'modal' }} />
              <Stack.Screen name="lapse" options={{ presentation: 'modal' }} />
              <Stack.Screen name="chamber" options={{ presentation: 'modal' }} />
              <Stack.Screen name="path-map" options={{ presentation: 'modal' }} />
              <Stack.Screen name="crown" options={{ presentation: 'modal' }} />
              <Stack.Screen name="safety" options={{ presentation: 'modal' }} />
            </Stack>
          </ErrorBoundary>
          </ThemeProvider>
        </AppDataProvider>
      </SafeAreaProvider>
    </GestureHandlerRootView>
  );
}

const styles = StyleSheet.create({
  root: { flex: 1 },
});
