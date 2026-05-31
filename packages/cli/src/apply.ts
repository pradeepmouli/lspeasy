/**
 * Apply an LSP {@link WorkspaceEdit} to disk.
 *
 * Handles both representations a server may return:
 * - `changes`: a `{ uri -> TextEdit[] }` map (text-only, unordered → applied as
 *   a transactional batch).
 * - `documentChanges`: an ORDERED array that may interleave `TextDocumentEdit`
 *   entries with resource operations (`create` / `rename` / `delete`). The array
 *   order is significant and is honored literally (sequential application).
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

/**
 * Compute the absolute offset of each line start (the index just past every
 * `\n`, plus `0` for line 0). Built ONCE per file so offset lookups are O(1);
 * rebuilding it per call made {@link applyTextEdits} O(N·E) on the file length.
 *
 * Column values are LSP-spec UTF-16 code units, which is exactly how JavaScript
 * strings are indexed, so `lineStart + character` is correct even across
 * surrogate pairs — no extra code-point translation is needed.
 */
function computeLineStarts(text: string): number[] {
  const lineStarts = [0];
  for (let i = 0; i < text.length; i++) {
    if (text[i] === '\n') lineStarts.push(i + 1);
  }
  return lineStarts;
}

/** Convert a `{line, character}` position to an absolute string offset. */
function positionToOffset(lineStarts: number[], textLength: number, pos: LspPosition): number {
  const lineStart = lineStarts[pos.line] ?? textLength;
  return lineStart + pos.character;
}

/**
 * Apply text edits to a string, splicing in reverse offset order so earlier
 * edits do not invalidate the offsets of later ones.
 *
 * `lineStarts` is computed once from the original `text` and reused for both the
 * sort and the splice loop. This is correct because edits apply in reverse
 * offset order: a later splice never shifts the line map of an earlier (smaller)
 * offset, so the original line map stays valid for every remaining edit.
 */
