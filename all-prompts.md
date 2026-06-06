Below is a **Claude Code prompt pack** you can paste step-by-step to build Retain from scratch.

I’m assuming **React Native + Expo + TypeScript** for v1 because it is fast for iOS/Android, supports a bundled app model, and Expo’s local-first guide explicitly calls out SQLite as a good persistence choice for local-first apps. ([Expo Documentation][1]) Android’s own offline-first guidance also emphasizes that offline-first apps should remain usable without reliable network access and present local data immediately. ([Android Developers][2]) Claude Code is available for terminal, VS Code, JetBrains, Slack, and desktop workflows, so these prompts are written for direct use inside a local repo. ([Claude][3])

---

# Prompt 1 — Project initialization

Paste this first into Claude Code:

```text
You are building a production-grade mobile app called Retain.

Retain is a fully offline, local-only, bundled mobile app for men practicing semen retention, sexual energy transmutation, discipline, and self-mastery. It is philosophical, mystical, aspirational, and non-medical.

Important product principles:
- Fully offline v1.
- No account.
- No cloud sync.
- No analytics.
- No remote config.
- No external API calls.
- All content ships bundled inside the app.
- Local-only user data.
- No medical claims.
- No shame language.
- No hatred of women, sex, desire, or the body.
- The energy is the ally.
- The compulsion is the enemy.
- The man is never the enemy.
- Lapses are handled as recovery and learning, not punishment.
- This is a practice app, not a treatment product.

Tech stack:
- React Native with Expo.
- TypeScript.
- Expo Router.
- SQLite for local persistence.
- Zod for runtime validation.
- Zustand or another minimal local state library only where appropriate.
- React Hook Form if forms become complex.
- No backend dependencies.
- No network calls.
- No analytics SDKs.
- No user tracking.

Your task:
Initialize the project from scratch with a clean, modular architecture.

Before writing code:
1. Inspect the current directory.
2. If no app exists, create a new Expo TypeScript project.
3. Set up a professional folder structure.
4. Add strict TypeScript settings.
5. Add linting and formatting.
6. Add path aliases.
7. Add a basic test setup.
8. Create a CLAUDE.md file explaining the product principles, architecture rules, coding standards, and content safety rules.

Architecture requirements:
- Use feature-first modularization.
- Separate domain logic from UI.
- Separate bundled content from user-generated local data.
- All persistence must go through repository/service layers.
- No component should directly call SQLite.
- No screen should contain business logic beyond orchestration.
- Use typed models and schemas.
- Keep copy/content centralized.
- Make future paid content or future optional updates possible without requiring it now.

Create these top-level directories:

src/
  app/
  shared/
    components/
    design/
    hooks/
    lib/
    storage/
    types/
    utils/
  features/
    onboarding/
    path/
    pause/
    forge/
    journal/
    codex/
    progress/
    boundaries/
    settings/
    safety/
  content/
    bundled/
    schemas/
  db/
    migrations/
    repositories/
    seed/
  navigation/
  testing/

Create the initial app shell with placeholder screens:
- Onboarding
- Path
- Pause
- Forge
- Journal
- Codex
- Progress
- Settings
- Safety / Disclaimer

After implementation:
- Run typecheck.
- Run lint.
- Run tests if configured.
- Show me the final file tree.
- Explain any decisions or tradeoffs.
```

---

# Prompt 2 — Architecture contract and coding rules

Run this after the project exists:

