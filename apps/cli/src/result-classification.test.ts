import { describe, it, expect, vi, afterEach } from 'vitest';
import { Command } from 'commander';

import { buildCommandTree } from './build-commands.js';
import type { GlobalFlags } from './io.js';

/**
 * Covers how a language server's RESPONSE is classified into workspace edits:
 * a direct WorkspaceEdit, a bare TextEdit[], and CodeAction[] results.
 *
 * These paths had no coverage before. The gap was found by neutering all three
 * classification schemas so nothing was ever recognised as an edit — the whole
 * CLI suite still passed. Since the schemas are now pulled in through a
 * deferred `await import('@lspeasy/core/schemas')` taken after the request
 * resolves, that import is on this path too: break it and these fail.
 *
 * `dryRun` keeps everything hermetic — `planWorkspaceEdit` is pure, so no test
 * here touches the filesystem.
 */

const FLAGS: GlobalFlags = {
  server: '',
  root: '/project',
  dryRun: true,
  json: true,
  verbose: false,
  waitMs: 0,
  allowOutsideRoot: true,
  overwrite: false,
  noProxy: false
};

function harness(result: unknown) {
  const sendRequest = vi.fn(async () => result);
  const session = {
    lsp: { sendRequest },
    takeCapturedEdits: () => [],
    requestWithRetry: (run: () => Promise<unknown>) => run()
  } as any;
  const writes: string[] = [];
  vi.spyOn(process.stdout, 'write').mockImplementation((s) => {
    writes.push(String(s));
    return true;
  });
  return { session, writes, out: () => JSON.parse(writes.join('')) as Record<string, unknown> };
}

const EDIT = {
  range: { start: { line: 0, character: 0 }, end: { line: 0, character: 3 } },
  newText: 'x'
};

async function run(
  capabilities: Record<string, unknown>,
  session: unknown,
  argv: string[]
): Promise<void> {
  const program = new Command().exitOverride();
  buildCommandTree(program, capabilities as any, session as any, FLAGS);
  await program.parseAsync(argv, { from: 'user' });
}

describe('result classification', () => {
  afterEach(() => {
    vi.restoreAllMocks();
  });

  it('recognises a direct WorkspaceEdit result and plans its edits', async () => {
    const h = harness({ changes: { 'file:///project/src/bar.ts': [EDIT] } });
    await run({ renameProvider: true }, h.session, [
      'textDocument',
      'rename',
      '/project/src/bar.ts',
      '3:5',
      'newBar'
    ]);
    expect(h.out()).toMatchObject({
      ok: true,
      dryRun: true,
      changes: [{ kind: 'edit', path: '/project/src/bar.ts', editCount: 1 }]
    });
  });

  it('does NOT treat an all-empty WorkspaceEdit as an edit result', async () => {
    // Every WorkspaceEdit field is optional, so a bare safeParse accepts any
    // object — this is exactly what NonEmptyWorkspaceEditSchema guards against.
    const h = harness({ changes: {} });
    await run({ renameProvider: true }, h.session, [
      'textDocument',
      'rename',
      '/project/src/bar.ts',
      '3:5',
      'newBar'
    ]);
    const out = h.out();
    expect(out['changes']).toBeUndefined();
    expect(out).toMatchObject({ ok: true, result: { changes: {} } });
  });

  it('wraps a bare TextEdit[] result using the requested document uri', async () => {
    const h = harness([EDIT]);
    await run({ documentFormattingProvider: true }, h.session, [
      'textDocument',
      'formatting',
      '/project/src/fmt.ts'
    ]);
    expect(h.out()).toMatchObject({
      ok: true,
      changes: [{ kind: 'edit', path: '/project/src/fmt.ts', editCount: 1 }]
    });
  });

  it('auto-applies a single edit-bearing code action', async () => {
    const h = harness([
      { title: 'Fix it', edit: { changes: { 'file:///project/src/ca.ts': [EDIT] } } }
    ]);
    await run({ codeActionProvider: true }, h.session, [
      'textDocument',
      'codeAction',
      '/project/src/ca.ts',
      '1:1-2:2'
    ]);
    expect(h.out()).toMatchObject({
      ok: true,
      changes: [{ kind: 'edit', path: '/project/src/ca.ts', editCount: 1 }]
    });
  });

  it('does NOT auto-apply when several code actions carry edits', async () => {
    const h = harness([
      { title: 'Fix A', edit: { changes: { 'file:///project/src/a.ts': [EDIT] } } },
      { title: 'Fix B', edit: { changes: { 'file:///project/src/b.ts': [EDIT] } } }
    ]);
    await run({ codeActionProvider: true }, h.session, [
      'textDocument',
      'codeAction',
      '/project/src/a.ts',
      '1:1-2:2'
    ]);
    const out = h.out();
    // Falls through to printing the result so the caller picks, rather than
    // silently applying the wrong quick-fix.
    expect(out['changes']).toBeUndefined();
    expect(Array.isArray(out['result'])).toBe(true);
  });

  it('tolerates a mixed (Command | CodeAction)[] result', async () => {
    // LSP allows Command entries alongside CodeActions. A Command's `command`
    // is a string, so it fails CodeActionSchema — it must be skipped rather
    // than failing the whole parse and losing the real action.
    const h = harness([
      { title: 'Just a command', command: 'editor.action.doThing' },
      { title: 'Fix it', edit: { changes: { 'file:///project/src/mixed.ts': [EDIT] } } }
    ]);
    await run({ codeActionProvider: true }, h.session, [
      'textDocument',
      'codeAction',
      '/project/src/mixed.ts',
      '1:1-2:2'
    ]);
    expect(h.out()).toMatchObject({
      ok: true,
      changes: [{ kind: 'edit', path: '/project/src/mixed.ts', editCount: 1 }]
    });
  });
});
