import { TAB_ORDER } from './tabs';

describe('TAB_ORDER', () => {
  it('lists the five tabs in order, each with a non-empty title', () => {
    expect(TAB_ORDER.map((t) => t.name)).toEqual(['path', 'forge', 'codex', 'progress', 'hall']);
    for (const tab of TAB_ORDER) {
      expect(tab.title.trim().length).toBeGreaterThan(0);
    }
  });

  it('labels the metrics tab Record and the honors tab Hall', () => {
    expect(TAB_ORDER.find((t) => t.name === 'progress')?.title).toBe('Record');
    expect(TAB_ORDER.find((t) => t.name === 'hall')?.title).toBe('Hall');
  });
});
