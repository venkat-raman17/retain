import { useEffect, useRef, useState } from 'react';
import { useRouter } from 'expo-router';
import { Animated, Easing, ScrollView, StyleSheet, View } from 'react-native';
import Svg, { Circle as SvgCircle, Defs, RadialGradient, Stop } from 'react-native-svg';

import {
  AppButton,
  AppCard,
  AppChip,
  AppScreen,
  AppText,
  type SelectOption,
  AppSelectList,
  FlameCircleGlyph,
  symbolStroke,
} from '@/shared/components';
import { theme } from '@/shared/design';
import { useTheme } from '@/shared/hooks/use-theme';
import { haptics } from '@/shared/lib';
import { Routes } from '@/navigation';

import { PAUSE_COMMANDS, TIMER_OPTIONS } from '../domain/commands';
import { TRIGGER_LABELS, TRIGGER_TYPES, type TriggerType } from '../domain/urge-log';
import { usePause } from '../hooks/use-pause';
import { usePauseSession, type BreathPhase } from '../store/pause-session';

type PauseStep =
  | 'entry'
  | 'trigger'
  | 'intensity_before'
  | 'timer_select'
  | 'breathing'
  | 'command'
  | 'intensity_after'
  | 'complete';

const TRIGGER_OPTIONS: SelectOption<TriggerType>[] = TRIGGER_TYPES.map((t) => ({
  value: t,
  label: TRIGGER_LABELS[t],
}));

const INTENSITY_LEVELS = [
  { value: 1, label: 'Calm' },
  { value: 2, label: 'Noticeable' },
  { value: 3, label: 'Strong' },
  { value: 4, label: 'Heavy' },
  { value: 5, label: 'Overwhelming' },
] as const;

const COMMAND_OPTIONS: SelectOption<string>[] = PAUSE_COMMANDS.map((c) => ({
  value: c,
  label: c,
}));

const INHALE_MS = 4000;
const HOLD_MS = 4000;
const EXHALE_MS = 6000;

function phaseDuration(p: BreathPhase): number {
  if (p === 'inhale') return INHALE_MS;
  if (p === 'hold') return HOLD_MS;
  if (p === 'exhale') return EXHALE_MS;
  return INHALE_MS;
}

function formatTime(seconds: number): string {
  const m = Math.floor(seconds / 60);
  const s = seconds % 60;
  return `${m}:${s.toString().padStart(2, '0')}`;
}

