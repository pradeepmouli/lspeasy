[**lspeasy v1.0.0**](../README.md)

***

[lspeasy](../README.md) / LSPNotificationMethod

# Type Alias: LSPNotificationMethod\<Direction\>

> **LSPNotificationMethod**\<`Direction`\> = `Direction` *extends* `"both"` ? `KeyAsString`\<`FlatNotificationMap`\> : `ConditionalKeys`\<`FlatNotificationMap`, \{ `Direction`: `Direction` \| `"both"`; \}\> & `string`

Defined in: [packages/core/src/protocol/infer.ts:41](https://github.com/pradeepmouli/lspeasy/blob/376bc5f0c5c131f9052829a682564c2344e71fd6/packages/core/src/protocol/infer.ts#L41)

Union type of all valid LSP notification method names

## Type Parameters

### Direction

`Direction` *extends* `"clientToServer"` \| `"serverToClient"` \| `"both"` = `"both"`