export function applyTextEdits(text: string, edits: LspTextEdit[]): string {
  const lineStarts = computeLineStarts(text);
  const offset = (pos: LspPosition) => positionToOffset(lineStarts, text.length, pos);
  const sorted = [...edits].sort((a, b) => offset(b.range.start) - offset(a.range.start));
  let out = text;
  for (const e of sorted) {
    const start = offset(e.range.start);
    const end = offset(e.range.end);
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

/** Read a text-edit target, throwing a clear error if it cannot be read. */
function readForEdit(path: string): string {
  try {
    return readFileSync(path, 'utf8');
  } catch (err) {
    throw new Error(
      `cannot read ${path} for text edits: ${err instanceof Error ? err.message : String(err)}`
    );
  }
}

/**
 * Perform a single `create` resource op, honoring LSP `overwrite` /
 * `ignoreIfExists` precedence. Returns the {@link AppliedChange} when the file
 * was created, or `undefined` when the op was skipped per `ignoreIfExists`.
 *
 * Per the LSP spec, `overwrite` takes precedence over `ignoreIfExists`. With
 * neither flag set, a `create` op on an EXISTING path is an error — silently
 * skipping it (the old behaviour) let a later text edit run against the
 * pre-existing file the server expected to have freshly created.
 */
function applyCreate(op: CreateFileOp): AppliedChange | undefined {
  const p = fileURLToPath(op.uri);
  if (existsSync(p)) {
    if (op.options?.overwrite) {
      // proceed: truncate to an empty file
    } else if (op.options?.ignoreIfExists) {
      return undefined;
    } else {
      throw new Error(`cannot create ${p}: already exists (no overwrite/ignoreIfExists)`);
    }
  }
  mkdirSync(dirname(p), { recursive: true });
  writeFileSync(p, '');
  return { kind: 'create', path: p };
}

/**
 * Perform a single `rename` resource op, honoring LSP `overwrite` /
 * `ignoreIfExists` precedence. A rename whose destination already exists is an
 * error unless `overwrite` is set (clobber) or `ignoreIfExists` is set (skip).
 * The old code called `renameSync` unconditionally, which clobbers on POSIX.
 */
function applyRename(op: RenameFileOp): AppliedChange | undefined {
  const from = fileURLToPath(op.oldUri);
  const to = fileURLToPath(op.newUri);
  if (existsSync(to)) {
    if (op.options?.overwrite) {
      // proceed: renameSync replaces the destination
    } else if (op.options?.ignoreIfExists) {
      return undefined;
    } else {
      throw new Error(`cannot rename to ${to}: already exists (no overwrite/ignoreIfExists)`);
    }
  }
  mkdirSync(dirname(to), { recursive: true });
  renameSync(from, to);
  return { kind: 'rename', path: from, toPath: to };
}

/** Perform a single `delete` resource op, honoring `ignoreIfNotExists`. */
function applyDelete(op: DeleteFileOp): AppliedChange | undefined {
  const p = fileURLToPath(op.uri);
  if (!existsSync(p) && op.options?.ignoreIfNotExists) return undefined;
  rmSync(p, { recursive: op.options?.recursive ?? false });
  return { kind: 'delete', path: p };
}

/** Apply a single resolved text write to disk. */
function applyTextWrite(w: TextWrite): AppliedChange {
  const after = applyTextEdits(readForEdit(w.path), w.edits);
  writeFileSync(w.path, after);
  return { kind: 'edit', path: w.path, editCount: w.edits.length };
}

/**
 * Apply a {@link WorkspaceEdit} to disk and return what was changed.
 *
 * ### `documentChanges` — sequential, order significant
 * Per the LSP spec the `documentChanges` array order is SIGNIFICANT: each entry
 * (text edit or resource op) is applied in the exact order the server emitted
 * it. This is the only correct interpretation — e.g. `[rename old→new, textEdit
 * on new]` requires the rename to run first so the edit can read `new`. (An
 * earlier three-phase model hoisted all resource ops into separate passes,
 * which silently reordered a server's ops and broke exactly that shape.)
 *
 * Because order is honored literally, a failure partway through `documentChanges`
 * (e.g. a text edit keyed to a not-yet-created path) may leave earlier ops
 * applied — that is inherent to respecting server-specified order.
 *
 * ### `changes` map — unordered, transactional
 * The `changes` map carries no resource ops and no defined ordering, so it is
 * applied as a batch: every target is read and its new content computed in
 * memory BEFORE any write. If a read fails the function throws before any write,
 * so a failed edit never leaves the tree half-applied.
 */
export function applyWorkspaceEdit(edit: WorkspaceEdit): AppliedChange[] {
  const applied: AppliedChange[] = [];

  if (edit.documentChanges) {
    // Sequential: honor the server-specified order literally.
    for (const dc of edit.documentChanges) {
      if ('kind' in dc) {
        const change =
          dc.kind === 'create'
            ? applyCreate(dc)
            : dc.kind === 'rename'
              ? applyRename(dc)
              : applyDelete(dc);
        if (change) applied.push(change);
      } else {
        applied.push(applyTextWrite({ path: fileURLToPath(dc.textDocument.uri), edits: dc.edits }));
      }
    }
    return applied;
  }

  if (edit.changes) {
    // Unordered text-only map: read every target and compute new content BEFORE
    // writing anything, so a failed read aborts without a half-applied tree.
    const writes: TextWrite[] = Object.keys(edit.changes)
      .sort()
      .map((uri) => ({ path: fileURLToPath(uri), edits: edit.changes![uri]! }));
    const pending = writes.map((w) => ({
      path: w.path,
      after: applyTextEdits(readForEdit(w.path), w.edits),
      count: w.edits.length
    }));
    for (const w of pending) {
      writeFileSync(w.path, w.after);
      applied.push({ kind: 'edit', path: w.path, editCount: w.count });
    }
  }

  return applied;
}
