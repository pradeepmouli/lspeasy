[**lspeasy v1.0.0**](../README.md)

***

[lspeasy](../README.md) / InlayHintClientCapabilities

# Type Alias: InlayHintClientCapabilities

> **InlayHintClientCapabilities** = `object`

Defined in: node\_modules/.pnpm/vscode-languageserver-protocol@3.17.5/node\_modules/vscode-languageserver-protocol/lib/common/protocol.inlayHint.d.ts:10

Inlay hint client capabilities.

## Since

3.17.0

## Properties

### dynamicRegistration?

> `optional` **dynamicRegistration?**: `boolean`

Defined in: node\_modules/.pnpm/vscode-languageserver-protocol@3.17.5/node\_modules/vscode-languageserver-protocol/lib/common/protocol.inlayHint.d.ts:14

Whether inlay hints support dynamic registration.

***

### resolveSupport?

> `optional` **resolveSupport?**: `object`

Defined in: node\_modules/.pnpm/vscode-languageserver-protocol@3.17.5/node\_modules/vscode-languageserver-protocol/lib/common/protocol.inlayHint.d.ts:19

Indicates which properties a client can resolve lazily on an inlay
hint.

#### properties

> **properties**: `string`[]

The properties that a client can resolve lazily.
