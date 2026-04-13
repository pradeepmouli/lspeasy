[**lspeasy v1.0.0**](../README.md)

***

[lspeasy](../README.md) / TypeHierarchyClientCapabilities

# Type Alias: TypeHierarchyClientCapabilities

> **TypeHierarchyClientCapabilities** = `object`

Defined in: node\_modules/.pnpm/vscode-languageserver-protocol@3.17.5/node\_modules/vscode-languageserver-protocol/lib/common/protocol.typeHierarchy.d.ts:8

## Since

3.17.0

## Properties

### dynamicRegistration?

> `optional` **dynamicRegistration?**: `boolean`

Defined in: node\_modules/.pnpm/vscode-languageserver-protocol@3.17.5/node\_modules/vscode-languageserver-protocol/lib/common/protocol.typeHierarchy.d.ts:14

Whether implementation supports dynamic registration. If this is set to `true`
the client supports the new `(TextDocumentRegistrationOptions & StaticRegistrationOptions)`
return value for the corresponding server capability as well.
