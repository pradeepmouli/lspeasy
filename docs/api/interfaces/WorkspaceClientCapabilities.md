[**lspeasy v1.0.0**](../README.md)

***

[lspeasy](../README.md) / WorkspaceClientCapabilities

# Interface: WorkspaceClientCapabilities

Defined in: node\_modules/.pnpm/vscode-languageserver-protocol@3.17.5/node\_modules/vscode-languageserver-protocol/lib/common/protocol.d.ts:295

Workspace specific client capabilities.

## Properties

### applyEdit?

> `optional` **applyEdit?**: `boolean`

Defined in: node\_modules/.pnpm/vscode-languageserver-protocol@3.17.5/node\_modules/vscode-languageserver-protocol/lib/common/protocol.d.ts:301

The client supports applying batch edits
to the workspace by supporting the request
'workspace/applyEdit'

***

### codeLens?

> `optional` **codeLens?**: [`CodeLensWorkspaceClientCapabilities`](CodeLensWorkspaceClientCapabilities.md)

Defined in: node\_modules/.pnpm/vscode-languageserver-protocol@3.17.5/node\_modules/vscode-languageserver-protocol/lib/common/protocol.d.ts:347

Capabilities specific to the code lens requests scoped to the
workspace.

#### Since

3.16.0.

***

### configuration?

> `optional` **configuration?**: `boolean`

Defined in: node\_modules/.pnpm/vscode-languageserver-protocol@3.17.5/node\_modules/vscode-languageserver-protocol/lib/common/protocol.d.ts:333

The client supports `workspace/configuration` requests.

#### Since

3.6.0

***

### diagnostics?

> `optional` **diagnostics?**: `DiagnosticWorkspaceClientCapabilities`

Defined in: node\_modules/.pnpm/vscode-languageserver-protocol@3.17.5/node\_modules/vscode-languageserver-protocol/lib/common/protocol.d.ts:374

Capabilities specific to the diagnostic requests scoped to the
workspace.

#### Since

3.17.0.

***

### didChangeConfiguration?

> `optional` **didChangeConfiguration?**: [`DidChangeConfigurationClientCapabilities`](DidChangeConfigurationClientCapabilities.md)

Defined in: node\_modules/.pnpm/vscode-languageserver-protocol@3.17.5/node\_modules/vscode-languageserver-protocol/lib/common/protocol.d.ts:309

Capabilities specific to the `workspace/didChangeConfiguration` notification.

***

### didChangeWatchedFiles?

> `optional` **didChangeWatchedFiles?**: [`DidChangeWatchedFilesClientCapabilities`](DidChangeWatchedFilesClientCapabilities.md)

Defined in: node\_modules/.pnpm/vscode-languageserver-protocol@3.17.5/node\_modules/vscode-languageserver-protocol/lib/common/protocol.d.ts:313

Capabilities specific to the `workspace/didChangeWatchedFiles` notification.

***

### executeCommand?

> `optional` **executeCommand?**: [`ExecuteCommandClientCapabilities`](ExecuteCommandClientCapabilities.md)

Defined in: node\_modules/.pnpm/vscode-languageserver-protocol@3.17.5/node\_modules/vscode-languageserver-protocol/lib/common/protocol.d.ts:321

Capabilities specific to the `workspace/executeCommand` request.

***

### fileOperations?

> `optional` **fileOperations?**: [`FileOperationClientCapabilities`](FileOperationClientCapabilities.md)

Defined in: node\_modules/.pnpm/vscode-languageserver-protocol@3.17.5/node\_modules/vscode-languageserver-protocol/lib/common/protocol.d.ts:353

The client has support for file notifications/requests for user operations on files.

Since 3.16.0

***

### foldingRange?

> `optional` **foldingRange?**: `FoldingRangeWorkspaceClientCapabilities`

Defined in: node\_modules/.pnpm/vscode-languageserver-protocol@3.17.5/node\_modules/vscode-languageserver-protocol/lib/common/protocol.d.ts:381

Capabilities specific to the folding range requests scoped to the workspace.

#### Since

3.18.0

#### Proposed

***

### inlayHint?

> `optional` **inlayHint?**: [`InlayHintWorkspaceClientCapabilities`](../type-aliases/InlayHintWorkspaceClientCapabilities.md)

Defined in: node\_modules/.pnpm/vscode-languageserver-protocol@3.17.5/node\_modules/vscode-languageserver-protocol/lib/common/protocol.d.ts:367

Capabilities specific to the inlay hint requests scoped to the
workspace.

#### Since

3.17.0.

***

### inlineValue?

> `optional` **inlineValue?**: [`InlineValueWorkspaceClientCapabilities`](../type-aliases/InlineValueWorkspaceClientCapabilities.md)

Defined in: node\_modules/.pnpm/vscode-languageserver-protocol@3.17.5/node\_modules/vscode-languageserver-protocol/lib/common/protocol.d.ts:360

Capabilities specific to the inline values requests scoped to the
workspace.

#### Since

3.17.0.

***

### semanticTokens?

> `optional` **semanticTokens?**: `SemanticTokensWorkspaceClientCapabilities`

Defined in: node\_modules/.pnpm/vscode-languageserver-protocol@3.17.5/node\_modules/vscode-languageserver-protocol/lib/common/protocol.d.ts:340

Capabilities specific to the semantic token requests scoped to the
workspace.

#### Since

3.16.0.

***

### symbol?

> `optional` **symbol?**: [`WorkspaceSymbolClientCapabilities`](WorkspaceSymbolClientCapabilities.md)

Defined in: node\_modules/.pnpm/vscode-languageserver-protocol@3.17.5/node\_modules/vscode-languageserver-protocol/lib/common/protocol.d.ts:317

Capabilities specific to the `workspace/symbol` request.

***

### workspaceEdit?

> `optional` **workspaceEdit?**: [`WorkspaceEditClientCapabilities`](WorkspaceEditClientCapabilities.md)

Defined in: node\_modules/.pnpm/vscode-languageserver-protocol@3.17.5/node\_modules/vscode-languageserver-protocol/lib/common/protocol.d.ts:305

Capabilities specific to `WorkspaceEdit`s.

***

### workspaceFolders?

> `optional` **workspaceFolders?**: `boolean`

Defined in: node\_modules/.pnpm/vscode-languageserver-protocol@3.17.5/node\_modules/vscode-languageserver-protocol/lib/common/protocol.d.ts:327

The client has support for workspace folders.

#### Since

3.6.0
