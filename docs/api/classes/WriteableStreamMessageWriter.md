[**lspeasy v1.0.0**](../README.md)

***

[lspeasy](../README.md) / WriteableStreamMessageWriter

# Class: WriteableStreamMessageWriter

Defined in: node\_modules/.pnpm/vscode-jsonrpc@8.2.0/node\_modules/vscode-jsonrpc/lib/common/messageWriter.d.ts:50

Writes JSON-RPC messages to an underlying transport.

## Extends

- [`AbstractMessageWriter`](AbstractMessageWriter.md)

## Implements

- [`MessageWriter`](../interfaces/MessageWriter.md)

## Constructors

### Constructor

> **new WriteableStreamMessageWriter**(`writable`, `options?`): `WriteableStreamMessageWriter`

Defined in: node\_modules/.pnpm/vscode-jsonrpc@8.2.0/node\_modules/vscode-jsonrpc/lib/common/messageWriter.d.ts:55

#### Parameters

##### writable

`_WritableStream`

##### options?

`_MessageBufferEncoding` \| [`MessageWriterOptions`](../interfaces/MessageWriterOptions.md)

#### Returns

`WriteableStreamMessageWriter`

#### Overrides

[`AbstractMessageWriter`](AbstractMessageWriter.md).[`constructor`](AbstractMessageWriter.md#constructor)

## Accessors

### onClose

#### Get Signature

> **get** **onClose**(): [`Event`](../interfaces/Event.md)\<`void`\>

Defined in: node\_modules/.pnpm/vscode-jsonrpc@8.2.0/node\_modules/vscode-jsonrpc/lib/common/messageWriter.d.ts:41

An event raised when the underlying transport has closed and writing is no longer possible.

##### Returns

[`Event`](../interfaces/Event.md)\<`void`\>

An event raised when the underlying transport has closed and writing is no longer possible.

#### Implementation of

[`MessageWriter`](../interfaces/MessageWriter.md).[`onClose`](../interfaces/MessageWriter.md#onclose)

#### Inherited from

[`AbstractMessageWriter`](AbstractMessageWriter.md).[`onClose`](AbstractMessageWriter.md#onclose)

***

### onError

#### Get Signature

> **get** **onError**(): [`Event`](../interfaces/Event.md)\<\[`Error`, `Message` \| `undefined`, `number` \| `undefined`\]\>

Defined in: node\_modules/.pnpm/vscode-jsonrpc@8.2.0/node\_modules/vscode-jsonrpc/lib/common/messageWriter.d.ts:39

Raised whenever an error occurs while writing a message.

##### Returns

[`Event`](../interfaces/Event.md)\<\[`Error`, `Message` \| `undefined`, `number` \| `undefined`\]\>

Raised whenever an error occurs while writing a message.

#### Implementation of

[`MessageWriter`](../interfaces/MessageWriter.md).[`onError`](../interfaces/MessageWriter.md#onerror)

#### Inherited from

[`AbstractMessageWriter`](AbstractMessageWriter.md).[`onError`](AbstractMessageWriter.md#onerror)

## Methods

### dispose()

> **dispose**(): `void`

Defined in: node\_modules/.pnpm/vscode-jsonrpc@8.2.0/node\_modules/vscode-jsonrpc/lib/common/messageWriter.d.ts:38

Releases resources incurred from writing or raising events. Does NOT close the underlying transport, if any.

#### Returns

`void`

#### Implementation of

[`MessageWriter`](../interfaces/MessageWriter.md).[`dispose`](../interfaces/MessageWriter.md#dispose)

#### Inherited from

[`AbstractMessageWriter`](AbstractMessageWriter.md).[`dispose`](AbstractMessageWriter.md#dispose)

***

### end()

> **end**(): `void`

Defined in: node\_modules/.pnpm/vscode-jsonrpc@8.2.0/node\_modules/vscode-jsonrpc/lib/common/messageWriter.d.ts:59

Call when the connection using this message writer ends
(e.g. MessageConnection.end() is called)

#### Returns

`void`

#### Implementation of

[`MessageWriter`](../interfaces/MessageWriter.md).[`end`](../interfaces/MessageWriter.md#end)

***

### fireClose()

> `protected` **fireClose**(): `void`

Defined in: node\_modules/.pnpm/vscode-jsonrpc@8.2.0/node\_modules/vscode-jsonrpc/lib/common/messageWriter.d.ts:42

#### Returns

`void`

#### Inherited from

[`AbstractMessageWriter`](AbstractMessageWriter.md).[`fireClose`](AbstractMessageWriter.md#fireclose)

***

### fireError()

> `protected` **fireError**(`error`, `message?`, `count?`): `void`

Defined in: node\_modules/.pnpm/vscode-jsonrpc@8.2.0/node\_modules/vscode-jsonrpc/lib/common/messageWriter.d.ts:40

#### Parameters

##### error

`any`

##### message?

`Message`

##### count?

`number`

#### Returns

`void`

#### Inherited from

[`AbstractMessageWriter`](AbstractMessageWriter.md).[`fireError`](AbstractMessageWriter.md#fireerror)

***

### write()

> **write**(`msg`): `Promise`\<`void`\>

Defined in: node\_modules/.pnpm/vscode-jsonrpc@8.2.0/node\_modules/vscode-jsonrpc/lib/common/messageWriter.d.ts:56

Sends a JSON-RPC message.

#### Parameters

##### msg

`Message`

The JSON-RPC message to be sent.

#### Returns

`Promise`\<`void`\>

#### Description

Implementations should guarantee messages are transmitted in the same order that they are received by this method.

#### Implementation of

[`MessageWriter`](../interfaces/MessageWriter.md).[`write`](../interfaces/MessageWriter.md#write)