```text
Create a formal architecture contract for Retain.

Add or update:
- CLAUDE.md
- docs/ARCHITECTURE.md
- docs/OFFLINE_FIRST.md
- docs/CONTENT_SAFETY.md
- docs/RELEASE_V1_SCOPE.md

The architecture must enforce these rules:

1. Offline-first / local-only
- No network calls in v1.
- No analytics.
- No login.
- No cloud sync.
- No external content fetch.
- All app content is bundled.
- All user data remains on device.

2. Data separation
Bundled content:
- Read-only.
- Versioned.
- Ships with app.
- Includes teachings, studies, rituals, prompts, archetypes, milestones, disclaimer copy, safety resources.

User data:
- Writable.
- Local SQLite only.
- Includes vow, path start date, urge logs, forge acts, journal entries, boundaries, completed rituals, lapse records, settings.

3. Layering
UI screens may call feature hooks.
Feature hooks may call services.
Services may call repositories.
Repositories may call SQLite.
Bundled content may be read through content loaders only.
No direct database access from screens or components.

4. Domain language
Use these terms:
- Path
- Pause
- Fire
- Forge Act
- Codex
- Vow
- Boundary
- Lapse
- Return
- Practice Day
- Study
- Rite

Avoid:
- relapse punishment language
- alpha male language
- purity/shame language
- medical outcome claims
- claims about testosterone, attraction, fertility, depression, anxiety, or disease
- misogyny
- grievance framing
- explicit sexual technique instruction

5. Content safety
Any teaching inspired by traditions must be framed as philosophical/historical inspiration.
No religious authority claims.
No medical claims.
No esoteric sexual practice instructions.
No partnered tantric instructions.
No instruction involving coercion or partner use.
Include one honest in-app disclaimer.

6. Testing standards
- Domain logic must be unit-tested.
- Database migrations should be tested where practical.
- Content schemas must be validated.
- Date/counting logic must be tested.
- Lapse/reset behavior must be tested.

7. Release standard
The app should be shippable as a self-contained v1 bundle.

Write the docs in a clear style so future AI coding sessions can follow them. Include examples of allowed and disallowed copy.
```

---

# Prompt 3 — Database schema and local persistence

```text
Design and implement Retain’s local SQLite persistence layer.

Requirements:
- Use SQLite through a single database adapter.
- Add migrations.
- Add typed repositories.
- Add seed/init logic.
- Add tests for core repository behavior if possible.
- No screen or component may call SQLite directly.

Create tables for:

1. user_profile
- id
- created_at
- updated_at
- onboarding_completed
- selected_vow
- custom_vow
- path_started_at
- current_path_started_at
- app_content_version
- preferred_teaching_tone
- notification_style
- app_lock_enabled

2. path_events
Tracks major events:
- id
- type: path_started | vow_changed | lapse_recorded | return_recorded | milestone_reached
- occurred_at
- note

3. urge_logs
- id
- occurred_at
- trigger_type: lust | boredom | stress | loneliness | anger | fatigue | habit | escapism | unknown
- intensity_before: 1-10
- intensity_after: 1-10 nullable
- completed_pause_timer_seconds nullable
- selected_response nullable
- note nullable

4. forge_acts
- id
- occurred_at
- category: body | mind | spirit | order | creation | brotherhood
- title
- duration_minutes nullable
- linked_urge_id nullable
- note nullable

5. journal_entries
- id
- created_at
- updated_at
- type: morning | evening | urge | lapse | freeform | study_reflection
- prompt_id nullable
- title nullable
- body
- mood nullable

6. lapse_records
- id
- occurred_at
- trigger_type nullable
- state_before nullable
- lesson nullable
- next_clean_action nullable
- shame_spiral_interrupted boolean
- note nullable

7. boundaries
- id
- title
- description nullable
- is_active
- created_at
- updated_at

8. boundary_checkins
- id
- boundary_id
- checked_at
- status: kept | broken | skipped
- note nullable

9. content_progress
- id
- content_id
- content_type: codex_day | study | ritual | rite | principle | archetype
- status: unread | opened | completed
- first_opened_at nullable
- completed_at nullable

10. settings
- key
- value
- updated_at

Implement repositories:
- UserProfileRepository
- PathRepository
- UrgeRepository
- ForgeRepository
- JournalRepository
- LapseRepository
- BoundaryRepository
- ContentProgressRepository
- SettingsRepository

Implement services:
- PathService
- PauseService
- ForgeService
- JournalService
- LapseRecoveryService
- ProgressService

Important logic:
- A lapse resets current retention/path day count but does not erase practice history.
- Total practice days, urges observed, forge acts, journals, and returns remain preserved.
- “Return” means recommitment after a lapse.
- Progress should emphasize practice, not punishment.

Add a database initialization function called initializeRetainDatabase().
Add a resetLocalDataForTestingOnly() function clearly marked as development/test-only.

Run typecheck and tests.
```

