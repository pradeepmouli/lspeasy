# Commands

## callHierarchy

callHierarchy operations

```
npx @lsproxy/cli callHierarchy [options] [command]
```

## callHierarchy incomingCalls

```
npx @lsproxy/cli callHierarchy incomingCalls [options]
```

### Options

#### --params

extra LSP params as JSON, deep-merged over positional args + flags (for raw methods, the full params)

**Type:** `string`

## callHierarchy outgoingCalls

```
npx @lsproxy/cli callHierarchy outgoingCalls [options]
```

### Options

#### --params

extra LSP params as JSON, deep-merged over positional args + flags (for raw methods, the full params)

**Type:** `string`

## codeAction

codeAction operations

```
npx @lsproxy/cli codeAction [options] [command]
```

## codeAction resolve

```
npx @lsproxy/cli codeAction resolve [options]
```

### Options

#### --params

extra LSP params as JSON, deep-merged over positional args + flags (for raw methods, the full params)

**Type:** `string`

## codeLens

codeLens operations

```
npx @lsproxy/cli codeLens [options] [command]
```

## codeLens resolve

```
npx @lsproxy/cli codeLens resolve [options]
```

### Options

#### --params

extra LSP params as JSON, deep-merged over positional args + flags (for raw methods, the full params)

**Type:** `string`

## completionItem

completionItem operations

```
npx @lsproxy/cli completionItem [options] [command]
```

## completionItem resolve

```
npx @lsproxy/cli completionItem resolve [options]
```

### Options

#### --params

extra LSP params as JSON, deep-merged over positional args + flags (for raw methods, the full params)

**Type:** `string`

## documentLink

documentLink operations

```
npx @lsproxy/cli documentLink [options] [command]
```

## documentLink resolve

```
npx @lsproxy/cli documentLink resolve [options]
```

### Options

#### --params

extra LSP params as JSON, deep-merged over positional args + flags (for raw methods, the full params)

**Type:** `string`

## inlayHint

inlayHint operations

```
npx @lsproxy/cli inlayHint [options] [command]
```

## inlayHint resolve

```
npx @lsproxy/cli inlayHint resolve [options]
```

### Options

#### --params

extra LSP params as JSON, deep-merged over positional args + flags (for raw methods, the full params)

**Type:** `string`

## textDocument

textDocument operations

```
npx @lsproxy/cli textDocument [options] [command]
```

## textDocument codeAction

```
npx @lsproxy/cli textDocument codeAction [options] <file> <range>
```

### Options

#### --params

extra LSP params as JSON, deep-merged over positional args + flags (for raw methods, the full params)

**Type:** `string`

#### --work-done-token

work-done-token

**Type:** `string`

#### --partial-result-token

partial-result-token

**Type:** `string`

#### --code-action-only

code-action-only (comma-separated)

**Type:** `string`

#### --code-action-trigger-kind

code-action-trigger-kind

**Type:** `string`

### Arguments

#### `file`

file path (relative to --root)

**Required:** yes

#### `range`

range as startLine:col-endLine:col, e.g. 2:1-4:5

**Required:** yes

## textDocument codeLens

```
npx @lsproxy/cli textDocument codeLens [options] <file>
```

### Options

#### --params

extra LSP params as JSON, deep-merged over positional args + flags (for raw methods, the full params)

**Type:** `string`

#### --work-done-token

work-done-token

**Type:** `string`

#### --partial-result-token

partial-result-token

**Type:** `string`

### Arguments

#### `file`

file path (relative to --root)

**Required:** yes

## textDocument colorPresentation

```
npx @lsproxy/cli textDocument colorPresentation [options] <file> <range>
```

### Options

#### --params

extra LSP params as JSON, deep-merged over positional args + flags (for raw methods, the full params)

**Type:** `string`

#### --work-done-token

work-done-token

**Type:** `string`

#### --partial-result-token

partial-result-token

**Type:** `string`

#### --color-presentation-color-red

color-presentation-color-red

**Type:** `string`

#### --color-presentation-color-green

color-presentation-color-green

**Type:** `string`

#### --color-presentation-color-blue

color-presentation-color-blue

**Type:** `string`

#### --color-presentation-color-alpha

color-presentation-color-alpha

**Type:** `string`

### Arguments

#### `file`

file path (relative to --root)

**Required:** yes

#### `range`

range as startLine:col-endLine:col, e.g. 2:1-4:5

**Required:** yes

## textDocument completion

