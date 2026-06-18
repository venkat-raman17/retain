import { useCallback, useState } from 'react';
import { useFocusEffect } from 'expo-router';
import { StyleSheet, View } from 'react-native';

import { copy } from '@/content';
import {
  AppButton,
  AppCard,
  AppChip,
  AppEmptyState,
  AppHero,
  AppScreen,
  AppSelectList,
  AppText,
  AppTextInput,
  type SelectOption,
  Bento,
  BentoItem,
  EmberSigil,
  FadeInRise,
  FORGE_GLYPHS,
  NoForgeSymbol,
  SealArt,
  symbolStroke,
} from '@/shared/components';
import { theme } from '@/shared/design';
import { useSurfaceTone } from '@/shared/hooks';
import { useTheme } from '@/shared/hooks/use-theme';

import {
  FORGE_CATEGORIES,
  type ForgeActDraft,
  type ForgeCategory,
} from '../domain/forge-act';
import { useForge } from '../hooks/use-forge';
import { useTodaysObjective } from '../hooks/use-todays-objective';
import { useHonors } from '@/features/honors/hooks/use-honors';

const FORGE_TITLE_MAX = 200;

const CATEGORY_DESCRIPTIONS: Record<ForgeCategory, string> = {
  body: 'Train, move, breathwork, cold exposure.',
  mind: 'Study, deep work, plan, solve.',
  spirit: 'Pray, meditate, silence, gratitude.',
  order: 'Clean, organize, prepare, repair.',
  creation: 'Write, build, draw, practice.',
  brotherhood: 'Call, serve, speak honestly.',
};

const CATEGORY_OPTIONS: SelectOption<ForgeCategory>[] = FORGE_CATEGORIES.map((c) => ({
  value: c,
  label: c.charAt(0).toUpperCase() + c.slice(1),
  description: CATEGORY_DESCRIPTIONS[c],
}));

const DURATION_CHIPS: { label: string; value: number | 'custom' }[] = [
  { label: '5 min', value: 5 },
  { label: '15 min', value: 15 },
  { label: '30 min', value: 30 },
  { label: '60 min', value: 60 },
  { label: 'Custom', value: 'custom' },
];

function cap(s: string): string {
  return s.charAt(0).toUpperCase() + s.slice(1);
}

function formatDate(iso: string): string {
  const d = new Date(iso);
  return d.toLocaleDateString(undefined, { month: 'short', day: 'numeric' });
}

function actCountLabel(count: number): string {
  return count === 1 ? '1 act' : `${count} acts`;
}

