[**lspeasy v1.0.0**](../README.md)

***

[lspeasy](../README.md) / TextDocumentClientCapabilities

# Interface: TextDocumentClientCapabilities

Defined in: node\_modules/.pnpm/vscode-languageserver-protocol@3.17.5/node\_modules/vscode-languageserver-protocol/lib/common/protocol.d.ts:386

Text document specific client capabilities.

## Properties

### callHierarchy?

> `optional` **callHierarchy?**: [`CallHierarchyClientCapabilities`](CallHierarchyClientCapabilities.md)

Defined in: node\_modules/.pnpm/vscode-languageserver-protocol@3.17.5/node\_modules/vscode-languageserver-protocol/lib/common/protocol.d.ts:493

Capabilities specific to the various call hierarchy requests.

#### Since

3.16.0

***

### codeAction?

> `optional` **codeAction?**: [`CodeActionClientCapabilities`](CodeActionClientCapabilities.md)

Defined in: node\_modules/.pnpm/vscode-languageserver-protocol@3.17.5/node\_modules/vscode-languageserver-protocol/lib/common/protocol.d.ts:440

Capabilities specific to the `textDocument/codeAction` request.

***

### codeLens?

> `optional` **codeLens?**: [`CodeLensClientCapabilities`](CodeLensClientCapabilities.md)

Defined in: node\_modules/.pnpm/vscode-languageserver-protocol@3.17.5/node\_modules/vscode-languageserver-protocol/lib/common/protocol.d.ts:444

Capabilities specific to the `textDocument/codeLens` request.

***

### colorProvider?

> `optional` **colorProvider?**: `DocumentColorClientCapabilities`

Defined in: node\_modules/.pnpm/vscode-languageserver-protocol@3.17.5/node\_modules/vscode-languageserver-protocol/lib/common/protocol.d.ts:455

Capabilities specific to the `textDocument/documentColor` and the
`textDocument/colorPresentation` request.

#### Since

3.6.0

***

### completion?

> `optional` **completion?**: [`CompletionClientCapabilities`](CompletionClientCapabilities.md)

Defined in: node\_modules/.pnpm/vscode-languageserver-protocol@3.17.5/node\_modules/vscode-languageserver-protocol/lib/common/protocol.d.ts:394

Capabilities specific to the `textDocument/completion` request.

***

### declaration?

> `optional` **declaration?**: [`DeclarationClientCapabilities`](DeclarationClientCapabilities.md)

Defined in: node\_modules/.pnpm/vscode-languageserver-protocol@3.17.5/node\_modules/vscode-languageserver-protocol/lib/common/protocol.d.ts:408

Capabilities specific to the `textDocument/declaration` request.

#### Since

3.14.0

***

### definition?

> `optional` **definition?**: [`DefinitionClientCapabilities`](DefinitionClientCapabilities.md)

Defined in: node\_modules/.pnpm/vscode-languageserver-protocol@3.17.5/node\_modules/vscode-languageserver-protocol/lib/common/protocol.d.ts:412

Capabilities specific to the `textDocument/definition` request.

***

### diagnostic?

> `optional` **diagnostic?**: [`DiagnosticClientCapabilities`](../type-aliases/DiagnosticClientCapabilities.md)

Defined in: node\_modules/.pnpm/vscode-languageserver-protocol@3.17.5/node\_modules/vscode-languageserver-protocol/lib/common/protocol.d.ts:535

Capabilities specific to the diagnostic pull model.

#### Since

3.17.0

***

### documentHighlight?

> `optional` **documentHighlight?**: [`DocumentHighlightClientCapabilities`](DocumentHighlightClientCapabilities.md)

Defined in: node\_modules/.pnpm/vscode-languageserver-protocol@3.17.5/node\_modules/vscode-languageserver-protocol/lib/common/protocol.d.ts:432

Capabilities specific to the `textDocument/documentHighlight` request.

***

### documentLink?

> `optional` **documentLink?**: [`DocumentLinkClientCapabilities`](DocumentLinkClientCapabilities.md)

Defined in: node\_modules/.pnpm/vscode-languageserver-protocol@3.17.5/node\_modules/vscode-languageserver-protocol/lib/common/protocol.d.ts:448

Capabilities specific to the `textDocument/documentLink` request.

