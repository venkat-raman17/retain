import { fireEvent, screen } from '@testing-library/react-native';

import { renderWithProviders } from '@/testing';

import { AppChip } from './chip';

describe('AppChip', () => {
  it('exposes its label to screen readers and fires onPress', () => {
    const onPress = jest.fn();
    renderWithProviders(<AppChip label="Stress" onPress={onPress} />);

    const chip = screen.getByLabelText('Stress');
    expect(chip).toBeTruthy();

    fireEvent.press(chip);
    expect(onPress).toHaveBeenCalledTimes(1);
  });
});
