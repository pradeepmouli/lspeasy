[**lspeasy v1.0.0**](../README.md)

***

[lspeasy](../README.md) / FileSystemWatcher

# Interface: FileSystemWatcher

Defined in: node\_modules/.pnpm/vscode-languageserver-protocol@3.17.5/node\_modules/vscode-languageserver-protocol/lib/common/protocol.d.ts:1722

## Properties

### globPattern

> **globPattern**: [`GlobPattern`](../type-aliases/GlobPattern.md)

Defined in: node\_modules/.pnpm/vscode-languageserver-protocol@3.17.5/node\_modules/vscode-languageserver-protocol/lib/common/protocol.d.ts:1728

The glob pattern to watch. See [glob pattern](../type-aliases/GlobPattern.md) for more detail.

#### Since

3.17.0 support for relative patterns.

***

### kind?

> `optional` **kind?**: `number`

Defined in: node\_modules/.pnpm/vscode-languageserver-protocol@3.17.5/node\_modules/vscode-languageserver-protocol/lib/common/protocol.d.ts:1734

The kind of events of interest. If omitted it defaults
to WatchKind.Create | WatchKind.Change | WatchKind.Delete
which is 7.
