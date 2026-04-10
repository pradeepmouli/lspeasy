[**lspeasy v1.0.0**](../README.md)

***

[lspeasy](../README.md) / TextDocument

# ~~Interface: TextDocument~~

Defined in: node\_modules/.pnpm/vscode-languageserver-types@3.17.5/node\_modules/vscode-languageserver-types/lib/esm/main.d.ts:3061

A simple text document. Not to be implemented. The document keeps the content
as string.

## Deprecated

Use the text document from the new vscode-languageserver-textdocument package.

## Properties

### ~~languageId~~

> `readonly` **languageId**: `string`

Defined in: node\_modules/.pnpm/vscode-languageserver-types@3.17.5/node\_modules/vscode-languageserver-types/lib/esm/main.d.ts:3075

The identifier of the language associated with this document.

***

### ~~lineCount~~

> `readonly` **lineCount**: `number`

Defined in: node\_modules/.pnpm/vscode-languageserver-types@3.17.5/node\_modules/vscode-languageserver-types/lib/esm/main.d.ts:3119

The number of lines in this document.

***

### ~~uri~~

> `readonly` **uri**: `string`

Defined in: node\_modules/.pnpm/vscode-languageserver-types@3.17.5/node\_modules/vscode-languageserver-types/lib/esm/main.d.ts:3069

The associated URI for this document. Most documents have the __file__-scheme, indicating that they
represent files on disk. However, some documents may have other schemes indicating that they are not
available on disk.

***

### ~~version~~

> `readonly` **version**: `number`

Defined in: node\_modules/.pnpm/vscode-languageserver-types@3.17.5/node\_modules/vscode-languageserver-types/lib/esm/main.d.ts:3082

The version number of this document (it will increase after each
change, including undo/redo).

## Methods

### ~~getText()~~

> **getText**(`range?`): `string`

Defined in: node\_modules/.pnpm/vscode-languageserver-types@3.17.5/node\_modules/vscode-languageserver-types/lib/esm/main.d.ts:3097

Get the text of this document. A substring can be retrieved by
providing a range.

#### Parameters

##### range?

[`Range`](Range.md)

(optional) An range within the document to return.
If no range is passed, the full content is returned.
Invalid range positions are adjusted as described in [Position.line](Position.md#line)
and [Position.character](Position.md#character).
If the start range position is greater than the end range position,
then the effect of getText is as if the two positions were swapped.

#### Returns

`string`

The text of this document or a substring of the text if a
        range is provided.

***

### ~~offsetAt()~~

> **offsetAt**(`position`): `number`

Defined in: node\_modules/.pnpm/vscode-languageserver-types@3.17.5/node\_modules/vscode-languageserver-types/lib/esm/main.d.ts:3113

Converts the position to a zero-based offset.
Invalid positions are adjusted as described in [Position.line](Position.md#line)
and [Position.character](Position.md#character).

#### Parameters

##### position

[`Position`](Position.md)

A position.

#### Returns

`number`

A valid zero-based offset.

***

### ~~positionAt()~~

> **positionAt**(`offset`): [`Position`](Position.md)

Defined in: node\_modules/.pnpm/vscode-languageserver-types@3.17.5/node\_modules/vscode-languageserver-types/lib/esm/main.d.ts:3104

Converts a zero-based offset to a position.

#### Parameters

##### offset

`number`

A zero-based offset.

#### Returns

[`Position`](Position.md)

A valid [position](Position.md).
