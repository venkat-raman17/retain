import { useState } from 'react';
import { StyleSheet, View } from 'react-native';

import {
  AppButton,
  AppCard,
  AppChip,
  AppDivider,
  AppEmptyState,
  AppHeader,
  AppHero,
  AppScreen,
  AppSelectList,
  AppText,
  AppTextInput,
  SealArt,
  type SelectOption,
} from '@/shared/components';
import { theme } from '@/shared/design';
import { useSurfaceTone } from '@/shared/hooks';

import type { Boundary } from '../domain/boundary';
import type { CheckinStatus } from '../domain/boundary-checkin';
import { useBoundaries } from '../hooks/use-boundaries';

type ViewMode = 'overview' | 'add' | 'checkin';

const CHECKIN_OPTIONS: SelectOption<CheckinStatus>[] = [
  { value: 'kept', label: 'Kept', description: 'The gate held.' },
  { value: 'broken', label: 'Broken', description: 'The gate was opened.' },
  { value: 'skipped', label: 'Skipped', description: 'I did not check this today.' },
];

type CheckinState = Record<string, { status: CheckinStatus | null; note: string }>;

const DEFAULT_BOUNDARIES = [
  'No phone in bed.',
  'No explicit content.',
  'No lust scrolling.',
  'No scrolling alone at night.',
  'Train when urges peak.',
  'Sleep before temptation hour.',
  'Keep bedroom clean.',
  'Replace isolation with movement.',
  'Leave the room when the first spark appears.',
];

