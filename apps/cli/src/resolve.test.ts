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

import { discoverServers } from '@lspeasy/core';
import { resolveByLanguageId, resolveByExtension, allConfiguredServers } from './resolve.js';

describe('resolve — platform fallback (B)', () => {
  it('resolveByLanguageId falls back to a detected platform server', () => {
    const r = resolveByLanguageId('/p', 'rust');
    expect(r?.serverCommand).toContain('rust-analyzer');
    expect(r?.languageId).toBe('rust');
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
