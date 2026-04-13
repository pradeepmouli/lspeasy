[**lspeasy v1.0.0**](../README.md)

***

[lspeasy](../README.md) / DidSaveTextDocumentParams

# Interface: DidSaveTextDocumentParams

Defined in: node\_modules/.pnpm/vscode-languageserver-protocol@3.17.5/node\_modules/vscode-languageserver-protocol/lib/common/protocol.d.ts:1531

The parameters sent in a save text document notification

## Properties

### text?

> `optional` **text?**: `string`

Defined in: node\_modules/.pnpm/vscode-languageserver-protocol@3.17.5/node\_modules/vscode-languageserver-protocol/lib/common/protocol.d.ts:1540

Optional the content when saved. Depends on the includeText value
when the save notification was requested.

***

### textDocument

> **textDocument**: [`TextDocumentIdentifier`](TextDocumentIdentifier.md)

Defined in: node\_modules/.pnpm/vscode-languageserver-protocol@3.17.5/node\_modules/vscode-languageserver-protocol/lib/common/protocol.d.ts:1535

The document that was saved.
