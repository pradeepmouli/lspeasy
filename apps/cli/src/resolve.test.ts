import { describe, it, expect, vi } from 'vitest';

// lsp.json discovery returns nothing by default → exercises the platform fallback.
// buildServerCommand is kept real (via importOriginal) so platform-sourced
// entries are put through the actual tokenize-then-quote logic under test.
vi.mock('@lspeasy/core', async (importOriginal) => {
  const actual = await importOriginal<typeof import('@lspeasy/core')>();
  return {
    ...actual,
    discoverServer: vi.fn(() => null),
    discoverServerByLanguageId: vi.fn(() => null),
    discoverServers: vi.fn(() => [])
  };
});

vi.mock('./config/registry.js', () => ({
  getAdapters: () => [
    {
      id: 'lspjson',
      detect: () => true,
      // lspjson is skipped by resolve.ts (core covers it); must not be read here.
      read: () => {
        throw new Error('lspjson should be skipped');
      }
    },
    {
      id: 'claude-code',
      detect: () => true,
      read: () => ({
        rust: { command: 'rust-analyzer', args: [], fileExtensions: { '.rs': 'rust' } },
        go: {
          command: 'gopls',
          args: [],
          fileExtensions: { '.go': 'go' },
          initializationOptions: { usePlaceholders: true }
        },
        // No separate `args` array — the whole launch command (binary + flags)
        // is embedded in `command`, exactly the shape that used to collapse
        // into one bogus token once buildServerCommand quoted it as a whole.
        kotlin: {
          command: 'kotlin-language-server --stdio',
          fileExtensions: { '.kt': 'kotlin' }
        }
      })
    }
  ]
}));

vi.mock('./config/commands.js', () => ({ homeForAdapter: () => '/home' }));

import {
  discoverServers,
  discoverServerByLanguageId,
  discoverServer,
  tokenizeCommand
} from '@lspeasy/core';
import {
  resolveByLanguageId,
  resolveByExtension,
  allConfiguredServers,
  allConfiguredServersWithSource,
  resolveEntry
} from './resolve.js';

describe('resolve — platform fallback (B)', () => {
  it('resolveByLanguageId falls back to a detected platform server (fromPlatform)', () => {
    const r = resolveByLanguageId('/p', 'rust');
    expect(r?.serverCommand).toContain('rust-analyzer');
    expect(r?.languageId).toBe('rust');
    expect(r?.fromPlatform).toBe(true); // → caller must bypass the daemon
  });

  it('a lsp.json hit is NOT fromPlatform (daemon can serve it)', () => {
    vi.mocked(discoverServerByLanguageId).mockReturnValueOnce({
      serverCommand: '"tsls"',
      languageId: 'typescript'
    });
    expect(resolveByLanguageId('/p', 'typescript')?.fromPlatform).toBe(false);
  });

  it('resolveByExtension falls back by extension', () => {
    expect(resolveByExtension('/p', '.rs')?.languageId).toBe('rust');
  });

  it('unknown language → null', () => {
    expect(resolveByLanguageId('/p', 'cobol')).toBeNull();
  });

  it('allConfiguredServers includes the platform server', () => {
    expect(allConfiguredServers('/p').some((s) => s.fileExtensions['.rs'] === 'rust')).toBe(true);
  });

  it('platformServers (via resolveByLanguageId) tokenizes an embedded-flags command into separate argv tokens', () => {
    // kotlin's `command` embeds "--stdio" with no separate `args` array —
    // proves the DRY consolidation (buildServerCommand from @lspeasy/core)
    // actually wires through platformServers(), not just core's own discovery.
    const r = resolveByLanguageId('/p', 'kotlin');
    expect(r?.fromPlatform).toBe(true);
    expect(tokenizeCommand(r!.serverCommand)).toEqual(['kotlin-language-server', '--stdio']);
  });

  it('allConfiguredServers dedups: lsp.json wins on language collision', () => {
    vi.mocked(discoverServers).mockReturnValueOnce([
      { name: 'rust', command: '"my-ra"', fileExtensions: { '.rs': 'rust' } }
    ]);
    const all = allConfiguredServers('/p');
    expect(all.filter((s) => s.fileExtensions['.rs'] === 'rust')).toHaveLength(1);
    expect(all[0]?.command).toBe('"my-ra"'); // the lsp.json one, not the platform
  });
});

