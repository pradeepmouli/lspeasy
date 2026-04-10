[**lspeasy v1.0.0**](../README.md)

***

[lspeasy](../README.md) / LSPRequestMethod

# Type Alias: LSPRequestMethod\<Direction\>

> **LSPRequestMethod**\<`Direction`\> = `Direction` *extends* `"both"` ? `KeyAsString`\<`FlatRequestMap`\> : `ConditionalKeys`\<`FlatRequestMap`, \{ `Direction`: `Direction` \| `"both"`; \}\> & `string`

Defined in: [packages/core/src/protocol/infer.ts:32](https://github.com/pradeepmouli/lspeasy/blob/90e5dd09e9abc1eaec4942c3ce2bc68117367562/packages/core/src/protocol/infer.ts#L32)

Union type of all valid LSP request method names

## Type Parameters

### Direction

`Direction` *extends* `"clientToServer"` \| `"serverToClient"` \| `"both"` = `"both"`
