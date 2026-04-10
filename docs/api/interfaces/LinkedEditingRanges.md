[**lspeasy v1.0.0**](../README.md)

***

[lspeasy](../README.md) / LinkedEditingRanges

# Interface: LinkedEditingRanges

Defined in: node\_modules/.pnpm/vscode-languageserver-protocol@3.17.5/node\_modules/vscode-languageserver-protocol/lib/common/protocol.linkedEditingRange.d.ts:29

The result of a linked editing range request.

## Since

3.16.0

## Properties

### ranges

> **ranges**: [`Range`](Range.md)[]

Defined in: node\_modules/.pnpm/vscode-languageserver-protocol@3.17.5/node\_modules/vscode-languageserver-protocol/lib/common/protocol.linkedEditingRange.d.ts:34

A list of ranges that can be edited together. The ranges must have
identical length and contain identical text content. The ranges cannot overlap.

***

### wordPattern?

> `optional` **wordPattern?**: `string`

Defined in: node\_modules/.pnpm/vscode-languageserver-protocol@3.17.5/node\_modules/vscode-languageserver-protocol/lib/common/protocol.linkedEditingRange.d.ts:40

An optional word pattern (regular expression) that describes valid contents for
the given ranges. If no pattern is provided, the client configuration's word
pattern will be used.
