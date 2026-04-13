[**lspeasy v1.0.0**](../README.md)

***

[lspeasy](../README.md) / OptionalVersionedTextDocumentIdentifier

# Interface: OptionalVersionedTextDocumentIdentifier

Defined in: node\_modules/.pnpm/vscode-languageserver-types@3.17.5/node\_modules/vscode-languageserver-types/lib/esm/main.d.ts:1056

A text document identifier to optionally denote a specific version of a text document.

## Extends

- [`TextDocumentIdentifier`](TextDocumentIdentifier.md)

## Properties

### uri

> **uri**: `string`

Defined in: node\_modules/.pnpm/vscode-languageserver-types@3.17.5/node\_modules/vscode-languageserver-types/lib/esm/main.d.ts:1011

The text document's uri.

#### Inherited from

[`TextDocumentIdentifier`](TextDocumentIdentifier.md).[`uri`](TextDocumentIdentifier.md#uri)

***

### version

> **version**: `number` \| `null`

Defined in: node\_modules/.pnpm/vscode-languageserver-types@3.17.5/node\_modules/vscode-languageserver-types/lib/esm/main.d.ts:1064

The version number of this document. If a versioned text document identifier
is sent from the server to the client and the file is not open in the editor
(the server has not received an open notification before) the server can send
`null` to indicate that the version is unknown and the content on disk is the
truth (as specified with document content ownership).
