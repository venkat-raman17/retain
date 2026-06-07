# Manforge — Project Guide

> Standing instructions for any AI/dev session working on this repo. Read this before
> writing code. The full build roadmap is `all-prompts.md` (a 20-prompt pack). When in doubt,
> favor the product principles below over cleverness.

**Detailed contracts:** [docs/ARCHITECTURE.md](docs/ARCHITECTURE.md) ·
[docs/OFFLINE_FIRST.md](docs/OFFLINE_FIRST.md) · [docs/CONTENT_SAFETY.md](docs/CONTENT_SAFETY.md) ·
[docs/RELEASE_V1_SCOPE.md](docs/RELEASE_V1_SCOPE.md). This file is the summary; those are the detail.

## What Manforge is

A **fully offline, local-only, bundled** mobile app for men practicing semen retention,
sexual-energy transmutation, discipline, and self-mastery. It is **philosophical, mystical,
aspirational, and explicitly non-medical**. It is a **practice app, not a treatment product**.

## Product principles (non-negotiable)

- **The energy is the ally. The compulsion is the enemy. The man is never the enemy.**
- Lapses are handled as **recovery, learning, and return** — never punishment.
- Fully offline v1: **no account, no cloud sync, no analytics, no remote config, no external
  API calls, no network of any kind.** All content ships bundled. All user data stays on device.
- **No medical claims.** No shame language. No hatred of women, sex, desire, or the body.
- **The streak is not the soul.** Progress emphasizes practice history (returns, urges observed,
  forge acts, reflection) over perfection.

If a change would violate any of these, do not make it — surface the conflict instead.

## Domain language

Use these terms consistently in code, copy, and types:

| Term | Meaning |
| --- | --- |
| **Path** | The ongoing practice / home surface. "Path day" = day count of the current run. |
| **Pause** | Urge-support mode: observe the urge, breathe, choose a response. |
| **Fire** | The energy itself (the ally). |
| **Forge / Forge Act** | Converting energy into meaningful action (body/mind/spirit/order/creation/brotherhood). |
| **Codex / Study / Rite** | Bundled teachings, lineage studies, milestone readings. |
| **Vow** | The user's chosen commitment. |
| **Boundary** | An attention/environment commitment ("guard the gates"). |
| **Lapse** | A reset of the current Path; preserves all practice history. |
| **Return** | Recommitment after a lapse. |
| **Practice Day** | Any day the user engaged the practice. |

**Avoid**: relapse/punishment language, "alpha male" framing, purity/shame language, medical
outcome claims (testosterone, fertility, attraction, depression, anxiety, disease,
performance), misogyny, grievance framing, and explicit sexual-technique instruction.

## Architecture

**Feature-first modularization.** Domain logic is separated from UI. Bundled content is
separated from user-generated data. The dependency direction is strict:

```
Screen (src/app route → feature screen)   ← orchestration only, no business logic
  → feature hook        (features/<f>/hooks)
    → service           (features/<f>/services)   ← business logic
      → repository       (db/repositories)          ← the only SQL
        → AppDatabase     (db/database.ts port → db/client.ts SQLite adapter)
Bundled content is read only through content loaders (src/content), never the DB.
```

Hard rules:

- **No component or screen imports `expo-sqlite` or runs SQL.** Data access goes through
  `useRepositories()` → repository interfaces.
- **No screen contains business logic** beyond wiring props/handlers. Logic lives in
  services and pure domain functions.
- **Typed models + Zod schemas** at every boundary (content, persistence, drafts).
- **Copy is centralized** in `src/content` (`copy.ts` and bundled content), not hardcoded in
  screens.
- Keep future paid/optional content possible (content is versioned and loader-accessed) but
  do not build it now.

### Directory map

```
src/
  app/            Expo Router routes (thin: delegate to feature screens). (tabs) group + modals.
  shared/
    components/   Design-system primitives (AppText, Button, Card, Screen, …). No feature logic.
    design/       Tokens + semantic theme. Consume via the theme, not raw palette.
    hooks/        Cross-cutting hooks (useTheme).
    lib/          Pure utilities (Result, id, clock, logger, assert).
    storage/      DI: RepositoriesProvider / useRepositories + AppDataProvider (DB bootstrap).
    types/        Cross-cutting types.
    utils/        Pure helpers (date math).
  features/<f>/   onboarding, path, pause, forge, journal, codex, progress, boundaries,
                  settings, safety. Each: screens/ domain/ services/ hooks/ + index.ts barrel.
  content/
    schemas/      Zod schemas for bundled content.
    bundled/      The content itself (typed; validated by content/index.ts at load).
  db/
    database.ts   AppDatabase port. migrations/ repositories/ seed/ client.ts (SQLite adapter).
  navigation/     Centralized Routes + tab config (file-based routing lives in app/).
  testing/        Fakes (in-memory repositories), render helper, content-safety scanner.
```

