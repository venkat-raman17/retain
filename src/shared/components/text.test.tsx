import { screen } from '@testing-library/react-native';

import { renderWithProviders } from '@/testing';

import { AppText } from './text';

describe('AppText', () => {
  it('renders its content', () => {
    renderWithProviders(<AppText>Hold the line</AppText>);
    expect(screen.getByText('Hold the line')).toBeTruthy();
  });
});
