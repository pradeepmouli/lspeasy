---
description: "Standalone refactor CLI driving any LSP server: project-wide rename, file-move with importer updates, and code actions. Also: lsp, language-server-protocol, refactor, rename, codemod, cli."
name: lsproxy-cli
---

# lsproxy-cli

Standalone refactor CLI driving any LSP server: project-wide rename, file-move with importer updates, and code actions.

## Features

- **Semantic refactoring** — project-wide rename, move-file with importer updates, extract symbol
- **Reference tracking** — find all references, call hierarchy, workspace symbol search
- **Code actions** — list and apply quick-fixes and refactors at any range; filter by kind with `--code-action-only` or trigger-kind with `--code-action-trigger-kind` instead of writing raw `--params` JSON
- **Any LSP server** — TypeScript, Rust, Python, Go, or any LSP-compliant server via `lsp.json`
- **Proxy daemon** — warm server connections for sub-100ms subsequent invocations
- **Dry-run preview** — `--dry-run` prints diffs without writing; safe to inspect before committing
- **Multi-platform config interop** — `lsproxy config import/export/diff/list` bridges `lsp.json` with Copilot CLI, Claude Code, and Codex; `--user` targets `~/.claude/lsp.json` for user-level scope
- **Self-describing discovery** — bare `lsproxy` lists configured languages with live daemon status; `lsproxy --help <language> <namespace> <request>` shows parameter schema, flag list, and illustrative example input/output; add `--json` for machine-readable output for agents
- **Server visibility** — `lsproxy status` groups every configured server by process, showing its resolved binary location, config source (lsp.json, Claude Code, Codex, Copilot CLI), live connection status/uptime, and which languages it serves

## Quick Start

```bash
# Preview a rename before writing (always do this first)
lsproxy src/auth/login.ts textDocument rename --dry-run 42:15 "signIn"

# Find all references to a symbol
lsproxy src/auth/login.ts textDocument references 42:15

# List available code actions at a range, then apply the chosen one
lsproxy src/foo.ts textDocument codeAction 12:1-12:20

# Send any LSP method directly (useful for probing capabilities)
lsproxy typescript call workspace/executeCommand --params '{"command":"typescript.reloadProjects"}'
```

Positions are **1-based** (`line:col`, editor-style).
Write-side commands apply changes to disk automatically — use `--dry-run` to preview first.

## Troubleshooting

**Commands missing from `--help`** — lsproxy only registers commands for capabilities the
server actually advertises. If `textDocument rename` doesn't appear, the server doesn't
support `renameProvider`. Use `lsproxy <language-or-file> call initialize --params '{}'`
to inspect the server's capability response.

**Wrong positions** — Positions must be 1-based (`line:col`). Most editors display
1-based positions; LSP protocol is 0-based internally but lsproxy converts for you.
Passing 0-based values shifts edits by one line/column.

**Server not found** — Without `--server`, lsproxy walks up from `--root` looking for
`lsp.json`. If it can't find one it will time out. Either add `lsp.json` to the project
root or pass `--server <cmd>` explicitly.

**Write commands applied unexpectedly** — `rename`, `formatting`, and code actions that
produce edits write to disk immediately. Always run with `--dry-run` first on an
unfamiliar codebase.

**`references` returns only the declaration (or nothing)** — In a multi-package TypeScript
monorepo (especially with a solution-style root `tsconfig.json` that has `references` but no
`include`), `textDocument references` can come back with only the symbol's own declaration —
or an empty result — even when cross-file callers exist. This happens when the language
server has not loaded the full workspace project. lsproxy flags this case as `partial:true`
with a `warning` (and a stderr note) instead of a bare `ok:true`. Do not treat a
partial/empty result as "no callers" for a deletion or a file move; verify with a
build/type-check, or re-run against a warmed proxy daemon so the project is fully indexed.

## Commands

### callHierarchy

callHierarchy operations

**Usage:**
```
[options] [command]
```

### callHierarchy incomingCalls

**Usage:**
```
[options]
```

| Flag | Type | Required | Default | Env | Description |
| --- | --- | --- | --- | --- | --- |
| `--params` | `string` | no | — | — | extra LSP params as JSON, deep-merged over positional args + flags (for raw methods, the full params) |

### callHierarchy outgoingCalls

**Usage:**
```
[options]
```

