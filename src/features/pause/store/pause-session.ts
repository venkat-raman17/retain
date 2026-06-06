import { create } from 'zustand';

/**
 * Ephemeral, in-memory state for an urge-support breathing session. This is UI
 * session state, not user data — it intentionally never touches persistence
 * (Zustand is the right tool; SQLite is not). If the user wants to keep a record
 * of the moment, they do so explicitly in the Journal.
 */
export type BreathPhase = 'idle' | 'inhale' | 'hold' | 'exhale';

interface PauseSessionState {
  running: boolean;
  phase: BreathPhase;
  cycles: number;
  start: () => void;
  stop: () => void;
  setPhase: (phase: BreathPhase) => void;
  completeCycle: () => void;
}

export const usePauseSession = create<PauseSessionState>((set) => ({
  running: false,
  phase: 'idle',
  cycles: 0,
  start: () => set({ running: true, phase: 'inhale', cycles: 0 }),
  stop: () => set({ running: false, phase: 'idle' }),
  setPhase: (phase) => set({ phase }),
  completeCycle: () => set((state) => ({ cycles: state.cycles + 1 })),
}));
