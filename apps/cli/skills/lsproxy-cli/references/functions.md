# Functions

## apply

### `applyWorkspaceEdit`
Apply a WorkspaceEdit to disk and return what was changed.

### `documentChanges` — sequential, order significant
Per the LSP spec the `documentChanges` array order is SIGNIFICANT: each entry
(text edit or resource op) is applied in the exact order the server emitted
it. This is the only correct interpretation — e.g. `[rename old→new, textEdit
on new]` requires the rename to run first so the edit can read `new`. (An
earlier three-phase model hoisted all resource ops into separate passes,
which silently reordered a server's ops and broke exactly that shape.)

Because order is honored literally, a failure partway through `documentChanges`
(e.g. a text edit keyed to a not-yet-created path) may leave earlier ops
applied — that is inherent to respecting server-specified order.

### `changes` map — unordered, transactional
The `changes` map carries no resource ops and no defined ordering, so it is
applied as a batch: every target is read and its new content computed in
memory BEFORE any write. If a read fails the function throws before any write,
so a failed edit never leaves the tree half-applied.
```ts
applyWorkspaceEdit(edit: WorkspaceEdit, guard?: BoundaryGuard): AppliedChange[]
```
**Parameters:**
- `edit: WorkspaceEdit`
- `guard: BoundaryGuard` (optional)
**Returns:** `AppliedChange[]`

### `applyTextEdits`
Apply text edits to a string, splicing in reverse offset order so earlier
edits do not invalidate the offsets of later ones.

`lineStarts` is computed once from the original `text` and reused for both the
sort and the splice loop. This is correct because edits apply in reverse
offset order: a later splice never shifts the line map of an earlier (smaller)
offset, so the original line map stays valid for every remaining edit.
```ts
applyTextEdits(text: string, edits: LspTextEdit[]): string
```
**Parameters:**
- `text: string`
- `edits: LspTextEdit[]`
**Returns:** `string`

### `planWorkspaceEdit`
Normalize a WorkspaceEdit into an ordered list of changes without
touching disk. Useful for `--dry-run` and `--json` reporting.
```ts
planWorkspaceEdit(edit: WorkspaceEdit, guard?: BoundaryGuard): AppliedChange[]
```
**Parameters:**
- `edit: WorkspaceEdit`
- `guard: BoundaryGuard` (optional)
**Returns:** `AppliedChange[]`
