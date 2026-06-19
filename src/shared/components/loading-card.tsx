import { copy } from '@/content';

import { AppCard } from './card';
import { AppText } from './text';

export interface LoadingCardProps {
  /** Overrides the default "Loading…" label. */
  label?: string;
}

/** A quiet centered "Loading…" card — the one loading fallback for list screens. */
export function LoadingCard({ label }: LoadingCardProps) {
  return (
    <AppCard>
      <AppText variant="body" color="muted" align="center">
        {label ?? copy.loading}
      </AppText>
    </AppCard>
  );
}
