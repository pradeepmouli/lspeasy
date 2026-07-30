import { describe, expect, it } from 'vitest';
import { vscodeAdapter } from './vscode.js';

describe('vscodeAdapter', () => {
  it('is read-only and returns no servers (unsupported in v1)', () => {
    expect(vscodeAdapter.tier).toBe('read-only');
    expect(vscodeAdapter.write).toBeUndefined();
    expect(vscodeAdapter.read('user', '/anywhere')).toEqual({});
  });
});
