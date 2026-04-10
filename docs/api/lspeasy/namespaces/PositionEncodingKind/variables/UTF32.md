[**lspeasy v1.0.0**](../../../../README.md)

***

[lspeasy](../../../../README.md) / [PositionEncodingKind](../README.md) / UTF32

# Variable: UTF32

> `const` **UTF32**: [`PositionEncodingKind`](../../../../type-aliases/PositionEncodingKind.md)

Defined in: node\_modules/.pnpm/vscode-languageserver-protocol@3.17.5/node\_modules/vscode-languageserver-protocol/lib/common/protocol.d.ts:631

Character offsets count UTF-32 code units.

Implementation note: these are the same as Unicode codepoints,
so this `PositionEncodingKind` may also be used for an
encoding-agnostic representation of character offsets.
