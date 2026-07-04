import { describe, expect, it, vi } from 'vitest';
import type { ServerCapabilities, CodeActionParams, CodeAction, Command } from '@lspeasy/core';
import { organizeImports } from './organize-imports.js';

describe('organizeImports.appliesTo', () => {
  it('applies when codeAction + diagnosticProvider are present and source.organizeImports is not advertised', () => {
    const caps: ServerCapabilities = {
      codeActionProvider: { codeActionKinds: ['quickfix'] },
      diagnosticProvider: { interFileDependencies: false, workspaceDiagnostics: false }
    };
    expect(organizeImports.appliesTo(caps)).toBe(true);
  });

  it('does not apply without diagnosticProvider', () => {
    expect(organizeImports.appliesTo({ codeActionProvider: true })).toBe(false);
  });

  it('does not apply when source.organizeImports is already advertised', () => {
    const caps: ServerCapabilities = {
      codeActionProvider: { codeActionKinds: ['quickfix', 'source.organizeImports'] },
      diagnosticProvider: { interFileDependencies: false, workspaceDiagnostics: false }
    };
    expect(organizeImports.appliesTo(caps)).toBe(false);
  });
});

describe('organizeImports.augmentCodeActions', () => {
  const missingImportDiagnostic = {
    range: { start: { line: 0, character: 0 }, end: { line: 0, character: 3 } },
    message: "Cannot find name 'foo'"
  };
  const unusedVarDiagnostic = {
    range: { start: { line: 1, character: 0 }, end: { line: 1, character: 3 } },
    message: 'unused variable'
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
          return { kind: 'full', items: [missingImportDiagnostic, unusedVarDiagnostic] };
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
    context: { diagnostics: [], only: ['source.organizeImports'] }
  };

  it('does nothing when context.only does not request organizeImports or source', async () => {
    const backend = makeBackend({});
    const result = await organizeImports.augmentCodeActions!(
      [],
      { ...params, context: { diagnostics: [] } },
      backend as never
    );
    expect(result).toEqual([]);
    expect(backend.sendRequest).not.toHaveBeenCalled();
  });

  it('fires for a plain "source" request too', async () => {
    const backend = makeBackend({
      0: [
        {
          title: 'Add missing import for "foo"',
          kind: 'quickfix',
          edit: {
            changes: {
              'file:///x.ts': [
                {
                  range: { start: { line: 0, character: 0 }, end: { line: 0, character: 0 } },
                  newText: 'import foo;\n'
                }
              ]
            }
          }
        }
      ]
    });

    const result = await organizeImports.augmentCodeActions!(
      [],
      { ...params, context: { diagnostics: [], only: ['source'] } },
      backend as never
    );

    expect(result).toHaveLength(1);
    expect(result[0]).toMatchObject({ kind: 'source.organizeImports' });
  });

  it('picks the import-related fix and ignores an unrelated quickfix for a different diagnostic', async () => {
    const backend = makeBackend({
      0: [
        {
          title: 'Add missing import for "foo"',
          kind: 'quickfix',
          edit: {
            changes: {
              'file:///x.ts': [
                {
                  range: { start: { line: 0, character: 0 }, end: { line: 0, character: 0 } },
                  newText: 'import foo;\n'
                }
              ]
            }
          }
        }
      ],
      1: [
        {
          title: 'Remove unused variable',
          kind: 'quickfix',
          edit: {
            changes: {
              'file:///x.ts': [
                {
                  range: { start: { line: 1, character: 0 }, end: { line: 1, character: 3 } },
                  newText: ''
                }
              ]
            }
          }
        }
      ]
    });

    const result = await organizeImports.augmentCodeActions!([], params, backend as never);

    expect(result).toHaveLength(1);
    expect(result[0]).toMatchObject({ title: 'Organize imports', kind: 'source.organizeImports' });
    // Only the import fix's edit is present — the non-import "Remove unused
    // variable" fix for line 1 must not have been merged in.
    expect(result[0]!.edit!.changes!['file:///x.ts']).toHaveLength(1);
    expect(result[0]!.edit!.changes!['file:///x.ts']![0]).toMatchObject({
      newText: 'import foo;\n'
    });
  });

  it('prefers the import-related fix over a non-import fix marked isPreferred for the same diagnostic', async () => {
    const backend = makeBackend({
      0: [
        {
          title: 'Rename to _foo',
          kind: 'quickfix',
          isPreferred: true,
          edit: {
            changes: {
              'file:///x.ts': [
                {
                  range: { start: { line: 0, character: 0 }, end: { line: 0, character: 3 } },
                  newText: '_foo'
                }
              ]
            }
          }
        },
        {
          title: 'Add missing import for "foo"',
          kind: 'quickfix',
          edit: {
            changes: {
              'file:///x.ts': [
                {
                  range: { start: { line: 0, character: 0 }, end: { line: 0, character: 0 } },
                  newText: 'import foo;\n'
                }
              ]
            }
          }
        }
      ]
    });

    const result = await organizeImports.augmentCodeActions!([], params, backend as never);

    expect(result).toHaveLength(1);
    expect(result[0]!.edit!.changes!['file:///x.ts']![0]).toMatchObject({
      newText: 'import foo;\n'
    });
  });

  it('returns real actions unchanged when no diagnostic has an import-related fix', async () => {
    const backend = makeBackend({
      1: [
        {
          title: 'Remove unused variable',
          kind: 'quickfix',
          edit: {
            changes: {
              'file:///x.ts': [
                {
                  range: { start: { line: 1, character: 0 }, end: { line: 1, character: 3 } },
                  newText: ''
                }
              ]
            }
          }
        }
      ]
    });
    const realAction: CodeAction = { title: 'Real action', kind: 'quickfix' };

    const result = await organizeImports.augmentCodeActions!(
      [realAction],
      params,
      backend as never
    );

    expect(result).toEqual([realAction]);
  });

  it('resolves a command-only import fix via codeAction/resolve when the backend supports native resolve', async () => {
    const commandOnlyFix: CodeAction = {
      title: 'Add missing import for "foo"',
      kind: 'quickfix',
      command: { title: 'Apply import', command: 'server.addImport' }
    };
    const resolvedEdit = {
      'file:///x.ts': [
        {
          range: { start: { line: 0, character: 0 }, end: { line: 0, character: 0 } },
          newText: 'import foo;\n'
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

    const result = await organizeImports.augmentCodeActions!([], params, backend as never);

    expect(backend.sendRequest).toHaveBeenCalledWith('codeAction/resolve', commandOnlyFix);
    expect(result).toHaveLength(1);
    expect(result[0]!.edit!.changes!['file:///x.ts']).toHaveLength(1);
  });
});
