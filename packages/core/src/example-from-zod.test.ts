import { describe, expect, it } from 'vitest';
import { z } from 'zod';
import { exampleFromZod } from './example-from-zod.js';

describe('exampleFromZod', () => {
  it('fills scalars with typed samples', () => {
    expect(exampleFromZod(z.string())).toBe('example');
    expect(exampleFromZod(z.number())).toBe(1);
    expect(exampleFromZod(z.boolean())).toBe(false);
  });
  it('uses the first value of an enum/literal union', () => {
    expect(exampleFromZod(z.enum(['a', 'b']))).toBe('a');
    expect(exampleFromZod(z.literal('quickfix'))).toBe('quickfix');
  });
  it('includes required object props and omits optionals', () => {
    const schema = z.object({ uri: z.string(), version: z.number().optional() });
    expect(exampleFromZod(schema)).toEqual({ uri: 'example' });
  });
  it('produces a one-element array sample', () => {
    expect(exampleFromZod(z.array(z.string()))).toEqual(['example']);
  });
  it('guards recursion depth (no infinite loop on lazy/recursive schemas)', () => {
    const Rec: z.ZodType<unknown> = z.lazy(() => z.object({ child: Rec.optional() }));
    expect(() => exampleFromZod(Rec)).not.toThrow();
  });
});
