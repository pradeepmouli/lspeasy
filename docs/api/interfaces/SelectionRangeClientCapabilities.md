[**lspeasy v1.0.0**](../README.md)

***

[lspeasy](../README.md) / SelectionRangeClientCapabilities

# Interface: SelectionRangeClientCapabilities

Defined in: node\_modules/.pnpm/vscode-languageserver-protocol@3.17.5/node\_modules/vscode-languageserver-protocol/lib/common/protocol.selectionRange.d.ts:5

## Properties

### dynamicRegistration?

> `optional` **dynamicRegistration?**: `boolean`

Defined in: node\_modules/.pnpm/vscode-languageserver-protocol@3.17.5/node\_modules/vscode-languageserver-protocol/lib/common/protocol.selectionRange.d.ts:11

Whether implementation supports dynamic registration for selection range providers. If this is set to `true`
the client supports the new `SelectionRangeRegistrationOptions` return value for the corresponding server
capability as well.
