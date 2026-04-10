[**lspeasy v1.0.0**](../README.md)

***

[lspeasy](../README.md) / TypedMiddleware

# Type Alias: TypedMiddleware\<M\>

> **TypedMiddleware**\<`M`\> = (`context`, `next`) => `Promise`\<`void` \| [`MiddlewareResult`](../interfaces/MiddlewareResult.md)\>

Defined in: [packages/core/src/middleware/types.ts:64](https://github.com/pradeepmouli/lspeasy/blob/9cfbcabb7e5a7111a570b29f368656ea6b98ee25/packages/core/src/middleware/types.ts#L64)

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
