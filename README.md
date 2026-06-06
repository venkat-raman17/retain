# Retain

A fully offline, local-only practice app for men working with semen retention, energy
transmutation, discipline, and self-mastery. Philosophical and aspirational — **not medical,
not therapy, never shaming**. No account, no sync, no analytics, no network. All content ships
bundled; all user data stays on the device.

> **The energy is the ally. The compulsion is the enemy. The man is never the enemy.**

## Stack

Expo SDK 56 · React Native 0.85 · React 19.2 · TypeScript 6 · Expo Router · SQLite
(`expo-sqlite`) · Zod · Zustand. Package manager: **pnpm**.

## Getting started

```bash
pnpm install        # requires .npmrc node-linker=hoisted (already configured)
pnpm start          # then press i / a, or open in Expo Go
```

## Scripts

```bash
pnpm run typecheck   # tsc --noEmit
pnpm run lint        # eslint .
pnpm run format      # prettier --write .
pnpm run test        # jest
pnpm run verify      # typecheck + lint + test:ci
```

## Architecture (at a glance)

Feature-first, with a strict dependency direction:

```
screen → feature hook → service → repository → AppDatabase (SQLite)
bundled content → content loaders (read-only, Zod-validated)
```

No screen/component touches SQLite directly; data flows through `useRepositories()`. Bundled
content (`src/content`) is separate from local user data (`src/db`). See **[CLAUDE.md](CLAUDE.md)**
for the full architecture, coding standards, and content-safety rules, and `src/` for the layout:

```
src/app  src/shared  src/features  src/content  src/db  src/navigation  src/testing
```

## Project roadmap

Built from `all-prompts.md` — a 20-prompt plan (foundation → features → release hardening).

## Privacy

Retain is offline by design. Your practice stays on your device. No account. No sync. No
public profile. No telemetry.
