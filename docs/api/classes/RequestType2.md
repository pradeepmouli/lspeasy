[**lspeasy v1.0.0**](../README.md)

***

[lspeasy](../README.md) / RequestType2

# Class: RequestType2\<P1, P2, R, E\>

Defined in: node\_modules/.pnpm/vscode-jsonrpc@8.2.0/node\_modules/vscode-jsonrpc/lib/common/messages.d.ts:205

## Extends

- `AbstractMessageSignature`

## Type Parameters

### P1

`P1`

### P2

`P2`

### R

`R`

### E

`E`

## Constructors

### Constructor

> **new RequestType2**\<`P1`, `P2`, `R`, `E`\>(`method`): `RequestType2`\<`P1`, `P2`, `R`, `E`\>

Defined in: node\_modules/.pnpm/vscode-jsonrpc@8.2.0/node\_modules/vscode-jsonrpc/lib/common/messages.d.ts:210

#### Parameters

##### method

`string`

#### Returns

`RequestType2`\<`P1`, `P2`, `R`, `E`\>

#### Overrides

`AbstractMessageSignature.constructor`

## Properties

### \_

> `readonly` **\_**: \[`P1`, `P2`, `R`, `E`, [`_EM`](../interfaces/EM.md)\] \| `undefined`

Defined in: node\_modules/.pnpm/vscode-jsonrpc@8.2.0/node\_modules/vscode-jsonrpc/lib/common/messages.d.ts:209

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
