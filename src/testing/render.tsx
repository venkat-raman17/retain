import { type ReactElement, type ReactNode } from 'react';
import { render, type RenderOptions } from '@testing-library/react-native';
import { SafeAreaProvider } from 'react-native-safe-area-context';

import type { Repositories } from '@/db';
import { RepositoriesProvider } from '@/shared/storage';

import { createFakeRepositories } from './fakes';

const TEST_METRICS = {
  frame: { x: 0, y: 0, width: 390, height: 844 },
  insets: { top: 0, left: 0, right: 0, bottom: 0 },
};

export interface RenderWithProvidersOptions extends Omit<RenderOptions, 'wrapper'> {
  repositories?: Repositories;
}

/**
 * Render a component inside the app's providers with fake (in-memory)
 * repositories. Screen and hook tests use this so they exercise the real DI path
 * without a native database.
 */
export function renderWithProviders(ui: ReactElement, options: RenderWithProvidersOptions = {}) {
  const { repositories = createFakeRepositories(), ...renderOptions } = options;

  function Wrapper({ children }: { children: ReactNode }) {
    return (
      <SafeAreaProvider initialMetrics={TEST_METRICS}>
        <RepositoriesProvider repositories={repositories}>{children}</RepositoriesProvider>
      </SafeAreaProvider>
    );
  }

  return { repositories, ...render(ui, { wrapper: Wrapper, ...renderOptions }) };
}
