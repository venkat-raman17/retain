import { useState } from 'react';
import { useRouter } from 'expo-router';
import { StyleSheet, View } from 'react-native';

import {
  AppButton,
  AppCard,
  AppHero,
  AppQuoteBlock,
  AppScreen,
  AppSelectList,
  AppText,
  AppTextInput,
  SealArt,
  type SelectOption,
} from '@/shared/components';
import { copy } from '@/content';
import { theme } from '@/shared/design';
import { useSurfaceTone } from '@/shared/hooks';
import { Routes } from '@/navigation';
import { TRIGGER_LABELS, TRIGGER_TYPES, type TriggerType } from '@/features/pause/domain/urge-log';

import type { Achievement } from '@/content/schemas';
import type { LapseRecordDraft } from '../domain/lapse-record';
import { usePath } from '../hooks/use-path';
import { useHonors } from '@/features/honors/hooks/use-honors';

type LapseStep = 'entry' | 'understand' | 'learn' | 'return';

const TRIGGER_OPTIONS: SelectOption<TriggerType>[] = TRIGGER_TYPES.map((t) => ({
  value: t,
  label: TRIGGER_LABELS[t],
}));

export function LapseScreen() {
  const router = useRouter();
  const { vow, recordLapse, recordReturn } = usePath();
  const { checkAndAward } = useHonors();

  const [step, setStep] = useState<LapseStep>('entry');
  // The screen's tone shifts from rust (grave) to olive (return) as the man moves
  // through the steps — the visual arc reinforces "learn, then return."
  const tone = useSurfaceTone({ kind: 'semantic', name: step === 'return' ? 'success' : 'danger' });
  const [triggerType, setTriggerType] = useState<TriggerType | null>(null);
  const [stateBefore, setStateBefore] = useState('');
  const [lesson, setLesson] = useState('');
  const [nextCleanAction, setNextCleanAction] = useState('');
  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);
  const [submittedMode, setSubmittedMode] = useState<'lapse' | 'return' | null>(null);
  const [newHonors, setNewHonors] = useState<Achievement[]>([]);

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
        const awarded = await checkAndAward();
        setNewHonors(awarded);
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
            <AppHero
              tone={tone}
              eyebrow="Lapse"
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
              <AppButton
                label={copy.safety.link}
                variant="ghost"
                fullWidth
                onPress={() => router.push(Routes.safety)}
              />
            </View>
          </>
        )}

        {step === 'understand' && (
          <>
            <AppHero
              tone={tone}
              eyebrow="Understand"
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
            <AppHero
              tone={tone}
              eyebrow="Learn"
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
            <AppHero
              tone={tone}
              eyebrow="Return"
              title="Return."
              subtitle="The practice continues."
              art={<SealArt source={{ kind: 'archetype', archetype: 'healer' }} size={80} color={tone.text} />}
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
              attribution="Manforge principle"
            />

            {saved && submittedMode === 'return' ? (
              <AppCard tone="overlay">
                <AppText variant="body" color="energy" align="center">
                  {'The return is itself the practice.'}
                </AppText>
                <AppText variant="caption" color="secondary" align="center" style={styles.spacing}>
                  {'A lapse ends a streak. It does not end the practice.'}
                </AppText>
              </AppCard>
            ) : null}

            {saved && submittedMode === 'return' && newHonors.length > 0 ? (
              <AppCard tone="raised" border="gold">
                <AppText variant="caption" color="energy" uppercase align="center">
                  {newHonors.length === 1 ? 'Honor unlocked' : 'Honors unlocked'}
                </AppText>
                {newHonors.map((h) => (
                  <AppText key={h.id} variant="label" color="primary" align="center">
                    {h.title}
                  </AppText>
                ))}
              </AppCard>
            ) : null}

            {saved && submittedMode ? (
              <View style={styles.nav}>
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
