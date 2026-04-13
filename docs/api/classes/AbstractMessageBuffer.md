[**lspeasy v1.0.0**](../README.md)

***

[lspeasy](../README.md) / AbstractMessageBuffer

# Abstract Class: AbstractMessageBuffer

Defined in: node\_modules/.pnpm/vscode-jsonrpc@8.2.0/node\_modules/vscode-jsonrpc/lib/common/messageBuffer.d.ts:2

## Implements

- [`MessageBuffer`](../lspeasy/namespaces/RAL/type-aliases/MessageBuffer.md)

## Constructors

### Constructor

> **new AbstractMessageBuffer**(`encoding?`): `AbstractMessageBuffer`

Defined in: node\_modules/.pnpm/vscode-jsonrpc@8.2.0/node\_modules/vscode-jsonrpc/lib/common/messageBuffer.d.ts:6

#### Parameters

##### encoding?

`_MessageBufferEncoding`

#### Returns

`AbstractMessageBuffer`

## Accessors

### encoding

#### Get Signature

> **get** **encoding**(): `_MessageBufferEncoding`

Defined in: node\_modules/.pnpm/vscode-jsonrpc@8.2.0/node\_modules/vscode-jsonrpc/lib/common/messageBuffer.d.ts:12

##### Returns

`_MessageBufferEncoding`

#### Implementation of

`RAL.MessageBuffer.encoding`

***

### numberOfBytes

#### Get Signature

> **get** **numberOfBytes**(): `number`

Defined in: node\_modules/.pnpm/vscode-jsonrpc@8.2.0/node\_modules/vscode-jsonrpc/lib/common/messageBuffer.d.ts:16

##### Returns

`number`

## Methods

### allocNative()

> `abstract` `protected` **allocNative**(`length`): `Uint8Array`

Defined in: node\_modules/.pnpm/vscode-jsonrpc@8.2.0/node\_modules/vscode-jsonrpc/lib/common/messageBuffer.d.ts:11

#### Parameters

##### length

`number`

#### Returns

`Uint8Array`

***

### append()

> **append**(`chunk`): `void`

Defined in: node\_modules/.pnpm/vscode-jsonrpc@8.2.0/node\_modules/vscode-jsonrpc/lib/common/messageBuffer.d.ts:13

Append data to the message buffer.

#### Parameters

##### chunk

`string` \| `Uint8Array`\<`ArrayBufferLike`\>

the data to append.

#### Returns

`void`

#### Implementation of

`RAL.MessageBuffer.append`

***

### asNative()

> `abstract` `protected` **asNative**(`buffer`, `length?`): `Uint8Array`

Defined in: node\_modules/.pnpm/vscode-jsonrpc@8.2.0/node\_modules/vscode-jsonrpc/lib/common/messageBuffer.d.ts:10

#### Parameters

##### buffer

`Uint8Array`

##### length?

`number`

#### Returns

`Uint8Array`

***

### emptyBuffer()

> `abstract` `protected` **emptyBuffer**(): `Uint8Array`

Defined in: node\_modules/.pnpm/vscode-jsonrpc@8.2.0/node\_modules/vscode-jsonrpc/lib/common/messageBuffer.d.ts:7

#### Returns

`Uint8Array`

***

### fromString()

> `abstract` `protected` **fromString**(`value`, `encoding`): `Uint8Array`

Defined in: node\_modules/.pnpm/vscode-jsonrpc@8.2.0/node\_modules/vscode-jsonrpc/lib/common/messageBuffer.d.ts:8

#### Parameters

##### value

`string`

##### encoding

`_MessageBufferEncoding`

#### Returns

`Uint8Array`

***

### toString()

> `abstract` `protected` **toString**(`value`, `encoding`): `string`

Defined in: node\_modules/.pnpm/vscode-jsonrpc@8.2.0/node\_modules/vscode-jsonrpc/lib/common/messageBuffer.d.ts:9

Returns a string representation of an object.

#### Parameters

##### value

`Uint8Array`

##### encoding

`_MessageBufferEncoding`

#### Returns

`string`

***

### tryReadBody()

> **tryReadBody**(`length`): `Uint8Array`\<`ArrayBufferLike`\> \| `undefined`

Defined in: node\_modules/.pnpm/vscode-jsonrpc@8.2.0/node\_modules/vscode-jsonrpc/lib/common/messageBuffer.d.ts:15

Tries to read the body of the given length.

#### Parameters

##### length

`number`

the amount of bytes to read.

#### Returns

`Uint8Array`\<`ArrayBufferLike`\> \| `undefined`

the data or undefined int less data is available.

#### Implementation of

`RAL.MessageBuffer.tryReadBody`

***

### tryReadHeaders()

> **tryReadHeaders**(`lowerCaseKeys?`): `Map`\<`string`, `string`\> \| `undefined`

Defined in: node\_modules/.pnpm/vscode-jsonrpc@8.2.0/node\_modules/vscode-jsonrpc/lib/common/messageBuffer.d.ts:14

Tries to read the headers from the buffer

#### Parameters

##### lowerCaseKeys?

`boolean`

Whether the keys should be stored lower case. Doing
so is recommended since HTTP headers are case insensitive.

#### Returns

`Map`\<`string`, `string`\> \| `undefined`

the header properties or undefined in not enough data can be read.

#### Implementation of

`RAL.MessageBuffer.tryReadHeaders`
