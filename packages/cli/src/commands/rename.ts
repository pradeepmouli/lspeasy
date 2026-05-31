/**
 * `lspeasy rename <file> <line:col> <newName>`
 *
 * Drives `textDocument/rename` and applies the returned WorkspaceEdit. The LSP
 * server finds every reference — including re-exports, aliased imports,
 * type-only imports, and `{@link}` references — that a text search would miss.
 */

import { pathToFileURL } from 'node:url';

import { applyWorkspaceEdit, planWorkspaceEdit, type WorkspaceEdit } from '../apply.js';
import {
  emitResult,
  fail,
  parseLineCol,
  resolvePathArg,
  toLspPosition,
  type GlobalFlags
} from '../io.js';
import { RefactorSession } from '../session.js';

export async function runRename(
  args: { file: string; position: string; newName: string },
  flags: GlobalFlags
): Promise<void> {
  const file = resolvePathArg(args.file, flags);
  const pos = toLspPosition(parseLineCol(args.position));

  const session = new RefactorSession({
    serverCommand: flags.server,
    root: flags.root,
    indexWaitMs: flags.waitMs,
    verbose: flags.verbose
  });

  try {
    await session.start();
    await session.openAndWait(file);

    const edit = await session.requestWithRetry<WorkspaceEdit>(
      () =>
        session.lsp.sendRequest('textDocument/rename', {
          textDocument: { uri: pathToFileURL(file).href },
          position: pos,
          newName: args.newName
        }) as Promise<WorkspaceEdit | null>
    );

    if (!edit)
      fail('rename returned no edit (symbol not renamable, or project not indexed)', flags.json);

    // Validate the SERVER-RETURNED edit against --root: a server can return a
    // URI/resource op outside the project; applying it unguarded would bypass
    // the --root safety guarantee. The guard refuses unless --allow-outside-root.
    const guard = { root: flags.root, allowOutsideRoot: flags.allowOutsideRoot };
    const changes = flags.dryRun ? planWorkspaceEdit(edit, guard) : applyWorkspaceEdit(edit, guard);
    emitResult('rename', changes, flags, { newName: args.newName });
  } finally {
    await session.stop();
  }
}
