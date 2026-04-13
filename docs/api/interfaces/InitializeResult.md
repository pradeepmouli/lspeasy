[**lspeasy v1.0.0**](../README.md)

***

[lspeasy](../README.md) / InitializeResult

# Interface: InitializeResult\<T\>

Defined in: node\_modules/.pnpm/vscode-languageserver-protocol@3.17.5/node\_modules/vscode-languageserver-protocol/lib/common/protocol.d.ts:1085

The result returned from an initialize request.

## Type Parameters

### T

`T` = `any`

## Indexable

> \[`custom`: `string`\]: `any`

Custom initialization results.

## Properties

### capabilities

> **capabilities**: [`ServerCapabilities`](ServerCapabilities.md)\<`T`\>

Defined in: node\_modules/.pnpm/vscode-languageserver-protocol@3.17.5/node\_modules/vscode-languageserver-protocol/lib/common/protocol.d.ts:1089

The capabilities the language server provides.

***

### serverInfo?

> `optional` **serverInfo?**: `object`

Defined in: node\_modules/.pnpm/vscode-languageserver-protocol@3.17.5/node\_modules/vscode-languageserver-protocol/lib/common/protocol.d.ts:1095

Information about the server.

#### name

> **name**: `string`

The name of the server as defined by the server.

#### version?

> `optional` **version?**: `string`

The server's version as defined by the server.

#### Since

3.15.0
