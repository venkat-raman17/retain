/**
 * Centralized route paths. Expo Router is file-based (routes live in `src/app`),
 * but navigation calls reference these constants instead of bare strings so that
 * paths are defined once and easy to refactor.
 */
export const Routes = {
  boot: '/',
  onboarding: '/onboarding',
  path: '/path',
  forge: '/forge',
  journal: '/journal',
  codex: '/codex',
  progress: '/progress',
  pause: '/pause',
  settings: '/settings',
  safety: '/safety',
} as const;

export type RouteKey = keyof typeof Routes;
export type RoutePath = (typeof Routes)[RouteKey];
