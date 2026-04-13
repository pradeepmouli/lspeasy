[**lspeasy v1.0.0**](../README.md)

***

[lspeasy](../README.md) / CodeAction

# Interface: CodeAction

Defined in: node\_modules/.pnpm/vscode-languageserver-types@3.17.5/node\_modules/vscode-languageserver-types/lib/esm/main.d.ts:2177

A code action represents a change that can be performed in code, e.g. to fix a problem or
to refactor code.

A CodeAction must set either `edit` and/or a `command`. If both are supplied, the `edit` is applied first, then the `command` is executed.

## Properties

### command?

> `optional` **command?**: [`Command`](Command.md)

Defined in: node\_modules/.pnpm/vscode-languageserver-types@3.17.5/node\_modules/vscode-languageserver-types/lib/esm/main.d.ts:2236

A command this code action executes. If a code action
provides an edit and a command, first the edit is
executed and then the command.

***

### data?

> `optional` **data?**: `any`

Defined in: node\_modules/.pnpm/vscode-languageserver-types@3.17.5/node\_modules/vscode-languageserver-types/lib/esm/main.d.ts:2243

A data entry field that is preserved on a code action between
a `textDocument/codeAction` and a `codeAction/resolve` request.

#### Since

3.16.0

***

### diagnostics?

> `optional` **diagnostics?**: [`Diagnostic`](Diagnostic.md)[]

Defined in: node\_modules/.pnpm/vscode-languageserver-types@3.17.5/node\_modules/vscode-languageserver-types/lib/esm/main.d.ts:2191

The diagnostics that this code action resolves.

***

### disabled?

> `optional` **disabled?**: `object`

Defined in: node\_modules/.pnpm/vscode-languageserver-types@3.17.5/node\_modules/vscode-languageserver-types/lib/esm/main.d.ts:2219

Marks that the code action cannot currently be applied.

Clients should follow the following guidelines regarding disabled code actions:

  - Disabled code actions are not shown in automatic [lightbulbs](https://code.visualstudio.com/docs/editor/editingevolved#_code-action)
    code action menus.

  - Disabled actions are shown as faded out in the code action menu when the user requests a more specific type
    of code action, such as refactorings.

  - If the user has a [keybinding](https://code.visualstudio.com/docs/editor/refactoring#_keybindings-for-code-actions)
    that auto applies a code action and only disabled code actions are returned, the client should show the user an
    error message with `reason` in the editor.

#### reason

> **reason**: `string`

Human readable description of why the code action is currently disabled.

This is displayed in the code actions UI.

#### Since

3.16.0

***

### edit?

> `optional` **edit?**: [`WorkspaceEdit`](WorkspaceEdit.md)

Defined in: node\_modules/.pnpm/vscode-languageserver-types@3.17.5/node\_modules/vscode-languageserver-types/lib/esm/main.d.ts:2230

The workspace edit this code action performs.

***

### isPreferred?

> `optional` **isPreferred?**: `boolean`

Defined in: node\_modules/.pnpm/vscode-languageserver-types@3.17.5/node\_modules/vscode-languageserver-types/lib/esm/main.d.ts:2201

Marks this as a preferred action. Preferred actions are used by the `auto fix` command and can be targeted
by keybindings.

A quick fix should be marked preferred if it properly addresses the underlying error.
A refactoring should be marked preferred if it is the most reasonable choice of actions to take.

#### Since

3.15.0

***

### kind?

> `optional` **kind?**: `string`

Defined in: node\_modules/.pnpm/vscode-languageserver-types@3.17.5/node\_modules/vscode-languageserver-types/lib/esm/main.d.ts:2187

The kind of the code action.

Used to filter code actions.

***

### title

> **title**: `string`

Defined in: node\_modules/.pnpm/vscode-languageserver-types@3.17.5/node\_modules/vscode-languageserver-types/lib/esm/main.d.ts:2181

A short, human-readable, title for this code action.
