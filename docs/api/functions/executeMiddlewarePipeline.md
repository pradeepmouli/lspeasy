[**lspeasy v1.0.0**](../README.md)

***

[lspeasy](../README.md) / executeMiddlewarePipeline

# Function: executeMiddlewarePipeline()

> **executeMiddlewarePipeline**(`registrations`, `context`, `finalHandler`): `Promise`\<`void` \| [`MiddlewareResult`](../interfaces/MiddlewareResult.md)\>

Defined in: [packages/core/src/middleware/pipeline.ts:42](https://github.com/pradeepmouli/lspeasy/blob/376bc5f0c5c131f9052829a682564c2344e71fd6/packages/core/src/middleware/pipeline.ts#L42)

## Parameters

### registrations

`MiddlewareRegistration`[] \| `undefined`

### context

[`MiddlewareContext`](../interfaces/MiddlewareContext.md)

### finalHandler

() => `Promise`\<`void` \| [`MiddlewareResult`](../interfaces/MiddlewareResult.md)\>

## Returns

`Promise`\<`void` \| [`MiddlewareResult`](../interfaces/MiddlewareResult.md)\>
