---
description: "Standalone refactor CLI driving any LSP server: project-wide rename, file-move with importer updates, and move-symbol Also: lsp, language-server-protocol, refactor, rename, codemod, move-symbol, cli."
name: cli
---

# cli

Standalone refactor CLI driving any LSP server: project-wide rename, file-move with importer updates, and move-symbol

## Features

- **Semantic refactoring** — project-wide rename, move-file with importer updates, extract symbol
- **Reference tracking** — find all references, call hierarchy, workspace symbol search
- **Code actions** — list and apply quick-fixes and refactors at any range; filter by kind with `--code-action-only` or trigger-kind with `--code-action-trigger-kind` instead of writing raw `--params` JSON
- **Any LSP server** — TypeScript, Rust, Python, Go, or any LSP-compliant server via `lsp.json`
- **Proxy daemon** — warm server connections for sub-100ms subsequent invocations
- **Dry-run preview** — `--dry-run` prints diffs without writing; safe to inspect before committing
- **Multi-platform config interop** — `lsproxy config import/export/diff/list` bridges `lsp.json` with Copilot CLI, Claude Code, and Codex; `--user` targets `~/.claude/lsp.json` for user-level scope
- **Self-describing discovery** — bare `lsproxy` lists configured languages with live daemon status; `lsproxy --help <language> <namespace> <request>` shows parameter schema, flag list, and illustrative example input/output; add `--json` for machine-readable output for agents

## Quick Start

```bash
# Preview a rename before writing (always do this first)
lsproxy textDocument rename --dry-run src/auth/login.ts 42:15 "signIn"

# Find all references to a symbol
lsproxy textDocument references src/auth/login.ts 42:15

# List available code actions at a range, then apply the chosen one
lsproxy textDocument codeAction src/foo.ts 12:1-12:20

# Send any LSP method directly (useful for probing capabilities)
lsproxy call workspace/executeCommand --params '{"command":"typescript.reloadProjects"}'
```

