[**lspeasy v1.0.0**](../README.md)

***

[lspeasy](../README.md) / AbstractMessageReader

# Abstract Class: AbstractMessageReader

Defined in: node\_modules/.pnpm/vscode-jsonrpc@8.2.0/node\_modules/vscode-jsonrpc/lib/common/messageReader.d.ts:38

Reads JSON-RPC messages from some underlying transport.

## Extended by

- [`ReadableStreamMessageReader`](ReadableStreamMessageReader.md)

## Implements

- [`MessageReader`](../interfaces/MessageReader.md)

## Constructors

### Constructor

> **new AbstractMessageReader**(): `AbstractMessageReader`

Defined in: node\_modules/.pnpm/vscode-jsonrpc@8.2.0/node\_modules/vscode-jsonrpc/lib/common/messageReader.d.ts:42

#### Returns

`AbstractMessageReader`

## Accessors

### onClose

#### Get Signature

> **get** **onClose**(): [`Event`](../interfaces/Event.md)\<`void`\>

Defined in: node\_modules/.pnpm/vscode-jsonrpc@8.2.0/node\_modules/vscode-jsonrpc/lib/common/messageReader.d.ts:46

An event raised when the end of the underlying transport has been reached.

##### Returns

[`Event`](../interfaces/Event.md)\<`void`\>

An event raised when the end of the underlying transport has been reached.

#### Implementation of

[`MessageReader`](../interfaces/MessageReader.md).[`onClose`](../interfaces/MessageReader.md#onclose)

***

### onError

#### Get Signature

> **get** **onError**(): [`Event`](../interfaces/Event.md)\<`Error`\>

Defined in: node\_modules/.pnpm/vscode-jsonrpc@8.2.0/node\_modules/vscode-jsonrpc/lib/common/messageReader.d.ts:44

Raised whenever an error occurs while reading a message.

##### Returns

[`Event`](../interfaces/Event.md)\<`Error`\>

Raised whenever an error occurs while reading a message.

#### Implementation of

[`MessageReader`](../interfaces/MessageReader.md).[`onError`](../interfaces/MessageReader.md#onerror)

***

### onPartialMessage

#### Get Signature

> **get** **onPartialMessage**(): [`Event`](../interfaces/Event.md)\<[`PartialMessageInfo`](../interfaces/PartialMessageInfo.md)\>

Defined in: node\_modules/.pnpm/vscode-jsonrpc@8.2.0/node\_modules/vscode-jsonrpc/lib/common/messageReader.d.ts:48

An event that *may* be raised to inform the owner that only part of a message has been received.
A MessageReader implementation may choose to raise this event after a timeout elapses while waiting for more of a partially received message to be received.

##### Returns

[`Event`](../interfaces/Event.md)\<[`PartialMessageInfo`](../interfaces/PartialMessageInfo.md)\>

An event that *may* be raised to inform the owner that only part of a message has been received.
A MessageReader implementation may choose to raise this event after a timeout elapses while waiting for more of a partially received message to be received.

#### Implementation of

[`MessageReader`](../interfaces/MessageReader.md).[`onPartialMessage`](../interfaces/MessageReader.md#onpartialmessage)

## Methods

### dispose()

> **dispose**(): `void`

Defined in: node\_modules/.pnpm/vscode-jsonrpc@8.2.0/node\_modules/vscode-jsonrpc/lib/common/messageReader.d.ts:43

Releases resources incurred from reading or raising events. Does NOT close the underlying transport, if any.

#### Returns

`void`

#### Implementation of

[`MessageReader`](../interfaces/MessageReader.md).[`dispose`](../interfaces/MessageReader.md#dispose)

***

### fireClose()

> `protected` **fireClose**(): `void`

Defined in: node\_modules/.pnpm/vscode-jsonrpc@8.2.0/node\_modules/vscode-jsonrpc/lib/common/messageReader.d.ts:47

#### Returns

`void`

***

### fireError()

> `protected` **fireError**(`error`): `void`

Defined in: node\_modules/.pnpm/vscode-jsonrpc@8.2.0/node\_modules/vscode-jsonrpc/lib/common/messageReader.d.ts:45

#### Parameters

##### error

`any`

#### Returns

`void`

***

### firePartialMessage()

> `protected` **firePartialMessage**(`info`): `void`

Defined in: node\_modules/.pnpm/vscode-jsonrpc@8.2.0/node\_modules/vscode-jsonrpc/lib/common/messageReader.d.ts:49

#### Parameters

##### info

[`PartialMessageInfo`](../interfaces/PartialMessageInfo.md)

#### Returns

`void`

***

### listen()

> `abstract` **listen**(`callback`): `Disposable`

Defined in: node\_modules/.pnpm/vscode-jsonrpc@8.2.0/node\_modules/vscode-jsonrpc/lib/common/messageReader.d.ts:51

Begins listening for incoming messages. To be called at most once.

#### Parameters

##### callback

[`DataCallback`](../interfaces/DataCallback.md)

A callback for receiving decoded messages.

#### Returns

`Disposable`

#### Implementation of

[`MessageReader`](../interfaces/MessageReader.md).[`listen`](../interfaces/MessageReader.md#listen)
