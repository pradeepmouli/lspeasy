[**lspeasy v1.0.0**](../README.md)

***

[lspeasy](../README.md) / WorkspaceChange

# Class: WorkspaceChange

Defined in: node\_modules/.pnpm/vscode-languageserver-types@3.17.5/node\_modules/vscode-languageserver-types/lib/esm/main.d.ts:979

A workspace change helps constructing changes to a workspace.

## Constructors

### Constructor

> **new WorkspaceChange**(`workspaceEdit?`): `WorkspaceChange`

Defined in: node\_modules/.pnpm/vscode-languageserver-types@3.17.5/node\_modules/vscode-languageserver-types/lib/esm/main.d.ts:983

#### Parameters

##### workspaceEdit?

[`WorkspaceEdit`](../interfaces/WorkspaceEdit.md)

#### Returns

`WorkspaceChange`

## Accessors

### edit

#### Get Signature

> **get** **edit**(): [`WorkspaceEdit`](../interfaces/WorkspaceEdit.md)

Defined in: node\_modules/.pnpm/vscode-languageserver-types@3.17.5/node\_modules/vscode-languageserver-types/lib/esm/main.d.ts:988

Returns the underlying [WorkspaceEdit](../interfaces/WorkspaceEdit.md) literal
use to be returned from a workspace edit operation like rename.

##### Returns

[`WorkspaceEdit`](../interfaces/WorkspaceEdit.md)

## Methods

### createFile()

#### Call Signature

> **createFile**(`uri`, `options?`): `void`

Defined in: node\_modules/.pnpm/vscode-languageserver-types@3.17.5/node\_modules/vscode-languageserver-types/lib/esm/main.d.ts:997

##### Parameters

###### uri

`string`

###### options?

[`CreateFileOptions`](../interfaces/CreateFileOptions.md)

##### Returns

`void`

#### Call Signature

> **createFile**(`uri`, `annotation`, `options?`): `string`

Defined in: node\_modules/.pnpm/vscode-languageserver-types@3.17.5/node\_modules/vscode-languageserver-types/lib/esm/main.d.ts:998

##### Parameters

###### uri

`string`

###### annotation

`string` \| [`ChangeAnnotation`](../interfaces/ChangeAnnotation.md)

###### options?

[`CreateFileOptions`](../interfaces/CreateFileOptions.md)

##### Returns

`string`

***

### deleteFile()

#### Call Signature

> **deleteFile**(`uri`, `options?`): `void`

Defined in: node\_modules/.pnpm/vscode-languageserver-types@3.17.5/node\_modules/vscode-languageserver-types/lib/esm/main.d.ts:1001

##### Parameters

###### uri

`string`

###### options?

[`DeleteFileOptions`](../interfaces/DeleteFileOptions.md)

##### Returns

`void`

#### Call Signature

> **deleteFile**(`uri`, `annotation`, `options?`): `string`

Defined in: node\_modules/.pnpm/vscode-languageserver-types@3.17.5/node\_modules/vscode-languageserver-types/lib/esm/main.d.ts:1002

##### Parameters

###### uri

`string`

###### annotation

`string` \| [`ChangeAnnotation`](../interfaces/ChangeAnnotation.md)

###### options?

[`DeleteFileOptions`](../interfaces/DeleteFileOptions.md)

##### Returns

`string`

***

### getTextEditChange()

#### Call Signature

> **getTextEditChange**(`textDocument`): [`TextEditChange`](../interfaces/TextEditChange.md)

Defined in: node\_modules/.pnpm/vscode-languageserver-types@3.17.5/node\_modules/vscode-languageserver-types/lib/esm/main.d.ts:993

Returns the [TextEditChange](../interfaces/TextEditChange.md) to manage text edits
for resources.

##### Parameters

###### textDocument

[`OptionalVersionedTextDocumentIdentifier`](../interfaces/OptionalVersionedTextDocumentIdentifier.md)

##### Returns

[`TextEditChange`](../interfaces/TextEditChange.md)

#### Call Signature

> **getTextEditChange**(`uri`): [`TextEditChange`](../interfaces/TextEditChange.md)

Defined in: node\_modules/.pnpm/vscode-languageserver-types@3.17.5/node\_modules/vscode-languageserver-types/lib/esm/main.d.ts:994

Returns the [TextEditChange](../interfaces/TextEditChange.md) to manage text edits
for resources.

##### Parameters

###### uri

`string`

##### Returns

[`TextEditChange`](../interfaces/TextEditChange.md)

***

### renameFile()

#### Call Signature

> **renameFile**(`oldUri`, `newUri`, `options?`): `void`

Defined in: node\_modules/.pnpm/vscode-languageserver-types@3.17.5/node\_modules/vscode-languageserver-types/lib/esm/main.d.ts:999

##### Parameters

###### oldUri

`string`

###### newUri

`string`

###### options?

[`RenameFileOptions`](../interfaces/RenameFileOptions.md)

##### Returns

`void`

#### Call Signature

> **renameFile**(`oldUri`, `newUri`, `annotation?`, `options?`): `string`

Defined in: node\_modules/.pnpm/vscode-languageserver-types@3.17.5/node\_modules/vscode-languageserver-types/lib/esm/main.d.ts:1000

##### Parameters

###### oldUri

`string`

###### newUri

`string`

###### annotation?

`string` \| [`ChangeAnnotation`](../interfaces/ChangeAnnotation.md)

###### options?

[`RenameFileOptions`](../interfaces/RenameFileOptions.md)

##### Returns

`string`