export function PauseScreen() {
  const router = useRouter();
  const { recordUrge } = usePause();
  const { phase, cycles, start, stop, setPhase, completeCycle } = usePauseSession();
  const [scale] = useState(() => new Animated.Value(0.6));

  const [step, setStep] = useState<PauseStep>('entry');
  const [triggerType, setTriggerType] = useState<TriggerType | null>(null);
  const [intensityBefore, setIntensityBefore] = useState<number | null>(null);
  const [timerSeconds, setTimerSeconds] = useState(180);
  const [timeLeft, setTimeLeft] = useState(0);
  const [selectedResponse, setSelectedResponse] = useState<string | null>(null);
  const [intensityAfter, setIntensityAfter] = useState<number | null>(null);
  const [saving, setSaving] = useState(false);
  const [savedUrgeId, setSavedUrgeId] = useState<string | null>(null);
  // Track end time for the breathing timer via a ref (mutating refs in effects is fine).
  const timerEndAtRef = useRef<number | null>(null);

  // Breathing animation — driven by phase state.
  useEffect(() => {
    if (step !== 'breathing') return undefined;
    if (phase === 'idle') return undefined;
    // A soft beat at each phase change — a tactile metronome for the breath.
    haptics.impact('light');
    const ms = phaseDuration(phase);
    if (phase === 'inhale' || phase === 'exhale') {
      Animated.timing(scale, {
        toValue: phase === 'inhale' ? 1 : 0.6,
        duration: ms,
        easing: Easing.inOut(Easing.ease),
        useNativeDriver: true,
      }).start();
    }
    const timer = setTimeout(() => {
      if (phase === 'inhale') setPhase('hold');
      else if (phase === 'hold') setPhase('exhale');
      else { completeCycle(); setPhase('inhale'); }
    }, ms);
    return () => clearTimeout(timer);
  }, [step, phase, scale, setPhase, completeCycle]);

  // Start breathing when entering the breathing step.
  useEffect(() => {
    if (step === 'breathing') { start(); }
    return undefined;
  }, [step, start]);

  // Countdown tick — state is only updated inside the interval callback (not in effect body).
  useEffect(() => {
    if (step !== 'breathing') return undefined;
    timerEndAtRef.current = Date.now() + timerSeconds * 1000;
    const interval = setInterval(() => {
      if (timerEndAtRef.current === null) return;
      const remaining = Math.ceil((timerEndAtRef.current - Date.now()) / 1000);
      setTimeLeft(Math.max(0, remaining));
    }, 500);
    return () => clearInterval(interval);
  }, [step, timerSeconds]);

  // Auto-advance when timer expires.
  useEffect(() => {
    if (step !== 'breathing' || timeLeft !== 0) return undefined;
    const timeout = setTimeout(() => setStep('command'), 200);
    return () => clearTimeout(timeout);
  }, [step, timeLeft]);

  // Stop breathing session when leaving.
  useEffect(() => {
    return () => stop();
  }, [stop]);

  const saveAndComplete = async () => {
    if (!triggerType || !intensityBefore) return;
    setSaving(true);
    try {
      const log = await recordUrge({
        triggerType,
        intensityBefore,
        intensityAfter,
        completedPauseTimerSeconds: timerSeconds,
        selectedResponse,
        note: null,
      });
      setSavedUrgeId(log.id);
      haptics.notify('success'); // the rep is logged — a quiet mark of completion
      setStep('complete');
    } finally {
      setSaving(false);
    }
  };

  const breathLabel =
    phase === 'inhale' ? 'Breathe in' : phase === 'hold' ? 'Hold' : 'Breathe out';

  return (
    <AppScreen edges={['top', 'bottom']}>
      <ScrollView
        contentContainerStyle={styles.scroll}
        keyboardShouldPersistTaps="handled"
        showsVerticalScrollIndicator={false}
      >
        {step === 'entry' && (
          <StepEntry onContinue={() => setStep('trigger')} onDismiss={() => router.back()} />
        )}

        {step === 'trigger' && (
          <StepTrigger
            value={triggerType}
            onChange={setTriggerType}
            onContinue={() => setStep('intensity_before')}
            onBack={() => setStep('entry')}
          />
        )}

        {step === 'intensity_before' && (
          <StepIntensity
            title="How strong is it?"
            subtitle="Before the pause."
            value={intensityBefore}
            onChange={setIntensityBefore}
            onContinue={() => setStep('timer_select')}
            onBack={() => setStep('trigger')}
          />
        )}

        {step === 'timer_select' && (
          <StepTimerSelect
            value={timerSeconds}
            onChange={setTimerSeconds}
            onContinue={() => { setTimeLeft(timerSeconds); setStep('breathing'); }}
            onBack={() => setStep('intensity_before')}
          />
        )}

        {step === 'breathing' && (
          <StepBreathing
            scale={scale}
            breathLabel={breathLabel}
            cycles={cycles}
            timeLeft={timeLeft === 0 ? timerSeconds : timeLeft}
            timerSeconds={timerSeconds}
            onReady={() => { stop(); setStep('command'); }}
          />
        )}

        {step === 'command' && (
          <StepCommand
            value={selectedResponse}
            onChange={setSelectedResponse}
            onContinue={() => setStep('intensity_after')}
            onBack={() => setStep('breathing')}
          />
        )}

        {step === 'intensity_after' && (
          <StepIntensity
            title="How strong is it now?"
            subtitle="After the pause."
            value={intensityAfter}
            onChange={setIntensityAfter}
            onContinue={() => void saveAndComplete()}
            continueLabel="Complete the pause"
            loading={saving}
            onBack={() => setStep('command')}
          />
        )}

        {step === 'complete' && (
          <StepComplete
            urgeId={savedUrgeId}
            onDone={() => router.back()}
            onForge={() => {
              router.back();
              router.push(Routes.forge);
            }}
            onJournal={() =>
              router.push({
                pathname: Routes.journal,
                params: { initialType: 'urge' },
              })
            }
          />
        )}
      </ScrollView>
    </AppScreen>
  );
}

// ── Sub-steps ────────────────────────────────────────────────────────────────

