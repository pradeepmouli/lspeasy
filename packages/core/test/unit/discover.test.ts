import { describe, it, expect } from 'vitest';
import { selectServer, selectServerByLanguageId, selectExtensionMap } from '../../src/discover.js';
import type { LspJson } from '../../src/discover.js';

const CONFIG: LspJson = {
  lspServers: {
    typescript: {
      command: 'typescript-language-server',
      args: ['--stdio'],
      fileExtensions: { '.ts': 'typescript', '.tsx': 'typescriptreact' }
    },
    rust: {
      command: 'rust-analyzer',
      args: [],
      fileExtensions: { '.rs': 'rust' }
    }
  }
};

describe('selectServer', () => {
  it('returns matching server for .ts extension', () => {
    const result = selectServer(CONFIG, '.ts');
    expect(result).toEqual({
      serverCommand: '"typescript-language-server" "--stdio"',
      languageId: 'typescript'
    });
  });

  it('maps .tsx to typescriptreact languageId', () => {
    expect(selectServer(CONFIG, '.tsx')?.languageId).toBe('typescriptreact');
  });

  it('matches rust server for .rs extension', () => {
    const result = selectServer(CONFIG, '.rs');
    expect(result).toEqual({ serverCommand: '"rust-analyzer"', languageId: 'rust' });
  });

  it('returns null for unknown extension', () => {
    expect(selectServer(CONFIG, '.py')).toBeNull();
  });

  it('returns null for empty lspServers', () => {
    expect(selectServer({ lspServers: {} }, '.ts')).toBeNull();
  });
});

describe('selectServerByLanguageId', () => {
  it('finds server by languageId', () => {
    expect(selectServerByLanguageId(CONFIG, 'rust')?.serverCommand).toBe('"rust-analyzer"');
  });
  it('finds secondary languageId (typescriptreact)', () => {
    expect(selectServerByLanguageId(CONFIG, 'typescriptreact')?.serverCommand).toContain(
      'typescript-language-server'
    );
  });
  it('returns null for unknown languageId', () => {
    expect(selectServerByLanguageId(CONFIG, 'python')).toBeNull();
  });
});

describe('selectExtensionMap', () => {
  it('builds extension → languageId map', () => {
    const map = selectExtensionMap(CONFIG);
    expect(map['.ts']).toBe('typescript');
    expect(map['.tsx']).toBe('typescriptreact');
    expect(map['.rs']).toBe('rust');
  });
});