| Flag | Type | Required | Default | Env | Description |
| --- | --- | --- | --- | --- | --- |
| `--params` | `string` | no | — | — | extra LSP params as JSON, deep-merged over positional args + flags (for raw methods, the full params) |

### codeAction

codeAction operations

**Usage:**
```
[options] [command]
```

### codeAction resolve

**Usage:**
```
[options]
```

| Flag | Type | Required | Default | Env | Description |
| --- | --- | --- | --- | --- | --- |
| `--params` | `string` | no | — | — | extra LSP params as JSON, deep-merged over positional args + flags (for raw methods, the full params) |

### codeLens

codeLens operations

**Usage:**
```
[options] [command]
```

### codeLens resolve

**Usage:**
```
[options]
```

| Flag | Type | Required | Default | Env | Description |
| --- | --- | --- | --- | --- | --- |
| `--params` | `string` | no | — | — | extra LSP params as JSON, deep-merged over positional args + flags (for raw methods, the full params) |

### completionItem

completionItem operations

**Usage:**
```
[options] [command]
```

### completionItem resolve

**Usage:**
```
[options]
```

| Flag | Type | Required | Default | Env | Description |
| --- | --- | --- | --- | --- | --- |
| `--params` | `string` | no | — | — | extra LSP params as JSON, deep-merged over positional args + flags (for raw methods, the full params) |

### documentLink

documentLink operations

**Usage:**
```
[options] [command]
```

### documentLink resolve

**Usage:**
```
[options]
```

| Flag | Type | Required | Default | Env | Description |
| --- | --- | --- | --- | --- | --- |
| `--params` | `string` | no | — | — | extra LSP params as JSON, deep-merged over positional args + flags (for raw methods, the full params) |

### inlayHint

inlayHint operations

**Usage:**
```
[options] [command]
```

### inlayHint resolve

**Usage:**
```
[options]
```

| Flag | Type | Required | Default | Env | Description |
| --- | --- | --- | --- | --- | --- |
| `--params` | `string` | no | — | — | extra LSP params as JSON, deep-merged over positional args + flags (for raw methods, the full params) |

### textDocument

textDocument operations

**Usage:**
```
[options] [command]
```

### textDocument codeAction

**Usage:**
```
[options] <file> <range>
```

| Flag | Type | Required | Default | Env | Description |
| --- | --- | --- | --- | --- | --- |
| `--params` | `string` | no | — | — | extra LSP params as JSON, deep-merged over positional args + flags (for raw methods, the full params) |
| `--work-done-token` | `string` | no | — | — | work-done-token |
| `--partial-result-token` | `string` | no | — | — | partial-result-token |
| `--code-action-only` | `string` | no | — | — | code-action-only (comma-separated) |
| `--code-action-trigger-kind` | `string` | no | — | — | code-action-trigger-kind |

**Arguments:**
- `file` *(required)* — file path (relative to --root)
- `range` *(required)* — range as startLine:col-endLine:col, e.g. 2:1-4:5

### textDocument codeLens

**Usage:**
```
[options] <file>
```

| Flag | Type | Required | Default | Env | Description |
| --- | --- | --- | --- | --- | --- |
| `--params` | `string` | no | — | — | extra LSP params as JSON, deep-merged over positional args + flags (for raw methods, the full params) |
| `--work-done-token` | `string` | no | — | — | work-done-token |
| `--partial-result-token` | `string` | no | — | — | partial-result-token |

**Arguments:**
- `file` *(required)* — file path (relative to --root)

### textDocument colorPresentation

**Usage:**
```
[options] <file> <range>
```

| Flag | Type | Required | Default | Env | Description |
| --- | --- | --- | --- | --- | --- |
| `--params` | `string` | no | — | — | extra LSP params as JSON, deep-merged over positional args + flags (for raw methods, the full params) |
| `--work-done-token` | `string` | no | — | — | work-done-token |
| `--partial-result-token` | `string` | no | — | — | partial-result-token |
| `--color-presentation-color-red` | `string` | no | — | — | color-presentation-color-red |
| `--color-presentation-color-green` | `string` | no | — | — | color-presentation-color-green |
| `--color-presentation-color-blue` | `string` | no | — | — | color-presentation-color-blue |
| `--color-presentation-color-alpha` | `string` | no | — | — | color-presentation-color-alpha |

**Arguments:**
- `file` *(required)* — file path (relative to --root)
- `range` *(required)* — range as startLine:col-endLine:col, e.g. 2:1-4:5

### textDocument completion

