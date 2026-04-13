[**lspeasy v1.0.0**](../README.md)

***

[lspeasy](../README.md) / LinkedEditingRangeClientCapabilities

# Interface: LinkedEditingRangeClientCapabilities

Defined in: node\_modules/.pnpm/vscode-languageserver-protocol@3.17.5/node\_modules/vscode-languageserver-protocol/lib/common/protocol.linkedEditingRange.d.ts:10

Client capabilities for the linked editing range request.

## Since

3.16.0

## Properties

### dynamicRegistration?

> `optional` **dynamicRegistration?**: `boolean`

Defined in: node\_modules/.pnpm/vscode-languageserver-protocol@3.17.5/node\_modules/vscode-languageserver-protocol/lib/common/protocol.linkedEditingRange.d.ts:16

Whether implementation supports dynamic registration. If this is set to `true`
the client supports the new `(TextDocumentRegistrationOptions & StaticRegistrationOptions)`
return value for the corresponding server capability as well.
