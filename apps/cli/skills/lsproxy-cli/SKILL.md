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
- **Multi-platform config interop** — `npx @lsproxy/cli config import/export/diff/list` bridges `lsp.json` with Copilot CLI, Claude Code, and Codex; `--user` targets `~/.claude/lsp.json` for user-level scope
- **Self-describing discovery** — bare `npx @lsproxy/cli` lists configured languages with live daemon status; `npx @lsproxy/cli --help <language> <namespace> <request>` shows parameter schema, flag list, and illustrative example input/output; add `--json` for machine-readable output for agents
- **Server visibility** — `npx @lsproxy/cli status` groups every configured server by process, showing its resolved binary location, config source (lsp.json, Claude Code, Codex, Copilot CLI), live connection status/uptime, and which languages it serves

## Quick Start

```bash
# Preview a rename before writing (always do this first)
npx @lsproxy/cli src/auth/login.ts textDocument rename --dry-run 42:15 "signIn"

# Find all references to a symbol
npx @lsproxy/cli src/auth/login.ts textDocument references 42:15

# List available code actions at a range, then apply the chosen one
npx @lsproxy/cli src/foo.ts textDocument codeAction 12:1-12:20

# Send any LSP method directly (useful for probing capabilities)
npx @lsproxy/cli typescript call workspace/executeCommand --params '{"command":"typescript.reloadProjects"}'
```

Positions are **1-based** (`line:col`, editor-style).
Write-side commands apply changes to disk automatically — use `--dry-run` to preview first.

## Troubleshooting

**Commands missing from `--help`** — npx @lsproxy/cli only registers commands for capabilities the
server actually advertises. If `textDocument rename` doesn't appear, the server doesn't
support `renameProvider`. Use `npx @lsproxy/cli <language-or-file> call initialize --params '{}'`
to inspect the server's capability response.

**Wrong positions** — Positions must be 1-based (`line:col`). Most editors display
1-based positions; LSP protocol is 0-based internally but npx @lsproxy/cli converts for you.
Passing 0-based values shifts edits by one line/column.

**Server not found** — Without `--server`, npx @lsproxy/cli walks up from `--root` looking for
`lsp.json`. If it can't find one it will time out. Either add `lsp.json` to the project
root or pass `--server <cmd>` explicitly.

**Write commands applied unexpectedly** — `rename`, `formatting`, and code actions that
produce edits write to disk immediately. Always run with `--dry-run` first on an
unfamiliar codebase.

**`references` returns only the declaration (or nothing)** — In a multi-package TypeScript
monorepo (especially with a solution-style root `tsconfig.json` that has `references` but no
`include`), `textDocument references` can come back with only the symbol's own declaration —
or an empty result — even when cross-file callers exist. This happens when the language
server has not loaded the full workspace project. npx @lsproxy/cli flags this case as `partial:true`
with a `warning` (and a stderr note) instead of a bare `ok:true`. Do not treat a
partial/empty result as "no callers" for a deletion or a file move; verify with a
build/type-check, or re-run against a warmed proxy daemon so the project is fully indexed.

## Commands

### callHierarchy

callHierarchy operations

**Usage:**
```
npx @lsproxy/cli callHierarchy [options] [command]
```

### callHierarchy incomingCalls

**Usage:**
```
npx @lsproxy/cli callHierarchy incomingCalls [options]
```

| Flag | Type | Required | Default | Env | Description |
| --- | --- | --- | --- | --- | --- |
| `--params` | `string` | no | — | — | extra LSP params as JSON, deep-merged over positional args + flags (for raw methods, the full params) |

### callHierarchy outgoingCalls

**Usage:**
```
npx @lsproxy/cli callHierarchy outgoingCalls [options]
```

| Flag | Type | Required | Default | Env | Description |
| --- | --- | --- | --- | --- | --- |
| `--params` | `string` | no | — | — | extra LSP params as JSON, deep-merged over positional args + flags (for raw methods, the full params) |

### codeAction

codeAction operations

**Usage:**
```
npx @lsproxy/cli codeAction [options] [command]
```

### codeAction resolve

**Usage:**
```
npx @lsproxy/cli codeAction resolve [options]
```

| Flag | Type | Required | Default | Env | Description |
| --- | --- | --- | --- | --- | --- |
| `--params` | `string` | no | — | — | extra LSP params as JSON, deep-merged over positional args + flags (for raw methods, the full params) |

### codeLens

codeLens operations