---

# Prompt 4 — Bundled content system

```text
Implement Retain’s bundled content system.

This app ships as a complete offline bundle. All teachings, studies, rituals, prompts, principles, rites, and safety copy must live in the repo as local content files.

Create:

src/content/schemas/
- codex.schema.ts
- study.schema.ts
- ritual.schema.ts
- prompt.schema.ts
- principle.schema.ts
- rite.schema.ts
- safety.schema.ts

src/content/bundled/
- codex/
- studies/
- rituals/
- prompts/
- principles/
- rites/
- safety/

Use JSON or TypeScript objects, whichever gives stronger type safety and easier validation.

All content must be validated with Zod at app startup or build-time utility.

Create content loader functions:
- getDailyCodexDay(dayNumber)
- getAllCodexDays()
- getStudyById(id)
- getAllStudies()
- getRitualById(id)
- getPromptByType(type)
- getPrinciples()
- getMilestoneRite(dayNumber)
- getSafetyDisclaimer()

Create placeholder bundled content:
- 7 Codex days
- 3 Studies
- 3 Rituals
- 12 Journal prompts
- 10 Principles
- 3 Milestone rites
- 1 Disclaimer
- 1 Crisis/professional help resource screen

Content voice:
- Aspirational
- Masculine but not hostile
- Mystical but not medical
- Direct but not cruel
- Non-shaming
- Practice-based, not prescription-based

Include these principles:
1. The energy is the ally.
2. The compulsion is the enemy.
3. The man is never the enemy.
4. Shame weakens command.
5. A lapse is information, not identity.
6. Guard the gates.
7. Hold the fire.
8. Refine the fire.
9. Return to order.
10. The pause is where manhood begins.

Studies to include as placeholders:
1. Brahmacharya: The Vow and the Conservation of Attention
2. Guarding the Gates: Sense Restraint and the First Spark
3. The Inner Forge: Transmutation Across Traditions

Every Study must include:
- id
- title
- lineage
- summary
- historical_frame
- retain_principle
- practice
- reflection_prompt
- guardrail

Guardrail examples:
- “This is philosophical inspiration, not medical advice.”
- “Retain does not teach religious authority or esoteric sexual technique.”
- “This practice is about pause, reflection, and discipline.”

Add tests that validate all bundled content against schemas.
```

---

# Prompt 5 — Design system and visual foundation

```text
Create Retain’s design system.

The app should feel:
- Monastic
- Masculine
- Calm
- Ancient
- Serious
- Warm
- Offline/private
- Like a forge, temple, codex, and training ground

Avoid:
- gym-bro aesthetic
- red failure screens
- childish badges
- medical app visuals
- explicit sexual imagery
- aggressive domination imagery
- shame/purity visuals

Implement:

src/shared/design/
- tokens.ts
- colors.ts
- typography.ts
- spacing.ts
- radius.ts
- shadows.ts
- motion.ts

Create theme tokens:
- background: dark stone / near-black
- surface: charcoal
- elevated surface
- text primary
- text secondary
- ember accent
- gold accent
- warning muted
- success muted
- border subtle

Do not overuse bright red.

Create shared components:
- AppScreen
- AppText
- AppButton
- AppCard
- AppHeader
- AppDivider
- AppChip
- AppTimerRing
- AppEmptyState
- AppStatCard
- AppQuoteBlock
- AppContentCard
- AppTextInput
- AppSelectList

Requirements:
- Components must be accessible.
- Buttons must have loading and disabled states.
- Text components must support semantic variants.
- Avoid hardcoded colors in feature screens.
- Use design tokens everywhere.
- Keep components simple and composable.

Create a visual test/demo screen or Storybook-like internal screen if practical:
- /dev/design-system
Only include it in development mode.

Run typecheck.
```

