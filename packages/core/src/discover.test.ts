import { afterEach, describe, expect, it } from 'vitest';
import { mkdtempSync, writeFileSync, rmSync } from 'node:fs';
import { tmpdir } from 'node:os';
import { join } from 'node:path';
import type { LspServerEntry } from './discover.js';
import { discoverServers } from './discover.js';

const tmpRoots: string[] = [];
function rootWithConfig(config: unknown): string {
  const dir = mkdtempSync(join(tmpdir(), 'lspeasy-disc-'));
  tmpRoots.push(dir);
  writeFileSync(join(dir, 'lsp.json'), JSON.stringify(config), 'utf8');
  return dir;
}

afterEach(() => {
  while (tmpRoots.length) rmSync(tmpRoots.pop()!, { recursive: true, force: true });
});

describe('discoverServers', () => {
  it('returns every configured server with name, command, and fileExtensions', () => {
    const root = rootWithConfig({
      lspServers: {
        typescript: {
          command: 'typescript-language-server',
          args: ['--stdio'],
          fileExtensions: { '.ts': 'typescript', '.tsx': 'typescriptreact' }
        },
        rust: { command: 'rust-analyzer', fileExtensions: { '.rs': 'rust' } }
      }
    });
    const servers = discoverServers(root);
    expect(servers).toHaveLength(2);
    const ts = servers.find((s) => s.name === 'typescript')!;
    expect(ts.command).toBe('"typescript-language-server" "--stdio"');
    expect(ts.fileExtensions).toEqual({ '.ts': 'typescript', '.tsx': 'typescriptreact' });
    expect(servers.find((s) => s.name === 'rust')!.command).toBe('"rust-analyzer"');
  });

  it('returns an empty array when no lsp.json is found', () => {
    const dir = mkdtempSync(join(tmpdir(), 'lspeasy-empty-'));
    tmpRoots.push(dir);
    expect(discoverServers(dir)).toEqual([]);
  });
});

describe('LspServerEntry preserved fields', () => {
  it('accepts provenance and preserved-but-unused fields', () => {
    const e: LspServerEntry = {
      command: 'rust-analyzer',
      fileExtensions: { '.rs': 'rust' },
      marketplacePlugin: 'rust-analyzer@claude-code-lsps',
      transport: 'stdio',
      initializationOptions: { a: 1 },
      settings: { b: 2 },
      maxRestarts: 3
    };
    expect(e.marketplacePlugin).toBe('rust-analyzer@claude-code-lsps');
    expect(e.maxRestarts).toBe(3);
  });
});
