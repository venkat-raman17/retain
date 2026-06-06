import type { ForgeCategoryCount, ForgeRepository } from '@/db';
import type { Clock } from '@/shared/lib';

import { createForgeAct, type ForgeAct, type ForgeActDraft } from '../domain/forge-act';

/** Turns raw desire into a recorded act of building (a Forge Act). */
export class ForgeService {
  constructor(
    private readonly forge: ForgeRepository,
    private readonly clock: Clock,
  ) {}

  async logAct(draft: ForgeActDraft): Promise<ForgeAct> {
    const act = createForgeAct(draft, this.clock);
    await this.forge.add(act);
    return act;
  }

  listRecent(limit?: number): Promise<ForgeAct[]> {
    return this.forge.list(limit);
  }

  categoryCounts(): Promise<ForgeCategoryCount[]> {
    return this.forge.categoryCounts();
  }
}
