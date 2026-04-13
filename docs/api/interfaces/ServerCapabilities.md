[**lspeasy v1.0.0**](../README.md)

***

[lspeasy](../README.md) / ServerCapabilities

# Interface: ServerCapabilities\<T\>

Defined in: node\_modules/.pnpm/vscode-languageserver-protocol@3.17.5/node\_modules/vscode-languageserver-protocol/lib/common/protocol.d.ts:809

Defines the capabilities provided by a language
server.

## Type Parameters

### T

`T` = [`LSPAny`](../type-aliases/LSPAny.md)

## Properties

### callHierarchyProvider?

> `optional` **callHierarchyProvider?**: `boolean` \| [`CallHierarchyOptions`](CallHierarchyOptions.md) \| [`CallHierarchyRegistrationOptions`](CallHierarchyRegistrationOptions.md)

Defined in: node\_modules/.pnpm/vscode-languageserver-protocol@3.17.5/node\_modules/vscode-languageserver-protocol/lib/common/protocol.d.ts:931

The server provides call hierarchy support.

#### Since

3.16.0

***

### codeActionProvider?

> `optional` **codeActionProvider?**: `boolean` \| [`CodeActionOptions`](CodeActionOptions.md)

Defined in: node\_modules/.pnpm/vscode-languageserver-protocol@3.17.5/node\_modules/vscode-languageserver-protocol/lib/common/protocol.d.ts:879

The server provides code actions. CodeActionOptions may only be
specified if the client states that it supports
`codeActionLiteralSupport` in its initial `initialize` request.

***

### codeLensProvider?

> `optional` **codeLensProvider?**: [`CodeLensOptions`](CodeLensOptions.md)

Defined in: node\_modules/.pnpm/vscode-languageserver-protocol@3.17.5/node\_modules/vscode-languageserver-protocol/lib/common/protocol.d.ts:883

The server provides code lens.

***

### colorProvider?

> `optional` **colorProvider?**: `boolean` \| [`DocumentColorOptions`](DocumentColorOptions.md) \| [`DocumentColorRegistrationOptions`](DocumentColorRegistrationOptions.md)

Defined in: node\_modules/.pnpm/vscode-languageserver-protocol@3.17.5/node\_modules/vscode-languageserver-protocol/lib/common/protocol.d.ts:891

The server provides color provider support.

***

### completionProvider?

> `optional` **completionProvider?**: [`CompletionOptions`](CompletionOptions.md)

Defined in: node\_modules/.pnpm/vscode-languageserver-protocol@3.17.5/node\_modules/vscode-languageserver-protocol/lib/common/protocol.d.ts:837

The server provides completion support.

***

### declarationProvider?

> `optional` **declarationProvider?**: `boolean` \| [`DeclarationOptions`](DeclarationOptions.md) \| [`DeclarationRegistrationOptions`](DeclarationRegistrationOptions.md)

Defined in: node\_modules/.pnpm/vscode-languageserver-protocol@3.17.5/node\_modules/vscode-languageserver-protocol/lib/common/protocol.d.ts:849

The server provides Goto Declaration support.

***

### definitionProvider?

> `optional` **definitionProvider?**: `boolean` \| [`DefinitionOptions`](DefinitionOptions.md)

Defined in: node\_modules/.pnpm/vscode-languageserver-protocol@3.17.5/node\_modules/vscode-languageserver-protocol/lib/common/protocol.d.ts:853

The server provides goto definition support.

***

### diagnosticProvider?

> `optional` **diagnosticProvider?**: [`DiagnosticOptions`](../type-aliases/DiagnosticOptions.md) \| [`DiagnosticRegistrationOptions`](../type-aliases/DiagnosticRegistrationOptions.md)

Defined in: node\_modules/.pnpm/vscode-languageserver-protocol@3.17.5/node\_modules/vscode-languageserver-protocol/lib/common/protocol.d.ts:973

The server has support for pull model diagnostics.

#### Since

3.17.0

***

### documentFormattingProvider?

> `optional` **documentFormattingProvider?**: `boolean` \| [`DocumentFormattingOptions`](DocumentFormattingOptions.md)

