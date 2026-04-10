[**lspeasy v1.0.0**](../README.md)

***

[lspeasy](../README.md) / DeleteFile

# Interface: DeleteFile

Defined in: node\_modules/.pnpm/vscode-languageserver-types@3.17.5/node\_modules/vscode-languageserver-types/lib/esm/main.d.ts:856

Delete file operation

## Extends

- `ResourceOperation`

## Properties

### annotationId?

> `optional` **annotationId?**: `string`

Defined in: node\_modules/.pnpm/vscode-languageserver-types@3.17.5/node\_modules/vscode-languageserver-types/lib/esm/main.d.ts:766

An optional annotation identifier describing the operation.

#### Since

3.16.0

#### Inherited from

`ResourceOperation.annotationId`

***

### kind

> **kind**: `"delete"`

Defined in: node\_modules/.pnpm/vscode-languageserver-types@3.17.5/node\_modules/vscode-languageserver-types/lib/esm/main.d.ts:860

A delete

#### Overrides

`ResourceOperation.kind`

***

### options?

> `optional` **options?**: [`DeleteFileOptions`](DeleteFileOptions.md)

Defined in: node\_modules/.pnpm/vscode-languageserver-types@3.17.5/node\_modules/vscode-languageserver-types/lib/esm/main.d.ts:868

Delete options.

***

### uri

> **uri**: `string`

Defined in: node\_modules/.pnpm/vscode-languageserver-types@3.17.5/node\_modules/vscode-languageserver-types/lib/esm/main.d.ts:864

The file to delete.
