import type { Trial, TrialObjective } from '@/content/schemas';
import type { Clock } from '@/shared/lib/clock';

export interface DayQuestSignals {
  /** True when this day's hidden instruction has been revealed (or the day completed). */
  secretRevealed: boolean;
  forgeActsToday: number;
  pausesToday: number;
}

export interface ObjectiveResult {
  id: string;
  kind: TrialObjective['kind'];
  label: string;
  optional: boolean;
  complete: boolean;
}

export interface DayQuestResult {
  trial: Trial;
  objectives: ObjectiveResult[];
  /** All non-optional objectives are met. */
  cleared: boolean;
  /** Embers earned (0 unless cleared). */
  embers: number;
}

function isObjectiveMet(kind: TrialObjective['kind'], signals: DayQuestSignals): boolean {
  switch (kind) {
    case 'reveal_secret':
      return signals.secretRevealed;
    case 'forge_act':
      return signals.forgeActsToday > 0;
    case 'log_pause':
      return signals.pausesToday > 0;
  }
}

/**
 * Pure evaluator — derives quest completion from observed signals. Injecting the
 * clock allows time-gating in the future (e.g. "only evaluates after 6 PM").
 */
export function evaluateDayQuest(
  trial: Trial,
  signals: DayQuestSignals,
  _clock: Clock,
): DayQuestResult {
  const objectives: ObjectiveResult[] = trial.objectives.map((obj) => ({
    id: obj.id,
    kind: obj.kind,
    label: obj.label,
    optional: obj.optional ?? false,
    complete: isObjectiveMet(obj.kind, signals),
  }));

  const cleared = objectives
    .filter((o) => !o.optional)
    .every((o) => o.complete);

  return {
    trial,
    objectives,
    cleared,
    embers: cleared ? trial.rewardEmbers : 0,
  };
}
