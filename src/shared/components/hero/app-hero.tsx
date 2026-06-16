import { type ReactNode } from 'react';
import { StyleSheet, View } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';

import { theme } from '@/shared/design';
import type { SurfaceTone } from '@/shared/hooks/use-surface-tone';

import { AppText } from '../text';
import { Halo } from './halo';

export interface AppHeroProps {
  /** The surface tone that gives this screen its identity (from `useSurfaceTone`). */
  tone: SurfaceTone;
  eyebrow?: string;
  title: string;
  subtitle?: string;
  /** Large symbol/seal art — e.g. `<SealArt … />` or a nav sigil. */
  art?: ReactNode;
  align?: 'left' | 'center';
  /** Soft glow behind the art (pass art WITHOUT its own halo to avoid doubling). */
  halo?: boolean;
  /** Extra content rendered under the heading inside the band (e.g. a PathPulse). */
  children?: ReactNode;
}

const SIDE_ART_BOX = 132;
const CENTER_ART_BOX = 220;

function HeroText({
  tone,
  eyebrow,
  title,
  subtitle,
  align,
}: {
  tone: SurfaceTone;
  eyebrow?: string;
  title: string;
  subtitle?: string;
  align: 'left' | 'center';
}) {
  return (
    <View style={align === 'center' ? styles.textCenter : styles.textLeft}>
      {eyebrow ? (
        <AppText variant="caption" uppercase align={align} style={{ color: tone.text }}>
          {eyebrow}
        </AppText>
      ) : null}
      <AppText variant="title" align={align}>
        {title}
      </AppText>
      {subtitle ? (
        <AppText variant="body" color="secondary" align={align}>
          {subtitle}
        </AppText>
      ) : null}
    </View>
  );
}

function ArtBox({ art, halo, tone, box }: { art: ReactNode; halo: boolean; tone: SurfaceTone; box: number }) {
  return (
    <View style={[styles.artBox, { width: box, height: box }]}>
      {halo ? <Halo color={tone.base} size={box} style={StyleSheet.absoluteFill} /> : null}
      {art}
    </View>
  );
}

/**
 * The screen-identity hero: a gradient-washed, tinted band carrying a large
 * sigil/seal (with an optional glow) beside or above an eyebrow/title/subtitle.
 * Replaces the faint `ScreenCrest` + `AppHeader` combo on primary screens — each
 * screen's `tone` + `art` make it recognizable at a glance.
 */
export function AppHero({
  tone,
  eyebrow,
  title,
  subtitle,
  art,
  align = 'left',
  halo = true,
  children,
}: AppHeroProps) {
  const centered = align === 'center';
  return (
    <LinearGradient
      colors={tone.gradient}
      start={{ x: 0, y: 0 }}
      end={{ x: 0, y: 1 }}
      style={[styles.band, { borderColor: tone.border, backgroundColor: tone.wash }]}
    >
      {centered ? (
        <View style={styles.centerCol}>
          {art ? <ArtBox art={art} halo={halo} tone={tone} box={CENTER_ART_BOX} /> : null}
          <HeroText tone={tone} eyebrow={eyebrow} title={title} subtitle={subtitle} align="center" />
          {children}
        </View>
      ) : (
        <>
          <View style={styles.row}>
            <View style={styles.flex}>
              <HeroText tone={tone} eyebrow={eyebrow} title={title} subtitle={subtitle} align="left" />
            </View>
            {art ? <ArtBox art={art} halo={halo} tone={tone} box={SIDE_ART_BOX} /> : null}
          </View>
          {children}
        </>
      )}
    </LinearGradient>
  );
}

const styles = StyleSheet.create({
  band: {
    borderRadius: theme.radii.xl,
    borderWidth: StyleSheet.hairlineWidth,
    padding: theme.spacing.lg,
    gap: theme.spacing.lg,
    overflow: 'hidden',
  },
  row: { flexDirection: 'row', alignItems: 'center', gap: theme.spacing.md },
  flex: { flex: 1, minWidth: 0 },
  centerCol: { alignItems: 'center', gap: theme.spacing.md },
  textLeft: { gap: theme.spacing.xs },
  textCenter: { gap: theme.spacing.xs, alignItems: 'center' },
  artBox: { alignItems: 'center', justifyContent: 'center' },
});
