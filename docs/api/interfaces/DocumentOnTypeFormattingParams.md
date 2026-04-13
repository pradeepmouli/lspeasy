[**lspeasy v1.0.0**](../README.md)

***

[lspeasy](../README.md) / DocumentOnTypeFormattingParams

# Interface: DocumentOnTypeFormattingParams

Defined in: node\_modules/.pnpm/vscode-languageserver-protocol@3.17.5/node\_modules/vscode-languageserver-protocol/lib/common/protocol.d.ts:2962

The parameters of a [DocumentOnTypeFormattingRequest](../lspeasy/namespaces/DocumentOnTypeFormattingRequest/README.md).

## Properties

### ch

> **ch**: `string`

Defined in: node\_modules/.pnpm/vscode-languageserver-protocol@3.17.5/node\_modules/vscode-languageserver-protocol/lib/common/protocol.d.ts:2979

The character that has been typed that triggered the formatting
on type request. That is not necessarily the last character that
got inserted into the document since the client could auto insert
characters as well (e.g. like automatic brace completion).

***

### options

> **options**: [`FormattingOptions`](FormattingOptions.md)

Defined in: node\_modules/.pnpm/vscode-languageserver-protocol@3.17.5/node\_modules/vscode-languageserver-protocol/lib/common/protocol.d.ts:2983

The formatting options.

***

### position

> **position**: [`Position`](Position.md)

Defined in: node\_modules/.pnpm/vscode-languageserver-protocol@3.17.5/node\_modules/vscode-languageserver-protocol/lib/common/protocol.d.ts:2972

The position around which the on type formatting should happen.
This is not necessarily the exact position where the character denoted
by the property `ch` got typed.

***

### textDocument

> **textDocument**: [`TextDocumentIdentifier`](TextDocumentIdentifier.md)

Defined in: node\_modules/.pnpm/vscode-languageserver-protocol@3.17.5/node\_modules/vscode-languageserver-protocol/lib/common/protocol.d.ts:2966

The document to format.
