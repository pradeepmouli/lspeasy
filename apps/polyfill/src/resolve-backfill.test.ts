import { describe, expect, it } from 'vitest';
import type { CodeAction } from '@lspeasy/core';
import { resolveBackfill } from './resolve-backfill.js';

describe('resolveBackfill.appliesTo', () => {
  it('applies when codeActionProvider is true (boolean form, no resolve)', () => {
    expect(resolveBackfill.appliesTo({ codeActionProvider: true })).toBe(true);
  });

  it('applies when codeActionProvider is an object without resolveProvider', () => {
    expect(
      resolveBackfill.appliesTo({ codeActionProvider: { codeActionKinds: ['quickfix'] } })
    ).toBe(true);
  });

  it('does not apply when resolveProvider is already true', () => {
    expect(resolveBackfill.appliesTo({ codeActionProvider: { resolveProvider: true } })).toBe(
      false
    );
  });

  it('does not apply when codeActionProvider is absent', () => {
    expect(resolveBackfill.appliesTo({})).toBe(false);
  });
});

describe('resolveBackfill.patchCapabilities', () => {
  it('normalizes boolean codeActionProvider to object form with resolveProvider: true', () => {
    const patched = resolveBackfill.patchCapabilities!({ codeActionProvider: true });
    expect(patched.codeActionProvider).toEqual({ resolveProvider: true });
  });

  it('adds resolveProvider: true to an existing object form', () => {
    const patched = resolveBackfill.patchCapabilities!({
      codeActionProvider: { codeActionKinds: ['quickfix'] }
    });
    expect(patched.codeActionProvider).toEqual({
      codeActionKinds: ['quickfix'],
      resolveProvider: true
    });
  });
});

describe('resolveBackfill.resolveCodeAction', () => {
  it('returns the input action unchanged', async () => {
    const action: CodeAction = {
      title: 'Fix it',
      kind: 'quickfix',
      edit: {
        changes: {
          'file:///x.ts': [
            {
              range: { start: { line: 0, character: 0 }, end: { line: 0, character: 1 } },
              newText: 'y'
            }
          ]
        }
      }
    };
    const resolved = await resolveBackfill.resolveCodeAction!(action, {} as never);
    expect(resolved).toBe(action);
  });
});
