/**
 * Raw color palette — Iron & Ember: the dark-iron / copper-fire / aged-codex
 * language of Retain.
 *
 * This is the lowest layer: literal values only. **No component references these
 * directly** — the semantic mapping lives in `theme.ts`, and screens consume the
 * theme. Each group below documents the *emotional* job of its colors so future
 * work can pick the right tone, not just the right hex.
 *
 * Mood: private discipline, controlled heat, steel, restraint. Backgrounds are
 * cool iron-black; the only warmth the app raises is the copper ember accent —
 * the fire is being *governed*, not decorated.
 *
 * The ember (#B86A3C) is now the sole primary accent: primary buttons, selected
 * borders, forge actions, active day, "I feel the fire." Gold steps back to
 * codex/archetype/ceremonial use only.
 */
export const palette = {
  // ──────────────────────────────────────────────────────────────────────────
  // Core surfaces — cool iron-black.
  // The walls of the room: heavy, matte, near-black with the faintest warm
  // undertone. Each step up is lighter but stays in the same controlled family.
  // ──────────────────────────────────────────────────────────────────────────
  backgroundPrimary: '#090A0A', // the app floor — iron black
  backgroundSecondary: '#111211', // nav chrome, sunken wells
  surfacePrimary: '#151615', // default card slab
  surfaceSecondary: '#191A18', // raised slab — selected/secondary fills
  surfaceElevated: '#1E1F1D', // highest slab — modals, overlays, inputs

  // ──────────────────────────────────────────────────────────────────────────
  // Text — warm parchment on iron.
  // Slightly cooler than old parchment; still warm enough to feel human.
  // Inverse is for text on a copper/ember fill (buttons, active chips).
  // ──────────────────────────────────────────────────────────────────────────
  textPrimary: '#E7E0D2', // off-white parchment — body & headings
  textSecondary: '#B8AE9B', // muted sage-cream — supporting copy
  textMuted: '#7C7467', // stone-grey — metadata, captions (non-essential)
  textInverse: '#0B0B0A', // dark iron — text on copper/ember fills

  // ──────────────────────────────────────────────────────────────────────────
  // Accents — copper ember (the governed fire).
  // Ember is the sole primary accent in Iron & Ember: all interactive and
  // energy-forward surfaces use this copper tone. Gold steps back to ceremonial
  // and archetype use only. Iron stays as the neutral metal.
  // ──────────────────────────────────────────────────────────────────────────
  ember: '#B86A3C', // copper ember — primary action, the fire, the ally
  emberMuted: '#8A4A2D', // banked coal — pressed states, deep ember edges
  emberBright: '#D4875A', // lit ember — readable ember text on dark stone
  emberSurface: '#2A1B15', // ember-tinted fill surface — soft ember backgrounds
  gold: '#B89A5E', // aged gold — codex / archetype / ceremonial only
  goldSoft: '#D6C08A', // gilded highlight — milestone text, sovereign archetype
  bronze: '#8B6A3E', // codex ink — editorial accents, structural gold
  bronzeSoft: '#C7A867', // lit bronze — readable editorial eyebrow text
  iron: '#5E5A52', // forged iron — neutral metal, strong borders

  // ──────────────────────────────────────────────────────────────────────────
  // State — earth, not alarm.
  // Completion is deep olive (something that grew). Warning is warm amber (the
  // urge present, not shrill). Lapse is deep rust — grave, warm, recoverable.
  // Each ships a lighter "Soft" sibling readable as text on dark stone.
  // ──────────────────────────────────────────────────────────────────────────
  success: '#7D8F6A', // deep olive — return, completion, integration
  successSoft: '#A3B48A', // sunlit olive — readable success text on dark
  warning: '#C98245', // warm amber — urge, caution (the fire noticed)
  warningSoft: '#E0A870', // lit amber — readable caution text on dark
  danger: '#A3483B', // deep rust — lapse surface; grave, warm, recoverable
  dangerSoft: '#C4695E', // worn rust — readable lapse text on dark

  // ──────────────────────────────────────────────────────────────────────────
  // Archetype tones — the 12 modes of formation (see content/archetypes).
  // Each carries a single muted tone used *subtly*: a left rule, a swatch, an
  // eyebrow on a lighter slab. Earthen cousins of the core palette.
  // ──────────────────────────────────────────────────────────────────────────
  monk: '#7A7468', // ash & stillness
  warrior: '#7B4B35', // banked ember & leather
  craftsman: '#9A743E', // worked brass
  king: '#B89A5E', // sovereign gold
  lover: '#8A5A4A', // warm terracotta
  pilgrim: '#6F6A55', // road-dust olive-grey
  sage: '#5F6E68', // slate teal-grey
  brother: '#6B7053', // muted moss
  guardian: '#4F5A50', // deep pine
  builder: '#8B6A3E', // structural bronze
  healer: '#6B7A6A', // sage green
  sovereign: '#D6C08A', // integrated, lit gold

  // ──────────────────────────────────────────────────────────────────────────
  // Borders — cool iron lines, not heavy shadows.
  // The base border is a cool grey-green hairline that matches the iron surface
  // family. Strong is a deliberate division. Gold marks the ceremonial.
  // ──────────────────────────────────────────────────────────────────────────
  borderSubtle: '#30312D', // cool grey-green hairline between surfaces
  borderStrong: '#4A4B47', // a deliberate division — emphasized cards
  borderGold: '#8B6A3E', // ceremonial edge — milestones, vows, the gilded

  // ──────────────────────────────────────────────────────────────────────────
  // Reading surfaces — warm parchment.
  // Codex and rite passages: aged cream with dark ink, for long, calm reading.
  // ──────────────────────────────────────────────────────────────────────────
  parchment: '#E8D8B8', // aged paper — reading cards
  parchmentText: '#231D16', // iron-gall ink — body on parchment
  parchmentMuted: '#66553C', // faded ink — attributions, marginalia
  parchmentBorder: 'rgba(35, 29, 22, 0.16)', // soft pressed edge around paper

  // ──────────────────────────────────────────────────────────────────────────
  // Washes — translucent tints for soft fills.
  // Used as backgrounds behind tinted content (selected chips, soft buttons,
  // the pause circle). Translucent so they settle onto iron stone naturally.
  // ──────────────────────────────────────────────────────────────────────────
  goldWash: 'rgba(184, 154, 94, 0.12)', // soft gold fill — ceremonial/codex
  emberWash: 'rgba(184, 106, 60, 0.15)', // soft ember fill — pause/support/primary
  bronzeWash: 'rgba(139, 106, 62, 0.14)', // soft editorial fill
  successWash: 'rgba(125, 143, 106, 0.16)', // soft olive fill
  warningWash: 'rgba(201, 130, 69, 0.15)', // soft amber fill
  dangerWash: 'rgba(163, 72, 59, 0.18)', // soft rust fill — lapse surfaces
  ironWash: 'rgba(94, 90, 82, 0.16)', // soft neutral fill

  // Absolutes — for shadows and edge cases only, never as text/surface tone.
  white: '#FFFFFF',
  black: '#000000',
  shadow: '#050606', // near-black for rare, soft elevation shadow
} as const;
