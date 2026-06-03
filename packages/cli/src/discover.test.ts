import { describe, it, expect } from 'vitest';
import { selectServer } from './discover.js';
import type { LspJson } from './discover.js';

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
      serverCommand: 'typescript-language-server --stdio',
      languageId: 'typescript'
    });
  });

  it('maps .tsx to typescriptreact languageId', () => {
    expect(selectServer(CONFIG, '.tsx')?.languageId).toBe('typescriptreact');
  });

  it('matches rust server for .rs extension', () => {
    const result = selectServer(CONFIG, '.rs');
    expect(result).toEqual({ serverCommand: 'rust-analyzer', languageId: 'rust' });
  });

  it('returns null for unknown extension', () => {
    expect(selectServer(CONFIG, '.py')).toBeNull();
  });

  it('omits trailing space when args is empty', () => {
    expect(selectServer(CONFIG, '.rs')?.serverCommand).toBe('rust-analyzer');
  });

  it('returns null for empty lspServers', () => {
    expect(selectServer({ lspServers: {} }, '.ts')).toBeNull();
  });
});
