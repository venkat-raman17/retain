import { copy } from '@/content';

/**
 * Bottom-tab configuration. `name` matches the route file under
 * `src/app/(tabs)/`. Consumed by the tabs layout to render screens in order.
 */
export interface TabDescriptor {
  name: 'path' | 'forge' | 'codex' | 'progress';
  title: string;
}

export const TAB_ORDER: readonly TabDescriptor[] = [
  { name: 'path', title: copy.tabs.path },
  { name: 'forge', title: copy.tabs.forge },
  { name: 'codex', title: copy.tabs.codex },
  { name: 'progress', title: copy.tabs.progress },
];
