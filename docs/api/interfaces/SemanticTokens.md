[**lspeasy v1.0.0**](../README.md)

***

[lspeasy](../README.md) / SemanticTokens

# Interface: SemanticTokens

Defined in: node\_modules/.pnpm/vscode-languageserver-types@3.17.5/node\_modules/vscode-languageserver-types/lib/esm/main.d.ts:2575

## Since

3.16.0

## Properties

### data

> **data**: `number`[]

Defined in: node\_modules/.pnpm/vscode-languageserver-types@3.17.5/node\_modules/vscode-languageserver-types/lib/esm/main.d.ts:2586

The actual tokens.

***

### resultId?

> `optional` **resultId?**: `string`

Defined in: node\_modules/.pnpm/vscode-languageserver-types@3.17.5/node\_modules/vscode-languageserver-types/lib/esm/main.d.ts:2582

An optional result id. If provided and clients support delta updating
the client will include the result id in the next semantic token request.
A server can then instead of computing all semantic tokens again simply
send a delta.
