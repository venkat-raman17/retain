import { Component, type ErrorInfo, type ReactNode } from 'react';
import { StyleSheet, View } from 'react-native';

import { copy } from '@/content';
import { theme } from '@/shared/design';
import { createLogger } from '@/shared/lib';

import { AppScreen } from './screen';
import { AppText } from './text';

const log = createLogger('app');

/** Calm, themed fallback shown when a screen throws. Functional so it can use the theme. */
function Fallback() {
  return (
    <AppScreen>
      <View style={styles.center}>
        <AppText variant="title" color="primary" align="center">
          {copy.errors.title}
        </AppText>
        <AppText variant="body" color="secondary" align="center">
          {copy.errors.body}
        </AppText>
      </View>
    </AppScreen>
  );
}

interface ErrorBoundaryProps {
  children: ReactNode;
}

interface ErrorBoundaryState {
  hasError: boolean;
}

/**
 * Catches uncaught render errors anywhere in the screen tree and shows a quiet
 * recovery message instead of a white screen. Database-bootstrap failures are
 * handled upstream by AppDataProvider; this is the last line for screen bugs.
 */
export class ErrorBoundary extends Component<ErrorBoundaryProps, ErrorBoundaryState> {
  override state: ErrorBoundaryState = { hasError: false };

  static getDerivedStateFromError(): ErrorBoundaryState {
    return { hasError: true };
  }

  override componentDidCatch(error: Error, info: ErrorInfo) {
    log.error(`Uncaught render error${info.componentStack ?? ''}`, error);
  }

  override render() {
    if (this.state.hasError) return <Fallback />;
    return this.props.children;
  }
}

const styles = StyleSheet.create({
  center: { flex: 1, alignItems: 'center', justifyContent: 'center', gap: theme.spacing.md },
});
