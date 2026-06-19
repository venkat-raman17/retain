import { screen } from '@testing-library/react-native';

import { renderWithProviders } from '@/testing';

import { AppBarSeries, type BarDatum } from './progress/bar-series';

const data: BarDatum[] = [
  { label: 'May 12', fill: 0.5, valueLabel: '2', hasData: true },
  { label: 'Jun 16', fill: 0, hasData: false },
];

describe('AppBarSeries', () => {
  it('renders a bar per datum with its axis label and exposes the summary', () => {
    renderWithProviders(<AppBarSeries data={data} accessibilityLabel="Urges met over six weeks." />);
    expect(screen.getByText('May 12')).toBeTruthy();
    expect(screen.getByText('Jun 16')).toBeTruthy();
    expect(screen.getByText('2')).toBeTruthy();
    expect(screen.getByLabelText('Urges met over six weeks.')).toBeTruthy();
  });
});
