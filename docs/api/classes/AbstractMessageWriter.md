[**lspeasy v1.0.0**](../README.md)

***

[lspeasy](../README.md) / AbstractMessageWriter

# Abstract Class: AbstractMessageWriter

Defined in: node\_modules/.pnpm/vscode-jsonrpc@8.2.0/node\_modules/vscode-jsonrpc/lib/common/messageWriter.d.ts:34

## Extended by

- [`WriteableStreamMessageWriter`](WriteableStreamMessageWriter.md)

## Constructors

### Constructor

> **new AbstractMessageWriter**(): `AbstractMessageWriter`

Defined in: node\_modules/.pnpm/vscode-jsonrpc@8.2.0/node\_modules/vscode-jsonrpc/lib/common/messageWriter.d.ts:37

#### Returns

`AbstractMessageWriter`

## Accessors

### onClose

#### Get Signature

> **get** **onClose**(): [`Event`](../interfaces/Event.md)\<`void`\>

Defined in: node\_modules/.pnpm/vscode-jsonrpc@8.2.0/node\_modules/vscode-jsonrpc/lib/common/messageWriter.d.ts:41

##### Returns

[`Event`](../interfaces/Event.md)\<`void`\>

***

### onError

#### Get Signature

> **get** **onError**(): [`Event`](../interfaces/Event.md)\<\[`Error`, `Message` \| `undefined`, `number` \| `undefined`\]\>

Defined in: node\_modules/.pnpm/vscode-jsonrpc@8.2.0/node\_modules/vscode-jsonrpc/lib/common/messageWriter.d.ts:39

##### Returns

[`Event`](../interfaces/Event.md)\<\[`Error`, `Message` \| `undefined`, `number` \| `undefined`\]\>

## Methods

### dispose()

> **dispose**(): `void`

Defined in: node\_modules/.pnpm/vscode-jsonrpc@8.2.0/node\_modules/vscode-jsonrpc/lib/common/messageWriter.d.ts:38

#### Returns

`void`

***

### fireClose()

> `protected` **fireClose**(): `void`

Defined in: node\_modules/.pnpm/vscode-jsonrpc@8.2.0/node\_modules/vscode-jsonrpc/lib/common/messageWriter.d.ts:42

#### Returns

`void`

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
