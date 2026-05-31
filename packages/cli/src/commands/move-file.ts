/**
 * `lspeasy move-file <oldPath> <newPath>`
 *
 * Asks the server for importer path updates via `workspace/willRenameFiles`,
 * applies them, then physically moves the file. Uses `git mv` when the file is
 * tracked (so history follows), falling back to a plain rename.
 */

import { execFileSync } from 'node:child_process';
import { existsSync, mkdirSync, renameSync } from 'node:fs';
import { dirname } from 'node:path';
import { pathToFileURL } from 'node:url';

import {
  applyWorkspaceEdit,
  planWorkspaceEdit,
  stripResourceOps,
  type AppliedChange,
  type WorkspaceEdit
} from '../apply.js';
import { emitResult, fail, resolvePathArg, type GlobalFlags } from '../io.js';
import { RefactorSession } from '../session.js';

function isGitTracked(root: string, path: string): boolean {
  try {
    execFileSync('git', ['ls-files', '--error-unmatch', path], { cwd: root, stdio: 'ignore' });
    return true;
  } catch {
    return false;
  }
}

function physicallyMove(root: string, from: string, to: string, dryRun: boolean): AppliedChange {
  if (!dryRun) {
    mkdirSync(dirname(to), { recursive: true });
    if (isGitTracked(root, from)) {
      execFileSync('git', ['mv', from, to], { cwd: root });
    } else {
      renameSync(from, to);
    }
  }
  return { kind: 'rename', path: from, toPath: to };
}

export async function runMoveFile(
  args: { oldPath: string; newPath: string },
  flags: GlobalFlags
): Promise<void> {
  const from = resolvePathArg(args.oldPath, flags);
  const to = resolvePathArg(args.newPath, flags);
  if (!existsSync(from)) fail(`source file not found: ${from}`, flags.json);

  const session = new RefactorSession({
    serverCommand: flags.server,
    root: flags.root,
    indexWaitMs: flags.waitMs,
    verbose: flags.verbose
  });

  try {
    await session.start();
    await session.openAndWait(from);

    const edit = await session.requestWithRetry<WorkspaceEdit>(
      () =>
        session.lsp.sendRequest('workspace/willRenameFiles', {
          files: [{ oldUri: pathToFileURL(from).href, newUri: pathToFileURL(to).href }]
        }) as Promise<WorkspaceEdit | null>
    );

    // A null edit just means no importers needed updating — still do the move.
    // Strip any resource op the server folded in: we own the single physical
    // move below (so `git mv` history is preserved); applying a server rename
    // here too would double-move and break a re-run with "source not found".
    const importerEdit = edit ? stripResourceOps(edit) : undefined;
    const importerChanges = importerEdit
      ? flags.dryRun
        ? planWorkspaceEdit(importerEdit)
        : applyWorkspaceEdit(importerEdit)
      : [];

    const moveChange = physicallyMove(flags.root, from, to, flags.dryRun);

    emitResult('move-file', [...importerChanges, moveChange], flags, {
      importerFilesUpdated: importerChanges.length
    });
  } finally {
    await session.stop();
  }
}
