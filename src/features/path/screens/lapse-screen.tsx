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
import { TRIGGER_LABELS, TRIGGER_TYPES, type TriggerType } from '@/features/pause/domain/urge-log';

import type { LapseRecordDraft } from '../domain/lapse-record';
import { usePath } from '../hooks/use-path';

type LapseStep = 'entry' | 'understand' | 'learn' | 'return';

const TRIGGER_OPTIONS: SelectOption<TriggerType>[] = TRIGGER_TYPES.map((t) => ({
  value: t,
  label: TRIGGER_LABELS[t],
}));

export function LapseScreen() {
  const router = useRouter();
  const { vow, recordLapse, recordReturn } = usePath();

  const [step, setStep] = useState<LapseStep>('entry');
  const [triggerType, setTriggerType] = useState<TriggerType | null>(null);
  const [stateBefore, setStateBefore] = useState('');
  const [lesson, setLesson] = useState('');
  const [nextCleanAction, setNextCleanAction] = useState('');
  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);
  const [submittedMode, setSubmittedMode] = useState<'lapse' | 'return' | null>(null);

  const goToReturn = () => setStep('return');

  const submitLapse = async (andReturn: boolean) => {
    setSaving(true);
    try {
      const draft: LapseRecordDraft = {
        triggerType,
        stateBefore: stateBefore.trim() || null,
        lesson: lesson.trim() || null,
        nextCleanAction: nextCleanAction.trim() || null,
        shameSpiralInterrupted: true,
        note: null,
      };
      await recordLapse(draft);
      if (andReturn) {
        await recordReturn();
        setSubmittedMode('return');
      } else {
        setSubmittedMode('lapse');
      }
      setSaved(true);
    } finally {
      setSaving(false);
    }
  };

  return (
    <AppScreen scroll>
      <View style={styles.container}>
        {step === 'entry' && (
          <>
            <AppHeader
              title="Record a lapse without shame."
              subtitle="A lapse ends a streak. It does not end the practice."
            />
            <AppCard tone="overlay">
              <AppText variant="body" color="secondary">
                {'Do not dramatize it. Do not hide it.'}
              </AppText>
              <AppText variant="body" color="secondary" style={styles.spacing}>
                {'Name what happened. Learn the pattern. Return.'}
              </AppText>
            </AppCard>
            <AppCard>
              <AppText variant="body" color="muted" align="center">
                {'You are not your lapse.'}
              </AppText>
            </AppCard>
            <View style={styles.nav}>
              <AppButton
                label="I am ready to reflect"
                fullWidth
                onPress={() => setStep('understand')}
              />
              <AppButton
                label="Just record and return"
                variant="ghost"
                fullWidth
                onPress={() => void goToReturn()}
              />
            </View>
          </>
        )}

        {step === 'understand' && (
          <>
            <AppHeader
              title="What happened?"
              subtitle="Name it clearly. The unnamed pattern repeats."
            />

            <AppCard>
              <AppText variant="caption" color="muted" uppercase>
                What triggered it?
              </AppText>
              <AppSelectList
                options={TRIGGER_OPTIONS}
                value={triggerType}
                onChange={setTriggerType}
              />
            </AppCard>

            <AppTextInput
              label="What happened before?"
              placeholder="Describe the state, situation, or sequence..."
              value={stateBefore}
              onChangeText={setStateBefore}
              multiline
              maxLength={2000}
            />

            <View style={styles.nav}>
              <AppButton label="Continue" fullWidth onPress={() => setStep('learn')} />
              <AppButton label="Back" variant="ghost" fullWidth onPress={() => setStep('entry')} />
            </View>
          </>
        )}

        {step === 'learn' && (
          <>
            <AppHeader
              title="Study it. Do not worship it."
              subtitle="One insight. One action. That is enough."
            />

            <AppTextInput
              label="What lie did the urge tell you?"
              placeholder="What story made it feel justified or inevitable?"
              value={lesson}
              onChangeText={setLesson}
              multiline
              maxLength={2000}
            />

            <AppTextInput
              label="What is your next clean action?"
              placeholder="One small act. Right now."
              value={nextCleanAction}
              onChangeText={setNextCleanAction}
              multiline
              maxLength={2000}
            />

            <View style={styles.nav}>
              <AppButton label="Continue" fullWidth onPress={() => void goToReturn()} />
              <AppButton
                label="Back"
                variant="ghost"
                fullWidth
                onPress={() => setStep('understand')}
              />
            </View>
          </>
        )}

        {step === 'return' && (
          <>
            <AppHeader
              title="Return."
              subtitle="The practice continues."
            />

            {vow ? (
              <AppCard tone="overlay" border="gold">
                <AppText variant="caption" color="muted" uppercase>
                  Your vow
                </AppText>
                <AppQuoteBlock quote={vow} attribution="Return to this" />
              </AppCard>
            ) : null}

            <AppCard>
              <AppText variant="body" color="secondary" align="center">
                {'One clean action now.'}
              </AppText>
              {nextCleanAction ? (
                <AppText variant="label" color="energy" align="center" style={styles.spacing}>
                  {nextCleanAction}
                </AppText>
              ) : null}
            </AppCard>

            <AppQuoteBlock
              quote="Command is trained in the return."
              attribution="Retain principle"
            />

            {saved && submittedMode ? (
              <View style={styles.nav}>
                <AppButton
                  label={
                    submittedMode === 'return'
                      ? 'Journal this return'
                      : 'Journal this lapse'
                  }
                  variant="ghost"
                  fullWidth
                  onPress={() =>
                    router.push({
                      pathname: Routes.journal,
                      params: { initialType: submittedMode },
                    })
                  }
                />
                <AppButton
                  label="Continue to the Path"
                  fullWidth
                  onPress={() => router.replace(Routes.path)}
                />
              </View>
            ) : (
              <View style={styles.nav}>
                <AppButton
                  label="Return to the Path"
                  fullWidth
                  loading={saving}
                  onPress={() => void submitLapse(true)}
                />
                <AppButton
                  label="Record lapse — rest before returning"
                  variant="ghost"
                  fullWidth
                  loading={saving}
                  onPress={() => void submitLapse(false)}
                />
              </View>
            )}
          </>
        )}
      </View>
    </AppScreen>
  );
}

const styles = StyleSheet.create({
  container: { gap: theme.spacing.lg },
  nav: { gap: theme.spacing.sm },
  spacing: { marginTop: theme.spacing.sm },
});
