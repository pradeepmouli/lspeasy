/**
 * Apply an LSP {@link WorkspaceEdit} to disk.
 *
 * Handles both representations a server may return:
 * - `changes`: a `{ uri -> TextEdit[] }` map (text-only).
 * - `documentChanges`: an ordered array that may interleave `TextDocumentEdit`
 *   entries with resource operations (`create` / `rename` / `delete`).
 *
 * TextEdits are applied per file by converting each `{line, character}` to an
 * absolute offset and splicing in REVERSE offset order so earlier edits do not
 * invalidate the offsets of later ones.
 */

import { existsSync, mkdirSync, readFileSync, renameSync, rmSync, writeFileSync } from 'node:fs';
import { dirname } from 'node:path';
import { fileURLToPath } from 'node:url';

export interface LspPosition {
  line: number;
  character: number;
}

export interface LspRange {
  start: LspPosition;
  end: LspPosition;
}

export interface LspTextEdit {
  range: LspRange;
  newText: string;
}

interface TextDocumentEdit {
  textDocument: { uri: string; version?: number | null };
  edits: LspTextEdit[];
}

interface CreateFileOp {
  kind: 'create';
  uri: string;
  options?: { overwrite?: boolean; ignoreIfExists?: boolean };
}
interface RenameFileOp {
  kind: 'rename';
  oldUri: string;
  newUri: string;
  options?: { overwrite?: boolean; ignoreIfExists?: boolean };
}
interface DeleteFileOp {
  kind: 'delete';
  uri: string;
  options?: { recursive?: boolean; ignoreIfNotExists?: boolean };
}

type DocumentChange = TextDocumentEdit | CreateFileOp | RenameFileOp | DeleteFileOp;

export interface WorkspaceEdit {
  changes?: Record<string, LspTextEdit[]>;
  documentChanges?: DocumentChange[];
}

/** A single change the apply pipeline performed, for reporting / dry-run output. */
export interface AppliedChange {
  kind: 'edit' | 'create' | 'rename' | 'delete';
  path: string;
  /** For `edit`, the number of text edits applied. */
  editCount?: number;
  /** For `rename`, the destination path. */
  toPath?: string;
}

/** Convert a `{line, character}` position to an absolute string offset. */
function positionToOffset(text: string, pos: LspPosition): number {
  const lineStarts = [0];
  for (let i = 0; i < text.length; i++) {
    if (text[i] === '\n') lineStarts.push(i + 1);
  }
  const lineStart = lineStarts[pos.line] ?? text.length;
  return lineStart + pos.character;
}

/** Apply text edits to a string, splicing in reverse offset order. */
export function applyTextEdits(text: string, edits: LspTextEdit[]): string {
  const sorted = [...edits].sort(
    (a, b) => positionToOffset(text, b.range.start) - positionToOffset(text, a.range.start)
  );
  let out = text;
  for (const e of sorted) {
    const start = positionToOffset(out, e.range.start);
    const end = positionToOffset(out, e.range.end);
    out = out.slice(0, start) + e.newText + out.slice(end);
  }
  return out;
}

/**
 * Normalize a {@link WorkspaceEdit} into an ordered list of changes without
 * touching disk. Useful for `--dry-run` and `--json` reporting.
 */
export function planWorkspaceEdit(edit: WorkspaceEdit): AppliedChange[] {
  const changes: AppliedChange[] = [];

  if (edit.documentChanges) {
    for (const dc of edit.documentChanges) {
      if ('kind' in dc) {
        if (dc.kind === 'create') changes.push({ kind: 'create', path: fileURLToPath(dc.uri) });
        else if (dc.kind === 'rename')
          changes.push({
            kind: 'rename',
            path: fileURLToPath(dc.oldUri),
            toPath: fileURLToPath(dc.newUri)
          });
        else if (dc.kind === 'delete')
          changes.push({ kind: 'delete', path: fileURLToPath(dc.uri) });
      } else {
        changes.push({
          kind: 'edit',
          path: fileURLToPath(dc.textDocument.uri),
          editCount: dc.edits.length
        });
      }
    }
  } else if (edit.changes) {
    for (const uri of Object.keys(edit.changes).sort()) {
      changes.push({
        kind: 'edit',
        path: fileURLToPath(uri),
        editCount: edit.changes[uri]!.length
      });
    }
  }

  return changes;
}

/**
 * Return a copy of `edit` with all resource operations (create / rename /
 * delete) removed, keeping only text edits.
 *
 * Used by `move-file`: the CLI performs the single physical move itself (via
 * `git mv` when possible), so any rename op a server folds into the
 * `willRenameFiles` result must be dropped to avoid a double-move (which would
 * leave the source missing on a second run).
 */
