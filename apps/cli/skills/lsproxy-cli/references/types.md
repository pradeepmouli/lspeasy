# Types & Enums

## apply

### `WorkspaceEdit`
**Properties:**
- `changes: Record<string, LspTextEdit[]>` (optional)
- `documentChanges: DocumentChange[]` (optional)

### `LspTextEdit`
**Properties:**
- `range: LspRange`
- `newText: string`

### `LspRange`
**Properties:**
- `start: LspPosition`
- `end: LspPosition`

### `LspPosition`
**Properties:**
- `line: number`
- `character: number`

### `AppliedChange`
A single change the apply pipeline performed, for reporting / dry-run output.
**Properties:**
- `kind: "rename" | "create" | "delete" | "edit"`
- `path: string`
- `editCount: number` (optional) — For `edit`, the number of text edits applied.
- `toPath: string` (optional) — For `rename`, the destination path.

## io

### `GlobalFlags`
**Properties:**
- `server: string`
- `root: string`
- `dryRun: boolean`
- `json: boolean`
- `verbose: boolean`
- `waitMs: number`
- `allowOutsideRoot: boolean`
- `overwrite: boolean` — Permit move-file to replace an existing destination (default: OFF).
- `noProxy: boolean` — Bypass the proxy daemon and connect directly to the language server.
