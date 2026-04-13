[**lspeasy v1.0.0**](../README.md)

***

[lspeasy](../README.md) / SharedArraySenderStrategy

# Class: SharedArraySenderStrategy

Defined in: node\_modules/.pnpm/vscode-jsonrpc@8.2.0/node\_modules/vscode-jsonrpc/lib/common/sharedArrayCancellation.d.ts:4

## Implements

- [`CancellationSenderStrategy`](../interfaces/CancellationSenderStrategy.md)

## Constructors

### Constructor

> **new SharedArraySenderStrategy**(): `SharedArraySenderStrategy`

Defined in: node\_modules/.pnpm/vscode-jsonrpc@8.2.0/node\_modules/vscode-jsonrpc/lib/common/sharedArrayCancellation.d.ts:6

#### Returns

`SharedArraySenderStrategy`

## Methods

### cleanup()

> **cleanup**(`id`): `void`

Defined in: node\_modules/.pnpm/vscode-jsonrpc@8.2.0/node\_modules/vscode-jsonrpc/lib/common/sharedArrayCancellation.d.ts:9

Cleanup any cancellation state for the given cancellation id. After this
method has been call no cancellation will be sent anymore for the given id.

#### Parameters

##### id

[`CancellationId`](../type-aliases/CancellationId.md)

The cancellation id.

#### Returns

`void`

#### Implementation of

[`CancellationSenderStrategy`](../interfaces/CancellationSenderStrategy.md).[`cleanup`](../interfaces/CancellationSenderStrategy.md#cleanup)

***

### dispose()

> **dispose**(): `void`

Defined in: node\_modules/.pnpm/vscode-jsonrpc@8.2.0/node\_modules/vscode-jsonrpc/lib/common/sharedArrayCancellation.d.ts:10

An optional method to dispose the strategy.

#### Returns

`void`

#### Implementation of

[`CancellationSenderStrategy`](../interfaces/CancellationSenderStrategy.md).[`dispose`](../interfaces/CancellationSenderStrategy.md#dispose)

***

### enableCancellation()

> **enableCancellation**(`request`): `void`

Defined in: node\_modules/.pnpm/vscode-jsonrpc@8.2.0/node\_modules/vscode-jsonrpc/lib/common/sharedArrayCancellation.d.ts:7

Hook to enable cancellation for the given request.

#### Parameters

##### request

`RequestMessage`

The request to enable cancellation for.

#### Returns

`void`

#### Implementation of

[`CancellationSenderStrategy`](../interfaces/CancellationSenderStrategy.md).[`enableCancellation`](../interfaces/CancellationSenderStrategy.md#enablecancellation)

***

### sendCancellation()

> **sendCancellation**(`_conn`, `id`): `Promise`\<`void`\>

Defined in: node\_modules/.pnpm/vscode-jsonrpc@8.2.0/node\_modules/vscode-jsonrpc/lib/common/sharedArrayCancellation.d.ts:8

Send cancellation for the given cancellation id

#### Parameters

##### \_conn

[`MessageConnection`](../interfaces/MessageConnection.md)

##### id

[`CancellationId`](../type-aliases/CancellationId.md)

The cancellation id.

#### Returns

`Promise`\<`void`\>

#### Implementation of

[`CancellationSenderStrategy`](../interfaces/CancellationSenderStrategy.md).[`sendCancellation`](../interfaces/CancellationSenderStrategy.md#sendcancellation)
