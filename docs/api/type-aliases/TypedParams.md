[**lspeasy v1.0.0**](../README.md)

***

[lspeasy](../README.md) / TypedParams

# Type Alias: TypedParams\<M\>

> **TypedParams**\<`M`\> = `M` *extends* [`LSPRequestMethod`](LSPRequestMethod.md) ? [`ParamsForRequest`](ParamsForRequest.md)\<`M`\> : `M` *extends* [`LSPNotificationMethod`](LSPNotificationMethod.md) ? [`ParamsForNotification`](ParamsForNotification.md)\<`M`\> : `never`

Defined in: [packages/core/src/middleware/types.ts:35](https://github.com/pradeepmouli/lspeasy/blob/1dc2e704391f3b32ce8185dadf1a265a4beb41d3/packages/core/src/middleware/types.ts#L35)

## Type Parameters

### M

`M` *extends* [`LSPMethod`](LSPMethod.md)
