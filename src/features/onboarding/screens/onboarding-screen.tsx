import { useState } from 'react';
import { useRouter } from 'expo-router';
import { StyleSheet, View } from 'react-native';

import {
  AppButton,
  AppCard,
  AppHeader,
  AppQuoteBlock,
  AppScreen,
  AppSelectList,
  AppText,
  AppTextInput,
  type SelectOption,
} from '@/shared/components';
import { theme } from '@/shared/design';
import { Routes } from '@/navigation';
import { VOW_PRESETS } from '@/features/path/domain/user-profile';

import {
  BOUNDARY_CUSTOM,
  BOUNDARY_PRESETS,
  BOUNDARY_SKIP,
  FORGE_CATEGORY_DISPLAY,
  INTENTIONS,
  ONBOARDING_STEPS,
  type IntentionId,
  type OnboardingDraft,
  type OnboardingStep,
} from '../domain/onboarding';
import { useOnboarding } from '../hooks/use-onboarding';

const CUSTOM_VOW_ID = 'custom';

/** Recommended starting selections (the cleanest, most universal options). */
const DEFAULT_VOW_ID = 'pause-before-obey';
const DEFAULT_BOUNDARY = 'No phone in bed.';

const VOW_OPTIONS: SelectOption<string>[] = [
  ...VOW_PRESETS.map((vow) => ({ value: vow.id, label: vow.text })),
  { value: CUSTOM_VOW_ID, label: 'Write my own vow.' },
];

const INTENTION_OPTIONS: SelectOption<string>[] = INTENTIONS.map((i) => ({
  value: i.id,
  label: i.label,
  description: i.description,
}));

const FORGE_OPTIONS: SelectOption<string>[] = FORGE_CATEGORY_DISPLAY.map((c) => ({
  value: c.id,
  label: c.label,
  description: c.description,
}));

const BOUNDARY_OPTIONS: SelectOption<string>[] = [
  ...BOUNDARY_PRESETS.map((b) => ({ value: b, label: b })),
  { value: BOUNDARY_CUSTOM, label: 'Write my own boundary.' },
  { value: BOUNDARY_SKIP, label: 'Skip for now.' },
];

const PATH_START_OPTIONS: SelectOption<string>[] = [
  { value: 'today', label: 'Starting today.', description: 'Begin fresh. Day 1 starts now.' },
  {
    value: 'existing',
    label: "I'm already on a path.",
    description: 'Tell the app which day you are on.',
  },
];

/** A consistent top mark on every screen so the flow has one rhythm. */
const STEP_EYEBROW: Record<OnboardingStep, string> = {
  welcome: 'Before the path begins',
  philosophy: 'Before the path begins',
  privacy: 'Before the path begins',
  intention: 'Step 1 of 4',
  vow: 'Step 2 of 4',
  forge: 'Step 3 of 4',
  boundary: 'Step 4 of 4',
  disclaimer: 'Before you begin',
  path_start: 'Your path',
  begin: 'The threshold',
};

