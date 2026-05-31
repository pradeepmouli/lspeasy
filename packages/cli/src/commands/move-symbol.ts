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
/**
 * A `textDocument/codeAction` response item. Per the LSP spec the response is
 * `(Command | CodeAction)[]`, so an item may be a full {@link CodeAction} OR a
 * raw {@link LspCommand} — the latter carries its payload in a TOP-LEVEL
 * `arguments` field (and `command` is then a `string`). We model both so a
 * command-only action's `arguments` are not dropped.
 */
interface CodeAction {
  title: string;
  kind?: string;
  edit?: WorkspaceEdit;
  /** Nested command (CodeAction shape) or a command name (raw Command shape). */
  command?: LspCommand | string;
  /** Present only on the raw `Command` shape, alongside a string `command`. */
  arguments?: unknown[];
  data?: unknown;
}

/**
 * Normalize the `command` of a code action into an {@link LspCommand}, preserving
 * arguments for BOTH shapes:
 *  - nested object command → used as-is;
 *  - raw `Command` (string `command`) → its top-level `arguments` are retained
 *    (dropping them left command-only `_typescript.applyRefactoring` moves with
 *    an empty arg list, so the refactor could not run).
 */
export function toLspCommand(action: CodeAction): LspCommand | undefined {
  if (!action.command) return undefined;
  if (typeof action.command === 'string') {
    const cmd: LspCommand = { title: action.title, command: action.command };
    if (action.arguments !== undefined) cmd.arguments = action.arguments;
    return cmd;
  }
  return action.command;
}

/**
 * Resolve the ordered list of {@link WorkspaceEdit}s a `refactor.move` action
 * produces, honoring the LSP `edit` + `command` contract:
 *  - if the action has an inline `edit`, it is applied FIRST;
 *  - if it also (or instead) has a `command`, the command is executed AFTER the
 *    inline edit, and EVERY edit the server then pushes via `workspace/applyEdit`
 *    (possibly several, in sequence) is appended in arrival order.
 *
 * Pure with respect to disk: it only sequences edits. `execute` runs the command
 * (injecting the move target); `drainCapturedEdits` returns all server-pushed
 * edits captured since the last drain.
 */
export async function resolveMoveEdits(
  action: CodeAction,
  targetFile: string,
  execute: (cmd: LspCommand) => Promise<void>,
  drainCapturedEdits: () => WorkspaceEdit[]
): Promise<WorkspaceEdit[]> {
  const edits: WorkspaceEdit[] = [];
  if (action.edit) edits.push(action.edit);
  const cmd = toLspCommand(action);
  if (cmd) {
    await execute(injectTargetFile(cmd, targetFile));
    edits.push(...drainCapturedEdits());
  }
  return edits;
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

    // Validate every server-returned edit against --root before applying.
    const guard = { root: flags.root, allowOutsideRoot: flags.allowOutsideRoot };
    const applyEdit = (e: WorkspaceEdit) =>
      flags.dryRun ? planWorkspaceEdit(e, guard) : applyWorkspaceEdit(e, guard);

    // Per the LSP spec, a CodeAction may carry BOTH an inline `edit` and a
    // `command`: apply the edit FIRST, then execute the command (not either/or).
    // The command may itself push further edits via workspace/applyEdit, possibly
    // several in sequence — drain them ALL in order. (See resolveMoveEdits.)
    const edits = await resolveMoveEdits(
      action,
      targetFile,
      async (cmd) => {
        await session.lsp.sendRequest('workspace/executeCommand', {
          command: cmd.command,
          arguments: cmd.arguments ?? []
        });
      },
      () => session.takeCapturedEdits()
    );

    if (edits.length === 0) {
      fail('move-symbol produced no edit (server did not return or apply one)', flags.json);
    }

    const changes = edits.flatMap(applyEdit);
    emitResult('move-symbol', changes, flags, { targetFile });
  } finally {
    await session.stop();
  }
}
