import type { Achievement, AchievementCriteriaKind } from '@/content/schemas';
import type { Clock } from '@/shared/lib/clock';

export interface AchievementSignals {
  completedDays: number[];
  pauseCount: number;
  forgeActCount: number;
  forgeCategoriesUsed: Set<string>;
  returnCount: number;
  crownReceived: boolean;
  totalEmbers: number;
}

function isCriteriaMet(
  kind: AchievementCriteriaKind,
  params: Record<string, number>,
  signals: AchievementSignals,
): boolean {
  switch (kind) {
    case 'days_completed':
      return signals.completedDays.length >= (params['count'] ?? 1);
    case 'arc_cleared': {
      const arcNum = params['arcNumber'] ?? 1;
      const start = (arcNum - 1) * 10 + 1;
      const end = arcNum * 10;
      for (let d = start; d <= end; d++) {
        if (!signals.completedDays.includes(d)) return false;
      }
      return true;
    }
    case 'arcs_cleared': {
      let cleared = 0;
      for (let arc = 1; arc <= 9; arc++) {
        const start = (arc - 1) * 10 + 1;
        const end = arc * 10;
        let arcDone = true;
        for (let d = start; d <= end; d++) {
          if (!signals.completedDays.includes(d)) { arcDone = false; break; }
        }
        if (arcDone) cleared++;
      }
      return cleared >= (params['count'] ?? 1);
    }
    case 'pause_logged':
      return signals.pauseCount >= (params['count'] ?? 1);
    case 'forge_act_logged':
      return signals.forgeActCount >= (params['count'] ?? 1);
    case 'forge_all_categories':
      return signals.forgeCategoriesUsed.size >= 6;
    case 'return_recorded':
      return signals.returnCount >= (params['count'] ?? 1);
    case 'crown_received':
      return signals.crownReceived;
    case 'embers_earned':
      return signals.totalEmbers >= (params['count'] ?? 1);
  }
}

/**
 * Pure evaluator — checks the full achievement catalog against current signals,
 * returns ids that *should* now be earned. The caller filters out already-earned
 * ones. Idempotent — safe to call on every meaningful app event.
 */
export function evaluateAchievements(
  catalog: readonly Achievement[],
  signals: AchievementSignals,
  _clock: Clock,
): string[] {
  return catalog
    .filter((a) =>
      isCriteriaMet(a.criteria.kind, a.criteria.params, signals),
    )
    .map((a) => a.id);
}