---

# Prompt 6 — Onboarding feature

```text
Build the Retain onboarding flow.

Purpose:
Initiate the user into the practice without creating an account.

Screens:
1. Welcome
2. Philosophy
3. Offline Privacy
4. Choose Intention
5. Choose Vow
6. Choose First Forge Category
7. Choose First Boundary
8. Disclaimer
9. Begin Path

Copy direction:
- “Welcome to Retain.”
- “A practice of pause, command, and transmutation.”
- “This is not about hating desire.”
- “The energy is the ally. The compulsion is the enemy. The man is never the enemy.”
- “Your practice is private. Retain works offline. No account. No sync. No public profile.”
- “When the fire rises, what will you remember?”
- “The Path begins in the pause.”

Vow options:
- I pause before I obey.
- I do not waste the fire.
- I turn desire into strength.
- I am not ruled by impulse.
- I return without shame.
- Custom vow.

Intentions:
- impulse
- attention
- lust
- loneliness
- discipline
- purpose
- energy
- self-respect

Forge categories:
- Body
- Mind
- Spirit
- Order
- Creation
- Brotherhood

Boundaries:
- No phone in bed.
- No explicit content.
- No scrolling alone at night.
- Train when the urge rises.
- Sleep before the temptation hour.
- Custom boundary.

Requirements:
- Save onboarding selections locally.
- Create user_profile if missing.
- Set path_started_at and current_path_started_at when onboarding completes.
- Create first boundary if chosen.
- Mark onboarding_completed true.
- Navigate to main app after completion.
- User can skip custom vow but must have a vow.
- Disclaimer must be shown before starting.

Add tests for onboarding persistence where practical.
```

---

# Prompt 7 — Path home screen

```text
Build the Path feature.

The Path screen is the home screen of Retain.

It should show:
- Current Path day count.
- Selected vow.
- Today’s principle.
- Today’s Codex card.
- Quick button: “I Feel the Fire.”
- Quick button: “Log a Forge Act.”
- Quick button: “Journal Tonight.”
- Morning ritual status.
- Evening ritual status.
- Progress summary:
  - Current path days
  - Longest path
  - Urges observed
  - Forge Acts completed
  - Returns after lapse

Important:
- The streak is not the soul of the product.
- The app should emphasize practice history, not perfection.
- If the user has lapsed, do not show shame language.
- If there is no data, show strong empty states.

Copy examples:
- “The Path begins in the pause.”
- “You are not the urge. You are the one who chooses.”
- “The fire is here. Give it direction.”
- “A lapse ends a streak. It does not end the practice.”

Implement:
- PathService methods needed to compute current day and progress stats.
- Path screen UI using design system components.
- Navigation to Pause, Forge, Journal, Codex.
- Loading and error states.

Add unit tests for day counting:
- New user day 1.
- Multi-day path.
- Lapse resets current path.
- Total practice history remains.
```

---

# Prompt 8 — Pause / Urge Mode

```text
Build the Pause feature, also called Urge Mode.

This is the most important feature in the app.

Flow:
1. Entry screen: “The fire is rising.”
2. Name the urge.
3. Choose intensity before.
4. Breathing timer.
5. Choose command / response.
6. Optional Forge Act link.
7. Intensity after.
8. Completion screen.

Trigger options:
- Lust
- Boredom
- Stress
- Loneliness
- Anger
- Fatigue
- Habit
- Escapism
- Unknown

Timer options:
- 60 seconds
- 3 minutes
- 7 minutes

Breath copy:
- “Do not run. Do not obey. Observe.”
- “The energy is not the enemy.”
- “The compulsion is not command.”
- “You are the one who chooses.”
- “Breathe until the body remembers who leads.”

Command options:
- 20 push-ups
- Walk outside
- Cold water on face
- Clean your space
- Pray / meditate
- Journal the urge
- Study for 15 minutes
- Build something
- Call a brother
- Sit still and let it pass

Requirements:
- Save urge log locally.
- Timer must work offline.
- Timer should not require audio.
- Vibration cues may be added if simple.
- User can complete without linking a Forge Act.
- User can choose to convert to Forge Act immediately.
- Completion screen should celebrate command, not suppression.

Completion copy:
- “The urge was observed.”
- “The fire was not wasted.”
- “You paused. That is the rep.”

Do not use:
- “You defeated lust forever.”
- “You are pure.”
- “You failed if the urge remains.”

Add tests for PauseService.
```

