# Release scope — v1

v1 is a **complete, self-contained, offline bundle**: enough content and core tools to be
genuinely useful with zero updates and zero backend.

## Definition of done (v1)

- Ships as one app bundle; fully usable offline on a fresh install with no sign-in.
- All content bundled and Zod-validated at load.
- All user data persists locally and survives app restarts.
- The core loop works end to end: **Notice the urge → Pause → Transmute → Record → Return.**
- `pnpm run verify` (typecheck + lint + tests) is green; content validates; no network/analytics.

## Feature scope

| Feature | v1 intent |
| --- | --- |
| Onboarding | Initiate the practice with no account; set vow, intention, first boundary; show disclaimer. |
| Path | Home: current path day, vow, today's principle/Codex, quick actions, progress summary. |
| Pause (Urge Mode) | The core tool: name the urge, breathe (offline timer), choose a response, log it. |
| Forge | Convert energy into action (body/mind/spirit/order/creation/brotherhood); log + history. |
| Journal | Structured, prompt-led entries (morning/evening/urge/lapse/freeform/study); local-only. |
| Codex / Studies | Bundled teachings, principles, studies, rites; reading progress. |
| Progress | Practice-not-perfection stats: streaks, totals, urges observed, forge acts, returns. |
| Boundaries | Define + check in on attention/environment commitments ("guard the gates"). |
| Lapse Recovery | Non-punitive flow: record → learn → renew vow → return; resets current path only. |
| Settings | Practice edits, privacy, delete-all-local-data, content version, disclaimer. |
| Safety | One honest non-medical disclaimer + crisis/professional-help resources. |
| Notifications | Optional, **local-only**, opt-in; no remote push. |

## Explicitly out of scope for v1

- Accounts, login, cloud sync/backup, social/sharing, public profiles.
- Analytics, telemetry, crash reporting, remote config, A/B testing.
- Any network call or external content fetch.
- In-app purchases / paid packs (architecture leaves room; not built).
- Explicit sexual-technique instruction (permanently out — see CONTENT_SAFETY.md).

## Quality gates (every milestone)

- `pnpm run typecheck` → 0 errors.
- `pnpm run lint` → 0 errors.
- `pnpm run test:ci` → all pass; domain, date/counting, and lapse/reset logic covered.
- Bundled content parses against schemas; content-safety scan clean.

## Build order (see `all-prompts.md`)

Foundation (1–5) → Features (6–14) → Hardening (15–20: safety, settings, notifications, QA,
spec, standing instructions). v1 ships after the hardening block.
