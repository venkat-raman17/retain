import { useMemo, useState } from 'react';
import { Alert, StyleSheet, View } from 'react-native';

import { getPromptByType } from '@/content';
import type { PromptType } from '@/content/schemas/prompt.schema';
import {
  AppButton,
  AppCard,
  AppChip,
  AppDivider,
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
  JOURNAL_TYPES,
  type JournalEntry,
  type JournalType,
} from '../domain/journal-entry';
import { useJournal } from '../hooks/use-journal';

type ViewMode = 'list' | 'new_entry' | 'detail';

const TYPE_LABELS: Record<JournalType, string> = {
  morning: 'Morning',
  evening: 'Evening',
  urge: 'Urge',
  lapse: 'Lapse',
  return: 'Return',
  freeform: 'Freeform',
  study_reflection: 'Study',
};

/** Journal types that have bundled prompts (a subset of all journal types). */
const PROMPT_TYPES_WITH_CONTENT = new Set<JournalType>([
  'morning',
  'evening',
  'urge',
  'lapse',
  'study_reflection',
  'freeform',
]);

const TYPE_OPTIONS: SelectOption<JournalType>[] = JOURNAL_TYPES.map((t) => ({
  value: t,
  label: TYPE_LABELS[t],
}));

const TYPE_FILTER_OPTIONS: SelectOption<JournalType | 'all'>[] = [
  { value: 'all', label: 'All' },
  ...JOURNAL_TYPES.map((t) => ({ value: t as JournalType | 'all', label: TYPE_LABELS[t] })),
];

function formatDate(iso: string): string {
  const d = new Date(iso);
  return d.toLocaleDateString(undefined, { month: 'short', day: 'numeric', year: 'numeric' });
}

