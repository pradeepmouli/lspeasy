import { describe, expect, it } from 'vitest';
import { getAdapters, getAdapter } from './registry.js';

describe('adapter registry', () => {
  it('exposes all v1 adapters by id', () => {
    const ids = getAdapters()
      .map((a) => a.id)
      .sort();
    expect(ids).toEqual(['claude-code', 'codex', 'copilot', 'lspjson', 'vscode']);
  });
  it('looks up an adapter by id', () => {
    expect(getAdapter('lspjson')?.tier).toBe('full');
    expect(getAdapter('claude-code')?.tier).toBe('plugin-resolved');
    expect(getAdapter('codex')?.tier).toBe('read-only');
    expect(getAdapter('nope')).toBeUndefined();
  });
});
