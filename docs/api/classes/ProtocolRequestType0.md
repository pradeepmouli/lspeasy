[**lspeasy v1.0.0**](../README.md)

***

[lspeasy](../README.md) / ProtocolRequestType0

# Class: ProtocolRequestType0\<R, PR, E, RO\>

Defined in: node\_modules/.pnpm/vscode-languageserver-protocol@3.17.5/node\_modules/vscode-languageserver-protocol/lib/common/messages.d.ts:15

Classes to type request response pairs

## Extends

- [`RequestType0`](RequestType0.md)\<`R`, `E`\>

## Type Parameters

### R

`R`

### PR

`PR`

### E

`E`

### RO

`RO`

## Implements

- [`ProgressType`](ProgressType.md)\<`PR`\>
- [`RegistrationType`](RegistrationType.md)\<`RO`\>

## Constructors

### Constructor

> **new ProtocolRequestType0**\<`R`, `PR`, `E`, `RO`\>(`method`): `ProtocolRequestType0`\<`R`, `PR`, `E`, `RO`\>

Defined in: node\_modules/.pnpm/vscode-languageserver-protocol@3.17.5/node\_modules/vscode-languageserver-protocol/lib/common/messages.d.ts:24

#### Parameters

##### method

`string`

#### Returns

`ProtocolRequestType0`\<`R`, `PR`, `E`, `RO`\>

#### Overrides

[`RequestType0`](RequestType0.md).[`constructor`](RequestType0.md#constructor)

## Properties

### \_

> `readonly` **\_**: \[`R`, `E`, [`_EM`](../interfaces/EM.md)\] \| `undefined`

Defined in: node\_modules/.pnpm/vscode-jsonrpc@8.2.0/node\_modules/vscode-jsonrpc/lib/common/messages.d.ts:184

Clients must not use this property. It is here to ensure correct typing.

#### Inherited from

[`RequestType0`](RequestType0.md).[`_`](RequestType0.md#_)

***

### \_\_

> `readonly` **\_\_**: \[`PR`, [`_EM`](../interfaces/EM.md)\] \| `undefined`

Defined in: node\_modules/.pnpm/vscode-languageserver-protocol@3.17.5/node\_modules/vscode-languageserver-protocol/lib/common/messages.d.ts:20

Clients must not use these properties. They are here to ensure correct typing.
in TypeScript

#### Implementation of

[`ProgressType`](ProgressType.md).[`__`](ProgressType.md#__)

***

### \_\_\_

> `readonly` **\_\_\_**: \[`PR`, `RO`, [`_EM`](../interfaces/EM.md)\] \| `undefined`

Defined in: node\_modules/.pnpm/vscode-languageserver-protocol@3.17.5/node\_modules/vscode-languageserver-protocol/lib/common/messages.d.ts:21

***

### \_\_\_\_

> `readonly` **\_\_\_\_**: \[`RO`, [`_EM`](../interfaces/EM.md)\] \| `undefined`

Defined in: node\_modules/.pnpm/vscode-languageserver-protocol@3.17.5/node\_modules/vscode-languageserver-protocol/lib/common/messages.d.ts:22

Clients must not use this property. It is here to ensure correct typing.

#### Implementation of

[`RegistrationType`](RegistrationType.md).[`____`](RegistrationType.md#____)

***

### \_pr

> `readonly` **\_pr**: `PR` \| `undefined`

Defined in: node\_modules/.pnpm/vscode-languageserver-protocol@3.17.5/node\_modules/vscode-languageserver-protocol/lib/common/messages.d.ts:23

#### Implementation of

[`ProgressType`](ProgressType.md).[`_pr`](ProgressType.md#_pr)

***

### method

> `readonly` **method**: `string`

Defined in: node\_modules/.pnpm/vscode-jsonrpc@8.2.0/node\_modules/vscode-jsonrpc/lib/common/messages.d.ts:166

#### Implementation of

[`RegistrationType`](RegistrationType.md).[`method`](RegistrationType.md#method)

#### Inherited from

[`RequestType0`](RequestType0.md).[`method`](RequestType0.md#method)

***

### numberOfParams

> `readonly` **numberOfParams**: `number`

Defined in: node\_modules/.pnpm/vscode-jsonrpc@8.2.0/node\_modules/vscode-jsonrpc/lib/common/messages.d.ts:167

#### Inherited from

[`RequestType0`](RequestType0.md).[`numberOfParams`](RequestType0.md#numberofparams)

## Accessors

### parameterStructures

#### Get Signature

> **get** **parameterStructures**(): [`ParameterStructures`](ParameterStructures.md)

Defined in: node\_modules/.pnpm/vscode-jsonrpc@8.2.0/node\_modules/vscode-jsonrpc/lib/common/messages.d.ts:169

##### Returns

[`ParameterStructures`](ParameterStructures.md)

#### Inherited from

[`RequestType0`](RequestType0.md).[`parameterStructures`](RequestType0.md#parameterstructures)
