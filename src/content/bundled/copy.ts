/**
 * Centralized user-facing copy. All durable UI strings live here so the voice
 * stays consistent and is reviewable in one place against the content rules in
 * CLAUDE.md. Screens import from here rather than hardcoding text.
 *
 * Dynamic per-day content (teachings, commands, seals) is NOT here — it lives in
 * bundled content (`src/content/bundled/daily-path`, archetypes, rites, …) and is
 * read through the content loaders. This file holds the app's *chrome* copy.
 */
export const copy = {
  app: {
    name: 'Manforge',
    tagline: 'The energy is the ally. The compulsion is the adversary.',
  },
  tabs: {
    path: 'Path',
    forge: 'Forge',
    trials: 'Trials',
    journal: 'Journal',
    codex: 'Codex',
    progress: 'Hall',
  },
  actions: {
    begin: 'Begin',
    continue: 'Continue',
    back: 'Back',
    acknowledge: 'I understand',
    save: 'Save',
    done: 'Done',
    pause: 'Pause',
    openSettings: 'Settings',
    viewSafety: 'Safety & disclaimer',
  },

  onboarding: {
    eyebrow: {
      intro: 'Before the path begins',
      disclaimer: 'Before you begin',
      pathStart: 'Your path',
      threshold: 'The threshold',
    },
    actions: {
      continue: 'Continue',
      acknowledge: 'I acknowledge',
      begin: 'Begin the practice',
      back: 'Back',
    },
    welcome: {
      title: 'Welcome to Manforge.',
      subtitle: 'A private practice of pause, command, and transmutation.',
      quote: '"When the fire rises, what will you remember?"',
      body: 'Manforge is a practice, not a promise. It does not ask you to be perfect. It asks you to choose — every time the fire rises — whether you will obey the compulsion or govern it.',
    },
    philosophy: {
      title: 'This is not about hating desire.',
      subtitle: 'The energy is the ally. The compulsion is the enemy. The man is never the enemy.',
      body: [
        'This practice does not ask you to deny your nature, shame your body, or see desire as evil.',
        'It asks you to pause. To choose. To give the energy a worthy destination.',
        'The same fire that pulls you toward compulsion can be turned toward discipline, creation, courage, and depth.',
      ],
      quote: 'Desire is not evil. The body is not dirty.',
      quoteAttribution: 'Manforge principle',
    },
    privacy: {
      title: 'Your practice is private.',
      subtitle: 'No account. No cloud. No public profile.',
      bullets: [
        'No account is created.',
        'No analytics collected.',
        'No private practice leaves your device.',
        'Works without internet.',
        'The vault belongs to you alone.',
      ],
      footer: 'What you build here is between you and your practice.',
    },
    intention: {
      title: 'Why are you here?',
      subtitle: 'Choose the reason you entered this practice.',
    },
    vow: {
      title: 'Choose your vow.',
      subtitle: 'This is the sentence you return to when the fire rises.',
      customLabel: 'Your vow',
      customPlaceholder: 'Write your vow in one sentence...',
    },
    forge: {
      title: 'Where will you forge first?',
      subtitle: 'Choose where your energy will be turned into action.',
    },
    boundary: {
      title: 'Guard the gates.',
      subtitle: 'A boundary is a small rule that wins before the battle begins.',
      customLabel: 'Your boundary',
      customPlaceholder: 'Name one rule you will keep...',
    },
    pathStart: {
      title: 'Where are you?',
      subtitle: 'Honor the work you have already done.',
      existingLabel: 'What day are you on?',
      existingPlaceholder: 'e.g. 14',
      today: { label: 'Starting today.', description: 'Begin fresh. Day 1 starts now.' },
      existing: { label: "I'm already on a path.", description: 'Tell the app which day you are on.' },
    },
    disclaimer: {
      title: 'Before you begin.',
      subtitle: 'Read and acknowledge.',
      cardTitle: 'A note before the practice',
      paragraphs: [
        'Manforge is a philosophical self-mastery, journaling, and discipline app. It is not medical advice, therapy, diagnosis, or a mental health service.',
        'Manforge does not diagnose, treat, cure, or prevent any condition. It makes no claims about testosterone, fertility, attraction, disease, depression, anxiety, or athletic performance.',
        'The teaching draws from philosophical and historical traditions only. It is not religious authority, medical fact, or sexual technique.',
        'Desire is not evil. The body is not dirty. The practice is about pause, reflection, discipline, and direction.',
      ],
    },
    begin: {
      title: 'The path begins in the pause.',
      subtitle: 'Your practice is set. The work starts now.',
      quote: 'The path begins in the pause.',
      quoteAttribution: 'Manforge',
      summaryLabels: {
        vow: 'Vow',
        intention: 'Intention',
        forge: 'First forge',
        boundary: 'First boundary',
      },
    },
  },

  path: {
    notStarted: {
      eyebrow: 'The Path',
      title: 'The Practice Begins',
      subtitle: 'Pause. Choose. Transmute.',
      body: 'The path begins in the pause. Begin when you are ready.',
      begin: 'Begin the practice',
    },
    vowAttribution: 'Your vow',
    stats: { day: 'Day', streak: 'Streak', urges: 'Urges', forge: 'Forge', embers: 'Embers' },
    crown: {
      label: 'The Crown is earned',
      body: 'Ninety days. You have been formed. Receive the Crown.',
      action: 'Receive the Crown',
    },
    milestoneHint: "A milestone rite awaits within today's chamber.",
    openChamber: "Open Today's Chamber",
    logForge: 'Log a Forge Act',
    journalTonight: 'Journal Tonight',
    viewMap: 'View the Map',
    previewCommand: "Today's command",
    previewEvening: 'Evening account',
    longPathComplete:
      'The daily chambers are complete. Walk the Long Path — revisit any day from the map.',
    recordLapse: 'Lapse and return',
    feelTheFire: 'I Feel the Fire',
    stationLabel: 'Station',
  },

  forge: {
    todaysObjective: {
      label: "Today's Forge",
      hint: 'The fire has a destination today.',
      accept: 'Accept & Log',
      done: "The day's forge is recorded.",
    },
  },

  trials: {
    eyebrow: 'The Trials',
    title: 'Every day, a trial.',
    subtitle: 'Clear the day to earn its embers.',
    today: "Today's Trial",
    cleared: 'Cleared',
    open: 'Open',
    objectivesLabel: 'objectives',
    recent: 'The days behind you',
    locked: 'Not yet walked.',
  },

  daily: {
    greeting: {
      dawn: 'Before the world wakes.',
      morning: 'The day is yours to forge.',
      midday: 'Hold the line through the noon.',
      evening: 'The day asks for its account.',
      night: 'Guard the gates as you rest.',
    },
    focus: {
      morning: 'This morning',
      midday: "Today's practice",
      evening: 'Tonight',
      night: 'Before you sleep',
    },
    teachingEyebrow: "Today's teaching",
  },

  chamber: {
    locked: {
      title: 'This chamber is not yet open.',
      body: "Walk today's fire first.",
    },
    return: 'Return',
    labels: {
      teaching: 'Teaching',
      command: "Today's command",
      practice: 'Practice',
      forge: 'Forge',
      journalPrompt: 'Journal prompt',
      openJournal: 'Open journal',
      eveningAccount: 'Evening account',
      milestoneRite: 'Milestone rite',
      vowRenewal: 'Vow renewal',
      keyEarned: 'Key earned',
    },
    secret: {
      defaultLabel: 'Hidden Instruction',
      lockedHint: 'Open after reading.',
      types: {
        hidden_teaching: 'Hidden Teaching',
        ancient_key: 'Ancient Key',
        archetype_trial: 'Trial',
        forge_assignment: 'Forge Assignment',
        night_warning: 'Night Warning',
        lapse_medicine: 'Lapse Medicine',
        crown_fragment: 'Crown Fragment',
      },
    },
    complete: {
      done: 'Day recorded. Well walked.',
      gate: 'Open the hidden instruction before completing the day.',
      cleared: 'Trial cleared',
      embersEarned: 'Embers earned',
      keyEarned: 'Key earned',
      honorUnlocked: 'Honor unlocked',
      honorsUnlocked: 'Honors unlocked',
      stationLabel: 'Station',
    },
  },

  record: {
    eyebrow: 'Record',
    title: 'The record of practice.',
    subtitle: 'Your practice is more than a streak.',
    intention:
      'Path is what you do today. This is the mirror — what the record reveals about you: where the fire rises, how you answer, and how fast you return.',

    arc: {
      label: 'The 90-day arc',
      began: 'Began',
      crown: 'Crown',
      remaining: 'days remain',
      remainingOne: 'day remains',
      notStarted: 'Your arc has not begun. Begin the path to set Day one.',
      complete: 'The ninety days are complete. The Crown is yours.',
    },

    reveal: {
      label: 'What the record reveals',
      empty:
        'Nothing observed yet. Each urge you log, each act you forge, each return you record draws the pattern. Begin, and the mirror will show your face.',
    },

    pattern: {
      trigger: 'Most common trigger',
      hour: 'Strongest urge hour',
      response: 'Most common response',
      forge: 'Strongest forge',
    },

    fireMap: {
      label: 'The fire map',
      empty:
        'The fires you may meet. When you log an urge you name which one — the map will show where you are most tested.',
    },

    return: {
      label: 'The return',
      empty: 'No lapse recorded. The record measures not the fall, but the speed of the return.',
      lapsesStudied: 'Lapses studied',
      returnsRecorded: 'Returns recorded',
      averageReturn: 'Average return',
      posture: 'Current posture',
      postureOnPath: 'On the path',
      postureReturning: 'Returning',
      noReturnYet: '—',
    },

    forge: {
      label: 'Forge balance',
      empty: 'No acts forged yet. The record will show where your energy goes — and where it is missing.',
    },

    rhythm: {
      label: 'Practice rhythm',
      note: 'This week',
      activeDays: 'Active days',
      urges: 'Urges met',
      journal: 'Journal',
      forge: 'Forge acts',
    },

    account: {
      label: 'Weekly account',
      prompts: [
        'What pattern kept returning?',
        'Where did I obey less quickly?',
        'What must I guard next week?',
      ],
      cta: 'Write weekly account',
    },

    command: {
      label: 'Next command',
    },

    principle:
      'Command is trained in the return.\nThe record shows where the fire asks for discipline.',
  },

  settings: {
    eyebrow: 'Settings',
    title: 'Your space',
    description: 'Adjust the practice to fit your life. Everything stays on this device.',
    points: ['Haptics and gentle reminders', 'Review the safety note', 'No account, ever'],
  },
  safety: {
    eyebrow: 'Safety',
    title: 'Before you begin',
    description: 'A short, honest note about what this app is — and what it is not.',
  },
} as const;

export type Copy = typeof copy;
