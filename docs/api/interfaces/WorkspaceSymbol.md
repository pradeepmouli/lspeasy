[**lspeasy v1.0.0**](../README.md)

***

[lspeasy](../README.md) / WorkspaceSymbol

# Interface: WorkspaceSymbol

Defined in: node\_modules/.pnpm/vscode-languageserver-types@3.17.5/node\_modules/vscode-languageserver-types/lib/esm/main.d.ts:1936

A special workspace symbol that supports locations without a range.

See also SymbolInformation.

## Since

3.17.0

## Extends

- [`BaseSymbolInformation`](BaseSymbolInformation.md)

## Properties

### containerName?

> `optional` **containerName?**: `string`

Defined in: node\_modules/.pnpm/vscode-languageserver-types@3.17.5/node\_modules/vscode-languageserver-types/lib/esm/main.d.ts:1891

The name of the symbol containing this symbol. This information is for
user interface purposes (e.g. to render a qualifier in the user interface
if necessary). It can't be used to re-infer a hierarchy for the document
symbols.

#### Inherited from

[`BaseSymbolInformation`](BaseSymbolInformation.md).[`containerName`](BaseSymbolInformation.md#containername)

***

### data?

> `optional` **data?**: `any`

Defined in: node\_modules/.pnpm/vscode-languageserver-types@3.17.5/node\_modules/vscode-languageserver-types/lib/esm/main.d.ts:1951

A data entry field that is preserved on a workspace symbol between a
workspace symbol request and a workspace symbol resolve request.

***

### kind

> **kind**: [`SymbolKind`](../type-aliases/SymbolKind.md)

Defined in: node\_modules/.pnpm/vscode-languageserver-types@3.17.5/node\_modules/vscode-languageserver-types/lib/esm/main.d.ts:1878

The kind of this symbol.

#### Inherited from

[`BaseSymbolInformation`](BaseSymbolInformation.md).[`kind`](BaseSymbolInformation.md#kind)

***

### location

> **location**: [`Location`](Location.md) \| \{ `uri`: `string`; \}

Defined in: node\_modules/.pnpm/vscode-languageserver-types@3.17.5/node\_modules/vscode-languageserver-types/lib/esm/main.d.ts:1944

The location of the symbol. Whether a server is allowed to
return a location without a range depends on the client
capability `workspace.symbol.resolveSupport`.

See SymbolInformation#location for more details.

***

### name

> **name**: `string`

Defined in: node\_modules/.pnpm/vscode-languageserver-types@3.17.5/node\_modules/vscode-languageserver-types/lib/esm/main.d.ts:1874

The name of this symbol.

#### Inherited from

[`BaseSymbolInformation`](BaseSymbolInformation.md).[`name`](BaseSymbolInformation.md#name)

***

### tags?

> `optional` **tags?**: `1`[]

Defined in: node\_modules/.pnpm/vscode-languageserver-types@3.17.5/node\_modules/vscode-languageserver-types/lib/esm/main.d.ts:1884

Tags for this symbol.

#### Since

3.16.0

#### Inherited from

[`BaseSymbolInformation`](BaseSymbolInformation.md).[`tags`](BaseSymbolInformation.md#tags)
