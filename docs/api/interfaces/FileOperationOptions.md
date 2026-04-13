[**lspeasy v1.0.0**](../README.md)

***

[lspeasy](../README.md) / FileOperationOptions

# Interface: FileOperationOptions

Defined in: node\_modules/.pnpm/vscode-languageserver-protocol@3.17.5/node\_modules/vscode-languageserver-protocol/lib/common/protocol.fileOperations.d.ts:9

Options for notifications/requests for user operations on files.

## Since

3.16.0

## Properties

### didCreate?

> `optional` **didCreate?**: [`FileOperationRegistrationOptions`](FileOperationRegistrationOptions.md)

Defined in: node\_modules/.pnpm/vscode-languageserver-protocol@3.17.5/node\_modules/vscode-languageserver-protocol/lib/common/protocol.fileOperations.d.ts:13

The server is interested in receiving didCreateFiles notifications.

***

### didDelete?

> `optional` **didDelete?**: [`FileOperationRegistrationOptions`](FileOperationRegistrationOptions.md)

Defined in: node\_modules/.pnpm/vscode-languageserver-protocol@3.17.5/node\_modules/vscode-languageserver-protocol/lib/common/protocol.fileOperations.d.ts:29

The server is interested in receiving didDeleteFiles file notifications.

***

### didRename?

> `optional` **didRename?**: [`FileOperationRegistrationOptions`](FileOperationRegistrationOptions.md)

Defined in: node\_modules/.pnpm/vscode-languageserver-protocol@3.17.5/node\_modules/vscode-languageserver-protocol/lib/common/protocol.fileOperations.d.ts:21

The server is interested in receiving didRenameFiles notifications.

***

### willCreate?

> `optional` **willCreate?**: [`FileOperationRegistrationOptions`](FileOperationRegistrationOptions.md)

Defined in: node\_modules/.pnpm/vscode-languageserver-protocol@3.17.5/node\_modules/vscode-languageserver-protocol/lib/common/protocol.fileOperations.d.ts:17

The server is interested in receiving willCreateFiles requests.

***

### willDelete?

> `optional` **willDelete?**: [`FileOperationRegistrationOptions`](FileOperationRegistrationOptions.md)

Defined in: node\_modules/.pnpm/vscode-languageserver-protocol@3.17.5/node\_modules/vscode-languageserver-protocol/lib/common/protocol.fileOperations.d.ts:33

The server is interested in receiving willDeleteFiles file requests.

***

### willRename?

> `optional` **willRename?**: [`FileOperationRegistrationOptions`](FileOperationRegistrationOptions.md)

Defined in: node\_modules/.pnpm/vscode-languageserver-protocol@3.17.5/node\_modules/vscode-languageserver-protocol/lib/common/protocol.fileOperations.d.ts:25

The server is interested in receiving willRenameFiles requests.
