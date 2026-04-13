[**lspeasy v1.0.0**](../README.md)

***

[lspeasy](../README.md) / CallHierarchyIncomingCall

# Interface: CallHierarchyIncomingCall

Defined in: node\_modules/.pnpm/vscode-languageserver-types@3.17.5/node\_modules/vscode-languageserver-types/lib/esm/main.d.ts:2473

Represents an incoming call, e.g. a caller of a method or constructor.

## Since

3.16.0

## Properties

### from

> **from**: [`CallHierarchyItem`](CallHierarchyItem.md)

Defined in: node\_modules/.pnpm/vscode-languageserver-types@3.17.5/node\_modules/vscode-languageserver-types/lib/esm/main.d.ts:2477

The item that makes the call.

***

### fromRanges

> **fromRanges**: [`Range`](Range.md)[]

Defined in: node\_modules/.pnpm/vscode-languageserver-types@3.17.5/node\_modules/vscode-languageserver-types/lib/esm/main.d.ts:2482

The ranges at which the calls appear. This is relative to the caller
denoted by [\`this.from\`](#from).