**Usage:**
```
[options] <file> <line:col>
```

| Flag | Type | Required | Default | Env | Description |
| --- | --- | --- | --- | --- | --- |
| `--params` | `string` | no | — | — | extra LSP params as JSON, deep-merged over positional args + flags (for raw methods, the full params) |
| `--work-done-token` | `string` | no | — | — | work-done-token |
| `--partial-result-token` | `string` | no | — | — | partial-result-token |
| `--completion-trigger-kind` | `string` | no | — | — | completion-trigger-kind |
| `--completion-trigger-character` | `string` | no | — | — | completion-trigger-character |

**Arguments:**
- `file` *(required)* — file path (relative to --root)
- `line:col` *(required)* — 1-based position, e.g. 12:7

### textDocument declaration

**Usage:**
```
[options] <file> <line:col>
```

| Flag | Type | Required | Default | Env | Description |
| --- | --- | --- | --- | --- | --- |
| `--params` | `string` | no | — | — | extra LSP params as JSON, deep-merged over positional args + flags (for raw methods, the full params) |
| `--work-done-token` | `string` | no | — | — | work-done-token |
| `--partial-result-token` | `string` | no | — | — | partial-result-token |

**Arguments:**
- `file` *(required)* — file path (relative to --root)
- `line:col` *(required)* — 1-based position, e.g. 12:7

### textDocument definition

**Usage:**
```
[options] <file> <line:col>
```

| Flag | Type | Required | Default | Env | Description |
| --- | --- | --- | --- | --- | --- |
| `--params` | `string` | no | — | — | extra LSP params as JSON, deep-merged over positional args + flags (for raw methods, the full params) |
| `--work-done-token` | `string` | no | — | — | work-done-token |
| `--partial-result-token` | `string` | no | — | — | partial-result-token |

**Arguments:**
- `file` *(required)* — file path (relative to --root)
- `line:col` *(required)* — 1-based position, e.g. 12:7

### textDocument diagnostic

**Usage:**
```
[options] <file>
```

| Flag | Type | Required | Default | Env | Description |
| --- | --- | --- | --- | --- | --- |
| `--params` | `string` | no | — | — | extra LSP params as JSON, deep-merged over positional args + flags (for raw methods, the full params) |
| `--work-done-token` | `string` | no | — | — | work-done-token |
| `--partial-result-token` | `string` | no | — | — | partial-result-token |
| `--identifier` | `string` | no | — | — | identifier |
| `--previous-result-id` | `string` | no | — | — | previous-result-id |

**Arguments:**
- `file` *(required)* — file path (relative to --root)

### textDocument documentColor

**Usage:**
```
[options] <file>
```

| Flag | Type | Required | Default | Env | Description |
| --- | --- | --- | --- | --- | --- |
| `--params` | `string` | no | — | — | extra LSP params as JSON, deep-merged over positional args + flags (for raw methods, the full params) |
| `--work-done-token` | `string` | no | — | — | work-done-token |
| `--partial-result-token` | `string` | no | — | — | partial-result-token |

**Arguments:**
- `file` *(required)* — file path (relative to --root)

### textDocument documentHighlight

**Usage:**
```
[options] <file> <line:col>
```

| Flag | Type | Required | Default | Env | Description |
| --- | --- | --- | --- | --- | --- |
| `--params` | `string` | no | — | — | extra LSP params as JSON, deep-merged over positional args + flags (for raw methods, the full params) |
| `--work-done-token` | `string` | no | — | — | work-done-token |
| `--partial-result-token` | `string` | no | — | — | partial-result-token |

**Arguments:**
- `file` *(required)* — file path (relative to --root)
- `line:col` *(required)* — 1-based position, e.g. 12:7

### textDocument documentLink

**Usage:**
```
[options] <file>
```

| Flag | Type | Required | Default | Env | Description |
| --- | --- | --- | --- | --- | --- |
| `--params` | `string` | no | — | — | extra LSP params as JSON, deep-merged over positional args + flags (for raw methods, the full params) |
| `--work-done-token` | `string` | no | — | — | work-done-token |
| `--partial-result-token` | `string` | no | — | — | partial-result-token |

**Arguments:**
- `file` *(required)* — file path (relative to --root)

### textDocument documentSymbol

**Usage:**
```
[options] <file>
```

