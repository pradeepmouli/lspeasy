[**lspeasy v1.0.0**](../README.md)

***

[lspeasy](../README.md) / TypedMiddleware

# Type Alias: TypedMiddleware\<M\>

> **TypedMiddleware**\<`M`\> = (`context`, `next`) => `Promise`\<`void` \| [`MiddlewareResult`](../interfaces/MiddlewareResult.md)\>

Defined in: [packages/core/src/middleware/types.ts:64](https://github.com/pradeepmouli/lspeasy/blob/74eda4ce2eb3e9f9d51dc27652e0acfc319327d4/packages/core/src/middleware/types.ts#L64)

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
