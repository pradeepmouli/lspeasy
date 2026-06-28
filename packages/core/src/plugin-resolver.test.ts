import { afterEach, describe, expect, it } from 'vitest';
import { mkdtempSync, mkdirSync, writeFileSync, rmSync } from 'node:fs';
import { tmpdir } from 'node:os';
import { join } from 'node:path';
import { listInstalledPluginServers, resolvePlugin, findPluginFor } from './plugin-resolver.js';

const roots: string[] = [];
function fixtureRoot(): string {
  // marketplaces/<mp>/<plugin>/.lsp.json (flat) and nested plugins/<plugin>/.lsp.json
  const root = mkdtempSync(join(tmpdir(), 'lspeasy-plugins-'));
  roots.push(root);
  const flat = join(root, 'claude-code-lsps', 'rust-analyzer');
  mkdirSync(flat, { recursive: true });
  writeFileSync(
    join(flat, '.lsp.json'),
    JSON.stringify({
      rust: {
        command: 'rust-analyzer',
        args: [],
        extensionToLanguage: { '.rs': 'rust' },
        maxRestarts: 3
      }
    })
  );
  const nested = join(root, 'claude-plugins-official', 'plugins', 'vscode-langservers');
  mkdirSync(nested, { recursive: true });
  writeFileSync(
    join(nested, '.lsp.json'),
    JSON.stringify({
      html: {
        command: 'vscode-html-language-server',
        args: ['--stdio'],
        extensionToLanguage: { '.html': 'html' }
      },
      css: {
        command: 'vscode-css-language-server',
        args: ['--stdio'],
        extensionToLanguage: { '.css': 'css' }
      }
    })
  );
  return root;
}

afterEach(() => {
  while (roots.length) rmSync(roots.pop()!, { recursive: true, force: true });
});

describe('plugin resolver', () => {
  it('lists installed plugin servers keyed by <plugin>@<marketplace>', () => {
    const all = listInstalledPluginServers(fixtureRoot());
    expect(Object.keys(all).sort()).toEqual([
      'rust-analyzer@claude-code-lsps',
      'vscode-langservers@claude-plugins-official'
    ]);
    expect(all['vscode-langservers@claude-plugins-official']).toHaveLength(2);
  });

  it('resolvePlugin renames extensionToLanguage and carries preserved fields + provenance', () => {
    const servers = resolvePlugin('rust-analyzer@claude-code-lsps', fixtureRoot());
    expect(servers).toHaveLength(1);
    expect(servers[0]).toMatchObject({
      command: 'rust-analyzer',
      fileExtensions: { '.rs': 'rust' },
      maxRestarts: 3,
      marketplacePlugin: 'rust-analyzer@claude-code-lsps'
    });
    expect((servers[0] as { extensionToLanguage?: unknown }).extensionToLanguage).toBeUndefined();
  });

  it('resolvePlugin returns [] for an unknown plugin', () => {
    expect(resolvePlugin('nope@nowhere', fixtureRoot())).toEqual([]);
  });

  it('findPluginFor matches by stamped provenance then by command', () => {
    const root = fixtureRoot();
    expect(
      findPluginFor(
        { command: 'x', fileExtensions: {}, marketplacePlugin: 'rust-analyzer@claude-code-lsps' },
        root
      )
    ).toBe('rust-analyzer@claude-code-lsps');
    expect(findPluginFor({ command: 'rust-analyzer', fileExtensions: {} }, root)).toBe(
      'rust-analyzer@claude-code-lsps'
    );
    expect(findPluginFor({ command: 'unmatched', fileExtensions: {} }, root)).toBeUndefined();
  });
});