**Usage:**
```
npx @lsproxy/cli codeLens [options] [command]
```

### codeLens resolve

**Usage:**
```
npx @lsproxy/cli codeLens resolve [options]
```

| Flag | Type | Required | Default | Env | Description |
| --- | --- | --- | --- | --- | --- |
| `--params` | `string` | no | — | — | extra LSP params as JSON, deep-merged over positional args + flags (for raw methods, the full params) |

### completionItem

completionItem operations

**Usage:**
```
npx @lsproxy/cli completionItem [options] [command]
```

### completionItem resolve

**Usage:**
```
npx @lsproxy/cli completionItem resolve [options]
```

| Flag | Type | Required | Default | Env | Description |
| --- | --- | --- | --- | --- | --- |
| `--params` | `string` | no | — | — | extra LSP params as JSON, deep-merged over positional args + flags (for raw methods, the full params) |

### documentLink

documentLink operations

**Usage:**
```
npx @lsproxy/cli documentLink [options] [command]
```

### documentLink resolve

**Usage:**
```
npx @lsproxy/cli documentLink resolve [options]
```

| Flag | Type | Required | Default | Env | Description |
| --- | --- | --- | --- | --- | --- |
| `--params` | `string` | no | — | — | extra LSP params as JSON, deep-merged over positional args + flags (for raw methods, the full params) |

### inlayHint

inlayHint operations

**Usage:**
```
npx @lsproxy/cli inlayHint [options] [command]
```

### inlayHint resolve

**Usage:**
```
npx @lsproxy/cli inlayHint resolve [options]
```

| Flag | Type | Required | Default | Env | Description |
| --- | --- | --- | --- | --- | --- |
| `--params` | `string` | no | — | — | extra LSP params as JSON, deep-merged over positional args + flags (for raw methods, the full params) |

### textDocument

textDocument operations

**Usage:**
```
npx @lsproxy/cli textDocument [options] [command]
```

### textDocument codeAction

**Usage:**
```
npx @lsproxy/cli textDocument codeAction [options] <file> <range>
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
npx @lsproxy/cli textDocument codeLens [options] <file>
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
npx @lsproxy/cli textDocument colorPresentation [options] <file> <range>
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
npx @lsproxy/cli textDocument completion [options] <file> <line:col>
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
npx @lsproxy/cli textDocument declaration [options] <file> <line:col>
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
npx @lsproxy/cli textDocument definition [options] <file> <line:col>
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
npx @lsproxy/cli textDocument diagnostic [options] <file>
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
npx @lsproxy/cli textDocument documentColor [options] <file>
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
npx @lsproxy/cli textDocument documentHighlight [options] <file> <line:col>
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
npx @lsproxy/cli textDocument documentLink [options] <file>
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
npx @lsproxy/cli textDocument documentSymbol [options] <file>
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
npx @lsproxy/cli textDocument foldingRange [options] <file>
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
npx @lsproxy/cli textDocument formatting [options] <file>
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
npx @lsproxy/cli textDocument hover [options] <file> <line:col>
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
npx @lsproxy/cli textDocument implementation [options] <file> <line:col>
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
npx @lsproxy/cli textDocument inlayHint [options] <file> <range>
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
npx @lsproxy/cli textDocument inlineCompletion [options] <file> <line:col>
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
npx @lsproxy/cli textDocument inlineValue [options] <file> <range>
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
npx @lsproxy/cli textDocument linkedEditingRange [options] <file> <line:col>
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
npx @lsproxy/cli textDocument moniker [options] <file> <line:col>
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
npx @lsproxy/cli textDocument onTypeFormatting [options] <file> <line:col>
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
npx @lsproxy/cli textDocument prepareCallHierarchy [options] <file> <line:col>
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
npx @lsproxy/cli textDocument prepareRename [options] <file> <line:col>
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
npx @lsproxy/cli textDocument prepareTypeHierarchy [options] <file> <line:col>
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
npx @lsproxy/cli textDocument rangeFormatting [options] <file> <range>
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
npx @lsproxy/cli textDocument rangesFormatting [options] <file>
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
npx @lsproxy/cli textDocument references [options] <file> <line:col>
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
npx @lsproxy/cli textDocument rename [options] <file> <line:col> <newName>
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
npx @lsproxy/cli textDocument selectionRange [options] <file>
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
npx @lsproxy/cli textDocument semanticTokens-full [options] <file>
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
npx @lsproxy/cli textDocument semanticTokens-full-delta [options] <file>
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
npx @lsproxy/cli textDocument semanticTokens-range [options] <file> <range>
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
npx @lsproxy/cli textDocument signatureHelp [options] <file> <line:col>
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
npx @lsproxy/cli textDocument typeDefinition [options] <file> <line:col>
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
npx @lsproxy/cli textDocument willSaveWaitUntil [options] <file>
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
npx @lsproxy/cli workspace [options] [command]
```

