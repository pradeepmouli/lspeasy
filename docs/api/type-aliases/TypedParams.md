[**lspeasy v1.0.0**](../README.md)

***

[lspeasy](../README.md) / TypedParams

# Type Alias: TypedParams\<M\>

> **TypedParams**\<`M`\> = `M` *extends* [`LSPRequestMethod`](LSPRequestMethod.md) ? [`ParamsForRequest`](ParamsForRequest.md)\<`M`\> : `M` *extends* [`LSPNotificationMethod`](LSPNotificationMethod.md) ? [`ParamsForNotification`](ParamsForNotification.md)\<`M`\> : `never`

Defined in: [packages/core/src/middleware/types.ts:35](https://github.com/pradeepmouli/lspeasy/blob/90e5dd09e9abc1eaec4942c3ce2bc68117367562/packages/core/src/middleware/types.ts#L35)

## Type Parameters

### M

`M` *extends* [`LSPMethod`](LSPMethod.md)
