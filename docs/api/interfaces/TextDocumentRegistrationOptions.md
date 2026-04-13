[**lspeasy v1.0.0**](../README.md)

***

[lspeasy](../README.md) / TextDocumentRegistrationOptions

# Interface: TextDocumentRegistrationOptions

Defined in: node\_modules/.pnpm/vscode-languageserver-protocol@3.17.5/node\_modules/vscode-languageserver-protocol/lib/common/protocol.d.ts:769

General text document registration options.

## Extended by

- [`TextDocumentChangeRegistrationOptions`](TextDocumentChangeRegistrationOptions.md)
- [`TextDocumentSaveRegistrationOptions`](TextDocumentSaveRegistrationOptions.md)
- [`CompletionRegistrationOptions`](CompletionRegistrationOptions.md)
- [`HoverRegistrationOptions`](HoverRegistrationOptions.md)
- [`SignatureHelpRegistrationOptions`](SignatureHelpRegistrationOptions.md)
- [`DefinitionRegistrationOptions`](DefinitionRegistrationOptions.md)
- [`ReferenceRegistrationOptions`](ReferenceRegistrationOptions.md)
- [`DocumentHighlightRegistrationOptions`](DocumentHighlightRegistrationOptions.md)
- [`DocumentSymbolRegistrationOptions`](DocumentSymbolRegistrationOptions.md)
- [`CodeActionRegistrationOptions`](CodeActionRegistrationOptions.md)
- [`CodeLensRegistrationOptions`](CodeLensRegistrationOptions.md)
- [`DocumentLinkRegistrationOptions`](DocumentLinkRegistrationOptions.md)
- [`DocumentFormattingRegistrationOptions`](DocumentFormattingRegistrationOptions.md)
- [`DocumentRangeFormattingRegistrationOptions`](DocumentRangeFormattingRegistrationOptions.md)
- [`DocumentOnTypeFormattingRegistrationOptions`](DocumentOnTypeFormattingRegistrationOptions.md)
- [`RenameRegistrationOptions`](RenameRegistrationOptions.md)
- [`ImplementationRegistrationOptions`](ImplementationRegistrationOptions.md)
- [`TypeDefinitionRegistrationOptions`](TypeDefinitionRegistrationOptions.md)
- [`DocumentColorRegistrationOptions`](DocumentColorRegistrationOptions.md)
- [`FoldingRangeRegistrationOptions`](FoldingRangeRegistrationOptions.md)
- [`DeclarationRegistrationOptions`](DeclarationRegistrationOptions.md)
- [`SelectionRangeRegistrationOptions`](SelectionRangeRegistrationOptions.md)
- [`CallHierarchyRegistrationOptions`](CallHierarchyRegistrationOptions.md)
- [`SemanticTokensRegistrationOptions`](SemanticTokensRegistrationOptions.md)
- [`LinkedEditingRangeRegistrationOptions`](LinkedEditingRangeRegistrationOptions.md)
- [`MonikerRegistrationOptions`](MonikerRegistrationOptions.md)

## Properties

### documentSelector

> **documentSelector**: [`DocumentSelector`](../type-aliases/DocumentSelector.md) \| `null`

Defined in: node\_modules/.pnpm/vscode-languageserver-protocol@3.17.5/node\_modules/vscode-languageserver-protocol/lib/common/protocol.d.ts:774

A document selector to identify the scope of the registration. If set to null
the document selector provided on the client side will be used.
