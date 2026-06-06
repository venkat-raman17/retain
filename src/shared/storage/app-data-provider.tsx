import { useEffect, useState, type ReactNode } from 'react';
import { ActivityIndicator, StyleSheet, View } from 'react-native';

import { initializeRetainDatabase, type Repositories } from '@/db';
import { AppText } from '@/shared/components';
import { theme } from '@/shared/design';
import { createLogger } from '@/shared/lib';

import { RepositoriesProvider } from './repositories-context';

const log = createLogger('storage');

type Status = 'loading' | 'ready' | 'error';

/**
 * Opens the database (migrations + seed) once at startup, then provides the
 * repositories to the tree. Renders a calm loading state while initializing and
 * a recoverable message if it fails — never a crash.
 */
export function AppDataProvider({
  children,
  onSettled,
}: {
  children: ReactNode;
  /** Fired once the database has settled (ready or error) — lets the root hold
   *  the native splash until data (and fonts) are ready, then reveal. */
  onSettled?: () => void;
}) {
  const [status, setStatus] = useState<Status>('loading');
  const [repositories, setRepositories] = useState<Repositories | null>(null);

  useEffect(() => {
    let active = true;
    initializeRetainDatabase()
      .then((initialized) => {
        if (!active) return;
        setRepositories(initialized.repositories);
        setStatus('ready');
      })
      .catch((error: unknown) => {
        if (!active) return;
        log.error('database initialization failed', error);
        setStatus('error');
      });
    return () => {
      active = false;
    };
  }, []);

  useEffect(() => {
    if (status !== 'loading') onSettled?.();
  }, [status, onSettled]);

  if (status === 'error') {
    return (
      <Centered>
        <AppText variant="heading" align="center">
          Something interrupted startup
        </AppText>
        <AppText variant="body" color="secondary" align="center">
          Your data is safe on this device. Please reopen the app.
        </AppText>
      </Centered>
    );
  }

  if (status !== 'ready' || !repositories) {
    return (
      <Centered>
        <ActivityIndicator color={theme.colors.primary} />
        <AppText variant="body" color="secondary">
          Preparing your space…
        </AppText>
      </Centered>
    );
  }

  return <RepositoriesProvider repositories={repositories}>{children}</RepositoriesProvider>;
}

function Centered({ children }: { children: ReactNode }) {
  return <View style={styles.centered}>{children}</View>;
}

const styles = StyleSheet.create({
  centered: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    gap: theme.spacing.md,
    padding: theme.spacing.xl,
    backgroundColor: theme.colors.background,
  },
});
