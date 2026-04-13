[**lspeasy v1.0.0**](../README.md)

***

[lspeasy](../README.md) / ParameterStructures

# Class: ParameterStructures

Defined in: node\_modules/.pnpm/vscode-jsonrpc@8.2.0/node\_modules/vscode-jsonrpc/lib/common/messages.d.ts:132

## Properties

### auto

> `readonly` `static` **auto**: `ParameterStructures`

Defined in: node\_modules/.pnpm/vscode-jsonrpc@8.2.0/node\_modules/vscode-jsonrpc/lib/common/messages.d.ts:138

The parameter structure is automatically inferred on the number of parameters
and the parameter type in case of a single param.

***

### byName

> `readonly` `static` **byName**: `ParameterStructures`

Defined in: node\_modules/.pnpm/vscode-jsonrpc@8.2.0/node\_modules/vscode-jsonrpc/lib/common/messages.d.ts:149

Forces `byName` parameter structure. This is only useful when having a single
parameter. The library will report errors if used with a different number of
parameters.

***

### byPosition

> `readonly` `static` **byPosition**: `ParameterStructures`

Defined in: node\_modules/.pnpm/vscode-jsonrpc@8.2.0/node\_modules/vscode-jsonrpc/lib/common/messages.d.ts:143

Forces `byPosition` parameter structure. This is useful if you have a single
parameter which has a literal type.

## Methods

### toString()

> **toString**(): `string`

Defined in: node\_modules/.pnpm/vscode-jsonrpc@8.2.0/node\_modules/vscode-jsonrpc/lib/common/messages.d.ts:152

#### Returns

`string`

***

### is()

> `static` **is**(`value`): `value is ParameterStructures`

Defined in: node\_modules/.pnpm/vscode-jsonrpc@8.2.0/node\_modules/vscode-jsonrpc/lib/common/messages.d.ts:151

#### Parameters

##### value

`any`

#### Returns

`value is ParameterStructures`
