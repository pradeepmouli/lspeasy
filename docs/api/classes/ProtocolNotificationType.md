[**lspeasy v1.0.0**](../README.md)

***

[lspeasy](../README.md) / ProtocolNotificationType

# Class: ProtocolNotificationType\<P, RO\>

Defined in: node\_modules/.pnpm/vscode-languageserver-protocol@3.17.5/node\_modules/vscode-languageserver-protocol/lib/common/messages.d.ts:44

## Extends

- [`NotificationType`](NotificationType.md)\<`P`\>

## Type Parameters

### P

`P`

### RO

`RO`

## Implements

- [`RegistrationType`](RegistrationType.md)\<`RO`\>

## Constructors

### Constructor

> **new ProtocolNotificationType**\<`P`, `RO`\>(`method`): `ProtocolNotificationType`\<`P`, `RO`\>

Defined in: node\_modules/.pnpm/vscode-languageserver-protocol@3.17.5/node\_modules/vscode-languageserver-protocol/lib/common/messages.d.ts:50

#### Parameters

##### method

`string`

#### Returns

`ProtocolNotificationType`\<`P`, `RO`\>

#### Overrides

[`NotificationType`](NotificationType.md).[`constructor`](NotificationType.md#constructor)

## Properties

### \_

> `readonly` **\_**: \[`P`, [`_EM`](../interfaces/EM.md)\] \| `undefined`

Defined in: node\_modules/.pnpm/vscode-jsonrpc@8.2.0/node\_modules/vscode-jsonrpc/lib/common/messages.d.ts:279

Clients must not use this property. It is here to ensure correct typing.

#### Inherited from

[`NotificationType`](NotificationType.md).[`_`](NotificationType.md#_)

***

### \_\_\_

> `readonly` **\_\_\_**: \[`RO`, [`_EM`](../interfaces/EM.md)\] \| `undefined`

Defined in: node\_modules/.pnpm/vscode-languageserver-protocol@3.17.5/node\_modules/vscode-languageserver-protocol/lib/common/messages.d.ts:48

Clients must not use this property. It is here to ensure correct typing.

***

### \_\_\_\_

> `readonly` **\_\_\_\_**: \[`RO`, [`_EM`](../interfaces/EM.md)\] \| `undefined`

Defined in: node\_modules/.pnpm/vscode-languageserver-protocol@3.17.5/node\_modules/vscode-languageserver-protocol/lib/common/messages.d.ts:49

Clients must not use this property. It is here to ensure correct typing.

#### Implementation of

[`RegistrationType`](RegistrationType.md).[`____`](RegistrationType.md#____)

***

### method

> `readonly` **method**: `string`

Defined in: node\_modules/.pnpm/vscode-jsonrpc@8.2.0/node\_modules/vscode-jsonrpc/lib/common/messages.d.ts:166

#### Implementation of

[`RegistrationType`](RegistrationType.md).[`method`](RegistrationType.md#method)

#### Inherited from

[`NotificationType`](NotificationType.md).[`method`](NotificationType.md#method)

***

### numberOfParams

> `readonly` **numberOfParams**: `number`

Defined in: node\_modules/.pnpm/vscode-jsonrpc@8.2.0/node\_modules/vscode-jsonrpc/lib/common/messages.d.ts:167

#### Inherited from

[`NotificationType`](NotificationType.md).[`numberOfParams`](NotificationType.md#numberofparams)

## Accessors

### parameterStructures

#### Get Signature

> **get** **parameterStructures**(): [`ParameterStructures`](ParameterStructures.md)

Defined in: node\_modules/.pnpm/vscode-jsonrpc@8.2.0/node\_modules/vscode-jsonrpc/lib/common/messages.d.ts:281

##### Returns

[`ParameterStructures`](ParameterStructures.md)

#### Inherited from

[`NotificationType`](NotificationType.md).[`parameterStructures`](NotificationType.md#parameterstructures)
