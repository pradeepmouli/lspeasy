[**lspeasy v1.0.0**](../README.md)

***

[lspeasy](../README.md) / DeclarationClientCapabilities

# Interface: DeclarationClientCapabilities

Defined in: node\_modules/.pnpm/vscode-languageserver-protocol@3.17.5/node\_modules/vscode-languageserver-protocol/lib/common/protocol.declaration.d.ts:8

## Since

3.14.0

## Properties

### dynamicRegistration?

> `optional` **dynamicRegistration?**: `boolean`

Defined in: node\_modules/.pnpm/vscode-languageserver-protocol@3.17.5/node\_modules/vscode-languageserver-protocol/lib/common/protocol.declaration.d.ts:14

Whether declaration supports dynamic registration. If this is set to `true`
the client supports the new `DeclarationRegistrationOptions` return value
for the corresponding server capability as well.

***

### linkSupport?

> `optional` **linkSupport?**: `boolean`

Defined in: node\_modules/.pnpm/vscode-languageserver-protocol@3.17.5/node\_modules/vscode-languageserver-protocol/lib/common/protocol.declaration.d.ts:18

The client supports additional metadata in the form of declaration links.
