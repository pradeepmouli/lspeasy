import { describe, it, expect, vi, afterEach } from 'vitest';
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
  afterEach(() => {
    vi.restoreAllMocks();
  });
  it('dispatches textDocument/hover with correct LSP params', async () => {
    const sendRequest = vi.fn(async () => ({ contents: { kind: 'markdown', value: 'hello' } }));
    const fakeSession = {
      lsp: { sendRequest },
      takeCapturedEdits: () => [],
      requestWithRetry: (run: () => Promise<unknown>) => run()
    } as any;

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
  });

  it('dispatches textDocument/rename with file + position + newName', async () => {
    const sendRequest = vi.fn(async () => ({ changes: {} }));
    const fakeSession = {
      lsp: { sendRequest },
      takeCapturedEdits: () => [],
      requestWithRetry: (run: () => Promise<unknown>) => run()
    } as any;

    const program = new Command().exitOverride();
    buildCommandTree(program, { renameProvider: true } as any, fakeSession, FLAGS);

    vi.spyOn(process.stdout, 'write').mockImplementation(() => true);

    await program.parseAsync(['textDocument', 'rename', '/project/src/bar.ts', '3:5', 'newBar'], {
      from: 'user'
    });

    expect(sendRequest).toHaveBeenCalledWith(
      'textDocument/rename',
      expect.objectContaining({
        textDocument: expect.objectContaining({ uri: expect.stringContaining('bar.ts') }),
        position: { line: 2, character: 4 },
        newName: 'newBar'
      })
    );
  });

  it('dispatches via generic call command', async () => {
    const sendRequest = vi.fn(async () => null);
    const fakeSession = { lsp: { sendRequest }, takeCapturedEdits: vi.fn(() => []) } as any;

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
  });

  it('reads --params on a raw-pattern namespace command (workspace/willRenameFiles)', async () => {
    // Regression: the zodToCommander action read commander's Command instance as
    // the options object (`cmdArgs.at(-1)`), so `--params` never reached
    // marshalParams. For a raw-pattern method (no positional shape) that made
    // params look absent and threw "requires --params". The action now reads
    // options via the Command's `.opts()`.
    const sendRequest = vi.fn(async () => ({ changes: {} }));
    const fakeSession = {
      lsp: { sendRequest },
      takeCapturedEdits: () => [],
      requestWithRetry: (run: () => Promise<unknown>) => run()
    } as any;

    const program = new Command().exitOverride();
    buildCommandTree(
      program,
      { workspace: { fileOperations: { willRename: { filters: [] } } } } as any,
      fakeSession,
      FLAGS
    );

    vi.spyOn(process.stdout, 'write').mockImplementation(() => true);

    const params = JSON.stringify({
      files: [{ oldUri: 'file:///project/a.ts', newUri: 'file:///project/b.ts' }]
    });
    await program.parseAsync(['workspace', 'willRenameFiles', '--params', params], {
      from: 'user'
    });

    expect(sendRequest).toHaveBeenCalledWith(
      'workspace/willRenameFiles',
      expect.objectContaining({
        files: [{ oldUri: 'file:///project/a.ts', newUri: 'file:///project/b.ts' }]
      })
    );
  });
});

describe('anchorFile-aware dispatch (form B: file as first token)', () => {
  it('produces identical params whether the file is the first token or the request-level positional', async () => {
    const sendRequest = vi.fn(async () => ({ contents: { kind: 'markdown', value: 'hi' } }));
    const fakeSession = {
      lsp: { sendRequest },
      takeCapturedEdits: () => [],
      requestWithRetry: (run: () => Promise<unknown>) => run()
    } as any;

    // Form A: language given, file repeated at the request level (today's shape).
    const programA = new Command().exitOverride();
    buildCommandTree(programA, { hoverProvider: true } as any, fakeSession, FLAGS);
    await programA.parseAsync(['textDocument', 'hover', '/project/src/foo.ts', '5:10'], {
      from: 'user'
    });
    const paramsA = sendRequest.mock.calls[0]![1];

    sendRequest.mockClear();

    // Form B: file is the pre-resolved anchor; the leaf command's own <file> arg is gone.
    const programB = new Command().exitOverride();
    buildCommandTree(
      programB,
      { hoverProvider: true } as any,
      fakeSession,
      FLAGS,
      '/project/src/foo.ts'
    );
    await programB.parseAsync(['textDocument', 'hover', '5:10'], { from: 'user' });
    const paramsB = sendRequest.mock.calls[0]![1];

    expect(paramsB).toEqual(paramsA);
  });
});
