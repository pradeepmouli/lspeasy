import { describe, expect, it } from 'vitest';
import { z } from 'zod';
import { getResultSchemaForMethod } from './schemas.js';

describe('getResultSchemaForMethod', () => {
  it('returns a Zod schema for a request method with a result', () => {
    const schema = getResultSchemaForMethod('textDocument/hover');
    expect(schema).toBeDefined();
    expect(schema).toBeInstanceOf(z.ZodType);
  });
  it('returns the result schema for initialize (the structure-schema collision case)', () => {
    const schema = getResultSchemaForMethod('initialize');
    expect(schema).toBeDefined();
    expect(schema).toBeInstanceOf(z.ZodType);
  });
  it('returns undefined for an unknown / notification method', () => {
    expect(getResultSchemaForMethod('textDocument/didOpen')).toBeUndefined();
    expect(getResultSchemaForMethod('made/up')).toBeUndefined();
  });
});
