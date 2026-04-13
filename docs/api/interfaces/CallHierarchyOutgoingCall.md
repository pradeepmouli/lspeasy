[**lspeasy v1.0.0**](../README.md)

***

[lspeasy](../README.md) / CallHierarchyOutgoingCall

# Interface: CallHierarchyOutgoingCall

Defined in: node\_modules/.pnpm/vscode-languageserver-types@3.17.5/node\_modules/vscode-languageserver-types/lib/esm/main.d.ts:2489

Represents an outgoing call, e.g. calling a getter from a method or a method from a constructor etc.

## Since

3.16.0

## Properties

### fromRanges

> **fromRanges**: [`Range`](Range.md)[]

Defined in: node\_modules/.pnpm/vscode-languageserver-types@3.17.5/node\_modules/vscode-languageserver-types/lib/esm/main.d.ts:2499

The range at which this item is called. This is the range relative to the caller, e.g the item
passed to CallHierarchyItemProvider.provideCallHierarchyOutgoingCalls \`provideCallHierarchyOutgoingCalls\`
and not [\`this.to\`](#to).

***

### to

> **to**: [`CallHierarchyItem`](CallHierarchyItem.md)

Defined in: node\_modules/.pnpm/vscode-languageserver-types@3.17.5/node\_modules/vscode-languageserver-types/lib/esm/main.d.ts:2493

The item that is called.
