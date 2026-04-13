[**lspeasy v1.0.0**](../README.md)

***

[lspeasy](../README.md) / CodeLens

# Interface: CodeLens

Defined in: node\_modules/.pnpm/vscode-languageserver-types@3.17.5/node\_modules/vscode-languageserver-types/lib/esm/main.d.ts:2278

A code lens represents a [command](Command.md) that should be shown along with
source text, like the number of references, a way to run tests, etc.

A code lens is _unresolved_ when no command is associated to it. For performance
reasons the creation of a code lens and resolving should be done in two stages.

## Properties

### command?

> `optional` **command?**: [`Command`](Command.md)

Defined in: node\_modules/.pnpm/vscode-languageserver-types@3.17.5/node\_modules/vscode-languageserver-types/lib/esm/main.d.ts:2286

The command this code lens represents.

***

### data?

> `optional` **data?**: `any`

Defined in: node\_modules/.pnpm/vscode-languageserver-types@3.17.5/node\_modules/vscode-languageserver-types/lib/esm/main.d.ts:2291

A data entry field that is preserved on a code lens item between
a [CodeLensRequest](../lspeasy/namespaces/CodeLensRequest/README.md) and a [CodeLensResolveRequest](../lspeasy/namespaces/CodeLensResolveRequest/README.md)

***

### range

> **range**: [`Range`](Range.md)

Defined in: node\_modules/.pnpm/vscode-languageserver-types@3.17.5/node\_modules/vscode-languageserver-types/lib/esm/main.d.ts:2282

The range in which this code lens is valid. Should only span a single line.
