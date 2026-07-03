import { describe, expect, it, vi } from 'vitest';
import type {
  ServerCapabilities,
  CodeActionParams,
  CodeAction,
  Command,
  Diagnostic
} from '@lspeasy/core';
import { fixAll } from './fix-all.js';

describe('fixAll.appliesTo', () => {
  it('applies when codeAction + diagnosticProvider are present and source.fixAll is not advertised', () => {
    const caps: ServerCapabilities = {
      codeActionProvider: { codeActionKinds: ['quickfix'] },
      diagnosticProvider: { interFileDependencies: false, workspaceDiagnostics: false }
    };
    expect(fixAll.appliesTo(caps)).toBe(true);
  });

  it('does not apply without diagnosticProvider', () => {
    expect(fixAll.appliesTo({ codeActionProvider: true })).toBe(false);
  });

  it('does not apply when source.fixAll is already advertised', () => {
    const caps: ServerCapabilities = {
      codeActionProvider: { codeActionKinds: ['quickfix', 'source.fixAll'] },
      diagnosticProvider: { interFileDependencies: false, workspaceDiagnostics: false }
    };
    expect(fixAll.appliesTo(caps)).toBe(false);
  });
});

describe('fixAll.augmentCodeActions', () => {
  const diagnostic1: Diagnostic = {
    range: { start: { line: 0, character: 0 }, end: { line: 0, character: 3 } },
    message: 'unused var'
  };
  const diagnostic2: Diagnostic = {
    range: { start: { line: 1, character: 0 }, end: { line: 1, character: 3 } },
    message: 'missing semi'
  };

  function makeBackend(
    fixesByLine: Record<number, (Command | CodeAction)[]>,
    options: {
      capabilities?: ServerCapabilities;
      resolve?: (action: CodeAction) => CodeAction;
    } = {}
  ) {
    return {
      sendRequest: vi.fn(async (method: string, params: unknown) => {
        if (method === 'textDocument/diagnostic') {
          return { kind: 'full', items: [diagnostic1, diagnostic2] };
        }
        if (method === 'textDocument/codeAction') {
          const p = params as { range: { start: { line: number } } };
          return fixesByLine[p.range.start.line] ?? [];
        }
        if (method === 'codeAction/resolve') {
          if (!options.resolve) throw new Error('backend does not support resolve');
          return options.resolve(params as CodeAction);
        }
        throw new Error(`unexpected method ${method}`);
      }),
      getServerCapabilities: () => options.capabilities ?? {}
    };
  }

  const params: CodeActionParams = {
    textDocument: { uri: 'file:///x.ts' },
    range: { start: { line: 0, character: 0 }, end: { line: 2, character: 0 } },
    context: { diagnostics: [], only: ['source.fixAll'] }
  };

  it('does nothing when context.only does not request source.fixAll', async () => {
    const backend = makeBackend({});
    const result = await fixAll.augmentCodeActions!(
      [],
      { ...params, context: { diagnostics: [] } },
      backend as never
    );
    expect(result).toEqual([]);
    expect(backend.sendRequest).not.toHaveBeenCalled();
  });

  it('merges one quick-fix per diagnostic into a single composite action', async () => {
    const backend = makeBackend({
      0: [
        {
          title: 'Remove unused var',
          kind: 'quickfix',
          edit: {
            changes: {
              'file:///x.ts': [
                {
                  range: { start: { line: 0, character: 0 }, end: { line: 0, character: 3 } },
                  newText: ''
                }
              ]
            }
          }
        }
      ],
      1: [
        {
          title: 'Add semicolon',
          kind: 'quickfix',
          edit: {
            changes: {
              'file:///x.ts': [
                {
                  range: { start: { line: 1, character: 3 }, end: { line: 1, character: 3 } },
                  newText: ';'
                }
              ]
            }
          }
        }
      ]
    });

    const result = await fixAll.augmentCodeActions!([], params, backend as never);

    expect(result).toHaveLength(1);
    expect(result[0]).toMatchObject({ kind: 'source.fixAll' });
    expect(result[0]!.edit!.changes!['file:///x.ts']).toHaveLength(2);
  });

  it('skips diagnostics with no available quick-fix and returns real actions unchanged if none merge', async () => {
    const backend = makeBackend({});
    const realAction: CodeAction = { title: 'Real action', kind: 'quickfix' };
    const result = await fixAll.augmentCodeActions!([realAction], params, backend as never);
    expect(result).toEqual([realAction]);
  });

  it('drops the later edit when two collected fixes overlap on the same URI', async () => {
    const overlappingRange = { start: { line: 0, character: 0 }, end: { line: 0, character: 5 } };
    const backend = makeBackend({
      0: [
        {
          title: 'Fix A',
          kind: 'quickfix',
          edit: { changes: { 'file:///x.ts': [{ range: overlappingRange, newText: 'a' }] } }
        }
      ],
      1: [
        {
          title: 'Fix B',
          kind: 'quickfix',
          edit: { changes: { 'file:///x.ts': [{ range: overlappingRange, newText: 'b' }] } }
        }
      ]
    });

    const result = await fixAll.augmentCodeActions!([], params, backend as never);
    expect(result[0]!.edit!.changes!['file:///x.ts']).toHaveLength(1);
    expect(result[0]!.edit!.changes!['file:///x.ts']![0]).toMatchObject({ newText: 'a' });
  });

  it('skips a bare Command candidate and picks a usable CodeAction later in the list', async () => {
    const bareCommand: Command = { title: 'Run something', command: 'editor.doThing' };
    const usableFix: CodeAction = {
      title: 'Remove unused var',
      kind: 'quickfix',
      edit: {
        changes: {
          'file:///x.ts': [
            {
              range: { start: { line: 0, character: 0 }, end: { line: 0, character: 3 } },
              newText: ''
            }
          ]
        }
      }
    };
    const backend = makeBackend({ 0: [bareCommand, usableFix] });

    const result = await fixAll.augmentCodeActions!([], params, backend as never);

    expect(result).toHaveLength(1);
    expect(result[0]!.edit!.changes!['file:///x.ts']).toHaveLength(1);
  });

  it('does not count an edit with no actual changes as merged', async () => {
    const emptyChangesFix: CodeAction = {
      title: 'No-op fix',
      kind: 'quickfix',
      edit: { changes: { 'file:///x.ts': [] } }
    };
    const backend = makeBackend({ 0: [emptyChangesFix] });

    const result = await fixAll.augmentCodeActions!([], params, backend as never);

    expect(result).toEqual([]);
  });

  it('resolves a command-only fix via codeAction/resolve when the backend supports native resolve', async () => {
    const commandOnlyFix: CodeAction = {
      title: 'Fix via command',
      kind: 'quickfix',
      command: { title: 'Apply fix', command: 'server.applyFix' }
    };
    const resolvedEdit = {
      'file:///x.ts': [
        {
          range: { start: { line: 0, character: 0 }, end: { line: 0, character: 3 } },
          newText: ''
        }
      ]
    };
    const backend = makeBackend(
      { 0: [commandOnlyFix] },
      {
        capabilities: { codeActionProvider: { resolveProvider: true } },
        resolve: (action) => ({ ...action, edit: { changes: resolvedEdit } })
      }
    );

    const result = await fixAll.augmentCodeActions!([], params, backend as never);

    expect(backend.sendRequest).toHaveBeenCalledWith('codeAction/resolve', commandOnlyFix);
    expect(result).toHaveLength(1);
    expect(result[0]!.edit!.changes!['file:///x.ts']).toHaveLength(1);
  });

  it('skips a command-only fix when the backend does not support native resolve', async () => {
    const commandOnlyFix: CodeAction = {
      title: 'Fix via command',
      kind: 'quickfix',
      command: { title: 'Apply fix', command: 'server.applyFix' }
    };
    const backend = makeBackend({ 0: [commandOnlyFix] });

    const result = await fixAll.augmentCodeActions!([], params, backend as never);

    expect(result).toEqual([]);
    expect(backend.sendRequest).not.toHaveBeenCalledWith('codeAction/resolve', expect.anything());
  });
});
