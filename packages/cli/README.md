# @lspeasy/cli

Standalone, server-agnostic refactor CLI that drives any Language Server Protocol
server to perform **write-side** refactors — project-wide rename, file-move with
importer updates, and move-symbol. These are the operations read-only tooling
(including Claude Code's built-in LSP tool) cannot do.

Built on [`@lspeasy/client`](../client): the CLI spawns the language server over the
stdio transport from `@lspeasy/core/node`, performs the LSP `initialize` /
`initialized` handshake, opens an anchor file, waits for the project to index, sends
the write request, and applies the returned `WorkspaceEdit` to disk. Because the
server sees the whole program, it updates references a text search misses —
re-exports, aliased and type-only imports, and `{@link}` doc references.

## Install

```bash
npx @lspeasy/cli rename src/math.ts 1:17 sumValues --root .   # zero-install
pnpm add -g @lspeasy/cli                                       # or install the bin
```

## Commands

Positions are **1-based** (`line:col`, editor-style) and refer to the symbol's identifier.

```bash
lspeasy rename <file> <line:col> <newName>
lspeasy move-file <oldPath> <newPath>
lspeasy move-symbol <file> <line:col> <targetFile>
lspeasy query <definition|references|hover> <file> <line:col>
```

| Command | LSP request(s) used |
|---|---|
| `rename` | `textDocument/rename` |
| `move-file` | `workspace/willRenameFiles` (+ physical `git mv` / rename) |
| `move-symbol` | `textDocument/codeAction` (`refactor.move`) → `workspace/executeCommand` |
| `query` | `textDocument/definition` \| `references` \| `hover` |

## Flags

| Flag | Default | Meaning |
|---|---|---|
| `--server <cmd>` | `typescript-language-server --stdio` | LSP server launch command (any server advertising rename / codeAction / willRenameFiles) |
| `--root <dir>` | cwd | Project root (point at the package whose tsconfig owns the file) |
| `--dry-run` | off | Print affected files / edit counts; change nothing |
| `--apply` | on | Apply changes to disk (default) |
| `--json` | off | Machine-readable JSON on stdout (diagnostics go to stderr) |
| `--wait <ms>` | `15000` | Index wait before sending requests |
| `--verbose` | off | Progress logging to stderr |
| `--allow-outside-root` | off | Permit file-path args that resolve outside `--root` |

### Path resolution & root safety

`--root` is the single base for the server *and* the file-path arguments. Relative
path args are resolved against `--root`, **not** the current working directory — so
running the CLI from an unrelated checkout (e.g. a different git worktree of the same
project) cannot silently operate on the wrong one. Any path that resolves outside
`--root` is refused (error, non-zero exit, no changes) unless `--allow-outside-root`
is passed.

## Programmatic use

The reusable internals are also exported:

```ts
import { RefactorSession, applyWorkspaceEdit, planWorkspaceEdit } from '@lspeasy/cli';
```

## License

MIT