| Flag | Type | Required | Default | Env | Description |
| --- | --- | --- | --- | --- | --- |
| `--params` | `string` | no | — | — | extra LSP params as JSON, deep-merged over positional args + flags (for raw methods, the full params) |
| `--work-done-token` | `string` | no | — | — | work-done-token |
| `--partial-result-token` | `string` | no | — | — | partial-result-token |

**Arguments:**
- `file` *(required)* — file path (relative to --root)

### textDocument foldingRange

**Usage:**
```
[options] <file>
```

| Flag | Type | Required | Default | Env | Description |
| --- | --- | --- | --- | --- | --- |
| `--params` | `string` | no | — | — | extra LSP params as JSON, deep-merged over positional args + flags (for raw methods, the full params) |
| `--work-done-token` | `string` | no | — | — | work-done-token |
| `--partial-result-token` | `string` | no | — | — | partial-result-token |

**Arguments:**
- `file` *(required)* — file path (relative to --root)

### textDocument formatting

**Usage:**
```
[options] <file>
```

| Flag | Type | Required | Default | Env | Description |
| --- | --- | --- | --- | --- | --- |
| `--params` | `string` | no | — | — | extra LSP params as JSON, deep-merged over positional args + flags (for raw methods, the full params) |
| `--work-done-token` | `string` | no | — | — | work-done-token |
| `--formatting-tab-size` | `string` | no | — | — | formatting-tab-size |
| `--formatting-insert-spaces` | `string` | no | — | — | formatting-insert-spaces |
| `--formatting-trim-trailing-whitespace` | `string` | no | — | — | formatting-trim-trailing-whitespace |
| `--formatting-insert-final-newline` | `string` | no | — | — | formatting-insert-final-newline |
| `--formatting-trim-final-newlines` | `string` | no | — | — | formatting-trim-final-newlines |

**Arguments:**
- `file` *(required)* — file path (relative to --root)

### textDocument hover

**Usage:**
```
[options] <file> <line:col>
```

| Flag | Type | Required | Default | Env | Description |
| --- | --- | --- | --- | --- | --- |
| `--params` | `string` | no | — | — | extra LSP params as JSON, deep-merged over positional args + flags (for raw methods, the full params) |
| `--work-done-token` | `string` | no | — | — | work-done-token |

**Arguments:**
- `file` *(required)* — file path (relative to --root)
- `line:col` *(required)* — 1-based position, e.g. 12:7

### textDocument implementation

**Usage:**
```
[options] <file> <line:col>
```

| Flag | Type | Required | Default | Env | Description |
| --- | --- | --- | --- | --- | --- |
| `--params` | `string` | no | — | — | extra LSP params as JSON, deep-merged over positional args + flags (for raw methods, the full params) |
| `--work-done-token` | `string` | no | — | — | work-done-token |
| `--partial-result-token` | `string` | no | — | — | partial-result-token |

**Arguments:**
- `file` *(required)* — file path (relative to --root)
- `line:col` *(required)* — 1-based position, e.g. 12:7

### textDocument inlayHint

**Usage:**
```
[options] <file> <range>
```

| Flag | Type | Required | Default | Env | Description |
| --- | --- | --- | --- | --- | --- |
| `--params` | `string` | no | — | — | extra LSP params as JSON, deep-merged over positional args + flags (for raw methods, the full params) |
| `--work-done-token` | `string` | no | — | — | work-done-token |

**Arguments:**
- `file` *(required)* — file path (relative to --root)
- `range` *(required)* — range as startLine:col-endLine:col, e.g. 2:1-4:5

### textDocument inlineCompletion

**Usage:**
```
[options] <file> <line:col>
```

| Flag | Type | Required | Default | Env | Description |
| --- | --- | --- | --- | --- | --- |
| `--params` | `string` | no | — | — | extra LSP params as JSON, deep-merged over positional args + flags (for raw methods, the full params) |
| `--work-done-token` | `string` | no | — | — | work-done-token |
| `--inline-completion-trigger-kind` | `string` | no | — | — | inline-completion-trigger-kind |

**Arguments:**
- `file` *(required)* — file path (relative to --root)
- `line:col` *(required)* — 1-based position, e.g. 12:7

### textDocument inlineValue

**Usage:**
```
[options] <file> <range>
```

| Flag | Type | Required | Default | Env | Description |
| --- | --- | --- | --- | --- | --- |
| `--params` | `string` | no | — | — | extra LSP params as JSON, deep-merged over positional args + flags (for raw methods, the full params) |
| `--work-done-token` | `string` | no | — | — | work-done-token |
| `--inline-value-frame-id` | `string` | no | — | — | inline-value-frame-id |