export function JournalScreen() {
  const { entries, loading, addEntry, deleteEntry, error } = useJournal();

  const [mode, setMode] = useState<ViewMode>('list');
  const [selected, setSelected] = useState<JournalEntry | null>(null);
  const [filter, setFilter] = useState<JournalType | 'all'>('all');

  // New entry form state
  const [entryType, setEntryType] = useState<JournalType | null>(null);
  const [body, setBody] = useState('');
  const [saving, setSaving] = useState(false);

  const resetForm = () => {
    setEntryType(null);
    setBody('');
  };

  const submitEntry = async () => {
    if (!entryType || !body.trim()) return;
    setSaving(true);
    const ok = await addEntry({ type: entryType, body: body.trim() });
    setSaving(false);
    if (ok) {
      resetForm();
      setMode('list');
    }
  };

  const confirmDelete = (entry: JournalEntry) => {
    Alert.alert(
      'Delete entry?',
      'This cannot be undone.',
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Delete',
          style: 'destructive',
          onPress: () => {
            void deleteEntry(entry.id);
            if (selected?.id === entry.id) {
              setSelected(null);
              setMode('list');
            }
          },
        },
      ],
    );
  };

  const filteredEntries = filter === 'all'
    ? entries
    : entries.filter((e) => e.type === filter);

  // Stable seed for prompt selection — initialized once on mount via lazy useState,
  // never re-computed during re-renders. This keeps prompt selection deterministic.
  const [promptSeed] = useState(() => Math.floor(Math.random() * 997));
  const prompt = useMemo(() => {
    if (!entryType || !PROMPT_TYPES_WITH_CONTENT.has(entryType)) return null;
    const prompts = getPromptByType(entryType as PromptType);
    if (prompts.length === 0) return null;
    return prompts[promptSeed % prompts.length] ?? null;
  }, [entryType, promptSeed]);

  if (mode === 'new_entry') {

    return (
      <AppScreen scroll>
        <View style={styles.container}>
          <AppHeader
            title="New entry."
            subtitle="Write without judgment."
          />

          <AppCard>
            <AppText variant="caption" color="muted" uppercase>
              Entry type
            </AppText>
            <AppSelectList
              options={TYPE_OPTIONS}
              value={entryType}
              onChange={setEntryType}
            />
          </AppCard>

          {entryType && prompt ? (
            <AppCard tone="overlay">
              <AppText variant="caption" color="accent" uppercase>
                Prompt
              </AppText>
              <AppText variant="body" color="secondary">
                {prompt.text}
              </AppText>
            </AppCard>
          ) : null}

          <AppTextInput
            label="Your reflection"
            placeholder="Write here..."
            value={body}
            onChangeText={setBody}
            multiline
            maxLength={10000}
          />

          {error ? (
            <AppText variant="caption" color="support">
              {error}
            </AppText>
          ) : null}

          <View style={styles.nav}>
            <AppButton
              label="Save entry"
              fullWidth
              disabled={!entryType || !body.trim()}
              loading={saving}
              onPress={() => void submitEntry()}
            />
            <AppButton
              label="Cancel"
              variant="ghost"
              fullWidth
              onPress={() => { resetForm(); setMode('list'); }}
            />
          </View>
        </View>
      </AppScreen>
    );
  }

  if (mode === 'detail' && selected) {
    return (
      <AppScreen scroll>
        <View style={styles.container}>
          <View style={styles.detailHeader}>
            <AppChip label={TYPE_LABELS[selected.type]} tone="accent" selected />
            <AppText variant="caption" color="muted">
              {formatDate(selected.createdAt)}
            </AppText>
          </View>
          <AppCard>
            <AppText variant="body" color="secondary">
              {selected.body}
            </AppText>
          </AppCard>
          <View style={styles.nav}>
            <AppButton label="Back" variant="ghost" fullWidth onPress={() => setMode('list')} />
            <AppButton
              label="Delete entry"
              variant="ghost"
              fullWidth
              onPress={() => confirmDelete(selected)}
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
          eyebrow="Journal"
          title="The record."
          subtitle="What you observe here cannot be taken."
        />

        <AppButton label="New entry" fullWidth onPress={() => setMode('new_entry')} />

        {/* Type filter */}
        <View style={styles.chips}>
          {TYPE_FILTER_OPTIONS.map((opt) => (
            <AppChip
              key={opt.value}
              label={opt.label}
              tone="accent"
              selected={filter === opt.value}
              onPress={() => setFilter(opt.value as JournalType | 'all')}
            />
          ))}
        </View>

        {loading ? (
          <AppCard>
            <AppText variant="body" color="muted" align="center">
              Loading...
            </AppText>
          </AppCard>
        ) : filteredEntries.length === 0 ? (
          <AppEmptyState
            title="No entries yet."
            message="Begin with a morning reflection or write freely."
            actionLabel="New entry"
            onAction={() => setMode('new_entry')}
          />
        ) : (
          <View style={styles.list}>
            {filteredEntries.map((entry, index) => (
              <View key={entry.id}>
                <AppCard
                  tone="overlay"
                  onPress={() => { setSelected(entry); setMode('detail'); }}
                >
                  <View style={styles.entryRow}>
                    <AppChip
                      label={TYPE_LABELS[entry.type]}
                      tone="accent"
                    />
                    <AppText variant="caption" color="muted">
                      {formatDate(entry.createdAt)}
                    </AppText>
                  </View>
                  <AppText
                    variant="body"
                    color="secondary"
                    numberOfLines={2}
                    style={styles.preview}
                  >
                    {entry.body}
                  </AppText>
                </AppCard>
                {index < filteredEntries.length - 1 ? <AppDivider /> : null}
              </View>
            ))}
          </View>
        )}
      </View>
    </AppScreen>
  );
}

const styles = StyleSheet.create({
  container: { gap: theme.spacing.lg },
  nav: { gap: theme.spacing.sm },
  chips: { flexDirection: 'row', flexWrap: 'wrap', gap: theme.spacing.sm },
  list: { gap: theme.spacing.xs },
  entryRow: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' },
  preview: { marginTop: theme.spacing.xs },
  detailHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' },
});