describe('resolveEntry — language-or-file resolution', () => {
  it('resolves a known language id with no anchor file', () => {
    vi.mocked(discoverServerByLanguageId).mockReturnValueOnce({
      serverCommand: '"tsls"',
      languageId: 'typescript'
    });
    vi.mocked(discoverServers).mockReturnValueOnce([
      { name: 'typescript', command: '"tsls"', fileExtensions: { '.ts': 'typescript' } }
    ]);
    const entry = resolveEntry('typescript', '/p', '');
    expect(entry?.languageId).toBe('typescript');
    expect(entry?.anchorFile).toBeUndefined();
  });

  it('resolves a file path by extension, and the file becomes the anchor', () => {
    const entry = resolveEntry('src/foo.rs', '/p', '');
    expect(entry?.languageId).toBe('rust');
    expect(entry?.anchorFile).toBe('src/foo.rs');
  });

  it('returns null for a token that is neither a configured language nor an extensioned file', () => {
    expect(resolveEntry('nope', '/p', '')).toBeNull();
  });

  it('--server bypasses discovery; a file token still becomes the anchor', () => {
    const entry = resolveEntry('src/foo.rs', '/p', 'rust-analyzer');
    expect(entry?.serverCommand).toBe('rust-analyzer');
    expect(entry?.anchorFile).toBe('src/foo.rs');
    expect(entry?.languageId).toBe('rust'); // inferred from extension even with --server
  });

  it('--server with a plain language-name token has no anchor and uses the token as languageId', () => {
    const entry = resolveEntry('typescript', '/p', 'my-custom-server');
    expect(entry?.serverCommand).toBe('my-custom-server');
    expect(entry?.anchorFile).toBeUndefined();
    expect(entry?.languageId).toBe('typescript');
  });

  it('--server with an unrecognized file extension falls back to "plaintext", not the raw token', () => {
    // '.py' is not in any configured server's fileExtensions (only '.rs' is,
    // via the claude-code mock) — resolveByExtension returns null, so the old
    // code fell back to the raw token ("src/foo.py") as languageId, which is
    // not a valid LSP languageId. anchorFile must still be set correctly.
    const entry = resolveEntry('src/foo.py', '/p', 'custom-server');
    expect(entry?.serverCommand).toBe('custom-server');
    expect(entry?.anchorFile).toBe('src/foo.py');
    expect(entry?.languageId).toBe('plaintext');
  });
});

describe('initializationOptions threading', () => {
  it('resolveEntry with a language-id token carries initializationOptions from a matched lsp.json entry', () => {
    vi.mocked(discoverServerByLanguageId).mockReturnValueOnce({
      serverCommand: '"tsls"',
      languageId: 'typescript',
      initializationOptions: { supportsMoveToFileCodeAction: true }
    });
    vi.mocked(discoverServers).mockReturnValueOnce([
      { name: 'typescript', command: '"tsls"', fileExtensions: { '.ts': 'typescript' } }
    ]);
    const entry = resolveEntry('typescript', '/p', '');
    expect(entry?.initializationOptions).toEqual({ supportsMoveToFileCodeAction: true });
  });

  it('--server override still carries initializationOptions from the extension-matched entry', () => {
    vi.mocked(discoverServer).mockReturnValueOnce({
      serverCommand: '"rust-analyzer"',
      languageId: 'rust',
      initializationOptions: { cargo: { features: 'all' } }
    });
    const entry = resolveEntry('src/foo.rs', '/p', 'my-custom-server');
    expect(entry?.serverCommand).toBe('my-custom-server');
    expect(entry?.initializationOptions).toEqual({ cargo: { features: 'all' } });
  });

  it('a platform-adapter-sourced entry carries initializationOptions through the fallback path', () => {
    const entry = resolveEntry('go', '/p', '');
    expect(entry?.fromPlatform).toBe(true);
    expect(entry?.initializationOptions).toEqual({ usePlaceholders: true });
  });

  it('resolveByLanguageId platform fallback carries initializationOptions', () => {
    const r = resolveByLanguageId('/p', 'go');
    expect(r?.fromPlatform).toBe(true);
    expect(r?.initializationOptions).toEqual({ usePlaceholders: true });
  });

  it('resolveByExtension platform fallback carries initializationOptions', () => {
    const r = resolveByExtension('/p', '.go');
    expect(r?.fromPlatform).toBe(true);
    expect(r?.initializationOptions).toEqual({ usePlaceholders: true });
  });

  it('omits initializationOptions when the matched entry has none', () => {
    const entry = resolveEntry('src/foo.rs', '/p', '');
    expect(entry).not.toBeNull();
    expect('initializationOptions' in (entry as object)).toBe(false);
  });
});

describe('allConfiguredServersWithSource', () => {
  it('tags a platform-adapter server with the adapter id', () => {
    const servers = allConfiguredServersWithSource('/p');
    const rust = servers.find((s) => s.fileExtensions['.rs'] === 'rust');
    expect(rust?.source).toBe('claude-code');
  });

  it('tags an lsp.json server with "lsp.json"', () => {
    vi.mocked(discoverServers).mockReturnValueOnce([
      { name: 'typescript', command: '"tsls"', fileExtensions: { '.ts': 'typescript' } }
    ]);
    const servers = allConfiguredServersWithSource('/p');
    const ts = servers.find((s) => s.fileExtensions['.ts'] === 'typescript');
    expect(ts?.source).toBe('lsp.json');
  });

  it('allConfiguredServers still returns the same servers via the wrapper', () => {
    const withSource = allConfiguredServersWithSource('/p');
    const plain = allConfiguredServers('/p');
    expect(plain.map((s) => s.command).sort()).toEqual(withSource.map((s) => s.command).sort());
  });
});
