import type { Repositories } from '../repositories';

/**
 * Materialize singleton rows (settings, practice state) on first launch.
 *
 * This seeds *user-data scaffolding* only — never content. Bundled content
 * (codex, practices, principles) lives in `src/content` and is never copied into
 * the database. Idempotent and safe to run on every startup.
 */
export async function seedDefaults(repositories: Repositories): Promise<void> {
  await repositories.settings.get();
  await repositories.progress.getPracticeState();
}
