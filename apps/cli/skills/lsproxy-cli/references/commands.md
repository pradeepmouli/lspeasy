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

<!-- truncated -->
