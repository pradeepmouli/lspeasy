[**lspeasy v1.0.0**](../README.md)

***

[lspeasy](../README.md) / NotebookDocumentSyncOptions

# Type Alias: NotebookDocumentSyncOptions

> **NotebookDocumentSyncOptions** = `object`

Defined in: node\_modules/.pnpm/vscode-languageserver-protocol@3.17.5/node\_modules/vscode-languageserver-protocol/lib/common/protocol.notebook.d.ts:169

Options specific to a notebook plus its cells
to be synced to the server.

If a selector provides a notebook document
filter but no cell selector all cells of a
matching notebook document will be synced.

If a selector provides no notebook document
filter but only a cell selector all notebook
document that contain at least one matching
cell will be synced.

## Since

3.17.0

## Properties

### notebookSelector

> **notebookSelector**: (\{ `cells?`: `object`[]; `notebook`: `string` \| [`NotebookDocumentFilter`](NotebookDocumentFilter.md); \} \| \{ `cells`: `object`[]; `notebook?`: `string` \| [`NotebookDocumentFilter`](NotebookDocumentFilter.md); \})[]

Defined in: node\_modules/.pnpm/vscode-languageserver-protocol@3.17.5/node\_modules/vscode-languageserver-protocol/lib/common/protocol.notebook.d.ts:173

The notebooks to be synced

***

### save?

> `optional` **save?**: `boolean`

Defined in: node\_modules/.pnpm/vscode-languageserver-protocol@3.17.5/node\_modules/vscode-languageserver-protocol/lib/common/protocol.notebook.d.ts:204

Whether save notification should be forwarded to
the server. Will only be honored if mode === `notebook`.
