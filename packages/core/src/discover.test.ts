import { afterEach, describe, expect, it } from 'vitest';
import { mkdtempSync, writeFileSync, rmSync } from 'node:fs';
import { tmpdir } from 'node:os';
import { join } from 'node:path';
import type { LspServerEntry } from './discover.js';
import {
  discoverServers,
  discoverServer,
  discoverServerByLanguageId,
  buildServerCommand,
  readLspJsonFile,
  writeLspJsonFile,
  mergeServers
} from './discover.js';
import { tokenizeCommand } from './utils/tokenize-command.js';

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

  it('the normal (already-split command/args) case is unchanged: identical quoting, no extra spaces', () => {
    // Regression guard: would catch a subtle formatting change (extra space,
    // different quoting) introduced by tokenizing `entry.command` first.
    const root = rootWithConfig({
      lspServers: {
        typescript: {
          command: 'typescript-language-server',
          args: ['--stdio'],
          fileExtensions: { '.ts': 'typescript' }
        }
      }
    });
    expect(discoverServers(root)[0]!.command).toBe('"typescript-language-server" "--stdio"');
  });

  it('tokenizes a command field with embedded flags and no args array into separate tokens', () => {
    // The confirmed bug: a whole launch command (binary + flags) crammed into
    // the single `command` string, with no separate `args` array.
    const root = rootWithConfig({
      lspServers: {
        typescript: {
          command: 'typescript-language-server --stdio',
          fileExtensions: { '.ts': 'typescript' }
        }
      }
    });
    const resolved = discoverServer(root, '.ts')!;
    // Round-trip through the real tokenizer, proving a caller doing
    // `const [cmd, ...args] = tokenizeCommand(serverCommand)` gets a real
    // binary name, not the whole string with a space in it.
    expect(tokenizeCommand(resolved.serverCommand)).toEqual([
      'typescript-language-server',
      '--stdio'
    ]);

    const configured = discoverServers(root)[0]!;
    expect(tokenizeCommand(configured.command)).toEqual(['typescript-language-server', '--stdio']);
  });

  it('buildServerCommand: bare command (no embedded spaces) tokenizes to a single unchanged token', () => {
    expect(buildServerCommand({ command: 'rust-analyzer', fileExtensions: {} })).toBe(
      '"rust-analyzer"'
    );
  });

  it('buildServerCommand: embedded flags in command combine with explicit args, in order', () => {
    expect(
      buildServerCommand({
        command: 'typescript-language-server --stdio',
        args: ['--log-level', '4'],
        fileExtensions: {}
      })
    ).toBe('"typescript-language-server" "--stdio" "--log-level" "4"');
  });

  it('returns an empty array when no lsp.json is found', () => {
    const dir = mkdtempSync(join(tmpdir(), 'lspeasy-empty-'));
    tmpRoots.push(dir);
    // Redirect HOME so the global ~/.claude/lsp.json fallback can't resolve.
    const origHome = process.env.HOME;
    const origUserProfile = process.env.USERPROFILE;
    try {
      process.env.HOME = dir;
      process.env.USERPROFILE = dir;
      expect(discoverServers(dir)).toEqual([]);
    } finally {
      process.env.HOME = origHome;
      process.env.USERPROFILE = origUserProfile;
    }
  });
});

describe('initializationOptions threading (ResolvedServer)', () => {
  it('discoverServer carries initializationOptions verbatim when the entry has them', () => {
    const root = rootWithConfig({
      lspServers: {
        typescript: {
          command: 'typescript-language-server',
          args: ['--stdio'],
          fileExtensions: { '.ts': 'typescript' },
          initializationOptions: { supportsMoveToFileCodeAction: true }
        }
      }
    });
    const resolved = discoverServer(root, '.ts');
    expect(resolved?.initializationOptions).toEqual({ supportsMoveToFileCodeAction: true });
  });

  it('discoverServer omits initializationOptions (not undefined-valued) when the entry has none', () => {
    const root = rootWithConfig({
      lspServers: {
        typescript: {
          command: 'typescript-language-server',
          args: ['--stdio'],
          fileExtensions: { '.ts': 'typescript' }
        }
      }
    });
    const resolved = discoverServer(root, '.ts');
    expect(resolved).not.toBeNull();
    expect('initializationOptions' in (resolved as object)).toBe(false);
  });

  it('discoverServerByLanguageId carries initializationOptions verbatim when the entry has them', () => {
    const root = rootWithConfig({
      lspServers: {
        rust: {
          command: 'rust-analyzer',
          fileExtensions: { '.rs': 'rust' },
          initializationOptions: { cargo: { features: 'all' } }
        }
      }
    });
    const resolved = discoverServerByLanguageId(root, 'rust');
    expect(resolved?.initializationOptions).toEqual({ cargo: { features: 'all' } });
  });

  it('discoverServerByLanguageId omits initializationOptions when the entry has none', () => {
    const root = rootWithConfig({
      lspServers: {
        rust: { command: 'rust-analyzer', fileExtensions: { '.rs': 'rust' } }
      }
    });
    const resolved = discoverServerByLanguageId(root, 'rust');
    expect(resolved).not.toBeNull();
    expect('initializationOptions' in (resolved as object)).toBe(false);
  });

  it('discoverServer with no fileExt (first server) still carries initializationOptions', () => {
    const root = rootWithConfig({
      lspServers: {
        typescript: {
          command: 'typescript-language-server',
          fileExtensions: { '.ts': 'typescript' },
          initializationOptions: { a: 1 }
        }
      }
    });
    const resolved = discoverServer(root, '');
    expect(resolved?.initializationOptions).toEqual({ a: 1 });
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

describe('LspJson file IO', () => {
  it('writes then reads back the same servers', () => {
    const dir = mkdtempSync(join(tmpdir(), 'lspeasy-io-'));
    try {
      const servers = { rust: { command: 'rust-analyzer', fileExtensions: { '.rs': 'rust' } } };
      const file = join(dir, 'lsp.json');
      writeLspJsonFile(file, servers);
      expect(readLspJsonFile(file)).toEqual(servers);
    } finally {
      rmSync(dir, { recursive: true, force: true });
    }
  });

  it('returns {} for a missing or invalid file', () => {
    expect(readLspJsonFile('/no/such/lsp.json')).toEqual({});
  });

  it('mergeServers reports added and updated keys', () => {
    const base = { a: { command: 'a', fileExtensions: {} } };
    const incoming = {
      a: { command: 'a2', fileExtensions: {} },
      b: { command: 'b', fileExtensions: {} }
    };
    const { merged, added, updated } = mergeServers(base, incoming);
    expect(added).toEqual(['b']);
    expect(updated).toEqual(['a']);
    expect(merged.a!.command).toBe('a2');
  });
});
