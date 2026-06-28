import { afterEach, describe, expect, it } from 'vitest';
import { mkdtempSync, mkdirSync, writeFileSync, rmSync } from 'node:fs';
import { tmpdir } from 'node:os';
import { join } from 'node:path';
import { codexAdapter } from './codex.js';

const dirs: string[] = [];
function fakeHome(): string {
  const home = mkdtempSync(join(tmpdir(), 'lspeasy-codex-'));
  dirs.push(home);
  mkdirSync(join(home, '.codex'), { recursive: true });
  writeFileSync(
    join(home, '.codex', 'config.toml'),
    [
      '[plugins."rust-analyzer@claude-code-lsps"]',
      'enabled = true',
      '',
      '[plugins."disabled@mp"]',
      'enabled = false'
    ].join('\n')
  );
  const plug = join(
    home,
    '.claude',
    'plugins',
    'marketplaces',
    'claude-code-lsps',
    'rust-analyzer'
  );
  mkdirSync(plug, { recursive: true });
  writeFileSync(
    join(plug, '.lsp.json'),
    JSON.stringify({ rust: { command: 'rust-analyzer', extensionToLanguage: { '.rs': 'rust' } } })
  );
  return home;
}
afterEach(() => {
  while (dirs.length) rmSync(dirs.pop()!, { recursive: true, force: true });
});

describe('codexAdapter', () => {
  it('is read-only (no write)', () => {
    expect(codexAdapter.tier).toBe('read-only');
    expect(codexAdapter.write).toBeUndefined();
  });
  it('reads enabled plugin servers from config.toml', () => {
    const home = fakeHome();
    const servers = codexAdapter.read('user', home);
    expect(servers['rust']).toMatchObject({
      command: 'rust-analyzer',
      marketplacePlugin: 'rust-analyzer@claude-code-lsps'
    });
    expect(Object.keys(servers)).toEqual(['rust']); // disabled@mp excluded
  });
});
