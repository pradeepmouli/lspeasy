[**lspeasy v1.0.0**](../README.md)

***

[lspeasy](../README.md) / TypedMiddleware

# Type Alias: TypedMiddleware\<M\>

> **TypedMiddleware**\<`M`\> = (`context`, `next`) => `Promise`\<`void` \| [`MiddlewareResult`](../interfaces/MiddlewareResult.md)\>

Defined in: [packages/core/src/middleware/types.ts:64](https://github.com/pradeepmouli/lspeasy/blob/376bc5f0c5c131f9052829a682564c2344e71fd6/packages/core/src/middleware/types.ts#L64)

## Type Parameters

### M

`M` *extends* [`LSPMethod`](LSPMethod.md)

## Parameters

### context

[`TypedMiddlewareContext`](../interfaces/TypedMiddlewareContext.md)\<`M`\>

### next

[`MiddlewareNext`](MiddlewareNext.md)

## Returns

`Promise`\<`void` \| [`MiddlewareResult`](../interfaces/MiddlewareResult.md)\>
