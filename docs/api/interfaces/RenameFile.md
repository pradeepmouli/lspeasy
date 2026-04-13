[**lspeasy v1.0.0**](../README.md)

***

[lspeasy](../README.md) / RenameFile

# Interface: RenameFile

Defined in: node\_modules/.pnpm/vscode-languageserver-types@3.17.5/node\_modules/vscode-languageserver-types/lib/esm/main.d.ts:818

Rename file operation

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

> **kind**: `"rename"`

Defined in: node\_modules/.pnpm/vscode-languageserver-types@3.17.5/node\_modules/vscode-languageserver-types/lib/esm/main.d.ts:822

A rename

#### Overrides

`ResourceOperation.kind`

***

### newUri

> **newUri**: `string`

Defined in: node\_modules/.pnpm/vscode-languageserver-types@3.17.5/node\_modules/vscode-languageserver-types/lib/esm/main.d.ts:830

The new location.

***

### oldUri

> **oldUri**: `string`

Defined in: node\_modules/.pnpm/vscode-languageserver-types@3.17.5/node\_modules/vscode-languageserver-types/lib/esm/main.d.ts:826

The old (existing) location.

***

### options?

> `optional` **options?**: [`RenameFileOptions`](RenameFileOptions.md)

Defined in: node\_modules/.pnpm/vscode-languageserver-types@3.17.5/node\_modules/vscode-languageserver-types/lib/esm/main.d.ts:834

Rename options.
