[**lspeasy v1.0.0**](../README.md)

***

[lspeasy](../README.md) / TextDocumentSyncOptions

# Interface: TextDocumentSyncOptions

Defined in: node\_modules/.pnpm/vscode-languageserver-protocol@3.17.5/node\_modules/vscode-languageserver-protocol/lib/common/protocol.d.ts:1370

## Properties

### change?

> `optional` **change?**: [`TextDocumentSyncKind`](../type-aliases/TextDocumentSyncKind.md)

Defined in: node\_modules/.pnpm/vscode-languageserver-protocol@3.17.5/node\_modules/vscode-languageserver-protocol/lib/common/protocol.d.ts:1380

Change notifications are sent to the server. See TextDocumentSyncKind.None, TextDocumentSyncKind.Full
and TextDocumentSyncKind.Incremental. If omitted it defaults to TextDocumentSyncKind.None.

***

### openClose?

> `optional` **openClose?**: `boolean`

Defined in: node\_modules/.pnpm/vscode-languageserver-protocol@3.17.5/node\_modules/vscode-languageserver-protocol/lib/common/protocol.d.ts:1375

Open and close notifications are sent to the server. If omitted open close notification should not
be sent.

***

### save?

> `optional` **save?**: `boolean` \| [`SaveOptions`](SaveOptions.md)

Defined in: node\_modules/.pnpm/vscode-languageserver-protocol@3.17.5/node\_modules/vscode-languageserver-protocol/lib/common/protocol.d.ts:1395

If present save notifications are sent to the server. If omitted the notification should not be
sent.

***

### willSave?

> `optional` **willSave?**: `boolean`

Defined in: node\_modules/.pnpm/vscode-languageserver-protocol@3.17.5/node\_modules/vscode-languageserver-protocol/lib/common/protocol.d.ts:1385

If present will save notifications are sent to the server. If omitted the notification should not be
sent.

***

### willSaveWaitUntil?

> `optional` **willSaveWaitUntil?**: `boolean`

Defined in: node\_modules/.pnpm/vscode-languageserver-protocol@3.17.5/node\_modules/vscode-languageserver-protocol/lib/common/protocol.d.ts:1390

If present will save wait until requests are sent to the server. If omitted the request should not be
sent.