---

# Prompt 9 — Forge feature

```text
Build the Forge feature.

A Forge Act is how the user converts sexual energy into meaningful action.

Forge categories:
- Body
- Mind
- Spirit
- Order
- Creation
- Brotherhood

Examples:
Body:
- Train
- Walk
- Stretch
- Cold exposure
- Breathwork

Mind:
- Study
- Read
- Plan
- Solve a problem
- Deep work

Spirit:
- Pray
- Meditate
- Silence
- Gratitude
- Sacred reading

Order:
- Clean room
- Laundry
- Prepare food
- Organize desk
- Remove temptation

Creation:
- Write
- Code
- Draw
- Build
- Practice a skill

Brotherhood:
- Call a friend
- Serve someone
- Speak honestly
- Repair a relationship

Build screens:
1. Forge overview
2. Log Forge Act
3. Forge history
4. Forge detail

Requirements:
- User can log a Forge Act quickly.
- User can link a Forge Act to an urge log.
- User can write optional notes.
- Show weekly Forge history.
- Show category distribution.
- Empty state should invite action.

Copy:
- “Do not waste the fire. Forge it.”
- “Raw desire becomes strength through action.”
- “What did you turn the fire into?”

Add repository and service tests.
```

---

# Prompt 10 — Journal feature

```text
Build the Journal feature.

Journal types:
- Morning
- Evening
- Urge
- Lapse
- Freeform
- Study reflection

The journal should be structured and prompt-led.

Morning prompts:
- What am I building today?
- Where might the fire test me today?
- What is one act of discipline I will complete?
- What temptation will I avoid feeding?

Evening prompts:
- Where did I command myself today?
- Where did I leak energy?
- What did I learn without shame?
- What must be repaired tomorrow?

Urge prompts:
- What triggered this?
- What am I actually seeking?
- What would obedience cost me?
- What can this energy become?

Lapse prompts:
- What happened before the lapse?
- What state was I in?
- What lie did the urge tell me?
- What boundary must I build now?
- What is my next clean action?

Screens:
1. Journal home
2. New entry
3. Entry detail
4. Entry history
5. Filter by type

Requirements:
- All journal entries local-only.
- No sync.
- No export yet unless very simple.
- Support editing entries.
- Support deleting entries with confirmation.
- Never shame the user in lapse prompts.
- Use bundled prompts through content loader.

Add tests for JournalRepository.
```

---

# Prompt 11 — Lapse recovery system

```text
Build the Lapse Recovery feature.

This is critical.

A lapse must not feel like punishment. It is handled as information, recovery, recommitment, and return.

Flow:
1. Entry: “Record a lapse without shame.”
2. What happened before?
3. What state was I in?
4. What lie did the urge tell me?
5. What boundary must I build now?
6. What is my next clean action?
7. Renew vow.
8. Return to Path.

When a lapse is recorded:
- Save lapse record.
- Add path_event type lapse_recorded.
- Reset current_path_started_at.
- Preserve total practice history.
- Preserve forge acts.
- Preserve urges observed.
- Preserve journal entries.
- Preserve content progress.
- Allow user to immediately create a Return event.

Copy:
- “You are not your lapse.”
- “A lapse ends a streak. It does not end the practice.”
- “Do not dramatize it. Do not hide from it. Learn and return.”
- “Stand up. Clean the wound. Continue.”
- “One clean action now.”

Do not use:
- “You lost everything.”
- “You failed.”
- “Start from zero.”
- “You are weak.”
- “You broke your purity.”

Add:
- LapseRecoveryService
- Tests proving lapse resets current path but not practice history.
- UI for renewed vow.
```