export function BoundariesScreen() {
  const { boundaries, loading, add, checkin, deactivate } = useBoundaries();
  const guardianTone = useSurfaceTone({ kind: 'archetype', id: 'guardian' });
  const [mode, setMode] = useState<ViewMode>('overview');

  // Add form
  const [newTitle, setNewTitle] = useState('');
  const [saving, setSaving] = useState(false);

  // Check-in state
  const [checkinState, setCheckinState] = useState<CheckinState>({});
  const [checkingSaving, setCheckingSaving] = useState(false);

  const submitAdd = async () => {
    const t = newTitle.trim();
    if (!t) return;
    setSaving(true);
    try {
      await add(t);
      setNewTitle('');
      setMode('overview');
    } finally {
      setSaving(false);
    }
  };

  const addPreset = async (title: string) => {
    setSaving(true);
    try {
      await add(title);
    } finally {
      setSaving(false);
    }
  };

  const submitCheckins = async () => {
    setCheckingSaving(true);
    try {
      for (const boundary of boundaries) {
        const state = checkinState[boundary.id];
        if (state?.status) {
          await checkin(boundary.id, state.status, state.note.trim() || null);
        }
      }
      setCheckinState({});
      setMode('overview');
    } finally {
      setCheckingSaving(false);
    }
  };

  const updateCheckin = (id: string, status: CheckinStatus) => {
    setCheckinState((prev) => ({
      ...prev,
      [id]: { status, note: prev[id]?.note ?? '' },
    }));
  };

  const updateNote = (id: string, note: string) => {
    setCheckinState((prev) => ({
      ...prev,
      [id]: { status: prev[id]?.status ?? null, note },
    }));
  };

  if (mode === 'add') {
    return (
      <AppScreen scroll>
        <View style={styles.container}>
          <AppHeader
            title="Add a boundary."
            subtitle="The fire is fed first by attention. Guard the gates."
          />

          <AppTextInput
            label="Your boundary"
            placeholder="Name one rule you will keep..."
            value={newTitle}
            onChangeText={setNewTitle}
            maxLength={160}
            autoFocus
          />

          <AppCard>
            <AppText variant="caption" color="muted" uppercase>
              Suggestions
            </AppText>
            <View style={styles.list}>
              {DEFAULT_BOUNDARIES.map((b) => (
                <AppCard
                  key={b}
                  tone="overlay"
                  onPress={() => void addPreset(b)}
                >
                  <AppText variant="body" color="secondary">{b}</AppText>
                </AppCard>
              ))}
            </View>
          </AppCard>

          <View style={styles.nav}>
            <AppButton
              label="Add boundary"
              fullWidth
              disabled={!newTitle.trim()}
              loading={saving}
              onPress={() => void submitAdd()}
            />
            <AppButton label="Cancel" variant="ghost" fullWidth onPress={() => setMode('overview')} />
          </View>
        </View>
      </AppScreen>
    );
  }

  if (mode === 'checkin' && boundaries.length > 0) {
    return (
      <AppScreen scroll>
        <View style={styles.container}>
          <AppHeader
            title="Daily check-in."
            subtitle="How did each boundary hold today?"
          />

          {boundaries.map((boundary) => {
            const state = checkinState[boundary.id];
            return (
              <AppCard key={boundary.id}>
                <AppText variant="label" color="primary">
                  {boundary.title}
                </AppText>
                <AppSelectList
                  options={CHECKIN_OPTIONS}
                  value={state?.status ?? null}
                  onChange={(v) => updateCheckin(boundary.id, v)}
                />
                {state?.status === 'broken' ? (
                  <>
                    <AppText variant="caption" color="muted" style={styles.spacing}>
                      What opened the gate?
                    </AppText>
                    <AppTextInput
                      placeholder="Write what happened..."
                      value={state.note}
                      onChangeText={(text) => updateNote(boundary.id, text)}
                      multiline
                      maxLength={500}
                    />
                  </>
                ) : null}
              </AppCard>
            );
          })}

          <View style={styles.nav}>
            <AppButton
              label="Complete check-in"
              fullWidth
              loading={checkingSaving}
              onPress={() => void submitCheckins()}
            />
            <AppButton label="Cancel" variant="ghost" fullWidth onPress={() => setMode('overview')} />
          </View>
        </View>
      </AppScreen>
    );
  }

  return (
    <AppScreen scroll>
      <View style={styles.container}>
        <AppHero
          tone={guardianTone}
          eyebrow="Guard the Gates"
          title="Your boundaries."
          subtitle="Small rules that win before the battle begins."
          art={<SealArt source={{ kind: 'arc', arcNumber: 2 }} size={80} color={guardianTone.text} />}
        />

        <View style={styles.row}>
          <AppButton
            label="Add boundary"
            variant="secondary"
            style={styles.halfAction}
            onPress={() => setMode('add')}
          />
          {boundaries.length > 0 ? (
            <AppButton
              label="Daily check-in"
              variant="ghost"
              style={styles.halfAction}
              onPress={() => setMode('checkin')}
            />
          ) : null}
        </View>

        {loading ? (
          <AppCard>
            <AppText variant="body" color="muted" align="center">Loading...</AppText>
          </AppCard>
        ) : boundaries.length === 0 ? (
          <AppEmptyState
            title="No boundaries set."
            message="Guard the gates before the battle begins."
            actionLabel="Add your first boundary"
            onAction={() => setMode('add')}
          />
        ) : (
          <View style={styles.list}>
            {boundaries.map((boundary) => (
              <BoundaryCard
                key={boundary.id}
                boundary={boundary}
                onDeactivate={() => void deactivate(boundary.id)}
              />
            ))}
          </View>
        )}

        <AppCard tone="overlay">
          <AppText variant="caption" color="muted" align="center">
            {"Do not feed what you do not want ruling you."}
          </AppText>
        </AppCard>
      </View>
    </AppScreen>
  );
}

function BoundaryCard({
  boundary,
  onDeactivate,
}: {
  boundary: Boundary;
  onDeactivate: () => void;
}) {
  const [expanded, setExpanded] = useState(false);
  return (
    <AppCard
      tone="overlay"
      onPress={() => setExpanded((v) => !v)}
    >
      <View style={styles.boundaryRow}>
        <AppChip label="Active" tone="energy" selected />
        <AppText variant="label" color="primary" style={styles.boundaryTitle}>
          {boundary.title}
        </AppText>
      </View>
      {expanded ? (
        <>
          <AppDivider />
          <AppButton
            label="Remove boundary"
            variant="ghost"
            onPress={onDeactivate}
          />
        </>
      ) : null}
    </AppCard>
  );
}

const styles = StyleSheet.create({
  container: { gap: theme.spacing.lg },
  nav: { gap: theme.spacing.sm },
  list: { gap: theme.spacing.sm },
  row: { flexDirection: 'row', gap: theme.spacing.md },
  halfAction: { flex: 1 },
  spacing: { marginTop: theme.spacing.sm },
  boundaryRow: { flexDirection: 'row', alignItems: 'center', gap: theme.spacing.sm },
  boundaryTitle: { flex: 1 },
});
