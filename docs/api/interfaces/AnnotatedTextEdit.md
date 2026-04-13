[**lspeasy v1.0.0**](../README.md)

***

[lspeasy](../README.md) / AnnotatedTextEdit

# Interface: AnnotatedTextEdit

Defined in: node\_modules/.pnpm/vscode-languageserver-types@3.17.5/node\_modules/vscode-languageserver-types/lib/esm/main.d.ts:691

A special text edit with an additional change annotation.

## Since

3.16.0.

## Extends

- [`TextEdit`](TextEdit.md)

## Properties

### annotationId

> **annotationId**: `string`

Defined in: node\_modules/.pnpm/vscode-languageserver-types@3.17.5/node\_modules/vscode-languageserver-types/lib/esm/main.d.ts:695

The actual identifier of the change annotation

***

### newText

> **newText**: `string`

Defined in: node\_modules/.pnpm/vscode-languageserver-types@3.17.5/node\_modules/vscode-languageserver-types/lib/esm/main.d.ts:627

The string to be inserted. For delete operations use an
empty string.

#### Inherited from

[`TextEdit`](TextEdit.md).[`newText`](TextEdit.md#newtext)

***

### range

> **range**: [`Range`](Range.md)

Defined in: node\_modules/.pnpm/vscode-languageserver-types@3.17.5/node\_modules/vscode-languageserver-types/lib/esm/main.d.ts:622

The range of the text document to be manipulated. To insert
text into a document create a range where start === end.

#### Inherited from

[`TextEdit`](TextEdit.md).[`range`](TextEdit.md#range)
