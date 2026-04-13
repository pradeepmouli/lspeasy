[**lspeasy v1.0.0**](../README.md)

***

[lspeasy](../README.md) / TextEdit

# Interface: TextEdit

Defined in: node\_modules/.pnpm/vscode-languageserver-types@3.17.5/node\_modules/vscode-languageserver-types/lib/esm/main.d.ts:617

A text edit applicable to a text document.

## Extended by

- [`AnnotatedTextEdit`](AnnotatedTextEdit.md)

## Properties

### newText

> **newText**: `string`

Defined in: node\_modules/.pnpm/vscode-languageserver-types@3.17.5/node\_modules/vscode-languageserver-types/lib/esm/main.d.ts:627

The string to be inserted. For delete operations use an
empty string.

***

### range

> **range**: [`Range`](Range.md)

Defined in: node\_modules/.pnpm/vscode-languageserver-types@3.17.5/node\_modules/vscode-languageserver-types/lib/esm/main.d.ts:622

The range of the text document to be manipulated. To insert
text into a document create a range where start === end.
