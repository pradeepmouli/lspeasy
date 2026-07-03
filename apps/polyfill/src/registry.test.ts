import { describe, expect, it } from 'vitest';
import { applicablePolyfills } from './registry.js';
import { resolveBackfill } from './resolve-backfill.js';

describe('applicablePolyfills', () => {
  it('includes resolve-backfill when the backend lacks native resolve', () => {
    const applicable = applicablePolyfills({ codeActionProvider: true });
    expect(applicable.map((p) => p.id)).toContain(resolveBackfill.id);
  });

  it('excludes resolve-backfill when the backend already supports resolve', () => {
    const applicable = applicablePolyfills({ codeActionProvider: { resolveProvider: true } });
    expect(applicable.map((p) => p.id)).not.toContain(resolveBackfill.id);
  });

  it('returns an empty list when no polyfill applies', () => {
    expect(applicablePolyfills({})).toEqual([]);
  });
});
