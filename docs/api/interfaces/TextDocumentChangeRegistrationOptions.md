[**lspeasy v1.0.0**](../README.md)

***

[lspeasy](../README.md) / TextDocumentChangeRegistrationOptions

# Interface: TextDocumentChangeRegistrationOptions

Defined in: node\_modules/.pnpm/vscode-languageserver-protocol@3.17.5/node\_modules/vscode-languageserver-protocol/lib/common/protocol.d.ts:1490

Describe options to be used when registered for text document change events.

## Extends

- [`TextDocumentRegistrationOptions`](TextDocumentRegistrationOptions.md)

## Properties

### documentSelector

> **documentSelector**: [`DocumentSelector`](../type-aliases/DocumentSelector.md) \| `null`

Defined in: node\_modules/.pnpm/vscode-languageserver-protocol@3.17.5/node\_modules/vscode-languageserver-protocol/lib/common/protocol.d.ts:774

A document selector to identify the scope of the registration. If set to null
the document selector provided on the client side will be used.

#### Inherited from

[`TextDocumentRegistrationOptions`](TextDocumentRegistrationOptions.md).[`documentSelector`](TextDocumentRegistrationOptions.md#documentselector)

***

### syncKind

> **syncKind**: [`TextDocumentSyncKind`](../type-aliases/TextDocumentSyncKind.md)

Defined in: node\_modules/.pnpm/vscode-languageserver-protocol@3.17.5/node\_modules/vscode-languageserver-protocol/lib/common/protocol.d.ts:1494

How documents are synced to the server.