---

# Prompt 12 — Codex and Studies

```text
Build the Codex feature.

Sections:
1. Daily Codex
2. Principles
3. Studies
4. Archetypes
5. Rites
6. Emergency readings
7. Lapse readings

For now, use placeholder content from bundled content system.

Screens:
- Codex home
- Daily Codex detail
- Principles list
- Principle detail
- Studies list
- Study detail
- Rites list
- Emergency readings list
- Reading detail

Study lineages to support:
- Brahmacharya
- Buddhist Sense Restraint
- Daoist Inner Alchemy
- Tibetan Inner Fire
- Stoic Command
- Monastic Watchfulness
- Sufi Purification
- Greco-Roman Pneuma
- Kabbalistic Repair
- Western Alchemy

Important content rules:
- Present as historical/philosophical inspiration.
- Do not make medical claims.
- Do not teach esoteric sexual techniques.
- Do not teach partnered tantra/karmamudra.
- Do not instruct occult sex magic.
- Do not use guilt-heavy sin language.
- Convert guilt into repair.
- Convert desire into direction.

Every study detail page should show:
- Historical frame
- Retain principle
- Practice
- Reflection prompt
- Guardrail

Add progress tracking:
- opened
- completed
- completed_at

Add search/filter if simple and local-only.
```

---

# Prompt 13 — Progress and insights

```text
Build the Progress feature.

Progress should measure practice, not perfection.

Show:
- Current path days
- Longest path
- Total practice days
- Urges observed
- Forge Acts completed
- Lapses studied
- Returns recorded
- Most common trigger
- Strongest Forge category
- Weekly activity
- Calendar markers

Do not over-glorify streaks.

Use copy:
- “Your practice is more than a streak.”
- “Command is trained in the return.”
- “The record shows where the fire asks for discipline.”
- “A lapse is studied, not worshiped.”

Implement ProgressService:
- getCurrentPathDays()
- getLongestPathDays()
- getTotalPracticeDays()
- getUrgesObserved()
- getForgeActsCompleted()
- getLapsesStudied()
- getReturnsRecorded()
- getMostCommonTrigger()
- getStrongestForgeCategory()
- getWeeklySummary()
- getCalendarMarkers()

Add tests for stats logic.

Calendar:
- Minimal local calendar visualization.
- Mark days with forge acts, urges, journals, lapses, returns.
- Avoid red shame markers for lapse. Use neutral marker language.
```

---

# Prompt 14 — Boundaries and Guard the Gates

```text
Build the Boundaries feature, also called Guard the Gates.

Purpose:
Help the user define and check the attention/environment boundaries that prevent urges from becoming crises.

Default boundary suggestions:
- No phone in bed.
- No explicit content.
- No lust scrolling.
- No scrolling alone at night.
- No private browsing.
- Train when urges peak.
- Sleep before temptation hour.
- Keep bedroom clean.
- Replace isolation with movement.
- Leave the room when the first spark appears.

Screens:
1. Boundaries overview
2. Add boundary
3. Boundary detail
4. Daily check-in

Daily check-in:
For each active boundary:
- Kept
- Broken
- Skipped
- Optional note

Copy:
- “The fire is fed first by attention.”
- “Guard the gates before the battle begins.”
- “The first victory is often looking away.”
- “Do not feed what you do not want ruling you.”

Requirements:
- Boundaries stored locally.
- Check-ins stored locally.
- Progress feature can read boundary check-ins.
- No shame language when boundary is broken.
- Broken boundary should lead to repair:
  - What opened the gate?
  - What will I change tomorrow?
```

---

# Prompt 15 — Safety, disclaimer, and help screen

