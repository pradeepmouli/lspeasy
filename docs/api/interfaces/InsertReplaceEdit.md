[**lspeasy v1.0.0**](../README.md)

***

[lspeasy](../README.md) / InsertReplaceEdit

# Interface: InsertReplaceEdit

Defined in: node\_modules/.pnpm/vscode-languageserver-types@3.17.5/node\_modules/vscode-languageserver-types/lib/esm/main.d.ts:1256

A special text edit to provide an insert and a replace operation.

## Since

3.16.0

## Properties

### insert

> **insert**: [`Range`](Range.md)

Defined in: node\_modules/.pnpm/vscode-languageserver-types@3.17.5/node\_modules/vscode-languageserver-types/lib/esm/main.d.ts:1264

The range if the insert is requested

***

### newText

> **newText**: `string`

Defined in: node\_modules/.pnpm/vscode-languageserver-types@3.17.5/node\_modules/vscode-languageserver-types/lib/esm/main.d.ts:1260

The string to be inserted.

***

### replace

> **replace**: [`Range`](Range.md)

Defined in: node\_modules/.pnpm/vscode-languageserver-types@3.17.5/node\_modules/vscode-languageserver-types/lib/esm/main.d.ts:1268

The range if the replace is requested.
