import { describe, it, expect, vi } from 'vitest';
import { Command } from 'commander';
import { buildCommandTree } from './build-commands.js';
import type { GlobalFlags } from './io.js';

/**
 * Verifies that buildCommandTree + zodToCommander correctly dispatches
 * LSP requests when capabilities are advertised, passing the right params.
 */

const FLAGS: GlobalFlags = {
  server: '',
  root: '/project',
  dryRun: false,
  json: false,
  verbose: false,
  waitMs: 0,
  allowOutsideRoot: true,
  overwrite: false
};

describe('capability → command → dispatch integration', () => {
  it('dispatches textDocument/hover with correct LSP params', async () => {
    const sendRequest = vi.fn(async () => ({ contents: { kind: 'markdown', value: 'hello' } }));
    const fakeSession = { lsp: { sendRequest } } as any;

    const program = new Command().exitOverride();
    buildCommandTree(program, { hoverProvider: true } as any, fakeSession, FLAGS);

    const writes: string[] = [];
    vi.spyOn(process.stdout, 'write').mockImplementation((s) => {
      writes.push(String(s));
      return true;
    });

    await program.parseAsync(['textDocument', 'hover', '/project/src/foo.ts', '5:10'], {
      from: 'user'
    });

    expect(sendRequest).toHaveBeenCalledWith(
      'textDocument/hover',
      expect.objectContaining({
        textDocument: expect.objectContaining({ uri: expect.stringContaining('foo.ts') }),
        position: { line: 4, character: 9 }
      })
    );

    vi.restoreAllMocks();
  });

  it('dispatches textDocument/rename with file + position + newName', async () => {
    const sendRequest = vi.fn(async () => ({ changes: {} }));
    const fakeSession = { lsp: { sendRequest } } as any;

    const program = new Command().exitOverride();
    buildCommandTree(program, { renameProvider: true } as any, fakeSession, FLAGS);

    vi.spyOn(process.stdout, 'write').mockImplementation(() => true);

    await program.parseAsync(['textDocument', 'rename', '/project/src/bar.ts', '3:5', 'newBar'], {
      from: 'user'
    });

    expect(sendRequest).toHaveBeenCalledWith(
      'textDocument/rename',
      expect.objectContaining({ newName: 'newBar' })
    );

    vi.restoreAllMocks();
  });

  it('dispatches via generic call command', async () => {
    const sendRequest = vi.fn(async () => null);
    const fakeSession = { lsp: { sendRequest } } as any;

    const program = new Command().exitOverride();
    buildCommandTree(program, {} as any, fakeSession, FLAGS);

    vi.spyOn(process.stdout, 'write').mockImplementation(() => true);

    await program.parseAsync(
      [
        'call',
        'textDocument/hover',
        '--params',
        JSON.stringify({
          textDocument: { uri: 'file:///x.ts' },
          position: { line: 0, character: 0 }
        })
      ],
      { from: 'user' }
    );

    expect(sendRequest).toHaveBeenCalledWith(
      'textDocument/hover',
      expect.objectContaining({
        textDocument: { uri: 'file:///x.ts' }
      })
    );

    vi.restoreAllMocks();
  });
});