```
npx @lsproxy/cli textDocument completion [options] <file> <line:col>
```

### Options

#### --params

extra LSP params as JSON, deep-merged over positional args + flags (for raw methods, the full params)

**Type:** `string`

#### --work-done-token

work-done-token

**Type:** `string`

#### --partial-result-token

partial-result-token

**Type:** `string`

#### --completion-trigger-kind

completion-trigger-kind

**Type:** `string`

#### --completion-trigger-character

completion-trigger-character

**Type:** `string`

### Arguments

#### `file`

file path (relative to --root)

**Required:** yes

#### `line:col`

1-based position, e.g. 12:7

**Required:** yes

## textDocument declaration

```
npx @lsproxy/cli textDocument declaration [options] <file> <line:col>
```

### Options

#### --params

extra LSP params as JSON, deep-merged over positional args + flags (for raw methods, the full params)

**Type:** `string`

#### --work-done-token

work-done-token

**Type:** `string`

#### --partial-result-token

partial-result-token

**Type:** `string`

### Arguments

#### `file`

file path (relative to --root)

**Required:** yes

#### `line:col`

1-based position, e.g. 12:7

**Required:** yes

## textDocument definition

```
npx @lsproxy/cli textDocument definition [options] <file> <line:col>
```

### Options

#### --params

extra LSP params as JSON, deep-merged over positional args + flags (for raw methods, the full params)

**Type:** `string`

#### --work-done-token

work-done-token

**Type:** `string`

#### --partial-result-token

partial-result-token

**Type:** `string`

### Arguments

#### `file`

file path (relative to --root)

**Required:** yes

#### `line:col`

1-based position, e.g. 12:7

**Required:** yes

## textDocument diagnostic

```
npx @lsproxy/cli textDocument diagnostic [options] <file>
```

### Options

#### --params

extra LSP params as JSON, deep-merged over positional args + flags (for raw methods, the full params)

**Type:** `string`

#### --work-done-token

work-done-token

**Type:** `string`

#### --partial-result-token

partial-result-token

**Type:** `string`

#### --identifier

identifier

**Type:** `string`

#### --previous-result-id

previous-result-id

**Type:** `string`

### Arguments

#### `file`

file path (relative to --root)

**Required:** yes

## textDocument documentColor

```
npx @lsproxy/cli textDocument documentColor [options] <file>
```

### Options

#### --params

extra LSP params as JSON, deep-merged over positional args + flags (for raw methods, the full params)

**Type:** `string`

#### --work-done-token

work-done-token

**Type:** `string`

#### --partial-result-token

partial-result-token

**Type:** `string`

### Arguments

#### `file`

file path (relative to --root)

**Required:** yes

## textDocument documentHighlight

```
npx @lsproxy/cli textDocument documentHighlight [options] <file> <line:col>
```

### Options

#### --params

extra LSP params as JSON, deep-merged over positional args + flags (for raw methods, the full params)

**Type:** `string`

#### --work-done-token

work-done-token

**Type:** `string`

#### --partial-result-token

partial-result-token

**Type:** `string`

### Arguments

#### `file`

file path (relative to --root)

**Required:** yes

#### `line:col`

1-based position, e.g. 12:7

**Required:** yes

## textDocument documentLink

```
npx @lsproxy/cli textDocument documentLink [options] <file>
```

### Options

#### --params

extra LSP params as JSON, deep-merged over positional args + flags (for raw methods, the full params)

**Type:** `string`

#### --work-done-token

work-done-token

**Type:** `string`

#### --partial-result-token

partial-result-token

**Type:** `string`

### Arguments

#### `file`

file path (relative to --root)

**Required:** yes

## textDocument documentSymbol

```
npx @lsproxy/cli textDocument documentSymbol [options] <file>
```

### Options

#### --params

extra LSP params as JSON, deep-merged over positional args + flags (for raw methods, the full params)

**Type:** `string`

#### --work-done-token

work-done-token

**Type:** `string`

#### --partial-result-token

partial-result-token

**Type:** `string`

### Arguments

#### `file`

file path (relative to --root)

**Required:** yes

## textDocument foldingRange

```
npx @lsproxy/cli textDocument foldingRange [options] <file>
```

### Options

#### --params

extra LSP params as JSON, deep-merged over positional args + flags (for raw methods, the full params)

**Type:** `string`

#### --work-done-token

work-done-token

**Type:** `string`

#### --partial-result-token

partial-result-token

**Type:** `string`

### Arguments

#### `file`