### Data separation

- **Bundled content** (read-only, versioned, ships with the app): teachings, studies, rituals,
  prompts, principles, rites, disclaimer/safety copy. Validated by Zod. Lives in `src/content`.
- **User data** (writable, local SQLite only): vow, path dates, urge logs, forge acts, journal
  entries, boundaries, lapses, settings, content progress. Never bundled; never synced.

## Coding standards

- **TypeScript strict**, plus `noUncheckedIndexedAccess`, `noImplicitOverride`,
  `noUnused*`, `noFallthroughCasesInSwitch`, `noImplicitReturns`. Write code that passes.
- **Path alias `@/*` → `src/*`** (and `@/assets/*`). Use `@/` imports, not deep relative paths.
- Files: kebab-case. Components: PascalCase. Hooks: `useX`. One barrel `index.ts` per module.
- Prefer pure, testable functions; inject `Clock` rather than calling `new Date()` in domain.
- Logging only via `createLogger` (no stray `console`). No analytics, ever.
- Validate external/persisted/draft data with Zod at the boundary.

### Commands (pnpm)

```
pnpm run typecheck     # tsc --noEmit
pnpm run lint          # eslint .
pnpm run format        # prettier --write .
pnpm run test          # jest
pnpm run verify        # typecheck + lint + test:ci
pnpm start             # expo start
```

> pnpm requires `.npmrc` `node-linker=hoisted` for Expo/Metro autolinking. Don't remove it.

## Content-safety rules

Any teaching inspired by a tradition is framed as **philosophical/historical inspiration**, not
authority or proof. No religious-authority claims, no medical claims, no esoteric or partnered
sexual-technique instruction, no coercion framing. Every Study/lineage entry carries a guardrail
line. Ship exactly one honest, non-medical disclaimer; surface crisis/professional-help
resources without hardcoding a single country's hotline.

**Allowed copy**

- "The energy is the ally. The compulsion is the enemy. The man is never the enemy."
- "A lapse ends a streak. It does not end the practice. Learn and return."
- "You paused. That is the rep."
- "This is philosophical inspiration, not medical advice."
- "Desire is not evil. The body is not dirty."

**Disallowed copy**

- "You failed. Start from zero. You are weak." (shame / punishment)
- "You broke your purity." (purity/shame)
- "Retain boosts testosterone / cures your addiction / improves fertility." (medical claims)
- "Women/society/modernity are the problem." (grievance / misogyny)
- Step-by-step sexual technique (karezza, karmamudra, sex magic). (explicit instruction)

A test in `src/testing` scans bundled content for degrading language; keep it green.

## Persistence rules

- One DB adapter behind the `AppDatabase` port. **Migrations are append-only** — never edit a
  shipped migration; add a new one. A **lapse resets the current Path but preserves all practice
  history** (forge acts, urges, journals, returns, content progress).

## Testing standards

Unit-test domain logic, date/counting logic, and lapse/reset behavior. Validate all bundled
content against schemas. Services are tested with in-memory fake repositories (`src/testing`).

## Tech stack & versions

Expo SDK **56** (React Native 0.85, React 19.2), TypeScript ~6.0, Expo Router, expo-sqlite,
Zod, Zustand (ephemeral UI state only), Jest + jest-expo + @testing-library/react-native,
ESLint (flat, eslint-config-expo) + Prettier. **Expo SDK 56 is newer than most training data —
check the versioned docs at https://docs.expo.dev/versions/v56.0.0/ before using an Expo API.**

## Roadmap

This repo is built from `all-prompts.md` (20 prompts: foundation 1–5, features 6–14, hardening
15–20). Build to the current prompt; don't over-build ahead. Keep the patterns above stable —
later prompts expand schemas/content/components on top of them.