### workspace diagnostic

**Usage:**
```
npx @lsproxy/cli workspace diagnostic [options]
```

| Flag | Type | Required | Default | Env | Description |
| --- | --- | --- | --- | --- | --- |
| `--params` | `string` | no | — | — | extra LSP params as JSON, deep-merged over positional args + flags (for raw methods, the full params) |

### workspace executeCommand

**Usage:**
```
npx @lsproxy/cli workspace executeCommand [options]
```

| Flag | Type | Required | Default | Env | Description |
| --- | --- | --- | --- | --- | --- |
| `--params` | `string` | no | — | — | extra LSP params as JSON, deep-merged over positional args + flags (for raw methods, the full params) |

### workspace symbol

**Usage:**
```
npx @lsproxy/cli workspace symbol [options] <query>
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
npx @lsproxy/cli workspace textDocumentContent [options]
```

| Flag | Type | Required | Default | Env | Description |
| --- | --- | --- | --- | --- | --- |
| `--params` | `string` | no | — | — | extra LSP params as JSON, deep-merged over positional args + flags (for raw methods, the full params) |

### workspace willCreateFiles

**Usage:**
```
npx @lsproxy/cli workspace willCreateFiles [options]
```

| Flag | Type | Required | Default | Env | Description |
| --- | --- | --- | --- | --- | --- |
| `--params` | `string` | no | — | — | extra LSP params as JSON, deep-merged over positional args + flags (for raw methods, the full params) |

### workspace willDeleteFiles

**Usage:**
```
npx @lsproxy/cli workspace willDeleteFiles [options]
```

| Flag | Type | Required | Default | Env | Description |
| --- | --- | --- | --- | --- | --- |
| `--params` | `string` | no | — | — | extra LSP params as JSON, deep-merged over positional args + flags (for raw methods, the full params) |

### workspace willRenameFiles

**Usage:**
```
npx @lsproxy/cli workspace willRenameFiles [options]
```

| Flag | Type | Required | Default | Env | Description |
| --- | --- | --- | --- | --- | --- |
| `--params` | `string` | no | — | — | extra LSP params as JSON, deep-merged over positional args + flags (for raw methods, the full params) |

### workspaceSymbol

workspaceSymbol operations

**Usage:**
```
npx @lsproxy/cli workspaceSymbol [options] [command]
```

### workspaceSymbol resolve

**Usage:**
```
npx @lsproxy/cli workspaceSymbol resolve [options]
```

| Flag | Type | Required | Default | Env | Description |
| --- | --- | --- | --- | --- | --- |
| `--params` | `string` | no | — | — | extra LSP params as JSON, deep-merged over positional args + flags (for raw methods, the full params) |

### call

Send any LSP request by method name with raw JSON params

**Usage:**
```
npx @lsproxy/cli call [options] <method>
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
npx @lsproxy/cli config [options] [command]
```

### config list

List detected platforms and their configured servers

**Usage:**
```
npx @lsproxy/cli config list [options]
```

| Flag | Type | Required | Default | Env | Description |
| --- | --- | --- | --- | --- | --- |
| `--user` | `boolean` | no | — | — | User-level config (~/.claude/lsp.json) instead of project |

### config import

Import a platform's LSP servers into lsp.json

**Usage:**
```
npx @lsproxy/cli config import [options] <platform>
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
npx @lsproxy/cli config export [options] <platform>
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
npx @lsproxy/cli config diff [options] <platform>
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
npx @lsproxy/cli daemon [options] [command]
```

### daemon start

Start the proxy daemon for --root (no-op if already running)

**Usage:**
```
npx @lsproxy/cli daemon start [options]
```

### daemon stop

Stop the proxy daemon for --root

**Usage:**
```
npx @lsproxy/cli daemon stop [options]
```

### daemon status

Show daemon status for --root

**Usage:**
```
npx @lsproxy/cli daemon status [options]
```

### status

Show configured language servers grouped by process, with location and config source

**Usage:**
```
npx @lsproxy/cli status [options]
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