Defined in: node\_modules/.pnpm/vscode-languageserver-protocol@3.17.5/node\_modules/vscode-languageserver-protocol/lib/common/protocol.d.ts:899

The server provides document formatting.

***

### documentHighlightProvider?

> `optional` **documentHighlightProvider?**: `boolean` \| [`DocumentHighlightOptions`](DocumentHighlightOptions.md)

Defined in: node\_modules/.pnpm/vscode-languageserver-protocol@3.17.5/node\_modules/vscode-languageserver-protocol/lib/common/protocol.d.ts:869

The server provides document highlight support.

***

### documentLinkProvider?

> `optional` **documentLinkProvider?**: [`DocumentLinkOptions`](DocumentLinkOptions.md)

Defined in: node\_modules/.pnpm/vscode-languageserver-protocol@3.17.5/node\_modules/vscode-languageserver-protocol/lib/common/protocol.d.ts:887

The server provides document link support.

***

### documentOnTypeFormattingProvider?

> `optional` **documentOnTypeFormattingProvider?**: [`DocumentOnTypeFormattingOptions`](DocumentOnTypeFormattingOptions.md)

Defined in: node\_modules/.pnpm/vscode-languageserver-protocol@3.17.5/node\_modules/vscode-languageserver-protocol/lib/common/protocol.d.ts:907

The server provides document formatting on typing.

***

### documentRangeFormattingProvider?

> `optional` **documentRangeFormattingProvider?**: `boolean` \| [`DocumentRangeFormattingOptions`](DocumentRangeFormattingOptions.md)

Defined in: node\_modules/.pnpm/vscode-languageserver-protocol@3.17.5/node\_modules/vscode-languageserver-protocol/lib/common/protocol.d.ts:903

The server provides document range formatting.

***

### documentSymbolProvider?

> `optional` **documentSymbolProvider?**: `boolean` \| [`DocumentSymbolOptions`](DocumentSymbolOptions.md)

Defined in: node\_modules/.pnpm/vscode-languageserver-protocol@3.17.5/node\_modules/vscode-languageserver-protocol/lib/common/protocol.d.ts:873

The server provides document symbol support.

***

### executeCommandProvider?

> `optional` **executeCommandProvider?**: [`ExecuteCommandOptions`](ExecuteCommandOptions.md)

Defined in: node\_modules/.pnpm/vscode-languageserver-protocol@3.17.5/node\_modules/vscode-languageserver-protocol/lib/common/protocol.d.ts:925

The server provides execute command support.

***

### experimental?

> `optional` **experimental?**: `T`

Defined in: node\_modules/.pnpm/vscode-languageserver-protocol@3.17.5/node\_modules/vscode-languageserver-protocol/lib/common/protocol.d.ts:1001

Experimental server capabilities.

***

### foldingRangeProvider?

> `optional` **foldingRangeProvider?**: `boolean` \| [`FoldingRangeOptions`](FoldingRangeOptions.md) \| [`FoldingRangeRegistrationOptions`](FoldingRangeRegistrationOptions.md)

Defined in: node\_modules/.pnpm/vscode-languageserver-protocol@3.17.5/node\_modules/vscode-languageserver-protocol/lib/common/protocol.d.ts:917

The server provides folding provider support.

***

### hoverProvider?

> `optional` **hoverProvider?**: `boolean` \| [`HoverOptions`](HoverOptions.md)

Defined in: node\_modules/.pnpm/vscode-languageserver-protocol@3.17.5/node\_modules/vscode-languageserver-protocol/lib/common/protocol.d.ts:841

The server provides hover support.

***

### implementationProvider?

> `optional` **implementationProvider?**: `boolean` \| [`ImplementationOptions`](ImplementationOptions.md) \| [`ImplementationRegistrationOptions`](ImplementationRegistrationOptions.md)

Defined in: node\_modules/.pnpm/vscode-languageserver-protocol@3.17.5/node\_modules/vscode-languageserver-protocol/lib/common/protocol.d.ts:861

The server provides Goto Implementation support.

***

### inlayHintProvider?

