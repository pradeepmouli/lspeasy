[**lspeasy v1.0.0**](../README.md)

***

[lspeasy](../README.md) / executeMiddlewarePipeline

# Function: executeMiddlewarePipeline()

> **executeMiddlewarePipeline**(`registrations`, `context`, `finalHandler`): `Promise`\<`void` \| [`MiddlewareResult`](../interfaces/MiddlewareResult.md)\>

Defined in: [packages/core/src/middleware/pipeline.ts:42](https://github.com/pradeepmouli/lspeasy/blob/9cfbcabb7e5a7111a570b29f368656ea6b98ee25/packages/core/src/middleware/pipeline.ts#L42)

## Parameters

### registrations

`MiddlewareRegistration`[] \| `undefined`

### context

[`MiddlewareContext`](../interfaces/MiddlewareContext.md)

### finalHandler

() => `Promise`\<`void` \| [`MiddlewareResult`](../interfaces/MiddlewareResult.md)\>

## Returns

`Promise`\<`void` \| [`MiddlewareResult`](../interfaces/MiddlewareResult.md)\>