```text
Build the Safety and Disclaimer section.

Retain must include one honest, clear disclaimer.

Create a dedicated screen accessible from:
- Onboarding
- Settings
- Footer/about area

Disclaimer copy should communicate:
- Retain is a philosophical self-mastery practice app.
- Retain is not medical advice.
- Retain is not therapy.
- Retain is not a mental health service.
- Retain does not diagnose, treat, cure, or prevent any condition.
- Retain makes no claims about testosterone, fertility, attraction, disease, depression, anxiety, or athletic performance.
- If the user is in crisis, at risk of harming himself or others, or struggling with compulsive sexual behavior, he should contact qualified professional help or emergency services.
- Desire is not evil.
- The body is not dirty.
- The practice is about pause, reflection, and discipline.

Add safety resources content as static bundled copy.
Because the app is offline and global, do not hardcode only one country’s emergency number as the sole resource.
Say:
- “Contact your local emergency number now.”
- “Reach out to a licensed mental health professional.”
- “Speak to someone you trust immediately.”
- “If available in your country, contact a crisis hotline.”

Add a “Read disclaimer again” option in Settings.

No external links are required for v1.
```

---

# Prompt 16 — Settings and privacy

```text
Build Settings.

Settings sections:
1. Practice
- Edit vow
- Edit intention
- Edit preferred teaching tone
- Restart current path with confirmation

2. Privacy
- Explain offline-only design
- App lock toggle placeholder if implementation is not ready
- Delete all local data

3. Content
- Content version
- Reset content progress with confirmation

4. Safety
- Disclaimer
- Help resources

5. About
- App name
- Version
- Philosophy summary

Privacy copy:
“Retain is offline by design. Your practice stays on your device. No account. No sync. No public profile.”

Delete local data:
- Must require strong confirmation.
- Explain that deletion cannot be recovered.
- Use repository reset function.
- Return to onboarding after deletion.

Do not add cloud backup.
Do not add analytics consent.
Do not add account screens.
```

---

# Prompt 17 — Local notifications, optional but offline

```text
Add local notifications only if they can be implemented without remote services.

Notifications must be optional.

Types:
- Morning ritual
- Midday return
- Evening account
- Temptation hour
- Boundary check-in

Tone options:
- Minimal
- Stern
- Gentle
- Mystical

Example notification copy:
Morning:
“Take the Path. Choose command before the world chooses for you.”

Midday:
“Return to the breath. The fire obeys direction.”

Evening:
“Account before sleep. What did the day teach you?”

Temptation hour:
“Do not negotiate in darkness. Stand up. Move.”

Requirements:
- No remote push notifications.
- Local notifications only.
- User can disable all notifications.
- Store preferences locally.
- Do not request notification permission until the user explicitly enables reminders.
```

---

# Prompt 18 — Quality gate and release hardening

```text
Perform a full v1 quality pass.

Audit for:
- Any network calls.
- Any analytics packages.
- Any account/login/sync code.
- Any medical claims.
- Any shame language.
- Any misogynistic/grievance language.
- Any explicit sexual technique instruction.
- Any direct SQLite calls from screens/components.
- Any hardcoded colors outside design system.
- Any untyped content.
- Any untested date/counting logic.

Run:
- typecheck
- lint
- tests
- content validation
- dependency audit if available

Add:
- docs/QA_CHECKLIST.md
- docs/APP_STORE_NOTES.md
- docs/PRIVACY_POSITIONING.md

APP_STORE_NOTES should describe the app as:
“An offline philosophical self-mastery, journaling, and discipline app built around pause, reflection, and transmutation.”

It should not describe the app as:
- medical
- therapeutic
- testosterone boosting
- addiction treatment
- fertility-related
- guaranteed performance-enhancing

Create a final implementation report:
- What exists
- What is stubbed
- What remains before v1 release
- Known risks
- Suggested next tasks
```

---

# Prompt 19 — Create the master product spec inside repo