export function OnboardingScreen() {
  const router = useRouter();
  const { complete: completeOnboarding } = useOnboarding();

  const [stepIndex, setStepIndex] = useState(0);
  const [finishing, setFinishing] = useState(false);

  // Selection state — vow and boundary start on the recommended option.
  const [intention, setIntention] = useState<string | null>(null);
  const [vowPresetId, setVowPresetId] = useState<string | null>(DEFAULT_VOW_ID);
  const [customVow, setCustomVow] = useState('');
  const [forgeCategory, setForgeCategory] = useState<string | null>(null);
  const [boundaryChoice, setBoundaryChoice] = useState<string | null>(DEFAULT_BOUNDARY);
  const [customBoundary, setCustomBoundary] = useState('');
  const [pathStartMode, setPathStartMode] = useState<string | null>('today');
  const [existingDaysText, setExistingDaysText] = useState('');

  const currentStep = ONBOARDING_STEPS[stepIndex] as OnboardingStep;

  const canAdvance = (): boolean => {
    switch (currentStep) {
      case 'intention':
        return intention !== null;
      case 'vow':
        if (vowPresetId === null) return false;
        if (vowPresetId === CUSTOM_VOW_ID) return customVow.trim().length > 0;
        return true;
      case 'forge':
        return forgeCategory !== null;
      case 'boundary':
        if (boundaryChoice === BOUNDARY_CUSTOM) return customBoundary.trim().length > 0;
        return true;
      case 'path_start': {
        if (pathStartMode === 'existing') {
          const n = parseInt(existingDaysText, 10);
          return !isNaN(n) && n >= 1 && n <= 3650;
        }
        return pathStartMode !== null;
      }
      case 'disclaimer':
      case 'begin':
      case 'welcome':
      case 'philosophy':
      case 'privacy':
        return true;
    }
  };

  const advance = () => {
    if (stepIndex < ONBOARDING_STEPS.length - 1) {
      setStepIndex((i) => i + 1);
    }
  };

  const back = () => {
    if (stepIndex > 0) setStepIndex((i) => i - 1);
  };

  const complete = async () => {
    if (!intention || !forgeCategory) return;
    setFinishing(true);
    try {
      const existingDay =
        pathStartMode === 'existing' ? parseInt(existingDaysText, 10) : 1;
      const offsetDays = !isNaN(existingDay) && existingDay > 1 ? existingDay - 1 : 0;
      const draft: OnboardingDraft = {
        vowPresetId: vowPresetId === CUSTOM_VOW_ID ? 'custom' : vowPresetId,
        customVow: vowPresetId === CUSTOM_VOW_ID ? customVow.trim() : null,
        intention: intention as IntentionId,
        forgeCategory,
        boundaryChoice,
        customBoundaryTitle: customBoundary.trim() || null,
        offsetDays,
      };
      await completeOnboarding(draft);
      router.replace(Routes.path);
    } finally {
      setFinishing(false);
    }
  };

  const resolvedVow =
    vowPresetId && vowPresetId !== CUSTOM_VOW_ID
      ? VOW_PRESETS.find((v) => v.id === vowPresetId)?.text ?? null
      : customVow.trim() || null;

  const resolvedBoundary =
    boundaryChoice === BOUNDARY_CUSTOM
      ? customBoundary.trim() || null
      : boundaryChoice === BOUNDARY_SKIP || boundaryChoice === null
        ? null
        : boundaryChoice;

  const intentionLabel = INTENTIONS.find((i) => i.id === intention)?.label ?? null;
  const forgeCategoryLabel = FORGE_CATEGORY_DISPLAY.find((c) => c.id === forgeCategory)?.label ?? null;

  const primaryLabel =
    currentStep === 'begin'
      ? 'Begin the practice'
      : currentStep === 'disclaimer'
        ? 'I acknowledge'
        : 'Continue';

  return (
    <AppScreen
      scroll
      padded={false}
      footer={
        <View style={styles.footer}>
          <AppButton
            label={primaryLabel}
            fullWidth
            loading={finishing}
            disabled={!canAdvance()}
            onPress={() => (currentStep === 'begin' ? void complete() : advance())}
          />
          {stepIndex > 0 ? (
            <AppButton label="Back" variant="ghost" fullWidth onPress={back} />
          ) : null}
        </View>
      }
    >
      <View style={styles.container}>
        <AppText variant="caption" color="accent" uppercase align="center">
          {STEP_EYEBROW[currentStep]}
        </AppText>

        {currentStep === 'welcome' && <StepWelcome />}
        {currentStep === 'philosophy' && <StepPhilosophy />}
        {currentStep === 'privacy' && <StepPrivacy />}

        {currentStep === 'intention' && (
          <>
            <AppHeader
              title="Why are you here?"
              subtitle="Choose the reason you entered this practice."
            />
            <AppSelectList options={INTENTION_OPTIONS} value={intention} onChange={setIntention} />
          </>
        )}

        {currentStep === 'vow' && (
          <>
            <AppHeader
              title="Choose your vow."
              subtitle="This is the sentence you return to when the fire rises."
            />
            <AppSelectList options={VOW_OPTIONS} value={vowPresetId} onChange={setVowPresetId} />
            {vowPresetId === CUSTOM_VOW_ID && (
              <AppTextInput
                label="Your vow"
                placeholder="Write your vow in one sentence..."
                value={customVow}
                onChangeText={setCustomVow}
                maxLength={280}
                autoFocus
              />
            )}
          </>
        )}

        {currentStep === 'forge' && (
          <>
            <AppHeader
              title="Where will you forge first?"
              subtitle="Choose where your energy will be turned into action."
            />
            <AppSelectList options={FORGE_OPTIONS} value={forgeCategory} onChange={setForgeCategory} />
          </>
        )}

        {currentStep === 'boundary' && (
          <>
            <AppHeader
              title="Guard the gates."
              subtitle="A boundary is a small rule that wins before the battle begins."
            />
            <AppSelectList options={BOUNDARY_OPTIONS} value={boundaryChoice} onChange={setBoundaryChoice} />
            {boundaryChoice === BOUNDARY_CUSTOM && (
              <AppTextInput
                label="Your boundary"
                placeholder="Name one rule you will keep..."
                value={customBoundary}
                onChangeText={setCustomBoundary}
                maxLength={160}
                autoFocus
              />
            )}
          </>
        )}

        {currentStep === 'disclaimer' && <StepDisclaimer />}

        {currentStep === 'path_start' && (
          <>
            <AppHeader
              title="Where are you?"
              subtitle="Honor the work you have already done."
            />
            <AppSelectList
              options={PATH_START_OPTIONS}
              value={pathStartMode}
              onChange={setPathStartMode}
            />
            {pathStartMode === 'existing' && (
              <AppTextInput
                label="What day are you on?"
                placeholder="e.g. 14"
                value={existingDaysText}
                onChangeText={setExistingDaysText}
                keyboardType="numeric"
                maxLength={4}
                autoFocus
              />
            )}
          </>
        )}

        {currentStep === 'begin' && (
          <StepBegin
            vow={resolvedVow}
            intention={intentionLabel}
            forgeCategory={forgeCategoryLabel}
            boundary={resolvedBoundary}
          />
        )}
      </View>
    </AppScreen>
  );
}

