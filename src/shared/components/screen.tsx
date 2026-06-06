import { LinearGradient } from 'expo-linear-gradient';
import { type ReactNode } from 'react';
import { ScrollView, StyleSheet, View, type ViewStyle } from 'react-native';
import { SafeAreaView, type Edge } from 'react-native-safe-area-context';
import { StatusBar } from 'expo-status-bar';

import { theme } from '@/shared/design';
import { useTheme } from '@/shared/hooks/use-theme';

export interface AppScreenProps {
  children: ReactNode;
  /** Wrap content in a vertical ScrollView. */
  scroll?: boolean;
  /** Apply the standard horizontal/vertical content padding. */
  padded?: boolean;
  /** Which safe-area edges to inset. Defaults to the top edge only. */
  edges?: readonly Edge[];
  /** Pinned content at the bottom (e.g. a primary action), outside the scroll. */
  footer?: ReactNode;
  /** A whisper-faint downward vignette for depth on hero surfaces. Default off. */
  vignette?: boolean;
  contentStyle?: ViewStyle;
}

const DEFAULT_EDGES: readonly Edge[] = ['top'];
/** Effect layer (not a semantic color): a barely-there darkening toward the floor. */
const VIGNETTE_COLORS = ['transparent', 'rgba(0,0,0,0.18)'] as const;

/**
 * The root container for every screen: safe-area handling, the app background,
 * status-bar style, and consistent padding. Screens compose this rather than
 * re-implementing layout chrome.
 */
export function AppScreen({
  children,
  scroll = false,
  padded = true,
  edges = DEFAULT_EDGES,
  footer,
  vignette = false,
  contentStyle,
}: AppScreenProps) {
  const { colors } = useTheme();

  return (
    <SafeAreaView style={[styles.safeArea, { backgroundColor: colors.background }]} edges={edges}>
      <StatusBar style="light" />
      {vignette ? (
        <LinearGradient colors={VIGNETTE_COLORS} style={StyleSheet.absoluteFill} pointerEvents="none" />
      ) : null}
      {scroll ? (
        <ScrollView
          contentContainerStyle={[styles.scrollContent, padded ? styles.padded : null, contentStyle]}
          keyboardShouldPersistTaps="handled"
          showsVerticalScrollIndicator={false}
        >
          {children}
        </ScrollView>
      ) : (
        <View style={[styles.flex, padded ? styles.padded : null, contentStyle]}>{children}</View>
      )}
      {footer ? <View style={[padded ? styles.footerPadded : null, { backgroundColor: colors.background }]}>{footer}</View> : null}
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: { flex: 1 },
  flex: { flex: 1 },
  padded: {
    paddingHorizontal: theme.spacing.lg,
    paddingTop: theme.spacing.xxl,
    paddingBottom: theme.spacing.lg,
  },
  scrollContent: { flexGrow: 1 },
  footerPadded: {
    paddingHorizontal: theme.spacing.lg,
    paddingTop: theme.spacing.md,
    paddingBottom: theme.spacing.lg,
  },
});
