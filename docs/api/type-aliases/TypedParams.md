[**lspeasy v1.0.0**](../README.md)

***

[lspeasy](../README.md) / TypedParams

# Type Alias: TypedParams\<M\>

> **TypedParams**\<`M`\> = `M` *extends* [`LSPRequestMethod`](LSPRequestMethod.md) ? [`ParamsForRequest`](ParamsForRequest.md)\<`M`\> : `M` *extends* [`LSPNotificationMethod`](LSPNotificationMethod.md) ? [`ParamsForNotification`](ParamsForNotification.md)\<`M`\> : `never`

Defined in: [packages/core/src/middleware/types.ts:35](https://github.com/pradeepmouli/lspeasy/blob/376bc5f0c5c131f9052829a682564c2344e71fd6/packages/core/src/middleware/types.ts#L35)

## Type Parameters

### M

`M` *extends* [`LSPMethod`](LSPMethod.md)
