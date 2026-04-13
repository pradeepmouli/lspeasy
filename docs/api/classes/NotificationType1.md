[**lspeasy v1.0.0**](../README.md)

***

[lspeasy](../README.md) / NotificationType1

# Class: NotificationType1\<P1\>

Defined in: node\_modules/.pnpm/vscode-jsonrpc@8.2.0/node\_modules/vscode-jsonrpc/lib/common/messages.d.ts:290

## Extends

- `AbstractMessageSignature`

## Type Parameters

### P1

`P1`

## Constructors

### Constructor

> **new NotificationType1**\<`P1`\>(`method`, `_parameterStructures?`): `NotificationType1`\<`P1`\>

Defined in: node\_modules/.pnpm/vscode-jsonrpc@8.2.0/node\_modules/vscode-jsonrpc/lib/common/messages.d.ts:296

#### Parameters

##### method

`string`

##### \_parameterStructures?

[`ParameterStructures`](ParameterStructures.md)

#### Returns

`NotificationType1`\<`P1`\>

#### Overrides

`AbstractMessageSignature.constructor`

## Properties

### \_

> `readonly` **\_**: \[`P1`, [`_EM`](../interfaces/EM.md)\] \| `undefined`

Defined in: node\_modules/.pnpm/vscode-jsonrpc@8.2.0/node\_modules/vscode-jsonrpc/lib/common/messages.d.ts:295

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

Defined in: node\_modules/.pnpm/vscode-jsonrpc@8.2.0/node\_modules/vscode-jsonrpc/lib/common/messages.d.ts:297

##### Returns

[`ParameterStructures`](ParameterStructures.md)

#### Overrides

`AbstractMessageSignature.parameterStructures`
