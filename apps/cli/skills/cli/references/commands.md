# Commands

## callHierarchy

callHierarchy operations

```
[options] [command]
```

## callHierarchy incomingCalls

```
[options]
```

### Options

#### --params

raw LSP params as JSON, overrides positional args

**Type:** `string`

## callHierarchy outgoingCalls

```
[options]
```

### Options

#### --params

raw LSP params as JSON, overrides positional args

**Type:** `string`

## codeAction

codeAction operations

```
[options] [command]
```

## codeAction resolve

```
[options]
```

### Options

#### --params

raw LSP params as JSON, overrides positional args

**Type:** `string`

## codeLens

codeLens operations

```
[options] [command]
```

## codeLens resolve

```
[options]
```

### Options

#### --params

raw LSP params as JSON, overrides positional args

**Type:** `string`

## completionItem

completionItem operations

```
[options] [command]
```

## completionItem resolve

```
[options]
```

### Options

#### --params

raw LSP params as JSON, overrides positional args

**Type:** `string`

## documentLink

documentLink operations

```
[options] [command]
```

## documentLink resolve

```
[options]
```

### Options

#### --params

raw LSP params as JSON, overrides positional args

**Type:** `string`

## inlayHint

inlayHint operations

```
[options] [command]
```

## inlayHint resolve

```
[options]
```

### Options

#### --params

raw LSP params as JSON, overrides positional args

**Type:** `string`

## textDocument

textDocument operations

```
[options] [command]
```

## textDocument codeAction

```
[options] <file> <range>
```

### Options

#### --params

raw LSP params as JSON, overrides positional args

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
[options] <file>
```

### Options

#### --params

raw LSP params as JSON, overrides positional args

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
[options] <file> <range>
```

### Options

#### --params

raw LSP params as JSON, overrides positional args

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
[options] <file> <line:col>
```

### Options

#### --params

raw LSP params as JSON, overrides positional args

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
[options] <file> <line:col>
```

### Options

#### --params

raw LSP params as JSON, overrides positional args

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
[options] <file> <line:col>
```

### Options

#### --params

raw LSP params as JSON, overrides positional args

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
[options] <file>
```

### Options

#### --params

raw LSP params as JSON, overrides positional args

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
[options] <file>
```

### Options

#### --params

raw LSP params as JSON, overrides positional args

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
[options] <file> <line:col>
```

### Options

#### --params

raw LSP params as JSON, overrides positional args

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
[options] <file>
```

### Options

#### --params

raw LSP params as JSON, overrides positional args

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
[options] <file>
```

### Options

#### --params

raw LSP params as JSON, overrides positional args

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
[options] <file>
```

### Options

#### --params

raw LSP params as JSON, overrides positional args

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
[options] <file>
```

### Options

#### --params

raw LSP params as JSON, overrides positional args

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
[options] <file> <line:col>
```

### Options

#### --params

raw LSP params as JSON, overrides positional args

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
[options] <file> <line:col>
```

### Options

#### --params

raw LSP params as JSON, overrides positional args

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
[options] <file> <range>
```

### Options

#### --params

raw LSP params as JSON, overrides positional args

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
[options] <file> <line:col>
```

### Options

#### --params

raw LSP params as JSON, overrides positional args

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
[options] <file> <range>
```

### Options

#### --params

raw LSP params as JSON, overrides positional args

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
[options] <file> <line:col>
```

### Options

#### --params

raw LSP params as JSON, overrides positional args

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
[options] <file> <line:col>
```

### Options

#### --params

raw LSP params as JSON, overrides positional args

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
[options] <file> <line:col>
```

### Options

#### --params

raw LSP params as JSON, overrides positional args

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
[options] <file> <line:col>
```

### Options

#### --params

raw LSP params as JSON, overrides positional args

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
[options] <file> <line:col>
```

### Options

#### --params

raw LSP params as JSON, overrides positional args

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
[options] <file> <line:col>
```

### Options

#### --params

raw LSP params as JSON, overrides positional args

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
[options] <file> <range>
```

### Options

#### --params

raw LSP params as JSON, overrides positional args

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
[options] <file>
```

### Options

#### --params

raw LSP params as JSON, overrides positional args

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
[options] <file> <line:col>
```

### Options

#### --params

raw LSP params as JSON, overrides positional args

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
[options] <file> <line:col> <newName>
```

### Options

#### --params

raw LSP params as JSON, overrides positional args

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
[options] <file>
```

### Options

#### --params

raw LSP params as JSON, overrides positional args

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
[options] <file>
```

### Options

#### --params

raw LSP params as JSON, overrides positional args

<!-- truncated -->
