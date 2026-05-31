---
name: lsp-refactor
description: Use for ANY rename, file-move, or move-symbol refactor — especially rename-heavy work across multiple files. Claude Code's built-in LSP tool is READ-ONLY (find references, but no rename / file-move / move-symbol). Hand-editing those refactors silently misses re-exports, aliased imports, type-only imports, and {@link} doc references. This skill drives a real language server via the `lspeasy` CLI to apply a correct WorkspaceEdit that catches every reference. Trigger when the user asks to rename a function/class/variable/type project-wide, move a file and fix its importers, or pull a symbol out into another module.
---

# lsp-refactor

Drive write-side refactors through a real language server instead of hand-editing.

## Why this exists

Claude Code's built-in `LSP` tool is **read-only** — `definition`, `references`, `hover`,
but no `rename`, no file-move, no code-action apply. So multi-file refactors otherwise fall
to manual edits, which miss the references a compiler would catch:

- **re-exports** (`export { foo } from './x'`) — and the public-alias form `export { newName as foo }`
- **aliased imports** (`import { foo as bar }`)
- **type-only imports** (`import type { Foo }`)
- **`{@link foo}`** references in JSDoc

The `lspeasy` CLI sends a real `textDocument/rename` / `workspace/willRenameFiles` /
`refactor.move` to the language server and applies the returned `WorkspaceEdit`. The server
sees the whole program, so it updates all of the above. This is strictly more correct than
ripgrep-and-replace, and it is what you should reach for on rename-heavy work.

## The CLI

Run it via `npx` (no install) or the `lspeasy` bin if `@lspeasy/cli` is installed:

```bash
npx @lspeasy/cli <command> ...          # zero-install
lspeasy <command> ...                   # if installed (pnpm add -g @lspeasy/cli)
```

Commands (positions are **1-based**, `line:col`, editor-style):

```bash
lspeasy rename <file> <line:col> <newName>
lspeasy move-file <oldPath> <newPath>
lspeasy move-symbol <file> <line:col> <targetFile>
lspeasy query <definition|references|hover> <file> <line:col>
```

Useful flags:

- `--root <dir>` — project root (default: cwd). Point this at the package whose `tsconfig` owns the file.
- `--dry-run` — print the affected files / edit counts and change **nothing**. Always do this first.
- `--json` — machine-readable output on stdout (diagnostics go to stderr).
- `--server <cmd>` — LSP server launch command (default `typescript-language-server --stdio`). Any server advertising rename / codeAction / willRenameFiles works.
- `--wait <ms>` — how long to let the server index before requesting (default 15000). Large repos may need more.

## Workflow

Do **one operation at a time** and verify between each — that keeps any failure attributable
to a single change.

1. **Find the symbol position.** Use the read-only `LSP` tool (`definition`) or ripgrep to
   locate the declaration. You need the file and the 1-based `line:col` of the *identifier*.

2. **Dry-run first.** Run the command with `--dry-run` to see which files would change and how
   many edits. Sanity-check the file list — if a re-export or test file you expected is missing,
   the position or `--root` is probably wrong.

3. **Apply.** Re-run without `--dry-run` (apply is the default). The CLI applies the
   WorkspaceEdit and, for `move-file`, physically moves the file (`git mv` when tracked).

4. **Verify.** Run the project's type-check / build, then review the actual changes with
   `git diff` (and `git diff --stat` for the file overview). For TypeScript:
   `tsgo --noEmit` or `tsc --noEmit` (use whatever the repo uses). A clean compile plus a diff
   that touches only the expected files is your confirmation.

5. **Repeat** for the next operation. Don't batch unrelated refactors into one step.

### Examples

```bash
# Rename a function project-wide (declaration at src/math.ts line 1, col 17)
npx @lspeasy/cli rename src/math.ts 1:17 sumValues --root . --dry-run
npx @lspeasy/cli rename src/math.ts 1:17 sumValues --root .

# Move a file and update every importer, then git mv it
npx @lspeasy/cli move-file src/helpers.ts src/util/helpers.ts --root .

# Move a symbol into another module (updates importers automatically)
npx @lspeasy/cli move-symbol src/math.ts 5:17 src/helpers.ts --root .
```

## Notes / honesty

- **rename** reliably updates re-exports, aliased/type-only imports, and `{@link}` references.
- **move-symbol** targets an existing file (the server moves the symbol and rewrites importers);
  it relies on the language server's `refactor.move` code action. For TypeScript this is
  `typescript-language-server`; other servers must advertise the same capability.
- After a `move-file` or `move-symbol`, eyeball the moved block's formatting — language servers
  re-indent moved code and that may differ from the repo's formatter. Run the formatter if needed.
- If a command returns "no edit", the project likely hadn't finished indexing — re-run with a
  larger `--wait`, or confirm `--root` points at the right tsconfig.
