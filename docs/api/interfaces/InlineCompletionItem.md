[**lspeasy v1.0.0**](../README.md)

***

[lspeasy](../README.md) / InlineCompletionItem

# Interface: InlineCompletionItem

Defined in: node\_modules/.pnpm/vscode-languageserver-types@3.17.5/node\_modules/vscode-languageserver-types/lib/esm/main.d.ts:2946

An inline completion item represents a text snippet that is proposed inline to complete text that is being typed.

## Since

3.18.0

## Proposed

## Properties

### command?

> `optional` **command?**: [`Command`](Command.md)

Defined in: node\_modules/.pnpm/vscode-languageserver-types@3.17.5/node\_modules/vscode-languageserver-types/lib/esm/main.d.ts:2962

An optional [Command](Command.md) that is executed *after* inserting this completion.

***

### filterText?

> `optional` **filterText?**: `string`

Defined in: node\_modules/.pnpm/vscode-languageserver-types@3.17.5/node\_modules/vscode-languageserver-types/lib/esm/main.d.ts:2954

A text that is used to decide if this inline completion should be shown. When `falsy` the [InlineCompletionItem.insertText](#inserttext) is used.

***

### insertText

> **insertText**: `string` \| [`StringValue`](StringValue.md)

Defined in: node\_modules/.pnpm/vscode-languageserver-types@3.17.5/node\_modules/vscode-languageserver-types/lib/esm/main.d.ts:2950

The text to replace the range with. Must be set.

***

### range?

> `optional` **range?**: [`Range`](Range.md)

Defined in: node\_modules/.pnpm/vscode-languageserver-types@3.17.5/node\_modules/vscode-languageserver-types/lib/esm/main.d.ts:2958

The range to replace. Must begin and end on the same line.