file path (relative to --root)

**Required:** yes

## textDocument formatting

```
npx @lsproxy/cli textDocument formatting [options] <file>
```

### Options

#### --params

extra LSP params as JSON, deep-merged over positional args + flags (for raw methods, the full params)

**Type:** `string`

#### --work-done-token

work-done-token

**Type:** `string`

#### --formatting-tab-size

formatting-tab-size

**Type:** `string`

#### --formatting-insert-spaces

formatting-insert-spaces

**Type:** `string`

#### --formatting-trim-trailing-whitespace

formatting-trim-trailing-whitespace

**Type:** `string`

#### --formatting-insert-final-newline

formatting-insert-final-newline

**Type:** `string`

#### --formatting-trim-final-newlines

formatting-trim-final-newlines

**Type:** `string`

### Arguments

#### `file`

file path (relative to --root)

**Required:** yes

## textDocument hover

```
npx @lsproxy/cli textDocument hover [options] <file> <line:col>
```

### Options

#### --params

extra LSP params as JSON, deep-merged over positional args + flags (for raw methods, the full params)

**Type:** `string`

#### --work-done-token

work-done-token

**Type:** `string`

### Arguments

#### `file`

file path (relative to --root)

**Required:** yes

#### `line:col`

1-based position, e.g. 12:7

**Required:** yes

## textDocument implementation

```
npx @lsproxy/cli textDocument implementation [options] <file> <line:col>
```

### Options

#### --params

extra LSP params as JSON, deep-merged over positional args + flags (for raw methods, the full params)

**Type:** `string`

#### --work-done-token

work-done-token

**Type:** `string`

#### --partial-result-token

partial-result-token

**Type:** `string`

### Arguments

#### `file`

file path (relative to --root)

**Required:** yes

#### `line:col`

1-based position, e.g. 12:7

**Required:** yes

## textDocument inlayHint

```
npx @lsproxy/cli textDocument inlayHint [options] <file> <range>
```

### Options

#### --params

extra LSP params as JSON, deep-merged over positional args + flags (for raw methods, the full params)

**Type:** `string`

#### --work-done-token

work-done-token

**Type:** `string`

### Arguments

#### `file`

file path (relative to --root)

**Required:** yes

#### `range`

range as startLine:col-endLine:col, e.g. 2:1-4:5

**Required:** yes

## textDocument inlineCompletion

```
npx @lsproxy/cli textDocument inlineCompletion [options] <file> <line:col>
```

### Options

#### --params

extra LSP params as JSON, deep-merged over positional args + flags (for raw methods, the full params)

**Type:** `string`

#### --work-done-token

work-done-token

**Type:** `string`

#### --inline-completion-trigger-kind

inline-completion-trigger-kind

**Type:** `string`

### Arguments

#### `file`

file path (relative to --root)

**Required:** yes

#### `line:col`

1-based position, e.g. 12:7

**Required:** yes

## textDocument inlineValue

```
npx @lsproxy/cli textDocument inlineValue [options] <file> <range>
```

### Options

#### --params

extra LSP params as JSON, deep-merged over positional args + flags (for raw methods, the full params)

**Type:** `string`

#### --work-done-token

work-done-token

**Type:** `string`

#### --inline-value-frame-id

inline-value-frame-id

**Type:** `string`

### Arguments

#### `file`

file path (relative to --root)

**Required:** yes

#### `range`

range as startLine:col-endLine:col, e.g. 2:1-4:5

**Required:** yes

## textDocument linkedEditingRange

```
npx @lsproxy/cli textDocument linkedEditingRange [options] <file> <line:col>
```

### Options

#### --params

extra LSP params as JSON, deep-merged over positional args + flags (for raw methods, the full params)

**Type:** `string`

#### --work-done-token

work-done-token

**Type:** `string`

### Arguments

#### `file`

file path (relative to --root)

**Required:** yes

#### `line:col`

1-based position, e.g. 12:7

**Required:** yes

## textDocument moniker

```
npx @lsproxy/cli textDocument moniker [options] <file> <line:col>
```

### Options

#### --params

extra LSP params as JSON, deep-merged over positional args + flags (for raw methods, the full params)

**Type:** `string`

#### --work-done-token

work-done-token

**Type:** `string`

#### --partial-result-token

partial-result-token

**Type:** `string`

### Arguments

#### `file`

file path (relative to --root)

**Required:** yes

#### `line:col`

1-based position, e.g. 12:7

**Required:** yes

