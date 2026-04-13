[**lspeasy v1.0.0**](../README.md)

***

[lspeasy](../README.md) / CodeActionContext

# Interface: CodeActionContext

Defined in: node\_modules/.pnpm/vscode-languageserver-types@3.17.5/node\_modules/vscode-languageserver-types/lib/esm/main.d.ts:2134

Contains additional diagnostic information about the context in which
a CodeActionProvider.provideCodeActions code action is run.

## Properties

### diagnostics

> **diagnostics**: [`Diagnostic`](Diagnostic.md)[]

Defined in: node\_modules/.pnpm/vscode-languageserver-types@3.17.5/node\_modules/vscode-languageserver-types/lib/esm/main.d.ts:2142

An array of diagnostics known on the client side overlapping the range provided to the
`textDocument/codeAction` request. They are provided so that the server knows which
errors are currently presented to the user for the given range. There is no guarantee
that these accurately reflect the error state of the resource. The primary parameter
to compute code actions is the provided range.

***

### only?

> `optional` **only?**: `string`[]

Defined in: node\_modules/.pnpm/vscode-languageserver-types@3.17.5/node\_modules/vscode-languageserver-types/lib/esm/main.d.ts:2149

Requested kind of actions to return.

Actions not of this kind are filtered out by the client before being shown. So servers
can omit computing them.

***

### triggerKind?

> `optional` **triggerKind?**: [`CodeActionTriggerKind`](../type-aliases/CodeActionTriggerKind.md)

Defined in: node\_modules/.pnpm/vscode-languageserver-types@3.17.5/node\_modules/vscode-languageserver-types/lib/esm/main.d.ts:2155

The reason why code actions were requested.

#### Since

3.17.0
