import { describe, it, expect, vi } from 'vitest';

// lsp.json discovery returns nothing by default → exercises the platform fallback.
vi.mock('@lspeasy/core', () => ({
  discoverServer: vi.fn(() => null),
  discoverServerByLanguageId: vi.fn(() => null),
  discoverServers: vi.fn(() => [])
}));

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
        rust: { command: 'rust-analyzer', args: [], fileExtensions: { '.rs': 'rust' } }
      })
    }
  ]
}));

vi.mock('./config/commands.js', () => ({ homeForAdapter: () => '/home' }));

import { discoverServers, discoverServerByLanguageId } from '@lspeasy/core';
import {
  resolveByLanguageId,
  resolveByExtension,
  allConfiguredServers,
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
});
