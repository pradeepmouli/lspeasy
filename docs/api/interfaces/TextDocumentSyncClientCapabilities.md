[**lspeasy v1.0.0**](../README.md)

***

[lspeasy](../README.md) / TextDocumentSyncClientCapabilities

# Interface: TextDocumentSyncClientCapabilities

Defined in: node\_modules/.pnpm/vscode-languageserver-protocol@3.17.5/node\_modules/vscode-languageserver-protocol/lib/common/protocol.d.ts:1328

## Properties

### didSave?

> `optional` **didSave?**: `boolean`

Defined in: node\_modules/.pnpm/vscode-languageserver-protocol@3.17.5/node\_modules/vscode-languageserver-protocol/lib/common/protocol.d.ts:1346

The client supports did save notifications.

***

### dynamicRegistration?

> `optional` **dynamicRegistration?**: `boolean`

Defined in: node\_modules/.pnpm/vscode-languageserver-protocol@3.17.5/node\_modules/vscode-languageserver-protocol/lib/common/protocol.d.ts:1332

Whether text document synchronization supports dynamic registration.

***

### willSave?

> `optional` **willSave?**: `boolean`

Defined in: node\_modules/.pnpm/vscode-languageserver-protocol@3.17.5/node\_modules/vscode-languageserver-protocol/lib/common/protocol.d.ts:1336

The client supports sending will save notifications.

***

### willSaveWaitUntil?

> `optional` **willSaveWaitUntil?**: `boolean`

Defined in: node\_modules/.pnpm/vscode-languageserver-protocol@3.17.5/node\_modules/vscode-languageserver-protocol/lib/common/protocol.d.ts:1342

The client supports sending a will save request and
waits for a response providing text edits which will
be applied to the document before it is saved.
