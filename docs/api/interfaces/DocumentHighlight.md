[**lspeasy v1.0.0**](../README.md)

***

[lspeasy](../README.md) / DocumentHighlight

# Interface: DocumentHighlight

Defined in: node\_modules/.pnpm/vscode-languageserver-types@3.17.5/node\_modules/vscode-languageserver-types/lib/esm/main.d.ts:1801

A document highlight is a range inside a text document which deserves
special attention. Usually a document highlight is visualized by changing
the background color of its range.

## Properties

### kind?

> `optional` **kind?**: [`DocumentHighlightKind`](../type-aliases/DocumentHighlightKind.md)

Defined in: node\_modules/.pnpm/vscode-languageserver-types@3.17.5/node\_modules/vscode-languageserver-types/lib/esm/main.d.ts:1809

The highlight kind, default is [text](../lspeasy/namespaces/DocumentHighlightKind/variables/Text.md).

***

### range

> **range**: [`Range`](Range.md)

Defined in: node\_modules/.pnpm/vscode-languageserver-types@3.17.5/node\_modules/vscode-languageserver-types/lib/esm/main.d.ts:1805

The range this highlight applies to.
