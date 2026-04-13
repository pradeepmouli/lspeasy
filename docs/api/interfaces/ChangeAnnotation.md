[**lspeasy v1.0.0**](../README.md)

***

[lspeasy](../README.md) / ChangeAnnotation

# Interface: ChangeAnnotation

Defined in: node\_modules/.pnpm/vscode-languageserver-types@3.17.5/node\_modules/vscode-languageserver-types/lib/esm/main.d.ts:658

Additional information that describes document changes.

## Since

3.16.0

## Properties

### description?

> `optional` **description?**: `string`

Defined in: node\_modules/.pnpm/vscode-languageserver-types@3.17.5/node\_modules/vscode-languageserver-types/lib/esm/main.d.ts:673

A human-readable string which is rendered less prominent in
the user interface.

***

### label

> **label**: `string`

Defined in: node\_modules/.pnpm/vscode-languageserver-types@3.17.5/node\_modules/vscode-languageserver-types/lib/esm/main.d.ts:663

A human-readable string describing the actual change. The string
is rendered prominent in the user interface.

***

### needsConfirmation?

> `optional` **needsConfirmation?**: `boolean`

Defined in: node\_modules/.pnpm/vscode-languageserver-types@3.17.5/node\_modules/vscode-languageserver-types/lib/esm/main.d.ts:668

A flag which indicates that user confirmation is needed
before applying the change.
