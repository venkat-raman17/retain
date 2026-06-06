import { type ReactNode } from 'react';
import { ScrollView, StyleSheet, View, type ViewStyle } from 'react-native';
import { SafeAreaView, type Edge } from 'react-native-safe-area-context';
import { StatusBar } from 'expo-status-bar';

import { theme } from '@/shared/design';

export interface ScreenProps {
  children: ReactNode;
  /** Wrap content in a vertical ScrollView. */
  scroll?: boolean;
  /** Apply the standard horizontal/vertical content padding. */
  padded?: boolean;
  /** Which safe-area edges to inset. Defaults to the top edge only. */
  edges?: readonly Edge[];
  /** Pinned content at the bottom (e.g. a primary action), outside the scroll. */
  footer?: ReactNode;
  contentStyle?: ViewStyle;
}

const DEFAULT_EDGES: readonly Edge[] = ['top'];

/**
 * The root container for every screen: safe-area handling, the app background,
 * status-bar style, and consistent padding. Screens compose this rather than
 * re-implementing layout chrome.
 */
export function Screen({
  children,
  scroll = false,
  padded = true,
  edges = DEFAULT_EDGES,
  footer,
  contentStyle,
}: ScreenProps) {
  return (
    <SafeAreaView style={styles.safeArea} edges={edges}>
      <StatusBar style="light" />
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
      {footer ? <View style={padded ? styles.footerPadded : undefined}>{footer}</View> : null}
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: { flex: 1, backgroundColor: theme.colors.background },
  flex: { flex: 1 },
  padded: { paddingHorizontal: theme.spacing.lg, paddingVertical: theme.spacing.lg },
  scrollContent: { flexGrow: 1 },
  footerPadded: {
    paddingHorizontal: theme.spacing.lg,
    paddingTop: theme.spacing.md,
    paddingBottom: theme.spacing.lg,
  },
});
