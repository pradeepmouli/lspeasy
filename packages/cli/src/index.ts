/**
 * `@lspeasy/cli` — programmatic entry point.
 *
 * Exposes the reusable refactor internals (session pipeline + WorkspaceEdit
 * applier) so the same machinery can be embedded in scripts, not just invoked
 * through the `lspeasy` bin.
 *
 * @packageDocumentation
 */

export { RefactorSession } from './session.js';
export type { SessionOptions } from './session.js';
export { applyWorkspaceEdit, applyTextEdits, planWorkspaceEdit } from './apply.js';
export type { WorkspaceEdit, LspTextEdit, LspRange, LspPosition, AppliedChange } from './apply.js';
export { runRename } from './commands/rename.js';
export { runMoveFile } from './commands/move-file.js';
export { runMoveSymbol } from './commands/move-symbol.js';
export { runQuery } from './commands/query.js';
export type { GlobalFlags } from './io.js';
