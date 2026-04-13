[**lspeasy v1.0.0**](../README.md)

***

[lspeasy](../README.md) / MessageReader

# Interface: MessageReader

Defined in: node\_modules/.pnpm/vscode-jsonrpc@8.2.0/node\_modules/vscode-jsonrpc/lib/common/messageReader.d.ts:17

Reads JSON-RPC messages from some underlying transport.

## Properties

### onClose

> `readonly` **onClose**: [`Event`](Event.md)\<`void`\>

Defined in: node\_modules/.pnpm/vscode-jsonrpc@8.2.0/node\_modules/vscode-jsonrpc/lib/common/messageReader.d.ts:21

An event raised when the end of the underlying transport has been reached.

***

### onError

> `readonly` **onError**: [`Event`](Event.md)\<`Error`\>

Defined in: node\_modules/.pnpm/vscode-jsonrpc@8.2.0/node\_modules/vscode-jsonrpc/lib/common/messageReader.d.ts:19

Raised whenever an error occurs while reading a message.

***

### onPartialMessage

> `readonly` **onPartialMessage**: [`Event`](Event.md)\<[`PartialMessageInfo`](PartialMessageInfo.md)\>

Defined in: node\_modules/.pnpm/vscode-jsonrpc@8.2.0/node\_modules/vscode-jsonrpc/lib/common/messageReader.d.ts:26

An event that *may* be raised to inform the owner that only part of a message has been received.
A MessageReader implementation may choose to raise this event after a timeout elapses while waiting for more of a partially received message to be received.

## Methods

### dispose()

> **dispose**(): `void`

Defined in: node\_modules/.pnpm/vscode-jsonrpc@8.2.0/node\_modules/vscode-jsonrpc/lib/common/messageReader.d.ts:33

Releases resources incurred from reading or raising events. Does NOT close the underlying transport, if any.

#### Returns

`void`

***

### listen()

> **listen**(`callback`): `Disposable`

Defined in: node\_modules/.pnpm/vscode-jsonrpc@8.2.0/node\_modules/vscode-jsonrpc/lib/common/messageReader.d.ts:31

Begins listening for incoming messages. To be called at most once.

#### Parameters

##### callback

[`DataCallback`](DataCallback.md)

A callback for receiving decoded messages.

#### Returns

`Disposable`
