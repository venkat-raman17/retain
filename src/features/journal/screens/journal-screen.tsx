import { useEffect, useRef, useState } from 'react';
import { Alert, Pressable, StyleSheet, View } from 'react-native';
import { useLocalSearchParams } from 'expo-router';

import {
  AppButton,
  AppCard,
  AppChip,
  AppDivider,
  AppEmptyState,
  AppHeader,
  AppScreen,
  AppText,
  AppTextInput,
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

const CARD_TYPE_LABELS: Record<JournalType, string> = {
  morning: 'MORNING',
  evening: 'EVENING',
  urge: 'URGE OBSERVED',
  lapse: 'LAPSE STUDIED',
  return: 'RETURN',
  freeform: 'FREEFORM',
  study_reflection: 'STUDY',
};

const TYPE_PROMPTS: Record<JournalType, string> = {
  morning: 'What must I remember before the day begins?',
  evening: 'Did I live today from intention or from habit?',
  urge: 'What triggered this — and what am I actually seeking?',
  lapse: 'What pattern led here, and what will I change now?',
  return: 'What did I learn, and what is my next right action?',
  freeform: 'What is true right now?',
  study_reflection: 'What principle do I need to live, not merely understand?',
};

const FILTER_OPTIONS: { value: JournalType | 'all'; label: string }[] = [
  { value: 'all', label: 'All' },
  ...JOURNAL_TYPES.map((t) => ({ value: t as JournalType | 'all', label: TYPE_LABELS[t] })),
];

function formatDate(iso: string): string {
  const d = new Date(iso);
  return d.toLocaleDateString(undefined, { month: 'short', day: 'numeric', year: 'numeric' });
}

function TypeGrid({
  value,
  onChange,
}: {
  value: JournalType | null;
  onChange: (t: JournalType) => void;
}) {
  return (
    <View style={gridStyles.grid}>
      {JOURNAL_TYPES.map((t) => {
        const selected = t === value;
        return (
          <Pressable
            key={t}
            onPress={() => onChange(t)}
            accessibilityRole="radio"
            accessibilityState={{ selected }}
            style={[gridStyles.cell, selected && gridStyles.cellSelected]}
          >
            <AppText variant="label" color={selected ? 'energy' : 'secondary'}>
              {TYPE_LABELS[t]}
            </AppText>
          </Pressable>
        );
      })}
    </View>
  );
}

const gridStyles = StyleSheet.create({
  grid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: theme.spacing.sm,
  },
  cell: {
    width: '47%',
    paddingVertical: theme.spacing.md,
    paddingHorizontal: theme.spacing.sm,
    borderRadius: theme.radii.md,
    borderWidth: StyleSheet.hairlineWidth,
    borderColor: theme.colors.border,
    alignItems: 'center',
  },
  cellSelected: {
    borderColor: theme.colors.primary,
    backgroundColor: theme.colors.primarySoft,
  },
});

export function JournalScreen() {
  const { entries, loading, addEntry, deleteEntry, error } = useJournal();
  const { initialType, initialPrompt } = useLocalSearchParams<{
    initialType?: string;
    initialPrompt?: string;
  }>();

  const [mode, setMode] = useState<ViewMode>('list');
  const [selected, setSelected] = useState<JournalEntry | null>(null);
  const [filter, setFilter] = useState<JournalType | 'all'>('all');

  const [entryType, setEntryType] = useState<JournalType | null>(null);
  const [customPrompt, setCustomPrompt] = useState<string | null>(null);
  const [body, setBody] = useState('');
  const [saving, setSaving] = useState(false);

  // Track the last-consumed initialType so repeated navigations with the same
  // type don't re-open the form once the user has cancelled/saved.
  const paramsConsumedRef = useRef<string | null>(null);

  useEffect(() => {
    if (!initialType) return;
    if (!(JOURNAL_TYPES as readonly string[]).includes(initialType)) return;
    if (paramsConsumedRef.current === initialType) return;
    paramsConsumedRef.current = initialType;
    setEntryType(initialType as JournalType);
    setCustomPrompt(initialPrompt ?? null);
    setMode('new_entry');
  }, [initialType, initialPrompt]);

  const resetForm = () => {
    setEntryType(null);
    setBody('');
    setCustomPrompt(null);
    // Reset so the next navigation with the same type re-opens the form.
    paramsConsumedRef.current = null;
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
    Alert.alert('Delete entry?', 'This cannot be undone.', [
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
    ]);
  };

  const filteredEntries =
    filter === 'all' ? entries : entries.filter((e) => e.type === filter);

  const displayedPrompt = customPrompt ?? (entryType ? TYPE_PROMPTS[entryType] : null);

  if (mode === 'new_entry') {
    return (
      <AppScreen scroll>
        <View style={styles.container}>
          <AppHeader title="New entry." subtitle="Write without judgment." />

          <AppCard>
            <AppText variant="caption" color="muted" uppercase>
              Entry type
            </AppText>
            <TypeGrid value={entryType} onChange={setEntryType} />
          </AppCard>

          {displayedPrompt ? (
            <AppCard tone="overlay">
              <AppText variant="caption" color="accent" uppercase>
                Prompt
              </AppText>
              <AppText variant="body" color="secondary">
                {displayedPrompt}
              </AppText>
            </AppCard>
          ) : null}

          <AppTextInput
            label="Reflection"
            placeholder="Write what is true..."
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
              onPress={() => {
                resetForm();
                setMode('list');
              }}
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
            <AppText variant="caption" color="energy" uppercase>
              {CARD_TYPE_LABELS[selected.type]}
            </AppText>
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

        <View style={styles.chips}>
          {FILTER_OPTIONS.map((opt) => (
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
            title="No record yet."
            message="Write what is true. One line is enough."
            actionLabel="New entry"
            onAction={() => setMode('new_entry')}
          />
        ) : (
          <View style={styles.list}>
            {filteredEntries.map((entry, index) => (
              <View key={entry.id}>
                <AppCard
                  tone="overlay"
                  onPress={() => {
                    setSelected(entry);
                    setMode('detail');
                  }}
                >
                  <View style={styles.entryRow}>
                    <AppText variant="caption" color="energy" uppercase>
                      {CARD_TYPE_LABELS[entry.type]}
                    </AppText>
                    <AppText variant="caption" color="muted">
                      {formatDate(entry.createdAt)}
                    </AppText>
                  </View>
                  <AppText
                    variant="body"
                    color="secondary"
                    numberOfLines={3}
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
  entryRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  preview: { marginTop: theme.spacing.xs },
  detailHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
});