function StepWelcome() {
  return (
    <>
      <AppHeader
        align="center"
        title="Welcome to Retain."
        subtitle="A private practice of pause, command, and transmutation."
      />
      <AppCard tone="overlay" style={styles.centered}>
        <AppText variant="subheading" color="energy" align="center">
          {'"When the fire rises, what will you remember?"'}
        </AppText>
      </AppCard>
      <AppCard>
        <AppText variant="body" color="secondary">
          {'Retain is a practice, not a promise. It does not ask you to be perfect. It asks you to choose — every time the fire rises — whether you will obey the compulsion or govern it.'}
        </AppText>
      </AppCard>
    </>
  );
}

function StepPhilosophy() {
  return (
    <>
      <AppHeader
        title="This is not about hating desire."
        subtitle="The energy is the ally. The compulsion is the enemy. The man is never the enemy."
      />
      <AppCard>
        <AppText variant="body" color="secondary">
          {'This practice does not ask you to deny your nature, shame your body, or see desire as evil.'}
        </AppText>
        <AppText variant="body" color="secondary" style={styles.bodySpacing}>
          {'It asks you to pause. To choose. To give the energy a worthy destination.'}
        </AppText>
        <AppText variant="body" color="secondary" style={styles.bodySpacing}>
          {'The same fire that pulls you toward compulsion can be turned toward discipline, creation, courage, and depth.'}
        </AppText>
      </AppCard>
      <AppQuoteBlock quote="Desire is not evil. The body is not dirty." attribution="Retain principle" />
    </>
  );
}

