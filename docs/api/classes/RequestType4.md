[**lspeasy v1.0.0**](../README.md)

***

[lspeasy](../README.md) / RequestType4

# Class: RequestType4\<P1, P2, P3, P4, R, E\>

Defined in: node\_modules/.pnpm/vscode-jsonrpc@8.2.0/node\_modules/vscode-jsonrpc/lib/common/messages.d.ts:219

## Extends

- `AbstractMessageSignature`

## Type Parameters

### P1

`P1`

### P2

`P2`

### P3

`P3`

### P4

`P4`

### R

`R`

### E

`E`

## Constructors

### Constructor

> **new RequestType4**\<`P1`, `P2`, `P3`, `P4`, `R`, `E`\>(`method`): `RequestType4`\<`P1`, `P2`, `P3`, `P4`, `R`, `E`\>

Defined in: node\_modules/.pnpm/vscode-jsonrpc@8.2.0/node\_modules/vscode-jsonrpc/lib/common/messages.d.ts:224

#### Parameters

##### method

`string`

#### Returns

`RequestType4`\<`P1`, `P2`, `P3`, `P4`, `R`, `E`\>

#### Overrides

`AbstractMessageSignature.constructor`

## Properties

### \_

> `readonly` **\_**: \[`P1`, `P2`, `P3`, `P4`, `R`, `E`, [`_EM`](../interfaces/EM.md)\] \| `undefined`

Defined in: node\_modules/.pnpm/vscode-jsonrpc@8.2.0/node\_modules/vscode-jsonrpc/lib/common/messages.d.ts:223

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

Defined in: node\_modules/.pnpm/vscode-jsonrpc@8.2.0/node\_modules/vscode-jsonrpc/lib/common/messages.d.ts:169

##### Returns

[`ParameterStructures`](ParameterStructures.md)

#### Inherited from

`AbstractMessageSignature.parameterStructures`
