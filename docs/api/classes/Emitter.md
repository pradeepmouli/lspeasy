[**lspeasy v1.0.0**](../README.md)

***

[lspeasy](../README.md) / Emitter

# Class: Emitter\<T\>

Defined in: node\_modules/.pnpm/vscode-jsonrpc@8.2.0/node\_modules/vscode-jsonrpc/lib/common/events.d.ts:22

## Type Parameters

### T

`T`

## Constructors

### Constructor

> **new Emitter**\<`T`\>(`_options?`): `Emitter`\<`T`\>

Defined in: node\_modules/.pnpm/vscode-jsonrpc@8.2.0/node\_modules/vscode-jsonrpc/lib/common/events.d.ts:27

#### Parameters

##### \_options?

`EmitterOptions`

#### Returns

`Emitter`\<`T`\>

## Accessors

### event

#### Get Signature

> **get** **event**(): [`Event`](../interfaces/Event.md)\<`T`\>

Defined in: node\_modules/.pnpm/vscode-jsonrpc@8.2.0/node\_modules/vscode-jsonrpc/lib/common/events.d.ts:32

For the public to allow to subscribe
to events from this Emitter

##### Returns

[`Event`](../interfaces/Event.md)\<`T`\>

## Methods

### dispose()

> **dispose**(): `void`

Defined in: node\_modules/.pnpm/vscode-jsonrpc@8.2.0/node\_modules/vscode-jsonrpc/lib/common/events.d.ts:38

#### Returns

`void`

***

### fire()

> **fire**(`event`): `any`

Defined in: node\_modules/.pnpm/vscode-jsonrpc@8.2.0/node\_modules/vscode-jsonrpc/lib/common/events.d.ts:37

To be kept private to fire an event to
subscribers

#### Parameters

##### event

`T`

#### Returns

`any`
