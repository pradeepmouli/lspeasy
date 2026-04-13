[**lspeasy v1.0.0**](../README.md)

***

[lspeasy](../README.md) / RequestType0

# Class: RequestType0\<R, E\>

Defined in: node\_modules/.pnpm/vscode-jsonrpc@8.2.0/node\_modules/vscode-jsonrpc/lib/common/messages.d.ts:180

Classes to type request response pairs

## Extends

- `AbstractMessageSignature`

## Extended by

- [`ProtocolRequestType0`](ProtocolRequestType0.md)

## Type Parameters

### R

`R`

### E

`E`

## Constructors

### Constructor

> **new RequestType0**\<`R`, `E`\>(`method`): `RequestType0`\<`R`, `E`\>

Defined in: node\_modules/.pnpm/vscode-jsonrpc@8.2.0/node\_modules/vscode-jsonrpc/lib/common/messages.d.ts:185

#### Parameters

##### method

`string`

#### Returns

`RequestType0`\<`R`, `E`\>

#### Overrides

`AbstractMessageSignature.constructor`

## Properties

### \_

> `readonly` **\_**: \[`R`, `E`, [`_EM`](../interfaces/EM.md)\] \| `undefined`

Defined in: node\_modules/.pnpm/vscode-jsonrpc@8.2.0/node\_modules/vscode-jsonrpc/lib/common/messages.d.ts:184

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