**Arguments:**
- `file` *(required)* — file path (relative to --root)
- `range` *(required)* — range as startLine:col-endLine:col, e.g. 2:1-4:5

### textDocument linkedEditingRange

**Usage:**
```
[options] <file> <line:col>
```

| Flag | Type | Required | Default | Env | Description |
| --- | --- | --- | --- | --- | --- |
| `--params` | `string` | no | — | — | extra LSP params as JSON, deep-merged over positional args + flags (for raw methods, the full params) |
| `--work-done-token` | `string` | no | — | — | work-done-token |

**Arguments:**
- `file` *(required)* — file path (relative to --root)
- `line:col` *(required)* — 1-based position, e.g. 12:7

### textDocument moniker

**Usage:**
```
[options] <file> <line:col>
```

| Flag | Type | Required | Default | Env | Description |
| --- | --- | --- | --- | --- | --- |
| `--params` | `string` | no | — | — | extra LSP params as JSON, deep-merged over positional args + flags (for raw methods, the full params) |
| `--work-done-token` | `string` | no | — | — | work-done-token |
| `--partial-result-token` | `string` | no | — | — | partial-result-token |

**Arguments:**
- `file` *(required)* — file path (relative to --root)
- `line:col` *(required)* — 1-based position, e.g. 12:7

### textDocument onTypeFormatting

**Usage:**
```
[options] <file> <line:col>
```

| Flag | Type | Required | Default | Env | Description |
| --- | --- | --- | --- | --- | --- |
| `--params` | `string` | no | — | — | extra LSP params as JSON, deep-merged over positional args + flags (for raw methods, the full params) |
| `--ch` | `string` | no | — | — | ch |
| `--on-type-formatting-tab-size` | `string` | no | — | — | on-type-formatting-tab-size |
| `--on-type-formatting-insert-spaces` | `string` | no | — | — | on-type-formatting-insert-spaces |
| `--on-type-formatting-trim-trailing-whitespace` | `string` | no | — | — | on-type-formatting-trim-trailing-whitespace |
| `--on-type-formatting-insert-final-newline` | `string` | no | — | — | on-type-formatting-insert-final-newline |
| `--on-type-formatting-trim-final-newlines` | `string` | no | — | — | on-type-formatting-trim-final-newlines |

**Arguments:**
- `file` *(required)* — file path (relative to --root)
- `line:col` *(required)* — 1-based position, e.g. 12:7

### textDocument prepareCallHierarchy

**Usage:**
```
[options] <file> <line:col>
```

| Flag | Type | Required | Default | Env | Description |
| --- | --- | --- | --- | --- | --- |
| `--params` | `string` | no | — | — | extra LSP params as JSON, deep-merged over positional args + flags (for raw methods, the full params) |
| `--work-done-token` | `string` | no | — | — | work-done-token |

**Arguments:**
- `file` *(required)* — file path (relative to --root)
- `line:col` *(required)* — 1-based position, e.g. 12:7

### textDocument prepareRename

**Usage:**
```
[options] <file> <line:col>
```

| Flag | Type | Required | Default | Env | Description |
| --- | --- | --- | --- | --- | --- |
| `--params` | `string` | no | — | — | extra LSP params as JSON, deep-merged over positional args + flags (for raw methods, the full params) |
| `--work-done-token` | `string` | no | — | — | work-done-token |

**Arguments:**
- `file` *(required)* — file path (relative to --root)
- `line:col` *(required)* — 1-based position, e.g. 12:7

### textDocument prepareTypeHierarchy

**Usage:**
```
[options] <file> <line:col>
```

| Flag | Type | Required | Default | Env | Description |
| --- | --- | --- | --- | --- | --- |
| `--params` | `string` | no | — | — | extra LSP params as JSON, deep-merged over positional args + flags (for raw methods, the full params) |
| `--work-done-token` | `string` | no | — | — | work-done-token |

**Arguments:**
- `file` *(required)* — file path (relative to --root)
- `line:col` *(required)* — 1-based position, e.g. 12:7

### textDocument rangeFormatting

**Usage:**
```
[options] <file> <range>
```

