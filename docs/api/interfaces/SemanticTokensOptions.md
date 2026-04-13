[**lspeasy v1.0.0**](../README.md)

***

[lspeasy](../README.md) / SemanticTokensOptions

# Interface: SemanticTokensOptions

Defined in: node\_modules/.pnpm/vscode-languageserver-protocol@3.17.5/node\_modules/vscode-languageserver-protocol/lib/common/protocol.semanticTokens.d.ts:105

## Since

3.16.0

## Extends

- [`WorkDoneProgressOptions`](WorkDoneProgressOptions.md)

## Extended by

- [`SemanticTokensRegistrationOptions`](SemanticTokensRegistrationOptions.md)

## Properties

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

***

### legend

> **legend**: [`SemanticTokensLegend`](SemanticTokensLegend.md)

Defined in: node\_modules/.pnpm/vscode-languageserver-protocol@3.17.5/node\_modules/vscode-languageserver-protocol/lib/common/protocol.semanticTokens.d.ts:109

The legend used by the server

***

### range?

> `optional` **range?**: `boolean` \| \{ \}

Defined in: node\_modules/.pnpm/vscode-languageserver-protocol@3.17.5/node\_modules/vscode-languageserver-protocol/lib/common/protocol.semanticTokens.d.ts:114

Server supports providing semantic tokens for a specific range
of a document.

***

### workDoneProgress?

> `optional` **workDoneProgress?**: `boolean`

Defined in: node\_modules/.pnpm/vscode-languageserver-protocol@3.17.5/node\_modules/vscode-languageserver-protocol/lib/common/protocol.d.ts:793

#### Inherited from

[`WorkDoneProgressOptions`](WorkDoneProgressOptions.md).[`workDoneProgress`](WorkDoneProgressOptions.md#workdoneprogress)
