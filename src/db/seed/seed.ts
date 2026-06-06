import type { Repositories } from '../repositories';

/**
 * Materialize the singleton profile row on first launch and ensure preferences
 * are readable. Seeds *user-data scaffolding* only — never content. Bundled
 * content lives in `src/content` and is never copied into the database.
 * Idempotent and safe to run on every startup.
 */
export async function seedDefaults(repositories: Repositories): Promise<void> {
  await repositories.profile.get();
  await repositories.settings.getPreferences();
}
