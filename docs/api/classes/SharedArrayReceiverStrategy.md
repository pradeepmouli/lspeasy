[**lspeasy v1.0.0**](../README.md)

***

[lspeasy](../README.md) / SharedArrayReceiverStrategy

# Class: SharedArrayReceiverStrategy

Defined in: node\_modules/.pnpm/vscode-jsonrpc@8.2.0/node\_modules/vscode-jsonrpc/lib/common/sharedArrayCancellation.d.ts:12

## Implements

- `RequestCancellationReceiverStrategy`

## Constructors

### Constructor

> **new SharedArrayReceiverStrategy**(): `SharedArrayReceiverStrategy`

#### Returns

`SharedArrayReceiverStrategy`

## Properties

### kind

> `readonly` **kind**: `"request"`

Defined in: node\_modules/.pnpm/vscode-jsonrpc@8.2.0/node\_modules/vscode-jsonrpc/lib/common/sharedArrayCancellation.d.ts:13

#### Implementation of

`RequestCancellationReceiverStrategy.kind`

## Methods

### createCancellationTokenSource()

> **createCancellationTokenSource**(`request`): [`AbstractCancellationTokenSource`](../interfaces/AbstractCancellationTokenSource.md)

Defined in: node\_modules/.pnpm/vscode-jsonrpc@8.2.0/node\_modules/vscode-jsonrpc/lib/common/sharedArrayCancellation.d.ts:14

Create a cancellation token source from a given request message.

#### Parameters

##### request

`RequestMessage`

#### Returns

[`AbstractCancellationTokenSource`](../interfaces/AbstractCancellationTokenSource.md)

#### Implementation of

`RequestCancellationReceiverStrategy.createCancellationTokenSource`