Positions are **1-based** (`line:col`, editor-style).
Write-side commands apply changes to disk automatically — use `--dry-run` to preview first.

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
[options] [command]
```

### callHierarchy incomingCalls

**Usage:**
```
[options]
```

| Flag | Type | Required | Default | Env | Description |
| --- | --- | --- | --- | --- | --- |
| `--params` | `string` | no | — | — | raw LSP params as JSON, overrides positional args |

### callHierarchy outgoingCalls

**Usage:**
```
[options]
```

| Flag | Type | Required | Default | Env | Description |
| --- | --- | --- | --- | --- | --- |
| `--params` | `string` | no | — | — | raw LSP params as JSON, overrides positional args |

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
| `--params` | `string` | no | — | — | raw LSP params as JSON, overrides positional args |

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
| `--params` | `string` | no | — | — | raw LSP params as JSON, overrides positional args |

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
| `--params` | `string` | no | — | — | raw LSP params as JSON, overrides positional args |

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
| `--params` | `string` | no | — | — | raw LSP params as JSON, overrides positional args |

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
| `--params` | `string` | no | — | — | raw LSP params as JSON, overrides positional args |

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
| `--params` | `string` | no | — | — | raw LSP params as JSON, overrides positional args |
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
| `--params` | `string` | no | — | — | raw LSP params as JSON, overrides positional args |
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
| `--params` | `string` | no | — | — | raw LSP params as JSON, overrides positional args |
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
| `--params` | `string` | no | — | — | raw LSP params as JSON, overrides positional args |
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
| `--params` | `string` | no | — | — | raw LSP params as JSON, overrides positional args |
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
| `--params` | `string` | no | — | — | raw LSP params as JSON, overrides positional args |
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
| `--params` | `string` | no | — | — | raw LSP params as JSON, overrides positional args |
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
| `--params` | `string` | no | — | — | raw LSP params as JSON, overrides positional args |
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
| `--params` | `string` | no | — | — | raw LSP params as JSON, overrides positional args |
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
| `--params` | `string` | no | — | — | raw LSP params as JSON, overrides positional args |
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
| `--params` | `string` | no | — | — | raw LSP params as JSON, overrides positional args |
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
| `--params` | `string` | no | — | — | raw LSP params as JSON, overrides positional args |
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
| `--params` | `string` | no | — | — | raw LSP params as JSON, overrides positional args |
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
| `--params` | `string` | no | — | — | raw LSP params as JSON, overrides positional args |
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
| `--params` | `string` | no | — | — | raw LSP params as JSON, overrides positional args |
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
| `--params` | `string` | no | — | — | raw LSP params as JSON, overrides positional args |
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
| `--params` | `string` | no | — | — | raw LSP params as JSON, overrides positional args |
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
| `--params` | `string` | no | — | — | raw LSP params as JSON, overrides positional args |
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
| `--params` | `string` | no | — | — | raw LSP params as JSON, overrides positional args |
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
| `--params` | `string` | no | — | — | raw LSP params as JSON, overrides positional args |
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
| `--params` | `string` | no | — | — | raw LSP params as JSON, overrides positional args |
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
| `--params` | `string` | no | — | — | raw LSP params as JSON, overrides positional args |
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
| `--params` | `string` | no | — | — | raw LSP params as JSON, overrides positional args |
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
| `--params` | `string` | no | — | — | raw LSP params as JSON, overrides positional args |
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
| `--params` | `string` | no | — | — | raw LSP params as JSON, overrides positional args |
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
| `--params` | `string` | no | — | — | raw LSP params as JSON, overrides positional args |
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
| `--params` | `string` | no | — | — | raw LSP params as JSON, overrides positional args |
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
| `--params` | `string` | no | — | — | raw LSP params as JSON, overrides positional args |
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
| `--params` | `string` | no | — | — | raw LSP params as JSON, overrides positional args |
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
| `--params` | `string` | no | — | — | raw LSP params as JSON, overrides positional args |
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
| `--params` | `string` | no | — | — | raw LSP params as JSON, overrides positional args |
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
| `--params` | `string` | no | — | — | raw LSP params as JSON, overrides positional args |
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
| `--params` | `string` | no | — | — | raw LSP params as JSON, overrides positional args |
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
| `--params` | `string` | no | — | — | raw LSP params as JSON, overrides positional args |
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
| `--params` | `string` | no | — | — | raw LSP params as JSON, overrides positional args |
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
| `--params` | `string` | no | — | — | raw LSP params as JSON, overrides positional args |

### workspace executeCommand

**Usage:**
```
[options]
```

| Flag | Type | Required | Default | Env | Description |
| --- | --- | --- | --- | --- | --- |
| `--params` | `string` | no | — | — | raw LSP params as JSON, overrides positional args |

### workspace symbol

**Usage:**
```
[options] <query>
```

| Flag | Type | Required | Default | Env | Description |
| --- | --- | --- | --- | --- | --- |
| `--params` | `string` | no | — | — | raw LSP params as JSON, overrides positional args |
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
| `--params` | `string` | no | — | — | raw LSP params as JSON, overrides positional args |

### workspace willCreateFiles

**Usage:**
```
[options]
```

| Flag | Type | Required | Default | Env | Description |
| --- | --- | --- | --- | --- | --- |
| `--params` | `string` | no | — | — | raw LSP params as JSON, overrides positional args |

### workspace willDeleteFiles

**Usage:**
```
[options]
```

| Flag | Type | Required | Default | Env | Description |
| --- | --- | --- | --- | --- | --- |
| `--params` | `string` | no | — | — | raw LSP params as JSON, overrides positional args |

### workspace willRenameFiles

**Usage:**
```
[options]
```

| Flag | Type | Required | Default | Env | Description |
| --- | --- | --- | --- | --- | --- |
| `--params` | `string` | no | — | — | raw LSP params as JSON, overrides positional args |

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
| `--params` | `string` | no | — | — | raw LSP params as JSON, overrides positional args |

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

Read/write LSP server config across platforms (lsp.json, Copilot CLI, Claude Code, Codex)

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