import { render, screen } from '@testing-library/react-native';

import { AppText } from './text';

describe('AppText', () => {
  it('renders its content', () => {
    render(<AppText>Hold the line</AppText>);
    expect(screen.getByText('Hold the line')).toBeTruthy();
  });
});
