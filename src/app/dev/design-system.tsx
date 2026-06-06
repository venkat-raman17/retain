import { type ReactNode, useState } from 'react';
import { Redirect } from 'expo-router';
import { StyleSheet, View } from 'react-native';

import {
  AppButton,
  AppCard,
  AppChip,
  AppContentCard,
  AppDivider,
  AppEmptyState,
  AppHeader,
  AppQuoteBlock,
  AppScreen,
  AppSelectList,
  AppStatCard,
  AppText,
  AppTextInput,
  AppTimerRing,
  type TextVariant,
} from '@/shared/components';
import { theme, type ArchetypeTone } from '@/shared/design';
import { Routes } from '@/navigation';

const TEXT_VARIANTS: readonly TextVariant[] = [
  'display',
  'title',
  'heading',
  'subheading',
  'body',
  'label',
  'caption',
  'seal',
];

/** Named state/accent tones, shown as labelled swatches. */
const STATE_SWATCHES: readonly { label: string; color: string }[] = [
  { label: 'primary · gold', color: theme.colors.primary },
  { label: 'ember', color: theme.colors.ember },
  { label: 'accent · bronze', color: theme.colors.accent },
  { label: 'success · olive', color: theme.colors.success },
  { label: 'warning · clay', color: theme.colors.warning },
  { label: 'danger · wine', color: theme.colors.danger },
];

const SURFACE_SWATCHES: readonly { label: string; color: string }[] = [
  { label: 'background', color: theme.colors.background },
  { label: 'surface', color: theme.colors.surface },
  { label: 'raised', color: theme.colors.surfaceRaised },
  { label: 'overlay', color: theme.colors.surfaceOverlay },
  { label: 'border', color: theme.colors.borderStrong },
  { label: 'gold edge', color: theme.colors.borderGold },
];

const ARCHETYPE_TONES = Object.entries(theme.archetype) as [ArchetypeTone, string][];

function Section({ title, children }: { title: string; children: ReactNode }) {
  return (
    <View style={styles.section}>
      <AppText variant="caption" color="muted" uppercase>
        {title}
      </AppText>
      {children}
    </View>
  );
}

function Swatch({ label, color }: { label: string; color: string }) {
  return (
    <View style={styles.swatchCell}>
      <View style={[styles.swatch, { backgroundColor: color }]} />
      <AppText variant="caption" color="muted">
        {label}
      </AppText>
    </View>
  );
}

/**
 * Internal design-system gallery. Development build only — redirects to the Path
 * in production so it never ships as a reachable screen.
 */
