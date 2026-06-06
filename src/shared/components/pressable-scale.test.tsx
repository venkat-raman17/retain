import { fireEvent, render, screen } from '@testing-library/react-native';
import { Text } from 'react-native';

import { PressableScale } from './pressable-scale';

// Doubles as the motion-infrastructure smoke test: exercises Reanimated shared
// values / animated styles / withTiming under the Jest mock, confirming the
// babel-preset-expo worklets transform and the reanimated mock are wired.
describe('PressableScale', () => {
  it('renders children and forwards press + press lifecycle events', () => {
    const onPress = jest.fn();
    const onPressIn = jest.fn();
    const onPressOut = jest.fn();

    render(
      <PressableScale
        accessibilityRole="button"
        onPress={onPress}
        onPressIn={onPressIn}
        onPressOut={onPressOut}
      >
        <Text>Forge</Text>
      </PressableScale>,
    );

    expect(screen.getByText('Forge')).toBeTruthy();

    const button = screen.getByRole('button');
    fireEvent(button, 'pressIn');
    fireEvent(button, 'pressOut');
    fireEvent.press(button);

    expect(onPressIn).toHaveBeenCalledTimes(1);
    expect(onPressOut).toHaveBeenCalledTimes(1);
    expect(onPress).toHaveBeenCalledTimes(1);
  });
});
