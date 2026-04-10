[**lspeasy v1.0.0**](../README.md)

***

[lspeasy](../README.md) / CreateFile

# Interface: CreateFile

Defined in: node\_modules/.pnpm/vscode-languageserver-types@3.17.5/node\_modules/vscode-languageserver-types/lib/esm/main.d.ts:784

Create file operation.

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

> **kind**: `"create"`

Defined in: node\_modules/.pnpm/vscode-languageserver-types@3.17.5/node\_modules/vscode-languageserver-types/lib/esm/main.d.ts:788

A create

#### Overrides

`ResourceOperation.kind`

***

### options?

> `optional` **options?**: [`CreateFileOptions`](CreateFileOptions.md)

Defined in: node\_modules/.pnpm/vscode-languageserver-types@3.17.5/node\_modules/vscode-languageserver-types/lib/esm/main.d.ts:796

Additional options

***

### uri

> **uri**: `string`

Defined in: node\_modules/.pnpm/vscode-languageserver-types@3.17.5/node\_modules/vscode-languageserver-types/lib/esm/main.d.ts:792

The resource to create.
