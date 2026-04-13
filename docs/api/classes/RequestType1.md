[**lspeasy v1.0.0**](../README.md)

***

[lspeasy](../README.md) / RequestType1

# Class: RequestType1\<P1, R, E\>

Defined in: node\_modules/.pnpm/vscode-jsonrpc@8.2.0/node\_modules/vscode-jsonrpc/lib/common/messages.d.ts:196

## Extends

- `AbstractMessageSignature`

## Type Parameters

### P1

`P1`

### R

`R`

### E

`E`

## Constructors

### Constructor

> **new RequestType1**\<`P1`, `R`, `E`\>(`method`, `_parameterStructures?`): `RequestType1`\<`P1`, `R`, `E`\>

Defined in: node\_modules/.pnpm/vscode-jsonrpc@8.2.0/node\_modules/vscode-jsonrpc/lib/common/messages.d.ts:202

#### Parameters

##### method

`string`

##### \_parameterStructures?

[`ParameterStructures`](ParameterStructures.md)

#### Returns

`RequestType1`\<`P1`, `R`, `E`\>

#### Overrides

`AbstractMessageSignature.constructor`

## Properties

### \_

> `readonly` **\_**: \[`P1`, `R`, `E`, [`_EM`](../interfaces/EM.md)\] \| `undefined`

Defined in: node\_modules/.pnpm/vscode-jsonrpc@8.2.0/node\_modules/vscode-jsonrpc/lib/common/messages.d.ts:201

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

Defined in: node\_modules/.pnpm/vscode-jsonrpc@8.2.0/node\_modules/vscode-jsonrpc/lib/common/messages.d.ts:203

##### Returns

[`ParameterStructures`](ParameterStructures.md)

#### Overrides

`AbstractMessageSignature.parameterStructures`
