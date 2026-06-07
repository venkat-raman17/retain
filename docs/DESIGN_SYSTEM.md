# Manforge — Design System

> The visual contract for Retain. Read this with
> [ARCHITECTURE.md](ARCHITECTURE.md) and [CONTENT_SAFETY.md](CONTENT_SAFETY.md).
> The summary lives in the root [CLAUDE.md](../CLAUDE.md); this is the detail for
> color, type, shape, and how screens are allowed to use them.

## 1. Visual philosophy

Retain should feel like **a private order**: a forge, a monastery, an ancient
codex, a discipline practice — **a man returning to command**. The surfaces are
dark stone and charcoal. The accents are **ember** (the fire / the energy / the
ally) and **aged gold** (the earned, the precious, the milestone seal). Edges are
**iron**. Reading happens on **warm parchment**. The mood is *low-contrast
luxury*: quiet, weighty, serious — never loud.

This is a **practice app, not a treatment product**, and the visual language has
to carry that. So the palette deliberately refuses several things:

| We avoid | Because |
| --- | --- |
| Bright failure-red | A lapse is recovery, not an alarm. Lapses use muted **wine**, not red. |
| Gym-bro colors, "alpha" clichés, tactical skull/acid | This is an order, not a locker room. |
| Neon gradients, candy buttons, childish gamification | Buttons are forged metal; progress is practice, not points. |
| Clinical medical blue | No medical claims, no clinic. |
| Dating-app pink / purple | The energy is the ally; this is not about pursuit. |

The whole palette is warm and earthbound on purpose. If a change makes Retain
feel brighter, cooler, more clinical, or more "app-store," it is wrong.

## 2. How the system is layered

```
colors.ts (raw palette)      ← literal hex/rgba, grouped by emotional job
  → tokens.ts (aggregator)   ← spacing, radius, typography, shadows, motion
    → theme.ts (semantic)    ← maps raw tokens to meaning (colors.support, …)
      → useTheme()           ← the single access point for components
        → components          ← consume semantic names only
```

**Hard rules**

- **Components use semantic names, never raw hex.** `colors.danger`, not
  `'#8A3F32'`. Raw values live only in `colors.ts`.
- **Screens consume primitives** (`AppText`, `AppButton`, `AppCard`, …), which
  consume the theme. A screen should rarely touch `theme.colors` directly.
- New work imports the theme via `useTheme()` so a future theme context is a
  drop-in change.

## 3. Color meanings

Each accent/state has up to three layers so the right tone is always reachable:

- **base** (`primary`, `support`, `danger`, …) — fills, borders, structural use.
- **`*Soft`** — a translucent **wash** for soft *backgrounds* (selected chips,
  the pause circle, soft buttons). Subtle, never a solid block.
- **`*Text`** — a lighter **solid** that stays readable as *text* on dark stone.

### Surfaces — the stone room

| Token | Hex | Meaning |
| --- | --- | --- |
| `background` | `#11100E` | The app floor. Warm obsidian, never pure black. |
| `backgroundRaised` | `#181613` | Nav chrome, sunken wells. |
| `surface` | `#201D18` | The default slab a card sits on. |
| `surfaceRaised` | `#2A251E` | A raised slab — pressed / selected / secondary. |
| `surfaceOverlay` | `#332D24` | The highest slab — modals, inputs, overlays. |

### Text — soft ivory on stone

| Token | Hex | Meaning |
| --- | --- | --- |
| `textPrimary` | `#F1E7D0` | Soft ivory — body & headings. |
| `textSecondary` | `#C8B894` | Aged-gold parchment — supporting copy. |
| `textMuted` | `#8F8066` | Worn stone — metadata only (non-essential). |
| `onPrimary` / `textInverse` | `#11100E` | Dark engraving — text on a gold fill. |

### Accents — ember & aged gold

| Token | Hex | Meaning |
| --- | --- | --- |
| `primary` / `gold` | `#B89A5E` | The precious energy. Primary actions, milestones, the seal. |
| `primaryBright` | `#D6C08A` | Gilded highlight — milestone text. |
| `ember` / `support` | `#C46A32` | The fire itself. Pause/urge moments — warm, present, **never an alarm**. |
| `emberMuted` | `#8F4728` | Banked coals — deep ember edges. |
| `accent` / `bronze` | `#8B6A3E` | Codex ink — editorial eyebrows, lineage labels. |
| `accentText` | `#C7A867` | Readable editorial eyebrow text. |
| `iron` | `#5E5A52` | Forged iron — neutral metal. |

