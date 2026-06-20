import { copy } from '@/content';
import { renderWithProviders } from '@/testing';

import { RecordScreen } from './record-screen';

jest.mock('expo-router', () => {
  // eslint-disable-next-line @typescript-eslint/no-require-imports
  const React = require('react');
  return {
    __esModule: true,
    useFocusEffect: (cb: () => void) => {
      const ref = React.useRef(cb);
      ref.current = cb;
      React.useEffect(() => ref.current(), []);
    },
    useRouter: () => ({ push: () => {}, replace: () => {}, back: () => {} }),
  };
});

describe('RecordScreen', () => {
  it('renders the metrics surface without crashing', async () => {
    const screen = renderWithProviders(<RecordScreen />);
    expect(await screen.findByText(copy.record.title)).toBeTruthy();
  });
});
