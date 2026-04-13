[**lspeasy v1.0.0**](../README.md)

***

[lspeasy](../README.md) / SemanticTokensRegistrationOptions

# Interface: SemanticTokensRegistrationOptions

Defined in: node\_modules/.pnpm/vscode-languageserver-protocol@3.17.5/node\_modules/vscode-languageserver-protocol/lib/common/protocol.semanticTokens.d.ts:128

## Since

3.16.0

## Extends

- [`TextDocumentRegistrationOptions`](TextDocumentRegistrationOptions.md).[`SemanticTokensOptions`](SemanticTokensOptions.md).[`StaticRegistrationOptions`](StaticRegistrationOptions.md)

## Properties

### documentSelector

> **documentSelector**: [`DocumentSelector`](../type-aliases/DocumentSelector.md) \| `null`

Defined in: node\_modules/.pnpm/vscode-languageserver-protocol@3.17.5/node\_modules/vscode-languageserver-protocol/lib/common/protocol.d.ts:774

A document selector to identify the scope of the registration. If set to null
the document selector provided on the client side will be used.

#### Inherited from

[`TextDocumentRegistrationOptions`](TextDocumentRegistrationOptions.md).[`documentSelector`](TextDocumentRegistrationOptions.md#documentselector)

***

### full?

> `optional` **full?**: `boolean` \| \{ `delta?`: `boolean`; \}

Defined in: node\_modules/.pnpm/vscode-languageserver-protocol@3.17.5/node\_modules/vscode-languageserver-protocol/lib/common/protocol.semanticTokens.d.ts:118

Server supports providing semantic tokens for a full document.

#### Union Members

`boolean`

***

##### Type Literal

\{ `delta?`: `boolean`; \}

##### delta?

> `optional` **delta?**: `boolean`

The server supports deltas for full documents.

#### Inherited from

[`SemanticTokensOptions`](SemanticTokensOptions.md).[`full`](SemanticTokensOptions.md#full)

***

### id?

> `optional` **id?**: `string`

Defined in: node\_modules/.pnpm/vscode-languageserver-protocol@3.17.5/node\_modules/vscode-languageserver-protocol/lib/common/protocol.d.ts:755

The id used to register the request. The id can be used to deregister
the request again. See also Registration#id.

#### Inherited from

[`StaticRegistrationOptions`](StaticRegistrationOptions.md).[`id`](StaticRegistrationOptions.md#id)

***

### legend

> **legend**: [`SemanticTokensLegend`](SemanticTokensLegend.md)

Defined in: node\_modules/.pnpm/vscode-languageserver-protocol@3.17.5/node\_modules/vscode-languageserver-protocol/lib/common/protocol.semanticTokens.d.ts:109

The legend used by the server

#### Inherited from

[`SemanticTokensOptions`](SemanticTokensOptions.md).[`legend`](SemanticTokensOptions.md#legend)

***

### range?

> `optional` **range?**: `boolean` \| \{ \}

Defined in: node\_modules/.pnpm/vscode-languageserver-protocol@3.17.5/node\_modules/vscode-languageserver-protocol/lib/common/protocol.semanticTokens.d.ts:114

Server supports providing semantic tokens for a specific range
of a document.

#### Inherited from

[`SemanticTokensOptions`](SemanticTokensOptions.md).[`range`](SemanticTokensOptions.md#range)

***

### workDoneProgress?

> `optional` **workDoneProgress?**: `boolean`

Defined in: node\_modules/.pnpm/vscode-languageserver-protocol@3.17.5/node\_modules/vscode-languageserver-protocol/lib/common/protocol.d.ts:793

#### Inherited from

[`SemanticTokensOptions`](SemanticTokensOptions.md).[`workDoneProgress`](SemanticTokensOptions.md#workdoneprogress)