```text
Create docs/PRODUCT_SPEC.md for Retain v1.

It should include:

1. Product vision
Retain is a fully offline practice app for men built around pause, discipline, semen retention, and transmutation of sexual energy, framed philosophically and mystically rather than medically.

2. Core loop
Notice the urge → Pause → Transmute → Record → Return

3. Main features
- Onboarding
- Path
- Pause
- Forge
- Journal
- Codex
- Studies
- Progress
- Boundaries
- Lapse Recovery
- Settings
- Safety

4. Voice principles
- The energy is the ally.
- The compulsion is the enemy.
- The man is never the enemy.
- Aspirational, never grievance.
- Practice, not prescription.
- Non-shaming throughout.

5. Offline bundle principle
- No account.
- No sync.
- No remote content.
- No analytics.
- Local-only data.

6. Content lineages
- Brahmacharya
- Buddhist Sense Restraint
- Daoist Inner Alchemy
- Tibetan Inner Fire
- Stoic Command
- Monastic Watchfulness
- Sufi Purification
- Greco-Roman Pneuma
- Kabbalistic Repair
- Western Alchemy
- Warrior/Athlete discipline

7. Content guardrails
- No medical claims.
- No explicit sexual technique.
- No religious authority claims.
- No shame mechanics.
- No misogyny.
- No coercive partner framing.
- No performance guarantees.

8. V1 release definition
A complete self-contained bundled app with enough content and core tools to be useful without updates.

Make this spec clear enough that any future Claude Code session can continue the project safely.
```

---

# Prompt 20 — Final Claude Code operating instruction

Save this as the standing instruction in `CLAUDE.md`:

```text
You are working on Retain.

Retain is not a generic habit tracker. Retain is a private, offline, philosophical self-mastery app for men built around pause, discipline, semen retention, and transmutation.

Never compromise these rules:

1. Offline v1 means offline.
No accounts, no sync, no analytics, no remote config, no API calls, no external content fetch.

2. Local user data stays local.
All user-generated data must remain on-device.

3. The streak is not the soul.
Progress must preserve practice history and emphasize return, reflection, urges observed, forge acts, and discipline.

4. Lapse is not failure identity.
A lapse may reset current path days, but it never erases the man’s practice.

5. No medical claims.
Do not claim Retain increases testosterone, improves fertility, cures addiction, treats anxiety/depression, improves attraction, or guarantees performance.

6. No shame.
Desire is not evil. The body is not dirty. The man is never the enemy.

7. No grievance.
Do not blame women, society, modernity, or sexuality itself. Retain builds men up.

8. Ancient traditions are inspiration, not proof.
Frame lineages as historical, philosophical, symbolic, or contemplative inspiration.

9. No explicit sexual instruction.
Do not teach karmamudra, sex magic, karezza technique, or partnered sexual methods. Studies may discuss traditions carefully at a high level.

10. Architecture matters.
Screens orchestrate. Services hold business logic. Repositories access storage. Content loaders access bundled content. Components stay reusable.

11. Validate content.
All bundled content must pass schemas before release.

12. Favor simple, durable code.
This app is a one-bundle release. Build the base carefully.
```

---

## Best order to run these

Start with:

```text
Prompt 1 → Prompt 2 → Prompt 3 → Prompt 4 → Prompt 5
```

Then build features:

```text
Prompt 6 → 7 → 8 → 9 → 10 → 11 → 12 → 13 → 14
```

Then harden:

```text
Prompt 15 → 16 → 17 → 18 → 19 → 20
```

The most important architectural decision is this:

> **Retain v1 should be built like a local operating system for practice, not like a content app waiting for a backend.**

That means the bundled content system, local database, lapse recovery logic, and voice guardrails should be treated as core infrastructure from day one.

[1]: https://docs.expo.dev/guides/local-first/?utm_source=chatgpt.com "Local-first architecture with Expo"
[2]: https://developer.android.com/topic/architecture/data-layer/offline-first?utm_source=chatgpt.com "Build an offline-first app | App architecture"
[3]: https://claude.com/download?utm_source=chatgpt.com "Download Claude | Claude by Anthropic"
