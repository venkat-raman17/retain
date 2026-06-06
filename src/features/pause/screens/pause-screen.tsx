import { useEffect, useRef } from 'react';
import { useRouter } from 'expo-router';
import { Animated, Easing, StyleSheet, View } from 'react-native';

import { copy } from '@/content';
import { AppText, Button, Screen } from '@/shared/components';
import { theme } from '@/shared/design';

import { usePauseSession } from '../store/pause-session';

const PHASE_MS = 4000;

export function PauseScreen() {
  const router = useRouter();
  const { phase, cycles, start, stop, setPhase, completeCycle } = usePauseSession();
  const scale = useRef(new Animated.Value(0.6)).current;

  // Begin a fresh session on mount; stop it on unmount.
  useEffect(() => {
    start();
    return () => stop();
  }, [start, stop]);

  // Advance the breath cycle and animate the circle to match the current phase.
  useEffect(() => {
    if (phase === 'idle') return undefined;

    if (phase === 'inhale' || phase === 'exhale') {
      Animated.timing(scale, {
        toValue: phase === 'inhale' ? 1 : 0.6,
        duration: PHASE_MS,
        easing: Easing.inOut(Easing.ease),
        useNativeDriver: true,
      }).start();
    }

    const timer = setTimeout(() => {
      if (phase === 'inhale') setPhase('hold');
      else if (phase === 'hold') setPhase('exhale');
      else {
        completeCycle();
        setPhase('inhale');
      }
    }, PHASE_MS);

    return () => clearTimeout(timer);
  }, [phase, scale, setPhase, completeCycle]);

  const label =
    phase === 'inhale'
      ? copy.pause.breatheIn
      : phase === 'hold'
        ? copy.pause.hold
        : copy.pause.breatheOut;

  return (
    <Screen
      edges={['top', 'bottom']}
      footer={
        <View style={styles.footer}>
          <Button label="I rode it out" fullWidth onPress={() => router.back()} />
          <Button
            label={copy.actions.done}
            variant="ghost"
            fullWidth
            onPress={() => router.back()}
          />
        </View>
      }
    >
      <View style={styles.container}>
        <AppText variant="caption" color="support" uppercase align="center">
          {copy.pause.eyebrow}
        </AppText>
        <AppText variant="title" align="center">
          {copy.pause.title}
        </AppText>

        <View style={styles.breathArea}>
          <Animated.View style={[styles.circle, { transform: [{ scale }] }]} />
          <AppText variant="heading" color="energy" style={styles.breathLabel}>
            {label}
          </AppText>
        </View>

        <AppText variant="body" color="secondary" align="center">
          {copy.pause.reassurance}
        </AppText>
        <AppText variant="caption" color="muted" align="center">
          {`Breaths completed: ${cycles}`}
        </AppText>
      </View>
    </Screen>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, alignItems: 'center', justifyContent: 'center', gap: theme.spacing.lg },
  breathArea: { alignItems: 'center', justifyContent: 'center', height: 260, width: 260 },
  circle: {
    position: 'absolute',
    width: 220,
    height: 220,
    borderRadius: theme.radii.pill,
    backgroundColor: theme.colors.supportSoft,
    borderWidth: 2,
    borderColor: theme.colors.support,
  },
  breathLabel: { textAlign: 'center' },
  footer: { gap: theme.spacing.sm },
});
