[**lspeasy v1.0.0**](../README.md)

***

[lspeasy](../README.md) / LSPNotificationMethod

# Type Alias: LSPNotificationMethod\<Direction\>

> **LSPNotificationMethod**\<`Direction`\> = `Direction` *extends* `"both"` ? `KeyAsString`\<`FlatNotificationMap`\> : `ConditionalKeys`\<`FlatNotificationMap`, \{ `Direction`: `Direction` \| `"both"`; \}\> & `string`

Defined in: [packages/core/src/protocol/infer.ts:41](https://github.com/pradeepmouli/lspeasy/blob/1dc2e704391f3b32ce8185dadf1a265a4beb41d3/packages/core/src/protocol/infer.ts#L41)

Union type of all valid LSP notification method names

## Type Parameters

### Direction

`Direction` *extends* `"clientToServer"` \| `"serverToClient"` \| `"both"` = `"both"`