### State — earth, not alarm

| Token | Base | Soft (wash) | Text | Meaning |
| --- | --- | --- | --- | --- |
| success / `calm` | `#6F7F4F` | olive wash | `#A3AD7A` | Completion, integration, a return kept. A thing that grew. |
| warning | `#9A6A3A` | clay wash | `#C49A63` | Caution, attention — without shrillness. |
| **danger** | `#8A3F32` | wine wash | `#B46A5D` | **Lapse.** Grave, warm, recoverable. **Not red.** |

### Borders — iron lines over heavy shadow

| Token | Hex | Meaning |
| --- | --- | --- |
| `border` | `#3A342B` | Warm iron hairline between surfaces (default). |
| `borderStrong` | `#5C4A34` | A deliberate division. |
| `borderGold` | `#8B6A3E` | Ceremonial edge — milestones, vows. |

### Reading surfaces — warm parchment

| Token | Hex | Meaning |
| --- | --- | --- |
| `parchment` | `#E8D8B8` | Aged paper — Codex reading cards. |
| `parchmentText` (`ink`) | `#231D16` | Iron-gall ink — body on parchment. |
| `parchmentMuted` (`inkMuted`) | `#66553C` | Faded ink — attributions, marginalia. |
| `parchmentBorder` | `rgba(35,29,22,.16)` | A soft pressed edge around paper. |

### Archetype tones — `theme.archetype[id]`

The 12 archetypes (monk, warrior, craftsman, king, lover, pilgrim, sage, brother,
guardian, builder, healer, sovereign) each carry one **muted earthen tone**. Use
them **subtly** — a left rule, a small swatch, an eyebrow on a lighter slab —
**never a loud fill**. They are cousins of the core palette, so an archetype
screen still feels like the order, only tinted toward that mode. Many archetype
tones (e.g. `guardian` `#4F5A50`) are too dark to be readable text on the
background — use them as fills/borders/marks, with `textPrimary`/`*Text` for copy.

## 4. Typography

Two families, **no custom font assets** (fully bundled / offline):

- **Ceremony** — a system serif (`Georgia` / `serif`). Display, headings,
  card/rite titles, seals. Carved and serious.
- **Reading** — the system sans. Body, labels, metadata. Legible for long Codex
  passages.

The pairing reads like a codex: a carved title over clean teaching. Nothing
futuristic, nothing playfully rounded.

| Variant | Family | Job |
| --- | --- | --- |
| `display` | serif | Ceremonial section titles. |
| `heading` | serif | Screen titles. |
| `title` | serif | Cards and rites. |
| `subheading` | sans | Secondary titles within a card. |
| `body` | sans | Teachings — generous leading for long reading. |
| `label` | sans | Controls and inline labels. |
| `caption` | sans | Metadata and (uppercased) eyebrows. |
| `seal` | serif italic | Short, mantra-like closing lines — engraved feel. |

## 5. Shape, spacing & weight

- **Radii are moderate, never bubbly** (`sm 6`, `md 10` buttons, `lg 14` cards,
  `xl 20`, `pill 999` for chips/rings). Surfaces should feel carved.
- **Spacing is generous.** A 4pt scale up to `xxxl 48`, plus `xxxxl 64` for
  ceremonial space around a single statement (a vow, a seal).
- **Iron borders over heavy shadows.** Cards default to a hairline edge and no
  shadow; opt into `elevated` only for surfaces that genuinely float (a modal,
  the active pause card). Shadows are a warm near-black, soft and rare.
- **Buttons are forged, not candy:** struck gold with a darker gold seam
  (primary), an iron-edged gilded stone slab (secondary), bare stone (ghost), a
  banked-ember panel (support). Labels are uppercased with wide tracking.

## 6. Usage rules

1. **Use semantic names, not raw hex** in components and screens.
2. **Never use bright red** for lapse/failure. There is no red token — `danger`
   is muted wine.
