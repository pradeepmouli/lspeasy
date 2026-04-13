[**lspeasy v1.0.0**](../README.md)

***

[lspeasy](../README.md) / ReadableStreamMessageReader

# Class: ReadableStreamMessageReader

Defined in: node\_modules/.pnpm/vscode-jsonrpc@8.2.0/node\_modules/vscode-jsonrpc/lib/common/messageReader.d.ts:60

Reads JSON-RPC messages from some underlying transport.

## Extends

- [`AbstractMessageReader`](AbstractMessageReader.md)

## Constructors

### Constructor

> **new ReadableStreamMessageReader**(`readable`, `options?`): `ReadableStreamMessageReader`

Defined in: node\_modules/.pnpm/vscode-jsonrpc@8.2.0/node\_modules/vscode-jsonrpc/lib/common/messageReader.d.ts:70

#### Parameters

##### readable

`_ReadableStream`

##### options?

`_MessageBufferEncoding` \| [`MessageReaderOptions`](../interfaces/MessageReaderOptions.md)

#### Returns

`ReadableStreamMessageReader`

#### Overrides

[`AbstractMessageReader`](AbstractMessageReader.md).[`constructor`](AbstractMessageReader.md#constructor)

## Accessors

### onClose

#### Get Signature

> **get** **onClose**(): [`Event`](../interfaces/Event.md)\<`void`\>

Defined in: node\_modules/.pnpm/vscode-jsonrpc@8.2.0/node\_modules/vscode-jsonrpc/lib/common/messageReader.d.ts:46

An event raised when the end of the underlying transport has been reached.

##### Returns

[`Event`](../interfaces/Event.md)\<`void`\>

An event raised when the end of the underlying transport has been reached.

#### Inherited from

[`AbstractMessageReader`](AbstractMessageReader.md).[`onClose`](AbstractMessageReader.md#onclose)

***

### onError

#### Get Signature

> **get** **onError**(): [`Event`](../interfaces/Event.md)\<`Error`\>

Defined in: node\_modules/.pnpm/vscode-jsonrpc@8.2.0/node\_modules/vscode-jsonrpc/lib/common/messageReader.d.ts:44

Raised whenever an error occurs while reading a message.

##### Returns

[`Event`](../interfaces/Event.md)\<`Error`\>

Raised whenever an error occurs while reading a message.

#### Inherited from

[`AbstractMessageReader`](AbstractMessageReader.md).[`onError`](AbstractMessageReader.md#onerror)

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

#### Inherited from

[`AbstractMessageReader`](AbstractMessageReader.md).[`onPartialMessage`](AbstractMessageReader.md#onpartialmessage)

***

### partialMessageTimeout

#### Get Signature

> **get** **partialMessageTimeout**(): `number`

Defined in: node\_modules/.pnpm/vscode-jsonrpc@8.2.0/node\_modules/vscode-jsonrpc/lib/common/messageReader.d.ts:72

##### Returns

`number`

#### Set Signature

> **set** **partialMessageTimeout**(`timeout`): `void`

Defined in: node\_modules/.pnpm/vscode-jsonrpc@8.2.0/node\_modules/vscode-jsonrpc/lib/common/messageReader.d.ts:71

##### Parameters

###### timeout

`number`

##### Returns

`void`

## Methods

### dispose()

> **dispose**(): `void`

Defined in: node\_modules/.pnpm/vscode-jsonrpc@8.2.0/node\_modules/vscode-jsonrpc/lib/common/messageReader.d.ts:43

Releases resources incurred from reading or raising events. Does NOT close the underlying transport, if any.

#### Returns

`void`

#### Inherited from

[`AbstractMessageReader`](AbstractMessageReader.md).[`dispose`](AbstractMessageReader.md#dispose)

***

### fireClose()

> `protected` **fireClose**(): `void`

Defined in: node\_modules/.pnpm/vscode-jsonrpc@8.2.0/node\_modules/vscode-jsonrpc/lib/common/messageReader.d.ts:47

#### Returns

`void`

#### Inherited from

[`AbstractMessageReader`](AbstractMessageReader.md).[`fireClose`](AbstractMessageReader.md#fireclose)

***

### fireError()

> `protected` **fireError**(`error`): `void`

Defined in: node\_modules/.pnpm/vscode-jsonrpc@8.2.0/node\_modules/vscode-jsonrpc/lib/common/messageReader.d.ts:45

#### Parameters

##### error

`any`

#### Returns

`void`

#### Inherited from

[`AbstractMessageReader`](AbstractMessageReader.md).[`fireError`](AbstractMessageReader.md#fireerror)

***

### firePartialMessage()

> `protected` **firePartialMessage**(`info`): `void`

Defined in: node\_modules/.pnpm/vscode-jsonrpc@8.2.0/node\_modules/vscode-jsonrpc/lib/common/messageReader.d.ts:49

#### Parameters

##### info

[`PartialMessageInfo`](../interfaces/PartialMessageInfo.md)

#### Returns

`void`

#### Inherited from

[`AbstractMessageReader`](AbstractMessageReader.md).[`firePartialMessage`](AbstractMessageReader.md#firepartialmessage)

***

### listen()

> **listen**(`callback`): `Disposable`

Defined in: node\_modules/.pnpm/vscode-jsonrpc@8.2.0/node\_modules/vscode-jsonrpc/lib/common/messageReader.d.ts:73

Begins listening for incoming messages. To be called at most once.

#### Parameters

##### callback

[`DataCallback`](../interfaces/DataCallback.md)

A callback for receiving decoded messages.

#### Returns

`Disposable`

#### Overrides

[`AbstractMessageReader`](AbstractMessageReader.md).[`listen`](AbstractMessageReader.md#listen)
