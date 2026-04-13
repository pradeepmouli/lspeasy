[**lspeasy v1.0.0**](../README.md)

***

[lspeasy](../README.md) / ApplyWorkspaceEditParams

# Interface: ApplyWorkspaceEditParams

Defined in: node\_modules/.pnpm/vscode-languageserver-protocol@3.17.5/node\_modules/vscode-languageserver-protocol/lib/common/protocol.d.ts:3204

The parameters passed via an apply workspace edit request.

## Properties

### edit

> **edit**: [`WorkspaceEdit`](WorkspaceEdit.md)

Defined in: node\_modules/.pnpm/vscode-languageserver-protocol@3.17.5/node\_modules/vscode-languageserver-protocol/lib/common/protocol.d.ts:3214

The edits to apply.

***

### label?

> `optional` **label?**: `string`

Defined in: node\_modules/.pnpm/vscode-languageserver-protocol@3.17.5/node\_modules/vscode-languageserver-protocol/lib/common/protocol.d.ts:3210

An optional label of the workspace edit. This label is
presented in the user interface for example on an undo
stack to undo the workspace edit.
