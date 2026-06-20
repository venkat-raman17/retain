import { useState } from 'react';
import { useRouter } from 'expo-router';
import { StyleSheet, View } from 'react-native';

import { copy } from '@/content';
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

const PATH_START_OPTIONS: SelectOption<string>[] = [
  {
    value: 'today',
    label: copy.onboarding.pathStart.today.label,
    description: copy.onboarding.pathStart.today.description,
  },
  {
    value: 'existing',
    label: copy.onboarding.pathStart.existing.label,
    description: copy.onboarding.pathStart.existing.description,
  },
];

/** A consistent top mark on every screen so the flow has one rhythm. */
const STEP_EYEBROW: Record<OnboardingStep, string> = {
  welcome: copy.onboarding.eyebrow.intro,
  philosophy: copy.onboarding.eyebrow.intro,
  privacy: copy.onboarding.eyebrow.intro,
  intention: 'Step 1 of 3',
  vow: 'Step 2 of 3',
  forge: 'Step 3 of 3',
  disclaimer: copy.onboarding.eyebrow.disclaimer,
  path_start: copy.onboarding.eyebrow.pathStart,
  begin: copy.onboarding.eyebrow.threshold,
};

export function OnboardingScreen() {
  const router = useRouter();
  const { complete: completeOnboarding } = useOnboarding();

  const [stepIndex, setStepIndex] = useState(0);
  const [finishing, setFinishing] = useState(false);

  // Selection state — vow starts on the recommended option.
  const [intention, setIntention] = useState<string | null>(null);
  const [vowPresetId, setVowPresetId] = useState<string | null>(DEFAULT_VOW_ID);
  const [customVow, setCustomVow] = useState('');
  const [forgeCategory, setForgeCategory] = useState<string | null>(null);
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

  const intentionLabel = INTENTIONS.find((i) => i.id === intention)?.label ?? null;
  const forgeCategoryLabel = FORGE_CATEGORY_DISPLAY.find((c) => c.id === forgeCategory)?.label ?? null;

  const primaryLabel =
    currentStep === 'begin'
      ? copy.onboarding.actions.begin
      : currentStep === 'disclaimer'
        ? copy.onboarding.actions.acknowledge
        : copy.onboarding.actions.continue;

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
            <AppButton label={copy.onboarding.actions.back} variant="ghost" fullWidth onPress={back} />
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
              title={copy.onboarding.intention.title}
              subtitle={copy.onboarding.intention.subtitle}
            />
            <AppSelectList options={INTENTION_OPTIONS} value={intention} onChange={setIntention} />
          </>
        )}

        {currentStep === 'vow' && (
          <>
            <AppHeader
              title={copy.onboarding.vow.title}
              subtitle={copy.onboarding.vow.subtitle}
            />
            <AppSelectList options={VOW_OPTIONS} value={vowPresetId} onChange={setVowPresetId} />
            {vowPresetId === CUSTOM_VOW_ID && (
              <AppTextInput
                label={copy.onboarding.vow.customLabel}
                placeholder={copy.onboarding.vow.customPlaceholder}
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
              title={copy.onboarding.forge.title}
              subtitle={copy.onboarding.forge.subtitle}
            />
            <AppSelectList options={FORGE_OPTIONS} value={forgeCategory} onChange={setForgeCategory} />
          </>
        )}

        {currentStep === 'disclaimer' && <StepDisclaimer />}

        {currentStep === 'path_start' && (
          <>
            <AppHeader
              title={copy.onboarding.pathStart.title}
              subtitle={copy.onboarding.pathStart.subtitle}
            />
            <AppSelectList
              options={PATH_START_OPTIONS}
              value={pathStartMode}
              onChange={setPathStartMode}
            />
            {pathStartMode === 'existing' && (
              <AppTextInput
                label={copy.onboarding.pathStart.existingLabel}
                placeholder={copy.onboarding.pathStart.existingPlaceholder}
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
        title={copy.onboarding.welcome.title}
        subtitle={copy.onboarding.welcome.subtitle}
      />
      <AppCard tone="overlay" style={styles.centered}>
        <AppText variant="subheading" color="energy" align="center">
          {copy.onboarding.welcome.quote}
        </AppText>
      </AppCard>
      <AppCard>
        <AppText variant="body" color="secondary">
          {copy.onboarding.welcome.body}
        </AppText>
      </AppCard>
    </>
  );
}

function StepPhilosophy() {
  return (
    <>
      <AppHeader
        title={copy.onboarding.philosophy.title}
        subtitle={copy.onboarding.philosophy.subtitle}
      />
      <AppCard>
        {copy.onboarding.philosophy.body.map((paragraph, index) => (
          <AppText
            key={paragraph}
            variant="body"
            color="secondary"
            style={index > 0 ? styles.bodySpacing : undefined}
          >
            {paragraph}
          </AppText>
        ))}
      </AppCard>
      <AppQuoteBlock
        quote={copy.onboarding.philosophy.quote}
        attribution={copy.onboarding.philosophy.quoteAttribution}
      />
    </>
  );
}

function StepPrivacy() {
  return (
    <>
      <AppHeader
        title={copy.onboarding.privacy.title}
        subtitle={copy.onboarding.privacy.subtitle}
      />
      <AppCard>
        {copy.onboarding.privacy.bullets.map((bullet) => (
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
          {copy.onboarding.privacy.footer}
        </AppText>
      </AppCard>
    </>
  );
}

function StepDisclaimer() {
  return (
    <>
      <AppHeader
        title={copy.onboarding.disclaimer.title}
        subtitle={copy.onboarding.disclaimer.subtitle}
      />
      <AppCard>
        <AppText variant="label" color="secondary">
          {copy.onboarding.disclaimer.cardTitle}
        </AppText>
        {copy.onboarding.disclaimer.paragraphs.map((paragraph) => (
          <AppText key={paragraph} variant="body" color="muted" style={styles.disclaimerPara}>
            {paragraph}
          </AppText>
        ))}
      </AppCard>
    </>
  );
}

interface StepBeginProps {
  vow: string | null;
  intention: string | null;
  forgeCategory: string | null;
}

function StepBegin({ vow, intention, forgeCategory }: StepBeginProps) {
  return (
    <>
      <AppHeader
        align="center"
        title={copy.onboarding.begin.title}
        subtitle={copy.onboarding.begin.subtitle}
      />
      <View style={styles.summaryList}>
        {vow ? <SummaryRow label={copy.onboarding.begin.summaryLabels.vow} value={`"${vow}"`} /> : null}
        {intention ? (
          <SummaryRow label={copy.onboarding.begin.summaryLabels.intention} value={intention} />
        ) : null}
        {forgeCategory ? (
          <SummaryRow label={copy.onboarding.begin.summaryLabels.forge} value={forgeCategory} />
        ) : null}
      </View>
      <AppQuoteBlock
        quote={copy.onboarding.begin.quote}
        attribution={copy.onboarding.begin.quoteAttribution}
      />
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
