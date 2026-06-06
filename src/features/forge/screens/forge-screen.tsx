import { useState } from 'react';
import { StyleSheet, View } from 'react-native';

import {
  AppButton,
  AppCard,
  AppEmptyState,
  AppHeader,
  AppScreen,
  AppSelectList,
  AppText,
  AppTextInput,
  type SelectOption,
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

function formatDate(iso: string): string {
  const d = new Date(iso);
  return d.toLocaleDateString(undefined, { month: 'short', day: 'numeric' });
}

export function ForgeScreen() {
  const { acts, categoryCounts, loading, logAct } = useForge();
  const [showForm, setShowForm] = useState(false);
  const [saving, setSaving] = useState(false);

  // Form state
  const [category, setCategory] = useState<ForgeCategory | null>(null);
  const [title, setTitle] = useState('');
  const [durationText, setDurationText] = useState('');
  const [note, setNote] = useState('');
  const [formError, setFormError] = useState<string | null>(null);

  const resetForm = () => {
    setCategory(null);
    setTitle('');
    setDurationText('');
    setNote('');
    setFormError(null);
  };

  const submit = async () => {
    if (!category) { setFormError('Choose a category.'); return; }
    if (!title.trim()) { setFormError('Name the act.'); return; }
    setFormError(null);
    setSaving(true);
    try {
      const draft: ForgeActDraft = {
        category,
        title: title.trim(),
        durationMinutes: durationText.trim() ? parseInt(durationText.trim(), 10) || null : null,
        linkedUrgeId: null,
        note: note.trim() || null,
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
            placeholder="Train, read, build, pray..."
            value={title}
            onChangeText={setTitle}
            maxLength={200}
          />

          <AppTextInput
            label="Duration (minutes, optional)"
            placeholder="30"
            value={durationText}
            onChangeText={setDurationText}
            keyboardType="number-pad"
            maxLength={4}
          />

          <AppTextInput
            label="Note (optional)"
            placeholder="How did it go?"
            value={note}
            onChangeText={setNote}
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
        <AppHeader
          eyebrow="Forge"
          eyebrowColor="energy"
          title="Turn the fire into action."
          subtitle="Raw desire becomes strength through direction."
        />

        <AppButton
          label="Log a Forge Act"
          fullWidth
          onPress={() => setShowForm(true)}
        />

        {/* Category distribution — readable totals for every category */}
        {acts.length > 0 ? (
          <AppCard>
            <AppText variant="caption" color="muted" uppercase>
              Category distribution
            </AppText>
            <View style={styles.distList}>
              {FORGE_CATEGORIES.map((cat) => {
                const count = categoryCounts.find((c) => c.category === cat)?.count ?? 0;
                return (
                  <View key={cat} style={styles.distRow}>
                    <AppText variant="body" color={count > 0 ? 'secondary' : 'muted'}>
                      {cat.charAt(0).toUpperCase() + cat.slice(1)}
                    </AppText>
                    <AppText variant="body" color={count > 0 ? 'energy' : 'muted'}>
                      {count === 1 ? '1 act' : `${count}`}
                    </AppText>
                  </View>
                );
              })}
            </View>
          </AppCard>
        ) : null}

        {/* Recent acts */}
        <AppText variant="caption" color="muted" uppercase>
          Recent acts
        </AppText>

        {loading ? (
          <AppCard>
            <AppText variant="body" color="muted" align="center">
              Loading...
            </AppText>
          </AppCard>
        ) : acts.length === 0 ? (
          <AppEmptyState
            title="No forge acts recorded yet."
            message="When the fire rises, turn it into one visible action."
            actionLabel="Log a Forge Act"
            onAction={() => setShowForm(true)}
          />
        ) : (
          <View style={styles.list}>
            {acts.map((act) => (
              <AppCard key={act.id} tone="overlay" style={styles.actCard}>
                <AppText variant="caption" color="energy" uppercase>
                  {act.category}
                </AppText>
                <AppText variant="subheading">{act.title}</AppText>
                <AppText variant="caption" color="muted">
                  {act.durationMinutes
                    ? `${act.durationMinutes} min · ${formatDate(act.occurredAt)}`
                    : formatDate(act.occurredAt)}
                </AppText>
                {act.note ? (
                  <AppText variant="body" color="secondary" style={styles.actNote}>
                    {act.note}
                  </AppText>
                ) : null}
              </AppCard>
            ))}
          </View>
        )}

        <AppCard tone="overlay">
          <AppText variant="caption" color="muted" align="center">
            {'Do not waste the fire. Forge it.'}
          </AppText>
        </AppCard>
      </View>
    </AppScreen>
  );
}

const styles = StyleSheet.create({
  container: { gap: theme.spacing.lg },
  nav: { gap: theme.spacing.sm },
  distList: { gap: theme.spacing.sm, marginTop: theme.spacing.sm },
  distRow: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' },
  list: { gap: theme.spacing.sm },
  actCard: { gap: theme.spacing.xs },
  actNote: { marginTop: theme.spacing.xs },
});