3. **Lapse screens use warm muted earth tones and recovery copy** — `danger`
   surfaces (`AppCard border="clay"`), `dangerText` for the headline, and a
   `support` (Return) action. A lapse ends a streak, not the practice.
4. **Milestone screens may use gold/ember highlights** — `AppCard border="gold"`,
   `color="energy"`/`"gold"` eyebrows, the `seal` variant for the closing line.
5. **Pause / urgency screens use ember but stay calm** — `support`/`ember` tones,
   never an alarm. The breath circle is an ember wash, not a flashing red.
6. **Codex reading may be dark by default, with optional parchment cards** —
   `AppCard tone="parchment"` with `color="ink"` / `"inkMuted"` text.
7. **Archetype screens may use each archetype's tone subtly** via
   `theme.archetype[id]` — a rule, a swatch, an eyebrow; not a full fill.
8. **Maintain contrast** (see §7). Low-contrast luxury, still accessible.
9. **Comment the emotional meaning** of any new color group in `colors.ts`.
10. **Update shared components**, not screens, when a token's treatment changes —
    screens inherit the look through the primitives.

## 7. Accessibility rules

The palette is intentionally low-contrast, but text must still be legible.

- **`textPrimary` / `textSecondary` clear AA** on every surface. Use them for any
  copy that matters.
- **`textMuted` is for non-essential metadata only** (captions, counts,
  attributions). Never put essential information in muted text on a raised slab.
- **Base state tones are fills/borders, not text.** `danger`, `success`, and
  `warning` are too dark for small text on stone — pair them with their `*Text`
  sibling (`dangerText`, `successText`, `warningText`) for labels.
- **Parchment is the high-contrast pairing** (`ink` on `parchment` ≈ 11:1) —
  reserve it for passages meant to be read.
- **On a colored fill, use `onPrimary`/`textPrimary`** (e.g. dark engraving on a
  gold button ≈ 6:1; ivory on a wine lapse surface ≈ 7:1).
- **Don't rely on archetype tones for legibility** — they're marks, not text.
- Borders and the focus ring need only ~3:1; `borderStrong` and `focusRing`
  (ember) clear it on the dark surfaces.

## 8. Good vs. bad usage

**Good**

```tsx
// A lapse handled as recovery — muted wine, no shame, a way back.
<AppCard tone="overlay" border="clay">
  <AppText variant="caption" color="danger" uppercase>A lapse, not a failure</AppText>
  <AppText variant="subheading">The streak ended. The practice did not.</AppText>
  <AppButton label="Return to the path" variant="support" />
</AppCard>

// A milestone — gold edge, gilded eyebrow, an engraved seal.
<AppCard tone="raised" border="gold">
  <AppText variant="caption" color="energy" uppercase>Milestone rite · Day 30</AppText>
  <AppText variant="title">The First Forging</AppText>
  <AppText variant="seal" color="gold">Sealed in iron and ember.</AppText>
</AppCard>

// A Codex passage on parchment — dark ink, long-form reading.
<AppCard tone="parchment">
  <AppText variant="title" color="ink">On gathering the fire</AppText>
  <AppText variant="body" color="ink">…philosophical inspiration, not medical advice.</AppText>
</AppCard>
```

**Bad**

```tsx
// ✗ Raw hex, and a bright failure-red lapse state.
<View style={{ backgroundColor: '#E53935' }}>
  <Text style={{ color: '#FFFFFF' }}>YOU FAILED. BACK TO ZERO.</Text>
</View>

// ✗ Essential copy in muted text on a raised slab (fails contrast + intent).
<AppCard tone="raised"><AppText color="muted">Your vow: …</AppText></AppCard>

// ✗ A loud archetype fill behind text the tone can't carry.
<View style={{ backgroundColor: theme.archetype.guardian }}>
  <AppText>Today's command</AppText>
</View>

// ✗ Neon/candy gradient button — wrong universe entirely.
<LinearGradient colors={['#FF00CC', '#3333FF']}>…</LinearGradient>
```

## 9. The dev gallery

`src/app/dev/design-system.tsx` renders the whole system — type scale, buttons,
cards, chips, the milestone / lapse / parchment cards, state tones, and the 12
archetype tones. It is **development-only** (redirects to the Path in production).
Reach it at `/dev/design-system` while running `pnpm start`.
```
