import { afterEach, describe, expect, it } from 'vitest';
import { mkdtempSync, writeFileSync, rmSync } from 'node:fs';
import { tmpdir } from 'node:os';
import { join } from 'node:path';
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
