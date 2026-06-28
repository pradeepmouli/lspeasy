import { afterEach, describe, expect, it } from 'vitest';
import { mkdtempSync, mkdirSync, writeFileSync, readFileSync, existsSync, rmSync } from 'node:fs';
import { tmpdir } from 'node:os';
import { join } from 'node:path';
import { claudeCodeAdapter } from './claude-code.js';

const dirs: string[] = [];
// Build a fake home with settings.json (enabledPlugins) + a plugins tree.
function fakeHome(): string {
  const home = mkdtempSync(join(tmpdir(), 'lspeasy-cc-'));
  dirs.push(home);
  mkdirSync(join(home, '.claude'), { recursive: true });
  writeFileSync(
    join(home, '.claude', 'settings.json'),
    JSON.stringify(
      {
        enabledPlugins: { 'rust-analyzer@claude-code-lsps': true, 'other@mp': true },
        theme: 'dark'
      },
      null,
      2
    )
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

describe('claudeCodeAdapter', () => {
  it('reads enabled plugins that resolve to servers', () => {
    const home = fakeHome();
    const servers = claudeCodeAdapter.read('user', home);
    // keyed by canonical server name (the .lsp.json server key)
    expect(servers['rust']).toMatchObject({
      command: 'rust-analyzer',
      marketplacePlugin: 'rust-analyzer@claude-code-lsps'
    });
    // "other@mp" had no installed .lsp.json → omitted
    expect(Object.keys(servers)).toEqual(['rust']);
  });

  it('writes by toggling enabledPlugins, preserving other keys, with a backup', () => {
    const home = fakeHome();
    const res = claudeCodeAdapter.write!(
      {
        rust: {
          command: 'rust-analyzer',
          fileExtensions: { '.rs': 'rust' },
          marketplacePlugin: 'rust-analyzer@claude-code-lsps'
        }
      },
      'user',
      home
    );
    expect(res.written).toEqual(['rust']);
    const settings = JSON.parse(readFileSync(join(home, '.claude', 'settings.json'), 'utf8'));
    expect(settings.enabledPlugins['rust-analyzer@claude-code-lsps']).toBe(true);
    expect(settings.theme).toBe('dark'); // unrelated key preserved
    expect(existsSync(join(home, '.claude', 'settings.json.bak'))).toBe(true);
  });

  it('skips a server with no matching installed plugin on write', () => {
    const home = fakeHome();
    const res = claudeCodeAdapter.write!(
      { ghost: { command: 'ghost-ls', fileExtensions: {} } },
      'user',
      home
    );
    expect(res.written).toEqual([]);
    expect(res.skipped.map((s) => s.name)).toEqual(['ghost']);
  });
});
