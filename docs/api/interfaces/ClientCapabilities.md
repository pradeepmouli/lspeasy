[**lspeasy v1.0.0**](../README.md)

***

[lspeasy](../README.md) / ClientCapabilities

# Interface: ClientCapabilities

Defined in: node\_modules/.pnpm/vscode-languageserver-protocol@3.17.5/node\_modules/vscode-languageserver-protocol/lib/common/protocol.d.ts:716

Defines the capabilities provided by the client.

## Properties

### experimental?

> `optional` **experimental?**: `any`

Defined in: node\_modules/.pnpm/vscode-languageserver-protocol@3.17.5/node\_modules/vscode-languageserver-protocol/lib/common/protocol.d.ts:744

Experimental client capabilities.

***

### general?

> `optional` **general?**: [`GeneralClientCapabilities`](GeneralClientCapabilities.md)

Defined in: node\_modules/.pnpm/vscode-languageserver-protocol@3.17.5/node\_modules/vscode-languageserver-protocol/lib/common/protocol.d.ts:740

General client capabilities.

#### Since

3.16.0

***

### notebookDocument?

> `optional` **notebookDocument?**: [`NotebookDocumentClientCapabilities`](NotebookDocumentClientCapabilities.md)

Defined in: node\_modules/.pnpm/vscode-languageserver-protocol@3.17.5/node\_modules/vscode-languageserver-protocol/lib/common/protocol.d.ts:730

Capabilities specific to the notebook document support.

#### Since

3.17.0

***

### textDocument?

> `optional` **textDocument?**: [`TextDocumentClientCapabilities`](TextDocumentClientCapabilities.md)

Defined in: node\_modules/.pnpm/vscode-languageserver-protocol@3.17.5/node\_modules/vscode-languageserver-protocol/lib/common/protocol.d.ts:724

Text document specific client capabilities.

***

### window?

> `optional` **window?**: [`WindowClientCapabilities`](WindowClientCapabilities.md)

Defined in: node\_modules/.pnpm/vscode-languageserver-protocol@3.17.5/node\_modules/vscode-languageserver-protocol/lib/common/protocol.d.ts:734

Window specific client capabilities.

***

### workspace?

> `optional` **workspace?**: [`WorkspaceClientCapabilities`](WorkspaceClientCapabilities.md)

Defined in: node\_modules/.pnpm/vscode-languageserver-protocol@3.17.5/node\_modules/vscode-languageserver-protocol/lib/common/protocol.d.ts:720

Workspace specific client capabilities.