***

### documentSymbol?

> `optional` **documentSymbol?**: [`DocumentSymbolClientCapabilities`](DocumentSymbolClientCapabilities.md)

Defined in: node\_modules/.pnpm/vscode-languageserver-protocol@3.17.5/node\_modules/vscode-languageserver-protocol/lib/common/protocol.d.ts:436

Capabilities specific to the `textDocument/documentSymbol` request.

***

### foldingRange?

> `optional` **foldingRange?**: [`FoldingRangeClientCapabilities`](FoldingRangeClientCapabilities.md)

Defined in: node\_modules/.pnpm/vscode-languageserver-protocol@3.17.5/node\_modules/vscode-languageserver-protocol/lib/common/protocol.d.ts:477

Capabilities specific to the `textDocument/foldingRange` request.

#### Since

3.10.0

***

### formatting?

> `optional` **formatting?**: [`DocumentFormattingClientCapabilities`](DocumentFormattingClientCapabilities.md)

Defined in: node\_modules/.pnpm/vscode-languageserver-protocol@3.17.5/node\_modules/vscode-languageserver-protocol/lib/common/protocol.d.ts:459

Capabilities specific to the `textDocument/formatting` request.

***

### hover?

> `optional` **hover?**: [`HoverClientCapabilities`](HoverClientCapabilities.md)

Defined in: node\_modules/.pnpm/vscode-languageserver-protocol@3.17.5/node\_modules/vscode-languageserver-protocol/lib/common/protocol.d.ts:398

Capabilities specific to the `textDocument/hover` request.

***

### implementation?

> `optional` **implementation?**: `ImplementationClientCapabilities`

Defined in: node\_modules/.pnpm/vscode-languageserver-protocol@3.17.5/node\_modules/vscode-languageserver-protocol/lib/common/protocol.d.ts:424

Capabilities specific to the `textDocument/implementation` request.

#### Since

3.6.0

***

### inlayHint?

> `optional` **inlayHint?**: [`InlayHintClientCapabilities`](../type-aliases/InlayHintClientCapabilities.md)

Defined in: node\_modules/.pnpm/vscode-languageserver-protocol@3.17.5/node\_modules/vscode-languageserver-protocol/lib/common/protocol.d.ts:529

Capabilities specific to the `textDocument/inlayHint` request.

#### Since

3.17.0

***

### inlineCompletion?

> `optional` **inlineCompletion?**: [`InlineCompletionClientCapabilities`](../type-aliases/InlineCompletionClientCapabilities.md)

Defined in: node\_modules/.pnpm/vscode-languageserver-protocol@3.17.5/node\_modules/vscode-languageserver-protocol/lib/common/protocol.d.ts:542

Client capabilities specific to inline completions.

#### Since

3.18.0

#### Proposed

***

### inlineValue?

> `optional` **inlineValue?**: [`InlineValueClientCapabilities`](../type-aliases/InlineValueClientCapabilities.md)

Defined in: node\_modules/.pnpm/vscode-languageserver-protocol@3.17.5/node\_modules/vscode-languageserver-protocol/lib/common/protocol.d.ts:523

Capabilities specific to the `textDocument/inlineValue` request.

#### Since

3.17.0

***

### linkedEditingRange?

> `optional` **linkedEditingRange?**: [`LinkedEditingRangeClientCapabilities`](LinkedEditingRangeClientCapabilities.md)

Defined in: node\_modules/.pnpm/vscode-languageserver-protocol@3.17.5/node\_modules/vscode-languageserver-protocol/lib/common/protocol.d.ts:505

Capabilities specific to the `textDocument/linkedEditingRange` request.

#### Since

3.16.0

***

### moniker?

> `optional` **moniker?**: [`MonikerClientCapabilities`](MonikerClientCapabilities.md)

Defined in: node\_modules/.pnpm/vscode-languageserver-protocol@3.17.5/node\_modules/vscode-languageserver-protocol/lib/common/protocol.d.ts:511

Client capabilities specific to the `textDocument/moniker` request.

#### Since

3.16.0

***

### onTypeFormatting?

> `optional` **onTypeFormatting?**: [`DocumentOnTypeFormattingClientCapabilities`](DocumentOnTypeFormattingClientCapabilities.md)

