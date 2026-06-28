# Commands

## config

Read/write LSP server config across platforms (lsp.json, Copilot CLI, Claude Code, Codex)

```
lsproxy config [options] [command]
```

### config list

List detected platforms and their configured servers

```
lsproxy config list [options]
```

#### Options

##### --user

User-level config (~/.claude/lsp.json) instead of project

**Type:** `boolean`

### config import

Import a platform's LSP servers into lsp.json

```
lsproxy config import [options] <platform>
```

#### Options

##### --user

User-level config instead of project

**Type:** `boolean`

#### Arguments

##### `platform`

**Required:** yes

### config export

Export lsp.json servers to a platform's native config

```
lsproxy config export [options] <platform>
```

#### Options

##### --user

User-level config instead of project

**Type:** `boolean`

#### Arguments

##### `platform`

**Required:** yes

### config diff

Diff lsp.json against a platform's config

```
lsproxy config diff [options] <platform>
```

#### Options

##### --user

User-level config instead of project

**Type:** `boolean`

#### Arguments

##### `platform`

**Required:** yes

## callHierarchy

callHierarchy operations

```
lsproxy callHierarchy [options] [command]
```

## codeAction

codeAction operations

```
lsproxy codeAction [options] [command]
```

### textDocument codeAction flags

When invoking `lsproxy textDocument codeAction`, the `context` object fields are
exposed as flags in addition to `--params <json>`:

| Flag | Type | Description |
| --- | --- | --- |
| `--code-action-only <items>` | string (comma-separated) | Filter by kind — valid values: `quickfix`, `refactor`, `refactor.extract`, `refactor.inline`, `refactor.move`, `refactor.rewrite`, `source`, `source.organizeImports`, `source.fixAll`, `notebook`, or any string |
| `--code-action-trigger-kind <value>` | `1` or `2` | Trigger kind: 1 = Invoked (user gesture), 2 = Automatic (on save / idle) |
| `--work-done-token <value>` | string | Progress token for work-done reporting |
| `--partial-result-token <value>` | string | Token for streaming partial results |

`context.diagnostics` (array of objects) must be supplied via `--params` if needed.

## codeLens

codeLens operations

```
lsproxy codeLens [options] [command]
```

## completionItem

completionItem operations

```
lsproxy completionItem [options] [command]
```

## documentLink

documentLink operations

```
lsproxy documentLink [options] [command]
```

## inlayHint

inlayHint operations

```
lsproxy inlayHint [options] [command]
```

## textDocument

textDocument operations

```
lsproxy textDocument [options] [command]
```

## workspace

workspace operations

```
lsproxy workspace [options] [command]
```

## workspaceSymbol

workspaceSymbol operations

```
lsproxy workspaceSymbol [options] [command]
```

## call

Send any LSP request by method name with raw JSON params

```
lsproxy call [options] <method>
```

### Options

#### --params

LSP params as JSON

**Type:** `string`

### Arguments

#### `method`

**Required:** yes