function StepEntry({ onContinue, onDismiss }: { onContinue: () => void; onDismiss: () => void }) {
  const { colors } = useTheme();
  return (
    <View style={styles.step}>
      <View style={styles.entryGlyph}>
        <FlameCircleGlyph size={120} color={colors.support} strokeWidth={symbolStroke(120)} />
      </View>
      <AppText variant="caption" color="support" uppercase align="center">
        Pause
      </AppText>
      <AppText variant="title" align="center">
        The fire is rising.
      </AppText>
      <AppCard tone="overlay" style={styles.centered}>
        <AppText variant="body" color="secondary" align="center">
          {'Do not run. Do not obey. Observe.'}
        </AppText>
        <AppText variant="body" color="secondary" align="center">
          {'The energy is not the enemy.'}
        </AppText>
      </AppCard>
      <View style={styles.nav}>
        <AppButton label="Enter the pause" fullWidth onPress={onContinue} />
        <AppButton label="I rode it out" variant="ghost" fullWidth onPress={onDismiss} />
      </View>
    </View>
  );
}

function StepTrigger({
  value,
  onChange,
  onContinue,
  onBack,
}: {
  value: TriggerType | null;
  onChange: (t: TriggerType) => void;
  onContinue: () => void;
  onBack: () => void;
}) {
  return (
    <View style={styles.step}>
      <AppText variant="title">What is driving it?</AppText>
      <AppText variant="body" color="secondary">
        {'Name it clearly. The unnamed urge is harder to command.'}
      </AppText>
      <AppSelectList options={TRIGGER_OPTIONS} value={value} onChange={onChange} />
      <View style={styles.nav}>
        <AppButton label="Continue" fullWidth disabled={!value} onPress={onContinue} />
        <AppButton label="Back" variant="ghost" fullWidth onPress={onBack} />
      </View>
    </View>
  );
}

function StepIntensity({
  title,
  subtitle,
  value,
  onChange,
  onContinue,
  onBack,
  continueLabel = 'Continue',
  loading = false,
}: {
  title: string;
  subtitle: string;
  value: number | null;
  onChange: (n: number) => void;
  onContinue: () => void;
  onBack: () => void;
  continueLabel?: string;
  loading?: boolean;
}) {
  return (
    <View style={styles.step}>
      <AppText variant="title">{title}</AppText>
      <AppText variant="body" color="secondary">{subtitle}</AppText>
      <IntensityPicker value={value} onChange={onChange} />
      <View style={styles.nav}>
        <AppButton
          label={continueLabel}
          fullWidth
          disabled={value === null}
          loading={loading}
          onPress={onContinue}
        />
        <AppButton label="Back" variant="ghost" fullWidth onPress={onBack} />
      </View>
    </View>
  );
}

function StepTimerSelect({
  value,
  onChange,
  onContinue,
  onBack,
}: {
  value: number;
  onChange: (n: number) => void;
  onContinue: () => void;
  onBack: () => void;
}) {
  return (
    <View style={styles.step}>
      <AppText variant="title">Choose the duration.</AppText>
      <AppText variant="body" color="secondary">
        {'Breathe until the body remembers command.'}
      </AppText>
      <AppText variant="caption" color="muted">
        {'You can end the pause at any time.'}
      </AppText>
      <View style={styles.timerRow}>
        {TIMER_OPTIONS.map((opt) => (
          <AppChip
            key={opt.seconds}
            label={opt.label}
            tone="energy"
            selected={value === opt.seconds}
            onPress={() => onChange(opt.seconds)}
            style={styles.timerChip}
          />
        ))}
      </View>
      <View style={styles.nav}>
        <AppButton label="Begin" fullWidth onPress={onContinue} />
        <AppButton label="Back" variant="ghost" fullWidth onPress={onBack} />
      </View>
    </View>
  );
}