## textDocument onTypeFormatting

```
npx @lsproxy/cli textDocument onTypeFormatting [options] <file> <line:col>
```

### Options

#### --params

extra LSP params as JSON, deep-merged over positional args + flags (for raw methods, the full params)

**Type:** `string`

#### --ch

ch

**Type:** `string`

#### --on-type-formatting-tab-size

on-type-formatting-tab-size

**Type:** `string`

#### --on-type-formatting-insert-spaces

on-type-formatting-insert-spaces

**Type:** `string`

#### --on-type-formatting-trim-trailing-whitespace

on-type-formatting-trim-trailing-whitespace

**Type:** `string`

#### --on-type-formatting-insert-final-newline

on-type-formatting-insert-final-newline

**Type:** `string`

#### --on-type-formatting-trim-final-newlines

on-type-formatting-trim-final-newlines

**Type:** `string`

### Arguments

#### `file`

file path (relative to --root)

**Required:** yes

#### `line:col`

1-based position, e.g. 12:7

**Required:** yes

## textDocument prepareCallHierarchy

```
npx @lsproxy/cli textDocument prepareCallHierarchy [options] <file> <line:col>
```

### Options

#### --params

extra LSP params as JSON, deep-merged over positional args + flags (for raw methods, the full params)

**Type:** `string`

#### --work-done-token

work-done-token

**Type:** `string`

### Arguments

#### `file`

file path (relative to --root)

**Required:** yes

#### `line:col`

1-based position, e.g. 12:7

**Required:** yes

## textDocument prepareRename

```
npx @lsproxy/cli textDocument prepareRename [options] <file> <line:col>
```

### Options

#### --params

extra LSP params as JSON, deep-merged over positional args + flags (for raw methods, the full params)

**Type:** `string`

#### --work-done-token

work-done-token

**Type:** `string`

### Arguments

#### `file`

file path (relative to --root)

**Required:** yes

#### `line:col`

1-based position, e.g. 12:7

**Required:** yes

## textDocument prepareTypeHierarchy

```
npx @lsproxy/cli textDocument prepareTypeHierarchy [options] <file> <line:col>
```

### Options

#### --params

extra LSP params as JSON, deep-merged over positional args + flags (for raw methods, the full params)

**Type:** `string`

#### --work-done-token

work-done-token

**Type:** `string`

### Arguments

#### `file`

file path (relative to --root)

**Required:** yes

#### `line:col`

1-based position, e.g. 12:7

**Required:** yes

## textDocument rangeFormatting

```
npx @lsproxy/cli textDocument rangeFormatting [options] <file> <range>
```

### Options

#### --params

extra LSP params as JSON, deep-merged over positional args + flags (for raw methods, the full params)

**Type:** `string`

#### --work-done-token

work-done-token

**Type:** `string`

#### --range-formatting-tab-size

range-formatting-tab-size

**Type:** `string`

#### --range-formatting-insert-spaces

range-formatting-insert-spaces

**Type:** `string`

#### --range-formatting-trim-trailing-whitespace

range-formatting-trim-trailing-whitespace

**Type:** `string`

#### --range-formatting-insert-final-newline

range-formatting-insert-final-newline

**Type:** `string`

#### --range-formatting-trim-final-newlines

range-formatting-trim-final-newlines

**Type:** `string`

### Arguments

#### `file`

file path (relative to --root)

**Required:** yes

#### `range`

range as startLine:col-endLine:col, e.g. 2:1-4:5

**Required:** yes

## textDocument rangesFormatting

```
npx @lsproxy/cli textDocument rangesFormatting [options] <file>
```

### Options

#### --params

extra LSP params as JSON, deep-merged over positional args + flags (for raw methods, the full params)

**Type:** `string`

#### --work-done-token

work-done-token

**Type:** `string`

#### --ranges-formatting-tab-size

ranges-formatting-tab-size

**Type:** `string`

#### --ranges-formatting-insert-spaces

ranges-formatting-insert-spaces

**Type:** `string`

#### --ranges-formatting-trim-trailing-whitespace

ranges-formatting-trim-trailing-whitespace

**Type:** `string`

#### --ranges-formatting-insert-final-newline

ranges-formatting-insert-final-newline

**Type:** `string`

#### --ranges-formatting-trim-final-newlines

ranges-formatting-trim-final-newlines

**Type:** `string`

### Arguments

#### `file`

file path (relative to --root)

**Required:** yes

## textDocument references