Defined in: node\_modules/.pnpm/vscode-languageserver-protocol@3.17.5/node\_modules/vscode-languageserver-protocol/lib/common/protocol.d.ts:467

Capabilities specific to the `textDocument/onTypeFormatting` request.

***

### publishDiagnostics?

> `optional` **publishDiagnostics?**: [`PublishDiagnosticsClientCapabilities`](PublishDiagnosticsClientCapabilities.md)

Defined in: node\_modules/.pnpm/vscode-languageserver-protocol@3.17.5/node\_modules/vscode-languageserver-protocol/lib/common/protocol.d.ts:487

Capabilities specific to the `textDocument/publishDiagnostics` notification.

***

### rangeFormatting?

> `optional` **rangeFormatting?**: [`DocumentRangeFormattingClientCapabilities`](DocumentRangeFormattingClientCapabilities.md)

Defined in: node\_modules/.pnpm/vscode-languageserver-protocol@3.17.5/node\_modules/vscode-languageserver-protocol/lib/common/protocol.d.ts:463

Capabilities specific to the `textDocument/rangeFormatting` request.

***

### references?

> `optional` **references?**: [`ReferenceClientCapabilities`](ReferenceClientCapabilities.md)

Defined in: node\_modules/.pnpm/vscode-languageserver-protocol@3.17.5/node\_modules/vscode-languageserver-protocol/lib/common/protocol.d.ts:428

Capabilities specific to the `textDocument/references` request.

***

### rename?

> `optional` **rename?**: [`RenameClientCapabilities`](RenameClientCapabilities.md)

Defined in: node\_modules/.pnpm/vscode-languageserver-protocol@3.17.5/node\_modules/vscode-languageserver-protocol/lib/common/protocol.d.ts:471

Capabilities specific to the `textDocument/rename` request.

***

### selectionRange?

> `optional` **selectionRange?**: [`SelectionRangeClientCapabilities`](SelectionRangeClientCapabilities.md)

Defined in: node\_modules/.pnpm/vscode-languageserver-protocol@3.17.5/node\_modules/vscode-languageserver-protocol/lib/common/protocol.d.ts:483

Capabilities specific to the `textDocument/selectionRange` request.

#### Since

3.15.0

***

### semanticTokens?

> `optional` **semanticTokens?**: [`SemanticTokensClientCapabilities`](SemanticTokensClientCapabilities.md)

Defined in: node\_modules/.pnpm/vscode-languageserver-protocol@3.17.5/node\_modules/vscode-languageserver-protocol/lib/common/protocol.d.ts:499

Capabilities specific to the various semantic token request.

#### Since

3.16.0

***

### signatureHelp?

> `optional` **signatureHelp?**: [`SignatureHelpClientCapabilities`](SignatureHelpClientCapabilities.md)

Defined in: node\_modules/.pnpm/vscode-languageserver-protocol@3.17.5/node\_modules/vscode-languageserver-protocol/lib/common/protocol.d.ts:402

Capabilities specific to the `textDocument/signatureHelp` request.

***

### synchronization?

> `optional` **synchronization?**: [`TextDocumentSyncClientCapabilities`](TextDocumentSyncClientCapabilities.md)

Defined in: node\_modules/.pnpm/vscode-languageserver-protocol@3.17.5/node\_modules/vscode-languageserver-protocol/lib/common/protocol.d.ts:390

Defines which synchronization capabilities the client supports.

***

### typeDefinition?

> `optional` **typeDefinition?**: `TypeDefinitionClientCapabilities`

Defined in: node\_modules/.pnpm/vscode-languageserver-protocol@3.17.5/node\_modules/vscode-languageserver-protocol/lib/common/protocol.d.ts:418

Capabilities specific to the `textDocument/typeDefinition` request.

#### Since

3.6.0

***

### typeHierarchy?

> `optional` **typeHierarchy?**: [`TypeHierarchyClientCapabilities`](../type-aliases/TypeHierarchyClientCapabilities.md)

Defined in: node\_modules/.pnpm/vscode-languageserver-protocol@3.17.5/node\_modules/vscode-languageserver-protocol/lib/common/protocol.d.ts:517

Capabilities specific to the various type hierarchy requests.

#### Since

3.17.0
