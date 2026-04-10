[**lspeasy v1.0.0**](../README.md)

***

[lspeasy](../README.md) / executeMiddlewarePipeline

# Function: executeMiddlewarePipeline()

> **executeMiddlewarePipeline**(`registrations`, `context`, `finalHandler`): `Promise`\<`void` \| [`MiddlewareResult`](../interfaces/MiddlewareResult.md)\>

Defined in: [packages/core/src/middleware/pipeline.ts:42](https://github.com/pradeepmouli/lspeasy/blob/90e5dd09e9abc1eaec4942c3ce2bc68117367562/packages/core/src/middleware/pipeline.ts#L42)

## Parameters

### registrations

`MiddlewareRegistration`[] \| `undefined`

### context

[`MiddlewareContext`](../interfaces/MiddlewareContext.md)

### finalHandler

() => `Promise`\<`void` \| [`MiddlewareResult`](../interfaces/MiddlewareResult.md)\>

## Returns

`Promise`\<`void` \| [`MiddlewareResult`](../interfaces/MiddlewareResult.md)\>
