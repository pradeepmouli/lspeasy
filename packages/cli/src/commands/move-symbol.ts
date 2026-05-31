/**
 * `lspeasy move-symbol <file> <line:col> <targetFile>`
 *
 * Moves the symbol at the given position into `targetFile`, updating all
 * importers. Driven by `textDocument/codeAction` (kind `refactor.move`).
 *
 * Two server shapes are supported:
 *  1. The code action (or its `codeAction/resolve`) returns a `WorkspaceEdit`
 *     directly — applied as-is.
 *  2. The action carries a `command`. We execute it via
 *     `workspace/executeCommand`; many servers (notably
 *     typescript-language-server's `_typescript.applyRefactoring`) then push
 *     the edit back through a `workspace/applyEdit` request, which the session
 *     captures. For TS, we inject the destination as
 *     `interactiveRefactorArguments.targetFile` so the move targets an existing
 *     file rather than prompting for a new one.
 */

import { existsSync, readFileSync } from 'node:fs';
import { pathToFileURL } from 'node:url';

import { applyWorkspaceEdit, planWorkspaceEdit, type WorkspaceEdit } from '../apply.js';
import {
  emitResult,
  fail,
  parseLineCol,
  resolvePathArg,
  toLspPosition,
  type GlobalFlags,
  type OneBasedPosition
} from '../io.js';
import { RefactorSession } from '../session.js';

interface LspCommand {
  title: string;
  command: string;
  arguments?: unknown[];
}
interface CodeAction {
  title: string;
  kind?: string;
  edit?: WorkspaceEdit;
  command?: LspCommand | string;
  data?: unknown;
}

/** Inject the move destination into a tsserver `_typescript.applyRefactoring`
 * command argument so the symbol lands in an existing target file. */
function injectTargetFile(cmd: LspCommand, targetFile: string): LspCommand {
  if (cmd.command !== '_typescript.applyRefactoring' || !Array.isArray(cmd.arguments)) return cmd;
  const arg0 = cmd.arguments[0];
  if (arg0 && typeof arg0 === 'object') {
    const obj = arg0 as Record<string, unknown>;
    return {
      ...cmd,
      arguments: [
        {
          ...obj,
          refactor: 'Move to file',
          action: 'Move to file',
          interactiveRefactorArguments: { targetFile }
        },
        ...cmd.arguments.slice(1)
      ]
    };
  }
  return cmd;
}

export async function runMoveSymbol(
  args: { file: string; position: string; targetFile: string },
  flags: GlobalFlags
): Promise<void> {
  const file = resolvePathArg(args.file, flags);
  const targetFile = resolvePathArg(args.targetFile, flags);
  const oneBased: OneBasedPosition = parseLineCol(args.position);
  const pos = toLspPosition(oneBased);
  if (!existsSync(file)) fail(`source file not found: ${file}`, flags.json);

  const session = new RefactorSession({
    serverCommand: flags.server,
    root: flags.root,
    indexWaitMs: flags.waitMs,
    verbose: flags.verbose
  });

  try {
    await session.start();
    await session.openAndWait(file);
    // Also open the target so the server knows its insertion context.
    if (existsSync(targetFile)) {
      await session.lsp.sendNotification('textDocument/didOpen', {
        textDocument: {
          uri: pathToFileURL(targetFile).href,
          languageId: 'typescript',
          version: 1,
          text: readFileSync(targetFile, 'utf8')
        }
      });
    }

    const range = { start: pos, end: pos };
    const actions = await session.requestWithRetry<CodeAction[]>(
      () =>
        session.lsp.sendRequest('textDocument/codeAction', {
          textDocument: { uri: pathToFileURL(file).href },
          range,
          context: { diagnostics: [], only: ['refactor.move'] }
        }) as Promise<CodeAction[] | null>
    );

    if (!actions || actions.length === 0) {
      fail('no refactor.move code action available at that position', flags.json);
    }

    // Prefer the move action; resolve it if it has no inline edit.
    let action = actions.find((a) => a.kind?.startsWith('refactor.move')) ?? actions[0]!;
    if (!action.edit && action.data !== undefined) {
      const resolved = (await session.lsp.sendRequest(
        'codeAction/resolve',
        action as never
      )) as CodeAction | null;
      if (resolved) action = resolved;
    }

    let edit: WorkspaceEdit | undefined = action.edit;

    if (!edit && action.command) {
      const cmd =
        typeof action.command === 'string'
          ? { title: action.title, command: action.command }
          : action.command;
      const withTarget = injectTargetFile(cmd, targetFile);
      await session.lsp.sendRequest('workspace/executeCommand', {
        command: withTarget.command,
        arguments: withTarget.arguments ?? []
      });
      // The server pushes the edit via workspace/applyEdit; the session captured it.
      edit = session.takeCapturedEdit();
    }

    if (!edit) {
      fail('move-symbol produced no edit (server did not return or apply one)', flags.json);
    }

    const changes = flags.dryRun ? planWorkspaceEdit(edit) : applyWorkspaceEdit(edit);
    emitResult('move-symbol', changes, flags, { targetFile });
  } finally {
    await session.stop();
  }
}
