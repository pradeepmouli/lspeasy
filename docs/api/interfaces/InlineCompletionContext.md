[**lspeasy v1.0.0**](../README.md)

***

[lspeasy](../README.md) / InlineCompletionContext

# Interface: InlineCompletionContext

Defined in: node\_modules/.pnpm/vscode-languageserver-types@3.17.5/node\_modules/vscode-languageserver-types/lib/esm/main.d.ts:3024

Provides information about the context in which an inline completion was requested.

## Since

3.18.0

## Proposed

## Properties

### selectedCompletionInfo?

> `optional` **selectedCompletionInfo?**: [`SelectedCompletionInfo`](SelectedCompletionInfo.md)

Defined in: node\_modules/.pnpm/vscode-languageserver-types@3.17.5/node\_modules/vscode-languageserver-types/lib/esm/main.d.ts:3032

Provides information about the currently selected item in the autocomplete widget if it is visible.

***

### triggerKind

> **triggerKind**: [`InlineCompletionTriggerKind`](../type-aliases/InlineCompletionTriggerKind.md)

Defined in: node\_modules/.pnpm/vscode-languageserver-types@3.17.5/node\_modules/vscode-languageserver-types/lib/esm/main.d.ts:3028

Describes how the inline completion was triggered.
