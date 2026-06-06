# Offline-first / local-only

Retain v1 is **fully offline by design** — not "offline-tolerant," but offline as a product
value. The practice is private; nothing leaves the device.

## Non-negotiables

- **No network calls of any kind.** No `fetch`, no WebSocket, no remote SDK.
- **No account / login / identity.**
- **No cloud sync or backup.**
- **No analytics, telemetry, crash reporting, or remote config.**
- **No external content fetch.** All teachings, studies, rituals, prompts, principles, rites,
  and safety copy ship **bundled** in the app.
- **All user data stays on device** in local SQLite (`expo-sqlite`).

## What this buys the user

- Total privacy: there is no server that could leak, subpoena, or monetize their practice.
- The app opens instantly and works the same on a plane, in a dead zone, or in airplane mode.
- No "create account" wall between a man and the pause he needs right now.

## Data ownership model

| | Bundled content | User data |
| --- | --- | --- |
| Location | `src/content` (in the app binary) | local SQLite (`src/db`) |
| Mutability | read-only, versioned | writable |
| Examples | teachings, studies, rituals, prompts, principles, rites, disclaimer, safety resources | vow, path dates, urge logs, forge acts, journals, boundaries, lapses, settings, content progress |
| Access | content loaders (`src/content`) | repositories (`src/db/repositories`) only |

These two never mix: content is never copied into the DB; user data is never bundled.

## Allowed local-only capabilities

These are fine because they require **no server**:

- Local SQLite persistence.
- **Local notifications** (scheduled on-device) — opt-in only, added in a later prompt.
- On-device haptics.

## What "offline" does NOT forbid forever

The architecture leaves room for **future optional content packs** shipped inside app updates
(still no runtime fetch). That is a future possibility, not a v1 feature.

## How we keep it honest

- No networking dependency is installed; none should be added.
- A release quality pass (Prompt 18) greps for network calls, analytics packages, and
  account/sync code and must find none.
- Reviewers reject any PR that introduces a remote dependency.

> Reference framing: Expo's local-first guidance treats SQLite as the persistence layer for
> local-first apps, and platform offline-first guidance expects the app to be fully usable
> without a network and to present local data immediately. Retain takes the strict end of that
> spectrum: local-only, period.
