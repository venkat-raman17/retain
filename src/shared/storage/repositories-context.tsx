import { createContext, useContext, type ReactNode } from 'react';

import type { Repositories } from '@/db';

/**
 * Dependency-injection boundary for the data layer. Screens and hooks read
 * repositories from here via {@link useRepositories} — they never construct a
 * repository or import `expo-sqlite`. Tests provide fakes through this same
 * provider (see `src/testing`).
 */
const RepositoriesContext = createContext<Repositories | null>(null);

export function RepositoriesProvider({
  repositories,
  children,
}: {
  repositories: Repositories;
  children: ReactNode;
}) {
  return (
    <RepositoriesContext.Provider value={repositories}>{children}</RepositoriesContext.Provider>
  );
}

export function useRepositories(): Repositories {
  const repositories = useContext(RepositoriesContext);
  if (!repositories) {
    throw new Error('useRepositories must be used within a RepositoriesProvider.');
  }
  return repositories;
}
