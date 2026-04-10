[**lspeasy v1.0.0**](../README.md)

***

[lspeasy](../README.md) / CancellationSenderStrategy

# Interface: CancellationSenderStrategy

Defined in: node\_modules/.pnpm/vscode-jsonrpc@8.2.0/node\_modules/vscode-jsonrpc/lib/common/connection.d.ts:239

## Methods

### cleanup()

> **cleanup**(`id`): `void`

Defined in: node\_modules/.pnpm/vscode-jsonrpc@8.2.0/node\_modules/vscode-jsonrpc/lib/common/connection.d.ts:259

Cleanup any cancellation state for the given cancellation id. After this
method has been call no cancellation will be sent anymore for the given id.

#### Parameters

##### id

[`CancellationId`](../type-aliases/CancellationId.md)

The cancellation id.

#### Returns

`void`

***

### dispose()?

> `optional` **dispose**(): `void`

Defined in: node\_modules/.pnpm/vscode-jsonrpc@8.2.0/node\_modules/vscode-jsonrpc/lib/common/connection.d.ts:263

An optional method to dispose the strategy.

#### Returns

`void`

***

### enableCancellation()?

> `optional` **enableCancellation**(`request`): `void`

Defined in: node\_modules/.pnpm/vscode-jsonrpc@8.2.0/node\_modules/vscode-jsonrpc/lib/common/connection.d.ts:245

Hook to enable cancellation for the given request.

#### Parameters

##### request

`RequestMessage`

The request to enable cancellation for.

#### Returns

`void`

***

### sendCancellation()

> **sendCancellation**(`conn`, `id`): `Promise`\<`void`\>

Defined in: node\_modules/.pnpm/vscode-jsonrpc@8.2.0/node\_modules/vscode-jsonrpc/lib/common/connection.d.ts:252

Send cancellation for the given cancellation id

#### Parameters

##### conn

[`MessageConnection`](MessageConnection.md)

The connection used.

##### id

[`CancellationId`](../type-aliases/CancellationId.md)

The cancellation id.

#### Returns

`Promise`\<`void`\>