export function ForgeScreen() {
  const { acts, categoryCounts, loading, logAct } = useForge();
  const { checkAndAward } = useHonors();
  const { objective, refresh: refreshObjective } = useTodaysObjective();
  const { colors } = useTheme();
  const tone = useSurfaceTone({ kind: 'semantic', name: 'primary' });
  const objectiveTone = useSurfaceTone({ kind: 'arc', arcNumber: objective?.arcNumber ?? 1 });
  const [showForm, setShowForm] = useState(false);
  const [saving, setSaving] = useState(false);

  useFocusEffect(useCallback(() => refreshObjective(), [refreshObjective]));

  const [category, setCategory] = useState<ForgeCategory | null>(null);
  const [title, setTitle] = useState('');
  const [selectedDuration, setSelectedDuration] = useState<number | 'custom' | null>(null);
  const [customDurationText, setCustomDurationText] = useState('');
  const [reflection, setReflection] = useState('');
  const [formError, setFormError] = useState<string | null>(null);

  const canSubmit = category !== null && title.trim().length > 0;

  const resetForm = () => {
    setCategory(null);
    setTitle('');
    setSelectedDuration(null);
    setCustomDurationText('');
    setReflection('');
    setFormError(null);
  };

  // Accept the day's forge challenge: prefill the act title from the bundled
  // challenge text, leaving the category for the user to choose (the challenge
  // is free text). Logging any act today clears the day's forge objective.
  const acceptChallenge = () => {
    if (!objective) return;
    resetForm();
    setTitle(objective.forgeChallenge.slice(0, FORGE_TITLE_MAX));
    setShowForm(true);
  };

  const submit = async () => {
    if (!category) { setFormError('Choose a category.'); return; }
    if (!title.trim()) { setFormError('Name the act.'); return; }
    setFormError(null);
    setSaving(true);
    try {
      let durationMinutes: number | null = null;
      if (selectedDuration === 'custom') {
        durationMinutes = customDurationText.trim() ? parseInt(customDurationText.trim(), 10) || null : null;
      } else {
        durationMinutes = selectedDuration;
      }
      const draft: ForgeActDraft = {
        category,
        title: title.trim(),
        durationMinutes,
        linkedUrgeId: null,
        note: reflection.trim() || null,
      };
      await logAct(draft);
      void checkAndAward();
      refreshObjective();
      resetForm();
      setShowForm(false);
    } finally {
      setSaving(false);
    }
  };

  if (showForm) {
    return (
      <AppScreen scroll>
        <View style={styles.container}>
          <AppHero
            tone={tone}
            eyebrow="Forge"
            title="What are you building?"
            subtitle="Name the act. Give the fire a destination."
            art={<EmberSigil size={84} color={tone.text} strokeWidth={symbolStroke(84)} />}
          />

          <AppCard>
            <AppText variant="caption" color="energy" uppercase>
              Category
            </AppText>
            <AppSelectList
              options={CATEGORY_OPTIONS}
              value={category}
              onChange={(v) => { setCategory(v); setFormError(null); }}
            />
          </AppCard>

          <AppTextInput
            label="Name the act"
            placeholder="Train, clean, build, study, serve..."
            value={title}
            onChangeText={setTitle}
            maxLength={200}
          />

          <View style={styles.durationSection}>
            <AppText variant="caption" color="muted" uppercase>
              Duration
            </AppText>
            <View style={styles.chipRow}>
              {DURATION_CHIPS.map((chip) => (
                <AppChip
                  key={String(chip.value)}
                  label={chip.label}
                  selected={selectedDuration === chip.value}
                  tone="energy"
                  onPress={() => {
                    setSelectedDuration(selectedDuration === chip.value ? null : chip.value);
                    if (chip.value !== 'custom') setCustomDurationText('');
                  }}
                />
              ))}
            </View>
            {selectedDuration === 'custom' ? (
              <AppTextInput
                placeholder="Minutes"
                value={customDurationText}
                onChangeText={setCustomDurationText}
                keyboardType="number-pad"
                maxLength={4}
              />
            ) : null}
          </View>

          <AppTextInput
            label="Reflection optional"
            placeholder="What changed after the act?"
            value={reflection}
            onChangeText={setReflection}
            multiline
            maxLength={2000}
          />

          {formError ? (
            <AppText variant="caption" color="support">
              {formError}
            </AppText>
          ) : null}

          <View style={styles.nav}>
            <AppButton
              label="Record the act"
              fullWidth
              loading={saving}
              disabled={!canSubmit}
              onPress={() => void submit()}
            />
            <AppButton
              label="Cancel"
              variant="ghost"
              fullWidth
              onPress={() => { resetForm(); setShowForm(false); }}
            />
          </View>
        </View>
      </AppScreen>
    );
  }

  return (
    <AppScreen scroll>
      <View style={styles.container}>
        <AppHero
          tone={tone}
          eyebrow="Forge"
          title="Turn the fire into action."
          subtitle="Raw desire becomes strength through direction."
          art={<EmberSigil size={84} color={tone.text} strokeWidth={symbolStroke(84)} />}
        />

        {/* Today's Forge — the day's written challenge, surfaced as the objective. */}
        {objective ? (
          <AppCard
            tone={objective.alreadyDoneToday ? 'raised' : 'overlay'}
            border={objective.alreadyDoneToday ? 'gold' : 'ember'}
          >
            <View style={styles.objectiveHead}>
              <AppText variant="caption" uppercase style={{ color: objectiveTone.text }}>
                {`${copy.forge.todaysObjective.label} · Day ${objective.day}`}
              </AppText>
              {objective.archetype ? (
                <SealArt
                  source={{ kind: 'archetype', archetype: objective.archetype }}
                  size={34}
                  color={objective.alreadyDoneToday ? colors.gold : objectiveTone.base}
                />
              ) : null}
            </View>
            <AppText variant="body" color="secondary">
              {objective.forgeChallenge}
            </AppText>
            {objective.alreadyDoneToday ? (
              <AppText variant="caption" color="energy">
                {`✓ ${copy.forge.todaysObjective.done}`}
              </AppText>
            ) : (
              <AppButton
                label={copy.forge.todaysObjective.accept}
                fullWidth
                onPress={acceptChallenge}
              />
            )}
          </AppCard>
        ) : null}

        <AppButton
          label={copy.path.logForge}
          variant={objective && !objective.alreadyDoneToday ? 'secondary' : 'primary'}
          fullWidth
          onPress={() => setShowForm(true)}
        />

        {acts.length > 0 ? (
          <>
            <AppText variant="caption" color="muted" uppercase>
              Category distribution
            </AppText>
            <Bento>
              {FORGE_CATEGORIES.map((cat) => {
                const count = categoryCounts.find((c) => c.category === cat)?.count ?? 0;
                const Glyph = FORGE_GLYPHS[cat];
                const active = count > 0;
                return (
                  <BentoItem key={cat}>
                    <AppCard tone={active ? 'raised' : 'overlay'} style={styles.catTile}>
                      {Glyph ? (
                        <Glyph size={26} color={active ? tone.text : colors.textMuted} strokeWidth={symbolStroke(26)} />
                      ) : null}
                      <AppText variant="label" color={active ? 'primary' : 'muted'}>
                        {cap(cat)}
                      </AppText>
                      <AppText variant="caption" color={active ? 'energy' : 'muted'}>
                        {actCountLabel(count)}
                      </AppText>
                    </AppCard>
                  </BentoItem>
                );
              })}
            </Bento>
          </>
        ) : null}

        {loading ? (
          <AppCard>
            <AppText variant="body" color="muted" align="center">
              Loading...
            </AppText>
          </AppCard>
        ) : acts.length === 0 ? (
          <View style={styles.emptyState}>
            <NoForgeSymbol size={64} color={colors.textMuted} />
            <AppEmptyState
              title="No forge acts recorded yet."
              message="When the fire rises, turn it into one visible action."
              actionLabel="Log a Forge Act"
              onAction={() => setShowForm(true)}
            />
          </View>
        ) : (
          <>
            <AppText variant="caption" color="muted" uppercase>
              Recent acts
            </AppText>
            <View style={styles.list}>
              {acts.map((act, index) => {
                const Glyph = FORGE_GLYPHS[act.category];
                return (
                <FadeInRise key={act.id} index={Math.min(index, 8)}>
                <AppCard tone="overlay" style={styles.actCard}>
                  <View style={styles.actCategoryRow}>
                    {Glyph ? <Glyph size={18} color={colors.ember} strokeWidth={symbolStroke(18)} /> : null}
                    <AppText variant="caption" color="energy" uppercase>
                      {act.category}
                    </AppText>
                  </View>
                  <AppText variant="subheading">{act.title}</AppText>
                  <AppText variant="caption" color="muted">
                    {act.durationMinutes
                      ? `${act.durationMinutes} min · ${formatDate(act.occurredAt)}`
                      : formatDate(act.occurredAt)}
                  </AppText>
                  {act.note ? (
                    <AppText variant="body" color="secondary" style={styles.actNote}>
                      {'Reflection: '}{act.note}
                    </AppText>
                  ) : null}
                </AppCard>
                </FadeInRise>
                );
              })}
            </View>
          </>
        )}
      </View>
    </AppScreen>
  );
}

const styles = StyleSheet.create({
  container: { gap: theme.spacing.lg },
  nav: { gap: theme.spacing.sm },
  catTile: { gap: theme.spacing.xs, alignItems: 'flex-start' },
  list: { gap: theme.spacing.sm },
  actCard: { gap: theme.spacing.xs },
  actCategoryRow: { flexDirection: 'row', alignItems: 'center', gap: theme.spacing.sm },
  actNote: { marginTop: theme.spacing.xs },
  emptyState: { gap: theme.spacing.md, alignItems: 'center' },
  durationSection: { gap: theme.spacing.sm },
  chipRow: { flexDirection: 'row', flexWrap: 'wrap', gap: theme.spacing.sm },
  objectiveHead: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' },
});