| Flag | Type | Required | Default | Env | Description |
| --- | --- | --- | --- | --- | --- |
| `--params` | `string` | no | — | — | extra LSP params as JSON, deep-merged over positional args + flags (for raw methods, the full params) |
| `--work-done-token` | `string` | no | — | — | work-done-token |
| `--range-formatting-tab-size` | `string` | no | — | — | range-formatting-tab-size |
| `--range-formatting-insert-spaces` | `string` | no | — | — | range-formatting-insert-spaces |
| `--range-formatting-trim-trailing-whitespace` | `string` | no | — | — | range-formatting-trim-trailing-whitespace |
| `--range-formatting-insert-final-newline` | `string` | no | — | — | range-formatting-insert-final-newline |
| `--range-formatting-trim-final-newlines` | `string` | no | — | — | range-formatting-trim-final-newlines |

**Arguments:**
- `file` *(required)* — file path (relative to --root)
- `range` *(required)* — range as startLine:col-endLine:col, e.g. 2:1-4:5

### textDocument rangesFormatting

**Usage:**
```
[options] <file>
```

| Flag | Type | Required | Default | Env | Description |
| --- | --- | --- | --- | --- | --- |
| `--params` | `string` | no | — | — | extra LSP params as JSON, deep-merged over positional args + flags (for raw methods, the full params) |
| `--work-done-token` | `string` | no | — | — | work-done-token |
| `--ranges-formatting-tab-size` | `string` | no | — | — | ranges-formatting-tab-size |
| `--ranges-formatting-insert-spaces` | `string` | no | — | — | ranges-formatting-insert-spaces |
| `--ranges-formatting-trim-trailing-whitespace` | `string` | no | — | — | ranges-formatting-trim-trailing-whitespace |
| `--ranges-formatting-insert-final-newline` | `string` | no | — | — | ranges-formatting-insert-final-newline |
| `--ranges-formatting-trim-final-newlines` | `string` | no | — | — | ranges-formatting-trim-final-newlines |

**Arguments:**
- `file` *(required)* — file path (relative to --root)

### textDocument references

**Usage:**
```
[options] <file> <line:col>
```

| Flag | Type | Required | Default | Env | Description |
| --- | --- | --- | --- | --- | --- |
| `--params` | `string` | no | — | — | extra LSP params as JSON, deep-merged over positional args + flags (for raw methods, the full params) |
| `--work-done-token` | `string` | no | — | — | work-done-token |
| `--partial-result-token` | `string` | no | — | — | partial-result-token |
| `--references-include-declaration` | `string` | no | — | — | references-include-declaration |

**Arguments:**
- `file` *(required)* — file path (relative to --root)
- `line:col` *(required)* — 1-based position, e.g. 12:7

### textDocument rename

**Usage:**
```
[options] <file> <line:col> <newName>
```

| Flag | Type | Required | Default | Env | Description |
| --- | --- | --- | --- | --- | --- |
| `--params` | `string` | no | — | — | extra LSP params as JSON, deep-merged over positional args + flags (for raw methods, the full params) |
| `--work-done-token` | `string` | no | — | — | work-done-token |

**Arguments:**
- `file` *(required)* — file path (relative to --root)
- `line:col` *(required)* — 1-based position, e.g. 12:7
- `newName` *(required)* — new symbol name

### textDocument selectionRange

**Usage:**
```
[options] <file>
```

| Flag | Type | Required | Default | Env | Description |
| --- | --- | --- | --- | --- | --- |
| `--params` | `string` | no | — | — | extra LSP params as JSON, deep-merged over positional args + flags (for raw methods, the full params) |
| `--work-done-token` | `string` | no | — | — | work-done-token |
| `--partial-result-token` | `string` | no | — | — | partial-result-token |

**Arguments:**
- `file` *(required)* — file path (relative to --root)

### textDocument semanticTokens-full

**Usage:**
```
[options] <file>
```

| Flag | Type | Required | Default | Env | Description |
| --- | --- | --- | --- | --- | --- |
| `--params` | `string` | no | — | — | extra LSP params as JSON, deep-merged over positional args + flags (for raw methods, the full params) |
| `--work-done-token` | `string` | no | — | — | work-done-token |
| `--partial-result-token` | `string` | no | — | — | partial-result-token |

**Arguments:**
- `file` *(required)* — file path (relative to --root)

### textDocument semanticTokens-full-delta

**Usage:**
```
[options] <file>
```

