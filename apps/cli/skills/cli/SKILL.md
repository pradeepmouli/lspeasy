---
description: API reference for cli
name: cli
---

# cli

## Commands

### callHierarchy

callHierarchy operations

**Usage:**
```
[options] [command]
```

### codeAction

codeAction operations

**Usage:**
```
[options] [command]
```

### codeLens

codeLens operations

**Usage:**
```
[options] [command]
```

### completionItem

completionItem operations

**Usage:**
```
[options] [command]
```

### documentLink

documentLink operations

**Usage:**
```
[options] [command]
```

### inlayHint

inlayHint operations

**Usage:**
```
[options] [command]
```

### textDocument

textDocument operations

**Usage:**
```
[options] [command]
```

### workspace

workspace operations

**Usage:**
```
[options] [command]
```

### workspaceSymbol

workspaceSymbol operations

**Usage:**
```
[options] [command]
```

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

## References

Load these on demand — do NOT read all at once:

- When using CLI commands → read `references/commands.md` for flags, arguments, and defaults