export default function DesignSystemRoute() {
  const [vow, setVow] = useState<'pause' | 'fire'>('pause');
  const [note, setNote] = useState('');

  if (!__DEV__) {
    return <Redirect href={Routes.path} />;
  }

  return (
    <AppScreen scroll>
      <View style={styles.container}>
        <AppHeader
          eyebrow="Dev"
          eyebrowColor="ember"
          title="Design System"
          subtitle="The stone, the forge, the codex. Development build only."
        />

        <Section title="Type scale">
          {TEXT_VARIANTS.map((variant) => (
            <AppText
              key={variant}
              variant={variant}
              color={variant === 'seal' ? 'accent' : 'primary'}
            >
              {variant === 'seal' ? 'Hold the line. Return without theater.' : variant}
            </AppText>
          ))}
        </Section>

        <Section title="Buttons">
          <AppButton label="Primary" />
          <AppButton label="Secondary" variant="secondary" />
          <AppButton label="Ghost" variant="ghost" />
          <AppButton label="Support" variant="support" />
          <AppButton label="Loading" loading />
          <AppButton label="Disabled" disabled />
        </Section>

        <Section title="Cards">
          <AppCard tone="surface">
            <AppText>surface</AppText>
          </AppCard>
          <AppCard tone="raised">
            <AppText>raised</AppText>
          </AppCard>
          <AppCard tone="overlay">
            <AppText>overlay</AppText>
          </AppCard>
          <AppCard tone="raised" border="gold" elevated>
            <AppText>raised · gold edge · elevated</AppText>
          </AppCard>
        </Section>

        <Section title="Chips">
          <View style={styles.row}>
            <AppChip label="Neutral" />
            <AppChip label="Energy" tone="energy" selected />
            <AppChip label="Accent" tone="accent" selected />
            <AppChip label="Support" tone="support" selected />
          </View>
        </Section>

        <Section title="Stat cards">
          <View style={styles.row}>
            <AppStatCard label="Path day" value="7" />
            <AppStatCard label="Returns" value="3" valueColor="calm" />
          </View>
        </Section>

        <Section title="Quote & seal">
          <AppQuoteBlock quote="The pause is where manhood begins." attribution="Principle" />
          <AppText variant="seal" color="accent" align="center">
            The energy is the ally.
          </AppText>
        </Section>

        <Section title="Milestone card">
          <AppCard tone="raised" border="gold">
            <AppText variant="caption" color="energy" uppercase>
              Milestone rite · Day 30
            </AppText>
            <AppText variant="title">The First Forging</AppText>
            <AppText variant="body" color="secondary">
              Thirty days held. The fire that was scattered is now gathered. Name what it built.
            </AppText>
            <AppText variant="seal" color="gold" style={styles.top}>
              Sealed in iron and ember.
            </AppText>
          </AppCard>
        </Section>

        <Section title="Lapse recovery card">
          <AppCard tone="overlay" border="clay">
            <AppText variant="caption" color="danger" uppercase>
              A lapse, not a failure
            </AppText>
            <AppText variant="subheading">The streak ended. The practice did not.</AppText>
            <AppText variant="body" color="secondary">
              Learn what opened the gate, then return. No shame, no zero — the history you built
              still stands.
            </AppText>
            <View style={styles.top}>
              <AppButton label="Return to the path" variant="support" />
            </View>
          </AppCard>
        </Section>

        <Section title="Codex reading card (parchment)">
          <AppCard tone="parchment">
            <AppText variant="caption" color="inkMuted" uppercase>
              Study · The Inner Forge
            </AppText>
            <AppText variant="title" color="ink" style={styles.top}>
              On gathering the fire
            </AppText>
            <AppText variant="body" color="ink" style={styles.top}>
              Across many traditions, men have spoken of energy that, when not spent, is not lost —
              only moved. Read this as philosophical inspiration, not medical advice.
            </AppText>
            <AppText variant="caption" color="inkMuted" style={styles.top}>
              — Lineage study, framed as inspiration
            </AppText>
          </AppCard>
        </Section>

        <Section title="Content card">
          <AppContentCard
            eyebrow="Study"
            title="The Inner Forge"
            body="Transmutation across traditions, as inspiration — not technique."
          />
        </Section>

        <Section title="Text input">
          <AppTextInput label="A note" value={note} onChangeText={setNote} placeholder="Type…" />
        </Section>

        <Section title="Select list">
          <AppSelectList
            options={[
              { value: 'pause', label: 'I pause before I obey.' },
              { value: 'fire', label: 'I do not waste the fire.' },
            ]}
            value={vow}
            onChange={setVow}
          />
        </Section>

        <Section title="Timer ring">
          <View style={styles.center}>
            <AppTimerRing progress={0.66} label="0:40" sublabel="breathe in" />
          </View>
        </Section>

        <Section title="Empty state">
          <AppEmptyState
            title="Nothing here yet"
            message="Your first entry will appear once you write it."
            actionLabel="Add one"
            onAction={() => setNote('added')}
          />
        </Section>

        <AppDivider />

        <Section title="Surfaces & edges">
          <View style={styles.row}>
            {SURFACE_SWATCHES.map((s) => (
              <Swatch key={s.label} label={s.label} color={s.color} />
            ))}
          </View>
        </Section>

        <Section title="State & accent tones">
          <View style={styles.row}>
            {STATE_SWATCHES.map((s) => (
              <Swatch key={s.label} label={s.label} color={s.color} />
            ))}
          </View>
        </Section>

        <Section title="Archetype tones">
          <View style={styles.row}>
            {ARCHETYPE_TONES.map(([id, color]) => (
              <Swatch key={id} label={id} color={color} />
            ))}
          </View>
        </Section>
      </View>
    </AppScreen>
  );
}

const styles = StyleSheet.create({
  container: { gap: theme.spacing.xl },
  section: { gap: theme.spacing.sm },
  row: { flexDirection: 'row', flexWrap: 'wrap', gap: theme.spacing.md, alignItems: 'flex-start' },
  center: { alignItems: 'center', paddingVertical: theme.spacing.md },
  top: { marginTop: theme.spacing.sm },
  swatchCell: { gap: theme.spacing.xs, width: 88 },
  swatch: {
    width: 88,
    height: 56,
    borderRadius: theme.radii.md,
    borderWidth: StyleSheet.hairlineWidth,
    borderColor: theme.colors.border,
  },
});
