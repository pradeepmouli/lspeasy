[**lspeasy v1.0.0**](../README.md)

***

[lspeasy](../README.md) / Event

# Interface: Event()\<T\>

Defined in: node\_modules/.pnpm/vscode-jsonrpc@8.2.0/node\_modules/vscode-jsonrpc/lib/common/events.d.ts:5

Represents a typed event.

## Type Parameters

### T

`T`

> **Event**(`listener`, `thisArgs?`, `disposables?`): `Disposable`

Defined in: node\_modules/.pnpm/vscode-jsonrpc@8.2.0/node\_modules/vscode-jsonrpc/lib/common/events.d.ts:13

## Parameters

### listener

(`e`) => `any`

The listener function will be called when the event happens.

### thisArgs?

`any`

The 'this' which will be used when calling the event listener.

### disposables?

`Disposable`[]

An array to which a {{IDisposable}} will be added.

## Returns

`Disposable`
