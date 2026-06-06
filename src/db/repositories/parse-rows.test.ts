import { z } from 'zod';

import { parseRows } from './parse-rows';

const schema = z.object({ n: z.number() });
const parse = (row: unknown): { n: number } => schema.parse(row);

describe('parseRows', () => {
  // Dropped rows log a warning by design; keep the suite output quiet.
  let warnSpy: jest.SpyInstance;
  beforeEach(() => {
    warnSpy = jest.spyOn(console, 'warn').mockImplementation(() => undefined);
  });
  afterEach(() => warnSpy.mockRestore());

  it('keeps valid rows and drops malformed ones without throwing', () => {
    const rows = [{ n: 1 }, { n: 'bad' }, { n: 3 }];
    expect(parseRows('test', rows, parse)).toEqual([{ n: 1 }, { n: 3 }]);
  });

  it('returns an empty list when every row is malformed', () => {
    const rows = [{ n: 'a' }, { bad: true }];
    expect(parseRows('test', rows, parse)).toEqual([]);
  });

  it('returns everything when all rows are valid', () => {
    const rows = [{ n: 1 }, { n: 2 }];
    expect(parseRows('test', rows, parse)).toEqual([{ n: 1 }, { n: 2 }]);
  });
});
