[**lspeasy v1.0.0**](../README.md)

***

[lspeasy](../README.md) / FileOperationClientCapabilities

# Interface: FileOperationClientCapabilities

Defined in: node\_modules/.pnpm/vscode-languageserver-protocol@3.17.5/node\_modules/vscode-languageserver-protocol/lib/common/protocol.fileOperations.d.ts:126

Capabilities relating to events from file operations by the user in the client.

These events do not come from the file system, they come from user operations
like renaming a file in the UI.

## Since

3.16.0

## Properties

### didCreate?

> `optional` **didCreate?**: `boolean`

Defined in: node\_modules/.pnpm/vscode-languageserver-protocol@3.17.5/node\_modules/vscode-languageserver-protocol/lib/common/protocol.fileOperations.d.ts:134

The client has support for sending didCreateFiles notifications.

***

### didDelete?

> `optional` **didDelete?**: `boolean`

Defined in: node\_modules/.pnpm/vscode-languageserver-protocol@3.17.5/node\_modules/vscode-languageserver-protocol/lib/common/protocol.fileOperations.d.ts:150

The client has support for sending didDeleteFiles notifications.

***

### didRename?

> `optional` **didRename?**: `boolean`

Defined in: node\_modules/.pnpm/vscode-languageserver-protocol@3.17.5/node\_modules/vscode-languageserver-protocol/lib/common/protocol.fileOperations.d.ts:142

The client has support for sending didRenameFiles notifications.

***

### dynamicRegistration?

> `optional` **dynamicRegistration?**: `boolean`

Defined in: node\_modules/.pnpm/vscode-languageserver-protocol@3.17.5/node\_modules/vscode-languageserver-protocol/lib/common/protocol.fileOperations.d.ts:130

Whether the client supports dynamic registration for file requests/notifications.

***

### willCreate?

> `optional` **willCreate?**: `boolean`

Defined in: node\_modules/.pnpm/vscode-languageserver-protocol@3.17.5/node\_modules/vscode-languageserver-protocol/lib/common/protocol.fileOperations.d.ts:138

The client has support for sending willCreateFiles requests.

***

### willDelete?

> `optional` **willDelete?**: `boolean`

Defined in: node\_modules/.pnpm/vscode-languageserver-protocol@3.17.5/node\_modules/vscode-languageserver-protocol/lib/common/protocol.fileOperations.d.ts:154

The client has support for sending willDeleteFiles requests.

***

### willRename?

> `optional` **willRename?**: `boolean`

Defined in: node\_modules/.pnpm/vscode-languageserver-protocol@3.17.5/node\_modules/vscode-languageserver-protocol/lib/common/protocol.fileOperations.d.ts:146

The client has support for sending willRenameFiles requests.
