[**lspeasy v1.0.0**](../README.md)

***

[lspeasy](../README.md) / TextDocumentItem

# Interface: TextDocumentItem

Defined in: node\_modules/.pnpm/vscode-languageserver-types@3.17.5/node\_modules/vscode-languageserver-types/lib/esm/main.d.ts:1086

An item to transfer a text document from the client to the
server.

## Properties

### languageId

> **languageId**: `string`

Defined in: node\_modules/.pnpm/vscode-languageserver-types@3.17.5/node\_modules/vscode-languageserver-types/lib/esm/main.d.ts:1094

The text document's language identifier.

***

### text

> **text**: `string`

Defined in: node\_modules/.pnpm/vscode-languageserver-types@3.17.5/node\_modules/vscode-languageserver-types/lib/esm/main.d.ts:1103

The content of the opened text document.

***

### uri

> **uri**: `string`

Defined in: node\_modules/.pnpm/vscode-languageserver-types@3.17.5/node\_modules/vscode-languageserver-types/lib/esm/main.d.ts:1090

The text document's uri.

***

### version

> **version**: `number`

Defined in: node\_modules/.pnpm/vscode-languageserver-types@3.17.5/node\_modules/vscode-languageserver-types/lib/esm/main.d.ts:1099

The version number of this document (it will increase after each
change, including undo/redo).
