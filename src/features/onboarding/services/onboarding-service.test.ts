import { createFakeRepositories } from '@/testing/fakes';
import { fixedClock } from '@/shared/lib';

import { BOUNDARY_CUSTOM, BOUNDARY_SKIP, type OnboardingDraft } from '../domain/onboarding';
import { OnboardingService } from './onboarding-service';

const CLOCK = fixedClock(new Date('2024-01-15T09:00:00Z'));

function makeService() {
  const repos = createFakeRepositories();
  const service = new OnboardingService(
    repos.profile,
    repos.path,
    repos.boundary,
    repos.settings,
    CLOCK,
  );
  return { repos, service };
}

const BASE_DRAFT: OnboardingDraft = {
  vowPresetId: 'pause-before-obey',
  customVow: null,
  intention: 'discipline',
  forgeCategory: 'mind',
  boundaryChoice: 'No phone in bed.',
  customBoundaryTitle: null,
  offsetDays: 0,
};

describe('OnboardingService', () => {
  it('marks onboarding complete', async () => {
    const { repos, service } = makeService();
    await service.complete(BASE_DRAFT);
    const profile = await repos.profile.get();
    expect(profile.onboardingCompleted).toBe(true);
  });

  it('saves a preset vow', async () => {
    const { repos, service } = makeService();
    await service.complete({ ...BASE_DRAFT, vowPresetId: 'do-not-waste-fire' });
    const profile = await repos.profile.get();
    expect(profile.selectedVow).toBe('do-not-waste-fire');
    expect(profile.customVow).toBeNull();
  });

  it('saves a custom vow', async () => {
    const { repos, service } = makeService();
    await service.complete({
      ...BASE_DRAFT,
      vowPresetId: 'custom',
      customVow: 'I choose the fire.',
    });
    const profile = await repos.profile.get();
    expect(profile.selectedVow).toBeNull();
    expect(profile.customVow).toBe('I choose the fire.');
  });

  it('saves intention and forge category to settings', async () => {
    const { repos, service } = makeService();
    await service.complete({ ...BASE_DRAFT, intention: 'purpose', forgeCategory: 'body' });
    const prefs = await repos.settings.getPreferences();
    expect(prefs.primaryIntention).toBe('purpose');
    expect(prefs.preferredForgeCategory).toBe('body');
  });

  it('acknowledges safety disclaimer', async () => {
    const { repos, service } = makeService();
    await service.complete(BASE_DRAFT);
    const prefs = await repos.settings.getPreferences();
    expect(prefs.safetyAcknowledged).toBe(true);
  });

  it('creates a boundary from a preset choice', async () => {
    const { repos, service } = makeService();
    await service.complete({ ...BASE_DRAFT, boundaryChoice: 'No phone in bed.' });
    const boundaries = await repos.boundary.list();
    expect(boundaries).toHaveLength(1);
    expect(boundaries[0]?.title).toBe('No phone in bed.');
  });

  it('creates a custom boundary', async () => {
    const { repos, service } = makeService();
    await service.complete({
      ...BASE_DRAFT,
      boundaryChoice: BOUNDARY_CUSTOM,
      customBoundaryTitle: 'No screens after 21:00.',
    });
    const boundaries = await repos.boundary.list();
    expect(boundaries).toHaveLength(1);
    expect(boundaries[0]?.title).toBe('No screens after 21:00.');
  });

  it('skips boundary creation when SKIP is chosen', async () => {
    const { repos, service } = makeService();
    await service.complete({ ...BASE_DRAFT, boundaryChoice: BOUNDARY_SKIP });
    const boundaries = await repos.boundary.list();
    expect(boundaries).toHaveLength(0);
  });

  it('skips boundary creation when boundaryChoice is null', async () => {
    const { repos, service } = makeService();
    await service.complete({ ...BASE_DRAFT, boundaryChoice: null });
    const boundaries = await repos.boundary.list();
    expect(boundaries).toHaveLength(0);
  });

  it('starts the path', async () => {
    const { repos, service } = makeService();
    await service.complete(BASE_DRAFT);
    const profile = await repos.profile.get();
    expect(profile.currentPathStartedAt).not.toBeNull();
    expect(profile.pathStartedAt).not.toBeNull();
  });

  it('backdates the path start when offsetDays is set', async () => {
    const { repos, service } = makeService();
    await service.complete({ ...BASE_DRAFT, offsetDays: 13 });
    const profile = await repos.profile.get();
    // Clock is 2024-01-15; 13 days back = 2024-01-02
    expect(profile.currentPathStartedAt).toContain('2024-01-02');
  });

  it('emits a path_started event', async () => {
    const { repos, service } = makeService();
    await service.complete(BASE_DRAFT);
    const events = await repos.path.listEvents();
    expect(events.some((event) => event.type === 'path_started')).toBe(true);
  });
});
