[**lspeasy v1.0.0**](../README.md)

***

[lspeasy](../README.md) / StaticRegistrationOptions

# Interface: StaticRegistrationOptions

Defined in: node\_modules/.pnpm/vscode-languageserver-protocol@3.17.5/node\_modules/vscode-languageserver-protocol/lib/common/protocol.d.ts:750

Static registration options to be returned in the initialize
request.

## Extended by

- [`ImplementationRegistrationOptions`](ImplementationRegistrationOptions.md)
- [`TypeDefinitionRegistrationOptions`](TypeDefinitionRegistrationOptions.md)
- [`DocumentColorRegistrationOptions`](DocumentColorRegistrationOptions.md)
- [`FoldingRangeRegistrationOptions`](FoldingRangeRegistrationOptions.md)
- [`DeclarationRegistrationOptions`](DeclarationRegistrationOptions.md)
- [`SelectionRangeRegistrationOptions`](SelectionRangeRegistrationOptions.md)
- [`CallHierarchyRegistrationOptions`](CallHierarchyRegistrationOptions.md)
- [`SemanticTokensRegistrationOptions`](SemanticTokensRegistrationOptions.md)
- [`LinkedEditingRangeRegistrationOptions`](LinkedEditingRangeRegistrationOptions.md)

## Properties

### id?

> `optional` **id?**: `string`

Defined in: node\_modules/.pnpm/vscode-languageserver-protocol@3.17.5/node\_modules/vscode-languageserver-protocol/lib/common/protocol.d.ts:755

The id used to register the request. The id can be used to deregister
the request again. See also Registration#id.
