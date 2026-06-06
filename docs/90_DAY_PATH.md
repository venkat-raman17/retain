# Retain — The 90-Day Path

## Philosophy

Retain is not an infinite streak tracker. It is a **rite of passage**: a 90-day initiated
structure that treats every day as a sealed chamber with a hidden instruction, a secret, and a
key to earn.

A tracker asks: *how long can you hold?*  
The rite asks: *what are you being formed into?*

After Day 90, the user is **Crowned** — not finished, but formed enough to carry the fire into
ordinary life. The app transitions to the **Long Path**: static evergreen content, maintenance
rituals, and the responsibility of keeping what was built.

---

## Arc Structure

Nine arcs of ten days each. Each arc has a central question.

| Arc | Days    | Title                          | Central Question                                       |
|-----|---------|--------------------------------|--------------------------------------------------------|
| 1   | 1–10    | The Vow                        | Who am I when the urge rises?                         |
| 2   | 11–20   | Guard the Gates                | What am I feeding before I fall?                      |
| 3   | 21–30   | The Body Must Be Included      | Is my body trained enough to carry my vow?            |
| 4   | 31–40   | The Discipline of Assent       | Do I obey every voice that appears within me?         |
| 5   | 41–50   | The Inner Kingdom              | Which part of me sits on the throne?                  |
| 6   | 51–60   | The Forge                      | What am I building with the fire?                     |
| 7   | 61–70   | Brotherhood and Service        | Who becomes stronger because I am becoming stronger?  |
| 8   | 71–80   | The Shadow and the Return      | What pattern am I ready to stop hiding from?          |
| 9   | 81–90   | The Crown                      | How does a crowned man live after the rite?           |

---

## Daily Chamber Model

Every day has a **chamber** with 10 elements:

1. **The Title** — the name of the day (e.g. "Day 17 — No Negotiation in Darkness")
2. **The Opening Line** — a single sentence that opens the chamber
3. **The Teaching** — a rich philosophical passage, 3–4 paragraphs
4. **The Secret** — a hidden insight revealed only on the day (never shown while locked)
5. **The Command** — one instruction for the day
6. **The Practice** — a concrete daily act
7. **The Forge Challenge** — an energy-transmutation act
8. **The Journal Gate** — one reflection prompt
9. **The Evening Account** — a closing audit question
10. **The Key / Crown Fragment** — a phrase added to the user's Codex if a fragment is present

### Secret Content Types

Secrets rotate to maintain curiosity:

| Type              | Description                                       |
|-------------------|---------------------------------------------------|
| `hidden_teaching` | A deeper philosophical passage                   |
| `ancient_key`     | A lineage-inspired insight (Stoic, Daoist, etc.) |
| `archetype_trial` | A challenge from the day's archetype             |
| `forge_assignment`| A specific transmutation task                    |
| `night_warning`   | A temptation-hour instruction                    |
| `lapse_medicine`  | A recovery teaching for if the urge wins         |
| `crown_fragment`  | A phrase collected toward the Crown              |

---

## Unlock State Model

Each day has one of four unlock states:

| State             | Condition                               | What is shown                          |
|-------------------|-----------------------------------------|----------------------------------------|
| `locked`          | Day > current path day                  | Title, arc — no teaching, no secret   |
| `available_today` | Day = current path day                  | Full content, secret tap-to-reveal     |
| `revisit`         | Day < current path day                  | Full content, can re-read any time     |
| `revisit`         | Phase = crowned_long_path (all 90 days) | All content accessible                 |

Locked days show: title, arc, the copy "This chamber opens when the Path has prepared you for it."

---

## Path Phase Model

```typescript
type PathPhase = 'initiation_90' | 'crowned_long_path'
```

**initiation_90**: Days 1–90. Each day unlocks its chamber. Lapses reset `currentPathStartedAt`
(which resets the current day count) but do NOT remove any content progress or history.

**crowned_long_path**: Day 91 onward. No more daily unlocks. All 90 chambers are revisitable.
The home screen shows "Crowned Man · Day X of the Long Path." Content is the Crown Codex.

---

## Crown Transition

Day 90 completion unlocks the Crown Celebration screen:

1. User sees the 90-day passage copy
2. User sees their collected Crown Fragments
3. User taps "Receive the Crown"
4. Profile updates: `currentPathPhase = 'crowned_long_path'`, `crownReceivedAt = now`, `longPathStartedAt = now`
5. Path events: `crown_received`, `long_path_started`

---

## Lapse Behavior

**Before Crown (Phase: initiation_90)**:
- Lapse resets `currentPathStartedAt` → current path day drops to 0 or 1 after return
- All history preserved (practice days, forge acts, journal, content progress)
- User can start a Return immediately

**After Crown (Phase: crowned_long_path)**:
- Lapse does NOT remove Crown status
- Lapse does NOT reset `currentPathPhase`
- Lapse records a `lapse_recorded` path event as a Long Path repair event
- Copy: "The crown is not lost in one weak hour. But it must be honored by repair."

---

## Content Status

All 90 days carry a `contentStatus` field:
- `'final'` — Days 1–30 and milestone days are fully written
- `'draft'` — Days 31–90 are structurally correct with placeholder bodies

Draft days show their correct title, arc, archetype, and theme. The `[Draft]` prefix on
teaching/command bodies marks them for content writing before v1 ship.

---

## Post-90 Crown Codex

After the Crown, the Codex gains the **Crown Codex** section — static evergreen content
covering: what comes next, warnings against spiritual pride, the Long Path, maintenance
rituals, how to begin again after a lapse, and the principle of quiet strength.

Crown Codex does not use daily unlock — it is always available after `crownReceivedAt` is set.

---

## Content Safety Rules

All 90-day content follows the same safety rules as the rest of Retain:
- No medical claims (testosterone, fertility, anxiety, depression, performance)
- No shame or punishment language
- No purity/sin framing
- No misogyny or grievance
- No explicit sexual technique
- Traditions framed as philosophical/historical inspiration only
- Every `ancient_key` secret carries the implicit guardrail: "inspiration, not authority"

The existing content safety scanner (`src/testing/content-safety.ts`) runs on all 90 days.
