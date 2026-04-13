[**lspeasy v1.0.0**](../README.md)

***

[lspeasy](../README.md) / Moniker

# Interface: Moniker

Defined in: node\_modules/.pnpm/vscode-languageserver-protocol@3.17.5/node\_modules/vscode-languageserver-protocol/lib/common/protocol.moniker.d.ts:57

Moniker definition to match LSIF 0.5 moniker definition.

## Since

3.16.0

## Properties

### identifier

> **identifier**: `string`

Defined in: node\_modules/.pnpm/vscode-languageserver-protocol@3.17.5/node\_modules/vscode-languageserver-protocol/lib/common/protocol.moniker.d.ts:66

The identifier of the moniker. The value is opaque in LSIF however
schema owners are allowed to define the structure if they want.

***

### kind?

> `optional` **kind?**: [`MonikerKind`](../type-aliases/MonikerKind.md)

Defined in: node\_modules/.pnpm/vscode-languageserver-protocol@3.17.5/node\_modules/vscode-languageserver-protocol/lib/common/protocol.moniker.d.ts:74

The moniker kind if known.

***

### scheme

> **scheme**: `string`

Defined in: node\_modules/.pnpm/vscode-languageserver-protocol@3.17.5/node\_modules/vscode-languageserver-protocol/lib/common/protocol.moniker.d.ts:61

The scheme of the moniker. For example tsc or .Net

***

### unique

> **unique**: [`UniquenessLevel`](../type-aliases/UniquenessLevel.md)

Defined in: node\_modules/.pnpm/vscode-languageserver-protocol@3.17.5/node\_modules/vscode-languageserver-protocol/lib/common/protocol.moniker.d.ts:70

The scope in which the moniker is unique
