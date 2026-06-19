import { type ReactElement } from 'react';
import { screen } from '@testing-library/react-native';

import { copy } from '@/content';
import { renderWithProviders } from '@/testing';

import { ErrorBoundary } from './error-boundary';
import { AppText } from './text';

function Boom(): ReactElement {
  throw new Error('boom');
}

describe('ErrorBoundary', () => {
  it('renders its children when they do not throw', () => {
    renderWithProviders(
      <ErrorBoundary>
        <AppText>Safe</AppText>
      </ErrorBoundary>,
    );
    expect(screen.getByText('Safe')).toBeTruthy();
  });

  it('shows the calm fallback when a child throws', () => {
    // React + the boundary both log the caught error; keep the test output clean.
    const spy = jest.spyOn(console, 'error').mockImplementation(() => {});
    renderWithProviders(
      <ErrorBoundary>
        <Boom />
      </ErrorBoundary>,
    );
    expect(screen.getByText(copy.errors.title)).toBeTruthy();
    spy.mockRestore();
  });
});
