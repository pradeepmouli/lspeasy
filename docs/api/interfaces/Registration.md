[**lspeasy v1.0.0**](../README.md)

***

[lspeasy](../README.md) / Registration

# Interface: Registration

Defined in: node\_modules/.pnpm/vscode-languageserver-protocol@3.17.5/node\_modules/vscode-languageserver-protocol/lib/common/protocol.d.ts:168

General parameters to register for a notification or to register a provider.

## Properties

### id

> **id**: `string`

Defined in: node\_modules/.pnpm/vscode-languageserver-protocol@3.17.5/node\_modules/vscode-languageserver-protocol/lib/common/protocol.d.ts:173

The id used to register the request. The id can be used to deregister
the request again.

***

### method

> **method**: `string`

Defined in: node\_modules/.pnpm/vscode-languageserver-protocol@3.17.5/node\_modules/vscode-languageserver-protocol/lib/common/protocol.d.ts:177

The method / capability to register for.

***

### registerOptions?

> `optional` **registerOptions?**: `any`

Defined in: node\_modules/.pnpm/vscode-languageserver-protocol@3.17.5/node\_modules/vscode-languageserver-protocol/lib/common/protocol.d.ts:181

Options necessary for the registration.
