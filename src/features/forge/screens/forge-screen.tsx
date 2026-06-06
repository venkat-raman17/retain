import { useState } from 'react';
import { StyleSheet, View } from 'react-native';

import {
  AppButton,
  AppCard,
  AppChip,
  AppEmptyState,
  AppHeader,
  AppScreen,
  AppSelectList,
  AppText,
  AppTextInput,
  type SelectOption,
  EmberSigil,
  FadeInRise,
  FORGE_GLYPHS,
  NoForgeSymbol,
  ScreenCrest,
  symbolStroke,
} from '@/shared/components';
import { theme } from '@/shared/design';

import {
  FORGE_CATEGORIES,
  type ForgeActDraft,
  type ForgeCategory,
} from '../domain/forge-act';
import { useForge } from '../hooks/use-forge';

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

function formatDate(iso: string): string {
  const d = new Date(iso);
  return d.toLocaleDateString(undefined, { month: 'short', day: 'numeric' });
}

function actCountLabel(count: number): string {
  return count === 1 ? '1 act' : `${count} acts`;
}

export function ForgeScreen() {
  const { acts, categoryCounts, loading, logAct } = useForge();
  const [showForm, setShowForm] = useState(false);
  const [saving, setSaving] = useState(false);

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
          <AppHeader
            eyebrow="Forge"
            eyebrowColor="energy"
            title="What are you building?"
            subtitle="Name the act. Give the fire a destination."
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
        <View>
          <ScreenCrest>
            <EmberSigil size={110} color={theme.colors.textMuted} strokeWidth={symbolStroke(110)} />
          </ScreenCrest>
          <AppHeader
            eyebrow="Forge"
            eyebrowColor="energy"
            title="Turn the fire into action."
            subtitle="Raw desire becomes strength through direction."
          />
        </View>

        <AppButton
          label="Log a Forge Act"
          fullWidth
          onPress={() => setShowForm(true)}
        />

        {acts.length > 0 ? (
          <AppCard>
            <AppText variant="caption" color="muted" uppercase>
              Category distribution
            </AppText>
            <View style={styles.distList}>
              {FORGE_CATEGORIES.map((cat) => {
                const count = categoryCounts.find((c) => c.category === cat)?.count ?? 0;
                const Glyph = FORGE_GLYPHS[cat];
                return (
                  <View key={cat} style={styles.distRow}>
                    <View style={styles.distLabel}>
                      {Glyph ? <Glyph size={20} color={theme.colors.textMuted} strokeWidth={symbolStroke(20)} /> : null}
                      <AppText variant="body" color={count > 0 ? 'secondary' : 'muted'}>
                        {cat.charAt(0).toUpperCase() + cat.slice(1)}
                      </AppText>
                    </View>
                    <AppText variant="body" color={count > 0 ? 'energy' : 'muted'}>
                      {actCountLabel(count)}
                    </AppText>
                  </View>
                );
              })}
            </View>
          </AppCard>
        ) : null}

        {loading ? (
          <AppCard>
            <AppText variant="body" color="muted" align="center">
              Loading...
            </AppText>
          </AppCard>
        ) : acts.length === 0 ? (
          <View style={styles.emptyState}>
            <NoForgeSymbol size={56} color={theme.colors.textMuted} />
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
                    {Glyph ? <Glyph size={18} color={theme.colors.ember} strokeWidth={symbolStroke(18)} /> : null}
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
  distList: { gap: theme.spacing.sm, marginTop: theme.spacing.sm },
  distRow: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' },
  distLabel: { flexDirection: 'row', alignItems: 'center', gap: theme.spacing.sm },
  list: { gap: theme.spacing.sm },
  actCard: { gap: theme.spacing.xs },
  actCategoryRow: { flexDirection: 'row', alignItems: 'center', gap: theme.spacing.sm },
  actNote: { marginTop: theme.spacing.xs },
  emptyState: { gap: theme.spacing.md, alignItems: 'center' },
  durationSection: { gap: theme.spacing.sm },
  chipRow: { flexDirection: 'row', flexWrap: 'wrap', gap: theme.spacing.sm },
});
