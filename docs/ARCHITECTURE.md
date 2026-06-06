# Architecture

This is the binding technical contract for Retain. `CLAUDE.md` is the short version; this
document is the detail. If code and this doc disagree, fix one of them — don't let them drift.

## Goals

- **Feature-first modularity** — each feature is a self-contained slice.
- **Domain separated from UI** — business rules are pure and testable without React or SQLite.
- **Bundled content separated from user data** — read-only content vs. writable local state.
- **One bundle, no backend** — the app is shippable and fully usable offline (see OFFLINE_FIRST).

## Layering

Dependencies point in one direction only. Each layer may call the layer below it; never above.

```
 Route (src/app/**)         file-based Expo Router entry — renders a feature screen, nothing else
   │
   ▼
 Screen (features/<f>/screens)   orchestration only: wires hooks → components, no business logic
   │
   ▼
 Hook (features/<f>/hooks)       React state/effects; adapts services to the UI
   │
   ▼
 Service (features/<f>/services) business logic; pure-ish, depends on repository *interfaces*
   │
   ▼
 Repository (db/repositories)    the ONLY code that builds SQL; maps rows ↔ domain models
   │
   ▼
 AppDatabase port (db/database.ts) → SqliteAppDatabase adapter (db/client.ts) → expo-sqlite

 Domain (features/<f>/domain)    pure models + Zod schemas + functions; imported by any layer,
                                 depends on nothing app-specific (only shared/lib, shared/utils)

 Bundled content (src/content)   read-only; reached ONLY through content loaders, never the DB
```

### Hard rules (enforced by review; some by lint/types)

1. **No component or screen imports `expo-sqlite` or writes SQL.** Data access is via
   `useRepositories()` → repository interfaces (`src/shared/storage`).
2. **Screens contain no business logic** beyond wiring. Logic lives in services + pure domain
   functions.
3. **Every boundary is typed and Zod-validated** — persisted rows, drafts, and bundled content.
4. **Time is injected** (`Clock` in `shared/lib`) in domain/services so logic is deterministic
   and unit-testable. Don't call `new Date()` inside domain functions.
5. **Copy is centralized** in `src/content` (`copy.ts` + bundled content), never hardcoded in a
   screen.
6. **Migrations are append-only.** Never edit a shipped migration; add the next one.

## Module map

| Path | Responsibility |
| --- | --- |
| `src/app` | Expo Router routes. Thin: each delegates to a feature screen. `(tabs)` group + `pause`/`safety` modals. |
| `src/shared/components` | Design-system primitives (`AppText`, `Button`, `Card`, `Screen`, …). No feature logic. |
| `src/shared/design` | Tokens + semantic theme. Consume via the theme, not the raw palette. |
| `src/shared/lib` | Pure utilities: `Result`, `createId`, `Clock`, `createLogger`, `assert`. |
| `src/shared/storage` | DI: `RepositoriesProvider` / `useRepositories`, `AppDataProvider` (DB bootstrap). |
| `src/shared/{types,utils,hooks}` | Cross-cutting types, pure helpers (date math), shared hooks. |
| `src/features/<f>` | A feature slice: `screens/ domain/ services/ hooks/` + `index.ts` barrel. |
| `src/content/schemas` | Zod schemas for bundled content. |
| `src/content/bundled` | The content itself (typed; validated by `content/index.ts` at load). |
| `src/db` | `database.ts` (port), `client.ts` (adapter + init), `migrations/`, `repositories/`, `seed/`. |
| `src/navigation` | Centralized `Routes` + tab config (file-based routing itself lives in `app/`). |
| `src/testing` | In-memory repository fakes, `renderWithProviders`, content-safety scanner. |

## Data layer

- **Port:** `AppDatabase` (`db/database.ts`) — `execute/run/getFirst/getAll/transaction`. Mirrors
  expo-sqlite's async API so the adapter is thin.
- **Adapter:** `SqliteAppDatabase` (`db/client.ts`) — the only `expo-sqlite` importer.
- **Repositories** depend on the port, expose typed methods, and validate rows with Zod on the
  way out. Each repository is defined by an interface; the SQLite class implements it; a
  Map-backed fake in `src/testing` implements it for unit tests.
- **DI:** `AppDataProvider` opens the DB (migrations + seed) once, then hands the `Repositories`
  registry to the tree via `RepositoriesProvider`. Features call `useRepositories()`.

## Adding a feature

1. `src/features/<f>/domain/*.ts` — model + Zod schema + pure functions (+ tests).
2. `src/features/<f>/services/*.ts` — use-cases over repository interfaces (+ tests with fakes).
3. `src/features/<f>/hooks/*.ts` — bridge services to React.
4. `src/features/<f>/screens/*.tsx` — compose shared components; orchestration only.
5. `src/features/<f>/index.ts` — barrel exporting the public surface.
6. `src/app/.../<f>.tsx` — a thin route that renders the screen.

## Extensibility (not built now, kept possible)

Content is versioned and reached through loaders, so future **optional/paid content packs** can
be added without a backend (drop in new bundled modules + a content version gate). Do not build
this now — just don't preclude it.

See also: [OFFLINE_FIRST.md](OFFLINE_FIRST.md) · [CONTENT_SAFETY.md](CONTENT_SAFETY.md) ·
[RELEASE_V1_SCOPE.md](RELEASE_V1_SCOPE.md).