> `optional` **inlayHintProvider?**: `boolean` \| [`InlayHintOptions`](../type-aliases/InlayHintOptions.md) \| [`InlayHintRegistrationOptions`](../type-aliases/InlayHintRegistrationOptions.md)

Defined in: node\_modules/.pnpm/vscode-languageserver-protocol@3.17.5/node\_modules/vscode-languageserver-protocol/lib/common/protocol.d.ts:967

The server provides inlay hints.

#### Since

3.17.0

***

### inlineCompletionProvider?

> `optional` **inlineCompletionProvider?**: `boolean` \| [`WorkDoneProgressOptions`](WorkDoneProgressOptions.md)

Defined in: node\_modules/.pnpm/vscode-languageserver-protocol@3.17.5/node\_modules/vscode-languageserver-protocol/lib/common/protocol.d.ts:980

Inline completion options used during static registration.

#### Since

3.18.0

#### Proposed

***

### inlineValueProvider?

> `optional` **inlineValueProvider?**: `boolean` \| [`WorkDoneProgressOptions`](WorkDoneProgressOptions.md) \| [`InlineValueRegistrationOptions`](../type-aliases/InlineValueRegistrationOptions.md)

Defined in: node\_modules/.pnpm/vscode-languageserver-protocol@3.17.5/node\_modules/vscode-languageserver-protocol/lib/common/protocol.d.ts:961

The server provides inline values.

#### Since

3.17.0

***

### linkedEditingRangeProvider?

> `optional` **linkedEditingRangeProvider?**: `boolean` \| [`LinkedEditingRangeOptions`](LinkedEditingRangeOptions.md) \| [`LinkedEditingRangeRegistrationOptions`](LinkedEditingRangeRegistrationOptions.md)

Defined in: node\_modules/.pnpm/vscode-languageserver-protocol@3.17.5/node\_modules/vscode-languageserver-protocol/lib/common/protocol.d.ts:937

The server provides linked editing range support.

#### Since

3.16.0

***

### monikerProvider?

> `optional` **monikerProvider?**: `boolean` \| [`MonikerOptions`](MonikerOptions.md) \| [`MonikerRegistrationOptions`](MonikerRegistrationOptions.md)

Defined in: node\_modules/.pnpm/vscode-languageserver-protocol@3.17.5/node\_modules/vscode-languageserver-protocol/lib/common/protocol.d.ts:949

The server provides moniker support.

#### Since

3.16.0

***

### notebookDocumentSync?

> `optional` **notebookDocumentSync?**: [`NotebookDocumentSyncOptions`](../type-aliases/NotebookDocumentSyncOptions.md) \| [`NotebookDocumentSyncRegistrationOptions`](../type-aliases/NotebookDocumentSyncRegistrationOptions.md)

Defined in: node\_modules/.pnpm/vscode-languageserver-protocol@3.17.5/node\_modules/vscode-languageserver-protocol/lib/common/protocol.d.ts:833

Defines how notebook documents are synced.

#### Since

3.17.0

***

### positionEncoding?

> `optional` **positionEncoding?**: `string`

Defined in: node\_modules/.pnpm/vscode-languageserver-protocol@3.17.5/node\_modules/vscode-languageserver-protocol/lib/common/protocol.d.ts:821

The position encoding the server picked from the encodings offered
by the client via the client capability `general.positionEncodings`.

If the client didn't provide any position encodings the only valid
value that a server can return is 'utf-16'.

If omitted it defaults to 'utf-16'.

#### Since

3.17.0

***

### referencesProvider?

> `optional` **referencesProvider?**: `boolean` \| [`ReferenceOptions`](ReferenceOptions.md)

Defined in: node\_modules/.pnpm/vscode-languageserver-protocol@3.17.5/node\_modules/vscode-languageserver-protocol/lib/common/protocol.d.ts:865

The server provides find references support.

***

### renameProvider?

> `optional` **renameProvider?**: `boolean` \| [`RenameOptions`](RenameOptions.md)

Defined in: node\_modules/.pnpm/vscode-languageserver-protocol@3.17.5/node\_modules/vscode-languageserver-protocol/lib/common/protocol.d.ts:913

