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

  it('includes fix-all when the backend has pull diagnostics but not source.fixAll', () => {
    const applicable = applicablePolyfills({
      codeActionProvider: true,
      diagnosticProvider: { interFileDependencies: false, workspaceDiagnostics: false }
    });
    expect(applicable.map((p) => p.id)).toContain('fix-all');
  });

  it('includes organize-imports when the backend has pull diagnostics but not source.organizeImports', () => {
    const applicable = applicablePolyfills({
      codeActionProvider: true,
      diagnosticProvider: { interFileDependencies: false, workspaceDiagnostics: false }
    });
    expect(applicable.map((p) => p.id)).toContain('organize-imports');
  });
});