```
npx @lsproxy/cli textDocument references [options] <file> <line:col>
```

### Options

#### --params

extra LSP params as JSON, deep-merged over positional args + flags (for raw methods, the full params)

**Type:** `string`

#### --work-done-token

work-done-token

**Type:** `string`

#### --partial-result-token

partial-result-token

**Type:** `string`

#### --references-include-declaration

references-include-declaration

**Type:** `string`

### Arguments

#### `file`

file path (relative to --root)

**Required:** yes

#### `line:col`

1-based position, e.g. 12:7

**Required:** yes

## textDocument rename

```
npx @lsproxy/cli textDocument rename [options] <file> <line:col> <newName>
```

### Options

#### --params

extra LSP params as JSON, deep-merged over positional args + flags (for raw methods, the full params)

**Type:** `string`

#### --work-done-token

work-done-token

**Type:** `string`

### Arguments

#### `file`

file path (relative to --root)

**Required:** yes

#### `line:col`

1-based position, e.g. 12:7

**Required:** yes

#### `newName`

new symbol name

**Required:** yes

## textDocument selectionRange

```
npx @lsproxy/cli textDocument selectionRange [options] <file>
```

### Options

#### --params

extra LSP params as JSON, deep-merged over positional args + flags (for raw methods, the full params)

**Type:** `string`

#### --work-done-token

work-done-token

**Type:** `string`

#### --partial-result-token

partial-result-token

**Type:** `string`

### Arguments

#### `file`

file path (relative to --root)

**Required:** yes

## textDocument semanticTokens-full

```
npx @lsproxy/cli textDocument semanticTokens-full [options] <file>
```

### Options

#### --params

extra LSP params as JSON, deep-merged over positional args + flags (for raw methods, the full params)

**Type:** `string`

#### --work-done-token

work-done-token

**Type:** `string`

#### --partial-result-token

partial-result-token

**Type:** `string`

### Arguments

#### `file`

file path (relative to --root)

**Required:** yes

## textDocument semanticTokens-full-delta

```
npx @lsproxy/cli textDocument semanticTokens-full-delta [options] <file>
```

### Options

#### --params

extra LSP params as JSON, deep-merged over positional args + flags (for raw methods, the full params)

**Type:** `string`

#### --work-done-token

work-done-token

**Type:** `string`

#### --partial-result-token

partial-result-token

**Type:** `string`

#### --previous-result-id

previous-result-id

**Type:** `string`

### Arguments

#### `file`

file path (relative to --root)

**Required:** yes

## textDocument semanticTokens-range

```
npx @lsproxy/cli textDocument semanticTokens-range [options] <file> <range>
```

### Options

#### --params

extra LSP params as JSON, deep-merged over positional args + flags (for raw methods, the full params)

**Type:** `string`

#### --work-done-token

work-done-token

**Type:** `string`

#### --partial-result-token

partial-result-token

**Type:** `string`

### Arguments

#### `file`

file path (relative to --root)

**Required:** yes

#### `range`

range as startLine:col-endLine:col, e.g. 2:1-4:5

**Required:** yes

## textDocument signatureHelp

```
npx @lsproxy/cli textDocument signatureHelp [options] <file> <line:col>
```

### Options

#### --params

extra LSP params as JSON, deep-merged over positional args + flags (for raw methods, the full params)

**Type:** `string`

#### --work-done-token

work-done-token

**Type:** `string`

#### --signature-help-trigger-kind

signature-help-trigger-kind

**Type:** `string`

#### --signature-help-trigger-character

signature-help-trigger-character

**Type:** `string`

#### --signature-help-is-retrigger

signature-help-is-retrigger

**Type:** `string`

### Arguments

#### `file`

file path (relative to --root)

**Required:** yes

#### `line:col`

1-based position, e.g. 12:7

**Required:** yes

## textDocument typeDefinition

```
npx @lsproxy/cli textDocument typeDefinition [options] <file> <line:col>
```

### Options

#### --params

extra LSP params as JSON, deep-merged over positional args + flags (for raw methods, the full params)

**Type:** `string`

#### --work-done-token

work-done-token

**Type:** `string`

#### --partial-result-token

partial-result-token

**Type:** `string`

### Arguments

#### `file`

file path (relative to --root)

**Required:** yes

#### `line:col`

1-based position, e.g. 12:7

**Required:** yes

## textDocument willSaveWaitUntil

```
npx @lsproxy/cli textDocument willSaveWaitUntil [options] <file>
```

### Options

#### --params