function StepPrivacy() {
  const bullets = [
    'No account is created.',
    'No analytics collected.',
    'No private practice leaves your device.',
    'Works without internet.',
    'The vault belongs to you alone.',
  ];

  return (
    <>
      <AppHeader
        title="Your practice is private."
        subtitle="No account. No cloud. No public profile."
      />
      <AppCard>
        {bullets.map((bullet) => (
          <View key={bullet} style={styles.bullet}>
            <AppText variant="body" color="accent">
              {'—'}
            </AppText>
            <AppText variant="body" color="secondary" style={styles.bulletText}>
              {bullet}
            </AppText>
          </View>
        ))}
      </AppCard>
      <AppCard tone="overlay">
        <AppText variant="caption" color="muted" align="center">
          {'What you build here is between you and your practice.'}
        </AppText>
      </AppCard>
    </>
  );
}

function StepDisclaimer() {
  return (
    <>
      <AppHeader title="Before you begin." subtitle="Read and acknowledge." />
      <AppCard>
        <AppText variant="label" color="secondary">
          A note before the practice
        </AppText>
        <AppText variant="body" color="muted" style={styles.disclaimerPara}>
          {'Retain is a philosophical self-mastery, journaling, and discipline app. It is not medical advice, therapy, diagnosis, or a mental health service.'}
        </AppText>
        <AppText variant="body" color="muted" style={styles.disclaimerPara}>
          {'Retain does not diagnose, treat, cure, or prevent any condition. It makes no claims about testosterone, fertility, attraction, disease, depression, anxiety, or athletic performance.'}
        </AppText>
        <AppText variant="body" color="muted" style={styles.disclaimerPara}>
          {'The teaching draws from philosophical and historical traditions only. It is not religious authority, medical fact, or sexual technique.'}
        </AppText>
        <AppText variant="body" color="muted" style={styles.disclaimerPara}>
          {'Desire is not evil. The body is not dirty. The practice is about pause, reflection, discipline, and direction.'}
        </AppText>
      </AppCard>
    </>
  );
}

interface StepBeginProps {
  vow: string | null;
  intention: string | null;
  forgeCategory: string | null;
  boundary: string | null;
}

function StepBegin({ vow, intention, forgeCategory, boundary }: StepBeginProps) {
  return (
    <>
      <AppHeader
        align="center"
        title="The path begins in the pause."
        subtitle="Your practice is set. The work starts now."
      />
      <View style={styles.summaryList}>
        {vow ? <SummaryRow label="Vow" value={`"${vow}"`} /> : null}
        {intention ? <SummaryRow label="Intention" value={intention} /> : null}
        {forgeCategory ? <SummaryRow label="First forge" value={forgeCategory} /> : null}
        {boundary ? <SummaryRow label="First boundary" value={boundary} /> : null}
      </View>
      <AppQuoteBlock quote="The path begins in the pause." attribution="Retain" />
    </>
  );
}

function SummaryRow({ label, value }: { label: string; value: string }) {
  return (
    <AppCard tone="overlay">
      <AppText variant="caption" color="accent" uppercase>
        {label}
      </AppText>
      <AppText variant="body" color="primary">
        {value}
      </AppText>
    </AppCard>
  );
}

const styles = StyleSheet.create({
  container: {
    gap: theme.spacing.lg,
    paddingHorizontal: theme.spacing.xl,
    paddingTop: theme.spacing.xxl,
    paddingBottom: theme.spacing.xl,
  },
  footer: {
    gap: theme.spacing.sm,
    paddingHorizontal: theme.spacing.xl,
    paddingTop: theme.spacing.md,
    paddingBottom: theme.spacing.lg,
  },
  centered: { alignItems: 'center' },
  bodySpacing: { marginTop: theme.spacing.md },
  bullet: { flexDirection: 'row', gap: theme.spacing.sm, alignItems: 'flex-start' },
  bulletText: { flex: 1 },
  disclaimerPara: { marginTop: theme.spacing.md },
  summaryList: { gap: theme.spacing.sm },
});
