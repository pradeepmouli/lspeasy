[**lspeasy v1.0.0**](../README.md)

***

[lspeasy](../README.md) / ProtocolRequestType

# Class: ProtocolRequestType\<P, R, PR, E, RO\>

Defined in: node\_modules/.pnpm/vscode-languageserver-protocol@3.17.5/node\_modules/vscode-languageserver-protocol/lib/common/messages.d.ts:26

## Extends

- [`RequestType`](RequestType.md)\<`P`, `R`, `E`\>

## Type Parameters

### P

`P`

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

> **new ProtocolRequestType**\<`P`, `R`, `PR`, `E`, `RO`\>(`method`): `ProtocolRequestType`\<`P`, `R`, `PR`, `E`, `RO`\>

Defined in: node\_modules/.pnpm/vscode-languageserver-protocol@3.17.5/node\_modules/vscode-languageserver-protocol/lib/common/messages.d.ts:34

#### Parameters

##### method

`string`

#### Returns

`ProtocolRequestType`\<`P`, `R`, `PR`, `E`, `RO`\>

#### Overrides

[`RequestType`](RequestType.md).[`constructor`](RequestType.md#constructor)

## Properties

### \_

> `readonly` **\_**: \[`P`, `R`, `E`, [`_EM`](../interfaces/EM.md)\] \| `undefined`

Defined in: node\_modules/.pnpm/vscode-jsonrpc@8.2.0/node\_modules/vscode-jsonrpc/lib/common/messages.d.ts:192

Clients must not use this property. It is here to ensure correct typing.

#### Inherited from

[`RequestType`](RequestType.md).[`_`](RequestType.md#_)

***

### \_\_

> `readonly` **\_\_**: \[`PR`, [`_EM`](../interfaces/EM.md)\] \| `undefined`

Defined in: node\_modules/.pnpm/vscode-languageserver-protocol@3.17.5/node\_modules/vscode-languageserver-protocol/lib/common/messages.d.ts:30

Clients must not use this property. It is here to ensure correct typing.

#### Implementation of

[`ProgressType`](ProgressType.md).[`__`](ProgressType.md#__)

***

### \_\_\_

> `readonly` **\_\_\_**: \[`PR`, `RO`, [`_EM`](../interfaces/EM.md)\] \| `undefined`

Defined in: node\_modules/.pnpm/vscode-languageserver-protocol@3.17.5/node\_modules/vscode-languageserver-protocol/lib/common/messages.d.ts:31

***

### \_\_\_\_

> `readonly` **\_\_\_\_**: \[`RO`, [`_EM`](../interfaces/EM.md)\] \| `undefined`

Defined in: node\_modules/.pnpm/vscode-languageserver-protocol@3.17.5/node\_modules/vscode-languageserver-protocol/lib/common/messages.d.ts:32

Clients must not use this property. It is here to ensure correct typing.

#### Implementation of

[`RegistrationType`](RegistrationType.md).[`____`](RegistrationType.md#____)

***

### \_pr

> `readonly` **\_pr**: `PR` \| `undefined`

Defined in: node\_modules/.pnpm/vscode-languageserver-protocol@3.17.5/node\_modules/vscode-languageserver-protocol/lib/common/messages.d.ts:33

#### Implementation of

[`ProgressType`](ProgressType.md).[`_pr`](ProgressType.md#_pr)

***

### method

> `readonly` **method**: `string`

Defined in: node\_modules/.pnpm/vscode-jsonrpc@8.2.0/node\_modules/vscode-jsonrpc/lib/common/messages.d.ts:166

#### Implementation of

[`RegistrationType`](RegistrationType.md).[`method`](RegistrationType.md#method)

#### Inherited from

[`RequestType`](RequestType.md).[`method`](RequestType.md#method)

***

### numberOfParams

> `readonly` **numberOfParams**: `number`

Defined in: node\_modules/.pnpm/vscode-jsonrpc@8.2.0/node\_modules/vscode-jsonrpc/lib/common/messages.d.ts:167

#### Inherited from

[`RequestType`](RequestType.md).[`numberOfParams`](RequestType.md#numberofparams)

## Accessors

### parameterStructures

#### Get Signature

> **get** **parameterStructures**(): [`ParameterStructures`](ParameterStructures.md)

Defined in: node\_modules/.pnpm/vscode-jsonrpc@8.2.0/node\_modules/vscode-jsonrpc/lib/common/messages.d.ts:194

##### Returns

[`ParameterStructures`](ParameterStructures.md)

#### Inherited from

[`RequestType`](RequestType.md).[`parameterStructures`](RequestType.md#parameterstructures)