| Flag | Type | Required | Default | Env | Description |
| --- | --- | --- | --- | --- | --- |
| `--params` | `string` | no | — | — | extra LSP params as JSON, deep-merged over positional args + flags (for raw methods, the full params) |
| `--work-done-token` | `string` | no | — | — | work-done-token |
| `--partial-result-token` | `string` | no | — | — | partial-result-token |
| `--previous-result-id` | `string` | no | — | — | previous-result-id |

**Arguments:**
- `file` *(required)* — file path (relative to --root)

### textDocument semanticTokens-range

**Usage:**
```
[options] <file> <range>
```

| Flag | Type | Required | Default | Env | Description |
| --- | --- | --- | --- | --- | --- |
| `--params` | `string` | no | — | — | extra LSP params as JSON, deep-merged over positional args + flags (for raw methods, the full params) |
| `--work-done-token` | `string` | no | — | — | work-done-token |
| `--partial-result-token` | `string` | no | — | — | partial-result-token |

**Arguments:**
- `file` *(required)* — file path (relative to --root)
- `range` *(required)* — range as startLine:col-endLine:col, e.g. 2:1-4:5

### textDocument signatureHelp

**Usage:**
```
[options] <file> <line:col>
```

| Flag | Type | Required | Default | Env | Description |
| --- | --- | --- | --- | --- | --- |
| `--params` | `string` | no | — | — | extra LSP params as JSON, deep-merged over positional args + flags (for raw methods, the full params) |
| `--work-done-token` | `string` | no | — | — | work-done-token |
| `--signature-help-trigger-kind` | `string` | no | — | — | signature-help-trigger-kind |
| `--signature-help-trigger-character` | `string` | no | — | — | signature-help-trigger-character |
| `--signature-help-is-retrigger` | `string` | no | — | — | signature-help-is-retrigger |

**Arguments:**
- `file` *(required)* — file path (relative to --root)
- `line:col` *(required)* — 1-based position, e.g. 12:7

### textDocument typeDefinition

**Usage:**
```
[options] <file> <line:col>
```

| Flag | Type | Required | Default | Env | Description |
| --- | --- | --- | --- | --- | --- |
| `--params` | `string` | no | — | — | extra LSP params as JSON, deep-merged over positional args + flags (for raw methods, the full params) |
| `--work-done-token` | `string` | no | — | — | work-done-token |
| `--partial-result-token` | `string` | no | — | — | partial-result-token |

**Arguments:**
- `file` *(required)* — file path (relative to --root)
- `line:col` *(required)* — 1-based position, e.g. 12:7

### textDocument willSaveWaitUntil

**Usage:**
```
[options] <file>
```

| Flag | Type | Required | Default | Env | Description |
| --- | --- | --- | --- | --- | --- |
| `--params` | `string` | no | — | — | extra LSP params as JSON, deep-merged over positional args + flags (for raw methods, the full params) |
| `--reason` | `string` | no | — | — | reason |

**Arguments:**
- `file` *(required)* — file path (relative to --root)

### workspace

workspace operations

**Usage:**
```
[options] [command]
```

### workspace diagnostic

**Usage:**
```
[options]
```

| Flag | Type | Required | Default | Env | Description |
| --- | --- | --- | --- | --- | --- |
| `--params` | `string` | no | — | — | extra LSP params as JSON, deep-merged over positional args + flags (for raw methods, the full params) |

### workspace executeCommand

**Usage:**
```
[options]
```

| Flag | Type | Required | Default | Env | Description |
| --- | --- | --- | --- | --- | --- |
| `--params` | `string` | no | — | — | extra LSP params as JSON, deep-merged over positional args + flags (for raw methods, the full params) |

### workspace symbol

**Usage:**
```
[options] <query>
```

| Flag | Type | Required | Default | Env | Description |
| --- | --- | --- | --- | --- | --- |
| `--params` | `string` | no | — | — | extra LSP params as JSON, deep-merged over positional args + flags (for raw methods, the full params) |
| `--work-done-token` | `string` | no | — | — | work-done-token |
| `--partial-result-token` | `string` | no | — | — | partial-result-token |

**Arguments:**
- `query` *(required)* — search query string

### workspace textDocumentContent

**Usage:**
```
[options]
```

| Flag | Type | Required | Default | Env | Description |
| --- | --- | --- | --- | --- | --- |
| `--params` | `string` | no | — | — | extra LSP params as JSON, deep-merged over positional args + flags (for raw methods, the full params) |

### workspace willCreateFiles

**Usage:**
```
[options]
```