function StepBreathing({
  scale,
  breathLabel,
  cycles,
  timeLeft,
  timerSeconds,
  onReady,
}: {
  scale: Animated.Value;
  breathLabel: string;
  cycles: number;
  timeLeft: number;
  timerSeconds: number;
  onReady: () => void;
}) {
  const { colors } = useTheme();
  const progress = timerSeconds > 0 ? Math.round(((timerSeconds - timeLeft) / timerSeconds) * 100) : 100;
  return (
    <View style={[styles.step, styles.breathStep]}>
      <AppText variant="caption" color="support" uppercase align="center">
        {`${formatTime(timeLeft)} remaining`}
      </AppText>
      <View style={styles.breathArea}>
        <Svg width={260} height={260} style={StyleSheet.absoluteFill} pointerEvents="none">
          <Defs>
            <RadialGradient id="breathAura" cx="50%" cy="50%" r="50%">
              <Stop offset="0%" stopColor={colors.support} stopOpacity={0.18} />
              <Stop offset="70%" stopColor={colors.support} stopOpacity={0.04} />
              <Stop offset="100%" stopColor={colors.support} stopOpacity={0} />
            </RadialGradient>
          </Defs>
          <SvgCircle cx={130} cy={130} r={130} fill="url(#breathAura)" />
        </Svg>
        <Animated.View
          style={[
            styles.circle,
            { backgroundColor: colors.supportSoft, borderColor: colors.support },
            { transform: [{ scale }] },
          ]}
        />
        <AppText variant="heading" color="energy" style={styles.breathLabel}>
          {breathLabel}
        </AppText>
      </View>
      <AppText variant="body" color="secondary" align="center">
        {'The compulsion is not command.'}
      </AppText>
      <AppText variant="body" color="secondary" align="center">
        {'You are the one who chooses.'}
      </AppText>
      <AppText variant="caption" color="muted" align="center">
        {`${cycles} breath${cycles === 1 ? '' : 's'} completed · ${progress}%`}
      </AppText>
      <AppButton label="I am ready" variant="secondary" fullWidth onPress={onReady} />
    </View>
  );
}

function StepCommand({
  value,
  onChange,
  onContinue,
  onBack,
}: {
  value: string | null;
  onChange: (s: string) => void;
  onContinue: () => void;
  onBack: () => void;
}) {
  return (
    <View style={styles.step}>
      <AppText variant="title">Choose your response.</AppText>
      <AppText variant="body" color="secondary">
        {'The energy needs direction. Give it one.'}
      </AppText>
      <AppSelectList options={COMMAND_OPTIONS} value={value} onChange={onChange} />
      <View style={styles.nav}>
        <AppButton
          label="Continue"
          fullWidth
          disabled={!value}
          onPress={onContinue}
        />
        <AppButton label="Back" variant="ghost" fullWidth onPress={onBack} />
      </View>
    </View>
  );
}

function StepComplete({
  urgeId,
  onDone,
  onForge,
  onJournal,
}: {
  urgeId: string | null;
  onDone: () => void;
  onForge: () => void;
  onJournal: () => void;
}) {
  return (
    <View style={styles.step}>
      <AppText variant="caption" color="energy" uppercase align="center">
        Observed
      </AppText>
      <AppText variant="title" align="center">
        You paused.
      </AppText>
      <AppCard tone="overlay" style={styles.centered}>
        <AppText variant="subheading" color="energy" align="center">
          {"That is the rep."}
        </AppText>
      </AppCard>
      <AppCard>
        <AppText variant="body" color="secondary" align="center">
          {"The urge was observed. The fire was not wasted."}
        </AppText>
      </AppCard>
      {urgeId ? (
        <View style={styles.nav}>
          <AppButton
            label="Forge the energy"
            variant="secondary"
            fullWidth
            onPress={onForge}
          />
          <AppButton label="Record in journal" variant="ghost" fullWidth onPress={onJournal} />
          <AppButton label="Done" variant="ghost" fullWidth onPress={onDone} />
        </View>
      ) : (
        <AppButton label="Done" fullWidth onPress={onDone} />
      )}
    </View>
  );
}

function IntensityPicker({
  value,
  onChange,
}: {
  value: number | null;
  onChange: (n: number) => void;
}) {
  return (
    <View style={styles.intensityColumn}>
      {INTENSITY_LEVELS.map((level) => (
        <AppChip
          key={level.value}
          label={level.label}
          tone="support"
          selected={value === level.value}
          onPress={() => onChange(level.value)}
          style={styles.intensityChip}
        />
      ))}
    </View>
  );
}

const styles = StyleSheet.create({
  scroll: { flexGrow: 1, padding: theme.spacing.xl },
  step: { gap: theme.spacing.lg },
  entryGlyph: { alignItems: 'center', opacity: 0.9 },
  breathStep: { alignItems: 'center' },
  centered: { alignItems: 'center' },
  nav: { gap: theme.spacing.sm },
  breathArea: { alignItems: 'center', justifyContent: 'center', height: 260, width: 260 },
  circle: {
    position: 'absolute',
    width: 220,
    height: 220,
    borderRadius: theme.radii.pill,
    borderWidth: 2,
  },
  breathLabel: { textAlign: 'center' },
  timerRow: { flexDirection: 'row', gap: theme.spacing.md },
  timerChip: { flex: 1, alignSelf: 'auto', alignItems: 'center' },
  intensityColumn: { gap: theme.spacing.sm },
  intensityChip: { alignSelf: 'stretch' },
});
