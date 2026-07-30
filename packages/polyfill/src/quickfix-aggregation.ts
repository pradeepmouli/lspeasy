// packages/polyfill/src/quickfix-aggregation.ts
import type {
  AnnotatedTextEdit,
  CodeAction,
  CodeActionParams,
  Command,
  CreateFile,
  DeleteFile,
  Diagnostic,
  Position,
  RenameFile,
  ServerCapabilities,
  SnippetTextEdit,
  TextDocumentEdit,
  TextEdit,
  WorkspaceEdit
} from '@lspeasy/core';
import type { LSPClient } from '@lspeasy/client';

export function isCodeAction(item: Command | CodeAction): item is CodeAction {
  return typeof item.command !== 'string';
}

export function comparePositions(a: Position, b: Position): number {
  return a.line !== b.line ? a.line - b.line : a.character - b.character;
}

export function rangesOverlap(a: TextEdit['range'], b: TextEdit['range']): boolean {
  return comparePositions(a.start, b.end) < 0 && comparePositions(b.start, a.end) < 0;
}

export function mergeEdits(existing: TextEdit[], incoming: TextEdit[]): TextEdit[] {
  const merged = [...existing];
  for (const edit of incoming) {
    if (merged.some((m) => rangesOverlap(m.range, edit.range))) continue;
    merged.push(edit);
  }
  return merged;
}

function supportsResolve(capabilities: ServerCapabilities): boolean {
  const provider = capabilities.codeActionProvider;
  return typeof provider === 'object' && provider.resolveProvider === true;
}

function isTextDocumentEdit(
  entry: TextDocumentEdit | CreateFile | RenameFile | DeleteFile
): entry is TextDocumentEdit {
  return 'edits' in entry;
}

function isPlainTextEdit(
  edit: TextEdit | AnnotatedTextEdit | SnippetTextEdit
): edit is TextEdit | AnnotatedTextEdit {
  return 'newText' in edit;
}

/**
 * Merges a WorkspaceEdit's edits into one per-URI map, reading both the
 * legacy `changes` field and the newer `documentChanges` field (many modern
 * servers — rust-analyzer, newer tsserver-based tooling — return edits
 * exclusively via the latter). Resource operations (create/rename/delete)
 * and snippet edits are intentionally skipped: neither can be represented
 * as a plain `TextEdit` in the synthesized composite action.
 */
function collectEditsByUri(edit: WorkspaceEdit | undefined): Record<string, TextEdit[]> {
  const byUri: Record<string, TextEdit[]> = {};

  for (const [uri, edits] of Object.entries(edit?.changes ?? {})) {
    if (edits.length === 0) continue;
    byUri[uri] = [...(byUri[uri] ?? []), ...edits];
  }

  for (const entry of edit?.documentChanges ?? []) {
    if (!isTextDocumentEdit(entry)) continue;
    const textEdits = entry.edits.filter(isPlainTextEdit);
    if (textEdits.length === 0) continue;
    const uri = entry.textDocument.uri;
    byUri[uri] = [...(byUri[uri] ?? []), ...textEdits];
  }

  return byUri;
}

function isEditEmpty(edit: WorkspaceEdit | undefined): boolean {
  return Object.keys(collectEditsByUri(edit)).length === 0;
}

export interface AggregationResult {
  changes: Record<string, TextEdit[]>;
  mergedCount: number;
}

/**
 * Fetches diagnostics for the document, requests a `quickfix` for each one,
 * lets `selectFix` choose which candidate (if any) to keep, resolves
 * command-only fixes via `codeAction/resolve` when the backend supports it,
 * and merges every chosen fix's edits into one non-overlapping edit map.
 */
export async function aggregateQuickFixes(
  params: CodeActionParams,
  backend: LSPClient,
  selectFix: (candidates: (Command | CodeAction)[]) => CodeAction | undefined
): Promise<AggregationResult> {
  const report = (await (backend.sendRequest as (m: string, p: unknown) => Promise<unknown>)(
    'textDocument/diagnostic',
    { textDocument: params.textDocument }
  )) as { kind: 'full' | 'unchanged'; items?: Diagnostic[] };
  const diagnostics = report.kind === 'full' ? (report.items ?? []) : [];

  const capabilities = backend.getServerCapabilities() ?? {};
  const changes: Record<string, TextEdit[]> = {};
  let mergedCount = 0;

  for (const diagnostic of diagnostics) {
    const candidates = (await (backend.sendRequest as (m: string, p: unknown) => Promise<unknown>)(
      'textDocument/codeAction',
      {
        textDocument: params.textDocument,
        range: diagnostic.range,
        context: { diagnostics: [diagnostic], only: ['quickfix'] }
      }
    )) as (Command | CodeAction)[] | null;

    let fix = candidates ? selectFix(candidates) : undefined;
    if (fix && isEditEmpty(fix.edit) && fix.command && supportsResolve(capabilities)) {
      fix = (await (backend.sendRequest as (m: string, p: unknown) => Promise<unknown>)(
        'codeAction/resolve',
        fix
      )) as CodeAction;
    }
    if (!fix) continue;

    const editsByUri = collectEditsByUri(fix.edit);
    if (Object.keys(editsByUri).length === 0) continue;

    for (const [uri, edits] of Object.entries(editsByUri)) {
      changes[uri] = mergeEdits(changes[uri] ?? [], edits);
    }
    mergedCount += 1;
  }

  return { changes, mergedCount };
}
