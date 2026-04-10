[**lspeasy v1.0.0**](../README.md)

***

[lspeasy](../README.md) / Middleware

# Type Alias: Middleware

> **Middleware** = (`context`, `next`) => `Promise`\<`void` \| [`MiddlewareResult`](../interfaces/MiddlewareResult.md)\>

Defined in: [packages/core/src/middleware/types.ts:59](https://github.com/pradeepmouli/lspeasy/blob/1dc2e704391f3b32ce8185dadf1a265a4beb41d3/packages/core/src/middleware/types.ts#L59)

## Parameters

### context

[`MiddlewareContext`](../interfaces/MiddlewareContext.md)

### next

[`MiddlewareNext`](MiddlewareNext.md)

## Returns

`Promise`\<`void` \| [`MiddlewareResult`](../interfaces/MiddlewareResult.md)\>
