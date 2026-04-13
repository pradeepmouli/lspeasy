[**lspeasy v1.0.0**](../README.md)

***

[lspeasy](../README.md) / NotificationType

# Class: NotificationType\<P\>

Defined in: node\_modules/.pnpm/vscode-jsonrpc@8.2.0/node\_modules/vscode-jsonrpc/lib/common/messages.d.ts:274

## Extends

- `AbstractMessageSignature`

## Extended by

- [`ProtocolNotificationType`](ProtocolNotificationType.md)

## Type Parameters

### P

`P`

## Constructors

### Constructor

> **new NotificationType**\<`P`\>(`method`, `_parameterStructures?`): `NotificationType`\<`P`\>

Defined in: node\_modules/.pnpm/vscode-jsonrpc@8.2.0/node\_modules/vscode-jsonrpc/lib/common/messages.d.ts:280

#### Parameters

##### method

`string`

##### \_parameterStructures?

[`ParameterStructures`](ParameterStructures.md)

#### Returns

`NotificationType`\<`P`\>

#### Overrides

`AbstractMessageSignature.constructor`

## Properties

### \_

> `readonly` **\_**: \[`P`, [`_EM`](../interfaces/EM.md)\] \| `undefined`

Defined in: node\_modules/.pnpm/vscode-jsonrpc@8.2.0/node\_modules/vscode-jsonrpc/lib/common/messages.d.ts:279

Clients must not use this property. It is here to ensure correct typing.

***

### method

> `readonly` **method**: `string`

Defined in: node\_modules/.pnpm/vscode-jsonrpc@8.2.0/node\_modules/vscode-jsonrpc/lib/common/messages.d.ts:166

#### Inherited from

`AbstractMessageSignature.method`

***

### numberOfParams

> `readonly` **numberOfParams**: `number`

Defined in: node\_modules/.pnpm/vscode-jsonrpc@8.2.0/node\_modules/vscode-jsonrpc/lib/common/messages.d.ts:167

#### Inherited from

`AbstractMessageSignature.numberOfParams`

## Accessors

### parameterStructures

#### Get Signature

> **get** **parameterStructures**(): [`ParameterStructures`](ParameterStructures.md)

Defined in: node\_modules/.pnpm/vscode-jsonrpc@8.2.0/node\_modules/vscode-jsonrpc/lib/common/messages.d.ts:281

##### Returns

[`ParameterStructures`](ParameterStructures.md)

#### Overrides

`AbstractMessageSignature.parameterStructures`
