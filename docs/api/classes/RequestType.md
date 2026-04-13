[**lspeasy v1.0.0**](../README.md)

***

[lspeasy](../README.md) / RequestType

# Class: RequestType\<P, R, E\>

Defined in: node\_modules/.pnpm/vscode-jsonrpc@8.2.0/node\_modules/vscode-jsonrpc/lib/common/messages.d.ts:187

## Extends

- `AbstractMessageSignature`

## Extended by

- [`ProtocolRequestType`](ProtocolRequestType.md)

## Type Parameters

### P

`P`

### R

`R`

### E

`E`

## Constructors

### Constructor

> **new RequestType**\<`P`, `R`, `E`\>(`method`, `_parameterStructures?`): `RequestType`\<`P`, `R`, `E`\>

Defined in: node\_modules/.pnpm/vscode-jsonrpc@8.2.0/node\_modules/vscode-jsonrpc/lib/common/messages.d.ts:193

#### Parameters

##### method

`string`

##### \_parameterStructures?

[`ParameterStructures`](ParameterStructures.md)

#### Returns

`RequestType`\<`P`, `R`, `E`\>

#### Overrides

`AbstractMessageSignature.constructor`

## Properties

### \_

> `readonly` **\_**: \[`P`, `R`, `E`, [`_EM`](../interfaces/EM.md)\] \| `undefined`

Defined in: node\_modules/.pnpm/vscode-jsonrpc@8.2.0/node\_modules/vscode-jsonrpc/lib/common/messages.d.ts:192

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

Defined in: node\_modules/.pnpm/vscode-jsonrpc@8.2.0/node\_modules/vscode-jsonrpc/lib/common/messages.d.ts:194

##### Returns

[`ParameterStructures`](ParameterStructures.md)

#### Overrides

`AbstractMessageSignature.parameterStructures`