export function stripResourceOps(edit: WorkspaceEdit): WorkspaceEdit {
  if (!edit.documentChanges) return edit;
  const textOnly = edit.documentChanges.filter((dc): dc is TextDocumentEdit => !('kind' in dc));
  return { documentChanges: textOnly };
}

/** Internal: a text-edit unit resolved to an absolute path, ready to write. */
interface TextWrite {
  path: string;
  edits: LspTextEdit[];
}

/**
 * Apply a {@link WorkspaceEdit} to disk and return what was changed.
 *
 * ### Ordering
 * A `documentChanges` array may interleave text edits with resource operations
 * in any order. LSP makes the array order significant, but servers are not
 * uniformly careful: a text edit may be keyed to a file that a later `rename`
 * op moves, or a text edit may target a file an earlier-listed `create` op must
 * make first. To be robust regardless of emission order we apply in three
 * phases:
 *
 *   1. **creates** — so a text edit can fill a freshly created file;
 *   2. **text edits** — read every target up-front, then write (any edit keyed
 *      to a file that is *also* being renamed is applied at the file's CURRENT
 *      path, before the move);
 *   3. **renames / deletes** — last, so no text edit ever targets a path a
 *      rename already moved.
 *
 * ### Transactional-ish behaviour
 * All text-edit targets are read and their new contents computed in memory
 * before any text edit is written. If a read fails (e.g. a missing source file)
 * the function throws before any text edit is applied, so a failed edit never
 * leaves files half-edited. (Phase-1 `create` ops run first, so a create
 * followed by a failed read can leave an empty created file — no live server
 * emits that shape; the guarantee covers the text-edit phase.)
 */
export function applyWorkspaceEdit(edit: WorkspaceEdit): AppliedChange[] {
  const applied: AppliedChange[] = [];

  // Normalize both representations into resource ops + text writes.
  const creates: CreateFileOp[] = [];
  const renames: RenameFileOp[] = [];
  const deletes: DeleteFileOp[] = [];
  const textWrites: TextWrite[] = [];

  if (edit.documentChanges) {
    for (const dc of edit.documentChanges) {
      if ('kind' in dc) {
        if (dc.kind === 'create') creates.push(dc);
        else if (dc.kind === 'rename') renames.push(dc);
        else if (dc.kind === 'delete') deletes.push(dc);
      } else {
        textWrites.push({ path: fileURLToPath(dc.textDocument.uri), edits: dc.edits });
      }
    }
  } else if (edit.changes) {
    for (const uri of Object.keys(edit.changes).sort()) {
      textWrites.push({ path: fileURLToPath(uri), edits: edit.changes[uri]! });
    }
  }

  // Phase 1: creates first, so subsequent text edits can fill them.
  for (const op of creates) {
    const p = fileURLToPath(op.uri);
    if (existsSync(p) && op.options?.ignoreIfExists) continue;
    if (existsSync(p) && !op.options?.overwrite) continue;
    mkdirSync(dirname(p), { recursive: true });
    writeFileSync(p, '');
    applied.push({ kind: 'create', path: p });
  }

  // Phase 2: read every text-edit target and compute new content BEFORE writing
  // anything, so a failed read aborts without a half-applied tree.
  const pending = textWrites.map((w) => {
    let before: string;
    try {
      before = readFileSync(w.path, 'utf8');
    } catch (err) {
      throw new Error(
        `cannot read ${w.path} for text edits: ${err instanceof Error ? err.message : String(err)}`
      );
    }
    return { path: w.path, after: applyTextEdits(before, w.edits), count: w.edits.length };
  });
  for (const w of pending) {
    writeFileSync(w.path, w.after);
    applied.push({ kind: 'edit', path: w.path, editCount: w.count });
  }

  // Phase 3: renames and deletes last — never move a path a text edit targeted.
  for (const op of renames) {
    const from = fileURLToPath(op.oldUri);
    const to = fileURLToPath(op.newUri);
    if (existsSync(to) && op.options?.ignoreIfExists) continue;
    mkdirSync(dirname(to), { recursive: true });
    renameSync(from, to);
    applied.push({ kind: 'rename', path: from, toPath: to });
  }
  for (const op of deletes) {
    const p = fileURLToPath(op.uri);
    if (!existsSync(p) && op.options?.ignoreIfNotExists) continue;
    rmSync(p, { recursive: op.options?.recursive ?? false });
    applied.push({ kind: 'delete', path: p });
  }

  return applied;
}