| Flag | Type | Required | Default | Env | Description |
| --- | --- | --- | --- | --- | --- |
| `--params` | `string` | no | — | — | extra LSP params as JSON, deep-merged over positional args + flags (for raw methods, the full params) |

### workspace willDeleteFiles

**Usage:**
```
[options]
```

| Flag | Type | Required | Default | Env | Description |
| --- | --- | --- | --- | --- | --- |
| `--params` | `string` | no | — | — | extra LSP params as JSON, deep-merged over positional args + flags (for raw methods, the full params) |

### workspace willRenameFiles

**Usage:**
```
[options]
```

| Flag | Type | Required | Default | Env | Description |
| --- | --- | --- | --- | --- | --- |
| `--params` | `string` | no | — | — | extra LSP params as JSON, deep-merged over positional args + flags (for raw methods, the full params) |

### workspaceSymbol

workspaceSymbol operations

**Usage:**
```
[options] [command]
```

### workspaceSymbol resolve

**Usage:**
```
[options]
```

| Flag | Type | Required | Default | Env | Description |
| --- | --- | --- | --- | --- | --- |
| `--params` | `string` | no | — | — | extra LSP params as JSON, deep-merged over positional args + flags (for raw methods, the full params) |

### call

Send any LSP request by method name with raw JSON params

**Usage:**
```
[options] <method>
```

| Flag | Type | Required | Default | Env | Description |
| --- | --- | --- | --- | --- | --- |
| `--params` | `string` | no | — | — | LSP params as JSON |

**Arguments:**
- `method` *(required)*

### config

Read/write LSP server config across platforms (lsp.json, Copilot CLI, Claude Code, Codex; VS Code is detected-but-unsupported)

**Usage:**
```
[options] [command]
```

### config list

List detected platforms and their configured servers

**Usage:**
```
[options]
```

| Flag | Type | Required | Default | Env | Description |
| --- | --- | --- | --- | --- | --- |
| `--user` | `boolean` | no | — | — | User-level config (~/.claude/lsp.json) instead of project |

### config import

Import a platform's LSP servers into lsp.json

**Usage:**
```
[options] <platform>
```

| Flag | Type | Required | Default | Env | Description |
| --- | --- | --- | --- | --- | --- |
| `--user` | `boolean` | no | — | — | User-level config instead of project |

**Arguments:**
- `platform` *(required)*

### config export

Export lsp.json servers to a platform's native config

**Usage:**
```
[options] <platform>
```

| Flag | Type | Required | Default | Env | Description |
| --- | --- | --- | --- | --- | --- |
| `--user` | `boolean` | no | — | — | User-level config instead of project |

**Arguments:**
- `platform` *(required)*

### config diff

Diff lsp.json against a platform's config

**Usage:**
```
[options] <platform>
```

| Flag | Type | Required | Default | Env | Description |
| --- | --- | --- | --- | --- | --- |
| `--user` | `boolean` | no | — | — | User-level config instead of project |

**Arguments:**
- `platform` *(required)*

### daemon

Manage the per-root proxy daemon (otherwise starts lazily on first request)

**Usage:**
```
[options] [command]
```

### daemon start

Start the proxy daemon for --root (no-op if already running)

**Usage:**
```
[options]
```

### daemon stop

Stop the proxy daemon for --root

**Usage:**
```
[options]
```

### daemon status

Show daemon status for --root

**Usage:**
```
[options]
```

### status

Show configured language servers grouped by process, with location and config source

**Usage:**
```
[options]
```

## Documentation

- **Dynamic discovery model** — Depth-aware --help surface built from live server capabilities
- **Server discovery (lsp.json)** — lsp.json file format and walk-up resolution order
- **Config interop (lsproxy config)** — Multi-platform config bridge: lsp.json ↔ Copilot CLI, Claude Code, Codex
- **Global flags** — Flags available on every lsproxy command
- **Proxy daemon** — Background daemon for warm LSP connections (sub-100ms subsequent calls)
- **Programmatic use** — TypeScript API: RefactorSession, applyWorkspaceEdit, planWorkspaceEdit

See `references/docs/` for full guides (6 total).

## References

Load these on demand — do NOT read all at once:

- When using CLI commands → read `references/commands.md` for flags, arguments, and defaults
- When learning concepts or workflows → browse `references/docs/` by category

## Links

- [Repository](https://github.com/pradeepmouli/lspeasy.git)
- Author: Pradeep Mouli