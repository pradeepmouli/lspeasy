[**lspeasy v1.0.0**](../../../../README.md)

***

[lspeasy](../../../../README.md) / [CodeAction](../README.md) / create

# Function: create()

## Call Signature

> **create**(`title`, `kind?`): [`CodeAction`](../../../../interfaces/CodeAction.md)

Defined in: node\_modules/.pnpm/vscode-languageserver-types@3.17.5/node\_modules/vscode-languageserver-types/lib/esm/main.d.ts:2252

Creates a new code action.

### Parameters

#### title

`string`

The title of the code action.

#### kind?

`string`

The kind of the code action.

### Returns

[`CodeAction`](../../../../interfaces/CodeAction.md)

## Call Signature

> **create**(`title`, `command`, `kind?`): [`CodeAction`](../../../../interfaces/CodeAction.md)

Defined in: node\_modules/.pnpm/vscode-languageserver-types@3.17.5/node\_modules/vscode-languageserver-types/lib/esm/main.d.ts:2260

Creates a new code action.

### Parameters

#### title

`string`

The title of the code action.

#### command

[`Command`](../../../../interfaces/Command.md)

The command to execute.

#### kind?

`string`

The kind of the code action.

### Returns

[`CodeAction`](../../../../interfaces/CodeAction.md)

## Call Signature

> **create**(`title`, `edit`, `kind?`): [`CodeAction`](../../../../interfaces/CodeAction.md)

Defined in: node\_modules/.pnpm/vscode-languageserver-types@3.17.5/node\_modules/vscode-languageserver-types/lib/esm/main.d.ts:2268

Creates a new code action.

### Parameters

#### title

`string`

The title of the code action.

#### edit

[`WorkspaceEdit`](../../../../interfaces/WorkspaceEdit.md)

The edit to perform.

#### kind?

`string`

The kind of the code action.

### Returns

[`CodeAction`](../../../../interfaces/CodeAction.md)