extra LSP params as JSON, deep-merged over positional args + flags (for raw methods, the full params)

**Type:** `string`

#### --reason

reason

**Type:** `string`

### Arguments

#### `file`

file path (relative to --root)

**Required:** yes

## workspace

workspace operations

```
npx @lsproxy/cli workspace [options] [command]
```

## workspace diagnostic

```
npx @lsproxy/cli workspace diagnostic [options]
```

### Options

#### --params

extra LSP params as JSON, deep-merged over positional args + flags (for raw methods, the full params)

**Type:** `string`

## workspace executeCommand

```
npx @lsproxy/cli workspace executeCommand [options]
```

### Options

#### --params

extra LSP params as JSON, deep-merged over positional args + flags (for raw methods, the full params)

**Type:** `string`

## workspace symbol

```
npx @lsproxy/cli workspace symbol [options] <query>
```

### Options

#### --params

extra LSP params as JSON, deep-merged over positional args + flags (for raw methods, the full params)

**Type:** `string`

#### --work-done-token

work-done-token

**Type:** `string`

#### --partial-result-token

partial-result-token

**Type:** `string`

### Arguments

#### `query`

search query string

**Required:** yes

## workspace textDocumentContent

```
npx @lsproxy/cli workspace textDocumentContent [options]
```

### Options

#### --params

extra LSP params as JSON, deep-merged over positional args + flags (for raw methods, the full params)

**Type:** `string`

## workspace willCreateFiles

```
npx @lsproxy/cli workspace willCreateFiles [options]
```

### Options

#### --params

extra LSP params as JSON, deep-merged over positional args + flags (for raw methods, the full params)

**Type:** `string`

## workspace willDeleteFiles

```
npx @lsproxy/cli workspace willDeleteFiles [options]
```

### Options

#### --params

extra LSP params as JSON, deep-merged over positional args + flags (for raw methods, the full params)

**Type:** `string`

## workspace willRenameFiles

```
npx @lsproxy/cli workspace willRenameFiles [options]
```

### Options

#### --params

extra LSP params as JSON, deep-merged over positional args + flags (for raw methods, the full params)

**Type:** `string`

## workspaceSymbol

workspaceSymbol operations

```
npx @lsproxy/cli workspaceSymbol [options] [command]
```

## workspaceSymbol resolve

```
npx @lsproxy/cli workspaceSymbol resolve [options]
```

### Options

#### --params

extra LSP params as JSON, deep-merged over positional args + flags (for raw methods, the full params)

**Type:** `string`

## call

Send any LSP request by method name with raw JSON params

```
npx @lsproxy/cli call [options] <method>
```

### Options

#### --params

LSP params as JSON

**Type:** `string`

### Arguments

#### `method`

**Required:** yes

## config

Read/write LSP server config across platforms (lsp.json, Copilot CLI, Claude Code, Codex; VS Code is detected-but-unsupported)

```
npx @lsproxy/cli config [options] [command]
```

## config list

List detected platforms and their configured servers

```
npx @lsproxy/cli config list [options]
```

### Options

#### --user

User-level config (~/.claude/lsp.json) instead of project

**Type:** `boolean`

## config import

Import a platform's LSP servers into lsp.json

```
npx @lsproxy/cli config import [options] <platform>
```

### Options

#### --user

User-level config instead of project

**Type:** `boolean`

### Arguments

#### `platform`

**Required:** yes

## config export

Export lsp.json servers to a platform's native config

```
npx @lsproxy/cli config export [options] <platform>
```

### Options

#### --user

User-level config instead of project

**Type:** `boolean`

### Arguments

#### `platform`

**Required:** yes

## config diff

Diff lsp.json against a platform's config

```
npx @lsproxy/cli config diff [options] <platform>
```

### Options

#### --user

User-level config instead of project

**Type:** `boolean`

### Arguments

#### `platform`

**Required:** yes

## daemon

Manage the per-root proxy daemon (otherwise starts lazily on first request)

```
npx @lsproxy/cli daemon [options] [command]
```

## daemon start

Start the proxy daemon for --root (no-op if already running)

```
npx @lsproxy/cli daemon start [options]
```

## daemon stop

Stop the proxy daemon for --root

```
npx @lsproxy/cli daemon stop [options]
```

## daemon status

Show daemon status for --root

```
npx @lsproxy/cli daemon status [options]
```

## status

Show configured language servers grouped by process, with location and config source

```
npx @lsproxy/cli status [options]
```