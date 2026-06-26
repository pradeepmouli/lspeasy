---
description: API reference for cli
name: cli
---

# cli

## Features

- **Semantic refactoring** — project-wide rename, move-file with importer updates, extract symbol
- **Reference tracking** — find all references, call hierarchy, workspace symbol search
- **Code actions** — list and apply quick-fixes and refactors at any range
- **Any LSP server** — TypeScript, Rust, Python, Go, or any LSP-compliant server via `lsp.json`
- **Proxy daemon** — warm server connections for sub-100ms subsequent invocations
- **Dry-run preview** — `--dry-run` prints diffs without writing; safe to inspect before committing

## Quick Start

```
lsproxy <namespace> <command> [args] [flags]
lsproxy call <method> --params <json>
```

Commands are built from the server's capabilities at startup. Available namespaces:
`callHierarchy`, `codeAction`, `codeLens`, `completionItem`, `documentLink`,
`inlayHint`, `textDocument`, `workspace`, `workspaceSymbol`.

```bash
lsproxy textDocument hover           src/foo.ts 12:7
lsproxy textDocument rename          src/foo.ts 12:7 newName
lsproxy textDocument references      src/foo.ts 12:7
lsproxy textDocument definition      src/foo.ts 12:7
lsproxy textDocument formatting      src/foo.ts
lsproxy textDocument rangeFormatting src/foo.ts 1:1-50:1
lsproxy workspace   symbol           MyClass
lsproxy call        textDocument/semanticTokens/full --params '{"textDocument":{"uri":"file:///…"}}'
```

### Code actions

`codeAction` returns a JSON array of available fixes and refactors for a range.
When exactly one action carries an edit it is applied automatically; when zero or
multiple carry edits the array is printed and no files are changed.

```bash
lsproxy textDocument codeAction --dry-run src/foo.ts 12:1-12:20
```

## Troubleshooting

**Commands missing from `--help`** — lsproxy only registers commands for capabilities the
server actually advertises. If `textDocument rename` doesn't appear, the server doesn't
support `renameProvider`. Use `lsproxy call initialize --params '{}'` to inspect the
server's capability response.

**Wrong positions** — Positions must be 1-based (`line:col`). Most editors display
1-based positions; LSP protocol is 0-based internally but lsproxy converts for you.
Passing 0-based values shifts edits by one line/column.

**Server not found** — Without `--server`, lsproxy walks up from `--root` looking for
`lsp.json`. If it can't find one it will time out. Either add `lsp.json` to the project
root or pass `--server <cmd>` explicitly.

**Write commands applied unexpectedly** — `rename`, `formatting`, and code actions that
produce edits write to disk immediately. Always run with `--dry-run` first on an
unfamiliar codebase.

## Commands

### callHierarchy

callHierarchy operations

**Usage:**
```
lsproxy callHierarchy [options] [command]
```

### codeAction

codeAction operations

**Usage:**
```
lsproxy codeAction [options] [command]
```

### codeLens

codeLens operations

**Usage:**
```
lsproxy codeLens [options] [command]
```

### completionItem

completionItem operations

**Usage:**
```
lsproxy completionItem [options] [command]
```

### documentLink

documentLink operations

**Usage:**
```
lsproxy documentLink [options] [command]
```

### inlayHint

inlayHint operations

**Usage:**
```
lsproxy inlayHint [options] [command]
```

### textDocument

textDocument operations

**Usage:**
```
lsproxy textDocument [options] [command]
```

### workspace

workspace operations

**Usage:**
```
lsproxy workspace [options] [command]
```

### workspaceSymbol

workspaceSymbol operations

**Usage:**
```
lsproxy workspaceSymbol [options] [command]
```

### call

Send any LSP request by method name with raw JSON params

**Usage:**
```
lsproxy call [options] <method>
```

| Flag | Type | Required | Default | Env | Description |
| --- | --- | --- | --- | --- | --- |
| `--params` | `string` | no | — | — | LSP params as JSON |

**Arguments:**
- `method` *(required)*

## References

Load these on demand — do NOT read all at once:

- When using CLI commands → read `references/commands.md` for flags, arguments, and defaults