The server provides rename support. RenameOptions may only be
specified if the client states that it supports
`prepareSupport` in its initial `initialize` request.

***

### selectionRangeProvider?

> `optional` **selectionRangeProvider?**: `boolean` \| [`SelectionRangeOptions`](SelectionRangeOptions.md) \| [`SelectionRangeRegistrationOptions`](SelectionRangeRegistrationOptions.md)

Defined in: node\_modules/.pnpm/vscode-languageserver-protocol@3.17.5/node\_modules/vscode-languageserver-protocol/lib/common/protocol.d.ts:921

The server provides selection range support.

***

### semanticTokensProvider?

> `optional` **semanticTokensProvider?**: [`SemanticTokensOptions`](SemanticTokensOptions.md) \| [`SemanticTokensRegistrationOptions`](SemanticTokensRegistrationOptions.md)

Defined in: node\_modules/.pnpm/vscode-languageserver-protocol@3.17.5/node\_modules/vscode-languageserver-protocol/lib/common/protocol.d.ts:943

The server provides semantic tokens support.

#### Since

3.16.0

***

### signatureHelpProvider?

> `optional` **signatureHelpProvider?**: [`SignatureHelpOptions`](SignatureHelpOptions.md)

Defined in: node\_modules/.pnpm/vscode-languageserver-protocol@3.17.5/node\_modules/vscode-languageserver-protocol/lib/common/protocol.d.ts:845

The server provides signature help support.

***

### textDocumentSync?

> `optional` **textDocumentSync?**: [`TextDocumentSyncOptions`](TextDocumentSyncOptions.md) \| [`TextDocumentSyncKind`](../type-aliases/TextDocumentSyncKind.md)

Defined in: node\_modules/.pnpm/vscode-languageserver-protocol@3.17.5/node\_modules/vscode-languageserver-protocol/lib/common/protocol.d.ts:827

Defines how text documents are synced. Is either a detailed structure
defining each notification or for backwards compatibility the
TextDocumentSyncKind number.

***

### typeDefinitionProvider?

> `optional` **typeDefinitionProvider?**: `boolean` \| [`TypeDefinitionOptions`](TypeDefinitionOptions.md) \| [`TypeDefinitionRegistrationOptions`](TypeDefinitionRegistrationOptions.md)

Defined in: node\_modules/.pnpm/vscode-languageserver-protocol@3.17.5/node\_modules/vscode-languageserver-protocol/lib/common/protocol.d.ts:857

The server provides Goto Type Definition support.

***

### typeHierarchyProvider?

> `optional` **typeHierarchyProvider?**: `boolean` \| [`WorkDoneProgressOptions`](WorkDoneProgressOptions.md) \| [`TypeHierarchyRegistrationOptions`](../type-aliases/TypeHierarchyRegistrationOptions.md)

Defined in: node\_modules/.pnpm/vscode-languageserver-protocol@3.17.5/node\_modules/vscode-languageserver-protocol/lib/common/protocol.d.ts:955

The server provides type hierarchy support.

#### Since

3.17.0

***

### workspace?

> `optional` **workspace?**: `object`

Defined in: node\_modules/.pnpm/vscode-languageserver-protocol@3.17.5/node\_modules/vscode-languageserver-protocol/lib/common/protocol.d.ts:984

Workspace specific server capabilities.

#### fileOperations?

> `optional` **fileOperations?**: [`FileOperationOptions`](FileOperationOptions.md)

The server is interested in notifications/requests for operations on files.

##### Since

3.16.0

#### workspaceFolders?

> `optional` **workspaceFolders?**: `WorkspaceFoldersServerCapabilities`

The server supports workspace folder.

##### Since

3.6.0

***

### workspaceSymbolProvider?

> `optional` **workspaceSymbolProvider?**: `boolean` \| [`WorkspaceSymbolOptions`](WorkspaceSymbolOptions.md)

Defined in: node\_modules/.pnpm/vscode-languageserver-protocol@3.17.5/node\_modules/vscode-languageserver-protocol/lib/common/protocol.d.ts:895

The server provides workspace symbol support.
