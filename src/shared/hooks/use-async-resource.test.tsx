import { Pressable } from 'react-native';
import { fireEvent, screen, waitFor } from '@testing-library/react-native';

import { AppText } from '@/shared/components';
import { renderWithProviders } from '@/testing';

import { useAsyncResource } from './use-async-resource';

function Probe({ load }: { load: () => Promise<string> }) {
  const { data, loading, error, refresh } = useAsyncResource(load);
  return (
    <>
      <AppText>{loading ? 'loading' : 'ready'}</AppText>
      <AppText>{data ?? 'no-data'}</AppText>
      <AppText>{error ? 'error' : 'no-error'}</AppText>
      <Pressable accessibilityRole="button" accessibilityLabel="refresh" onPress={refresh}>
        <AppText>refresh</AppText>
      </Pressable>
    </>
  );
}

describe('useAsyncResource', () => {
  it('starts loading, then exposes resolved data', async () => {
    renderWithProviders(<Probe load={() => Promise.resolve('value')} />);
    expect(screen.getByText('loading')).toBeTruthy();
    await waitFor(() => expect(screen.getByText('value')).toBeTruthy());
    expect(screen.getByText('ready')).toBeTruthy();
    expect(screen.getByText('no-error')).toBeTruthy();
  });

  it('captures load errors without throwing', async () => {
    renderWithProviders(<Probe load={() => Promise.reject(new Error('boom'))} />);
    await waitFor(() => expect(screen.getByText('error')).toBeTruthy());
    expect(screen.getByText('ready')).toBeTruthy(); // loading cleared via finally
    expect(screen.getByText('no-data')).toBeTruthy();
  });

  it('re-runs load on refresh', async () => {
    let n = 0;
    const load = () => Promise.resolve(`run-${++n}`);
    renderWithProviders(<Probe load={load} />);
    await waitFor(() => expect(screen.getByText('run-1')).toBeTruthy());
    fireEvent.press(screen.getByLabelText('refresh'));
    await waitFor(() => expect(screen.getByText('run-2')).toBeTruthy());
  });
});
