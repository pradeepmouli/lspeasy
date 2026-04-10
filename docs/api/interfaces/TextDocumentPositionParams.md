[**lspeasy v1.0.0**](../README.md)

***

[lspeasy](../README.md) / TextDocumentPositionParams

# Interface: TextDocumentPositionParams

Defined in: node\_modules/.pnpm/vscode-languageserver-protocol@3.17.5/node\_modules/vscode-languageserver-protocol/lib/common/protocol.d.ts:240

A parameter literal used in requests to pass a text document and a position inside that
document.

## Extended by

- [`CompletionParams`](CompletionParams.md)
- [`HoverParams`](HoverParams.md)
- [`SignatureHelpParams`](SignatureHelpParams.md)
- [`DefinitionParams`](DefinitionParams.md)
- [`ReferenceParams`](ReferenceParams.md)
- [`DocumentHighlightParams`](DocumentHighlightParams.md)
- [`PrepareRenameParams`](PrepareRenameParams.md)
- [`ImplementationParams`](ImplementationParams.md)
- [`TypeDefinitionParams`](TypeDefinitionParams.md)
- [`DeclarationParams`](DeclarationParams.md)
- [`CallHierarchyPrepareParams`](CallHierarchyPrepareParams.md)
- [`LinkedEditingRangeParams`](LinkedEditingRangeParams.md)
- [`MonikerParams`](MonikerParams.md)

## Properties

### position

> **position**: [`Position`](Position.md)

Defined in: node\_modules/.pnpm/vscode-languageserver-protocol@3.17.5/node\_modules/vscode-languageserver-protocol/lib/common/protocol.d.ts:248

The position inside the text document.

***

### textDocument

> **textDocument**: [`TextDocumentIdentifier`](TextDocumentIdentifier.md)

Defined in: node\_modules/.pnpm/vscode-languageserver-protocol@3.17.5/node\_modules/vscode-languageserver-protocol/lib/common/protocol.d.ts:244

The text document.
