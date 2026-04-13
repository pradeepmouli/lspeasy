[**lspeasy v1.0.0**](../README.md)

***

[lspeasy](../README.md) / MessageWriter

# Interface: MessageWriter

Defined in: node\_modules/.pnpm/vscode-jsonrpc@8.2.0/node\_modules/vscode-jsonrpc/lib/common/messageWriter.d.ts:8

Writes JSON-RPC messages to an underlying transport.

## Properties

### onClose

> `readonly` **onClose**: [`Event`](Event.md)\<`void`\>

Defined in: node\_modules/.pnpm/vscode-jsonrpc@8.2.0/node\_modules/vscode-jsonrpc/lib/common/messageWriter.d.ts:16

An event raised when the underlying transport has closed and writing is no longer possible.

***

### onError

> `readonly` **onError**: [`Event`](Event.md)\<\[`Error`, `Message` \| `undefined`, `number` \| `undefined`\]\>

Defined in: node\_modules/.pnpm/vscode-jsonrpc@8.2.0/node\_modules/vscode-jsonrpc/lib/common/messageWriter.d.ts:12

Raised whenever an error occurs while writing a message.

## Methods

### dispose()

> **dispose**(): `void`

Defined in: node\_modules/.pnpm/vscode-jsonrpc@8.2.0/node\_modules/vscode-jsonrpc/lib/common/messageWriter.d.ts:29

Releases resources incurred from writing or raising events. Does NOT close the underlying transport, if any.

#### Returns

`void`

***

### end()

> **end**(): `void`

Defined in: node\_modules/.pnpm/vscode-jsonrpc@8.2.0/node\_modules/vscode-jsonrpc/lib/common/messageWriter.d.ts:27

Call when the connection using this message writer ends
(e.g. MessageConnection.end() is called)

#### Returns

`void`

***

### write()

> **write**(`msg`): `Promise`\<`void`\>

Defined in: node\_modules/.pnpm/vscode-jsonrpc@8.2.0/node\_modules/vscode-jsonrpc/lib/common/messageWriter.d.ts:22

Sends a JSON-RPC message.

#### Parameters

##### msg

`Message`

The JSON-RPC message to be sent.

#### Returns

`Promise`\<`void`\>

#### Description

Implementations should guarantee messages are transmitted in the same order that they are received by this method.
