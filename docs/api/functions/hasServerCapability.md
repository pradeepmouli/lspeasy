[**lspeasy v1.0.0**](../README.md)

***

[lspeasy](../README.md) / hasServerCapability

# Function: hasServerCapability()

> **hasServerCapability**\<`K`, `T`\>(`capabilities`, `capability`): capabilities is T & \{ \[KeyType in string \| number \| symbol\]: UnionToIntersection\<\{ \[P in InternalPaths\<Required\<ServerCapabilities\<any\>\>, \{ bracketNotation: false; depth: number; leavesOnly: false; maxRecursionDepth: 5 \}, 0\>\]: \{ \[KeyType in string \| number \| symbol\]: PickDeepObject\<ServerCapabilities\<any\>, P\>\[KeyType\] \} \}\[K\]\>\[KeyType\] \}

Defined in: [packages/core/src/protocol/capabilities.ts:135](https://github.com/pradeepmouli/lspeasy/blob/74eda4ce2eb3e9f9d51dc27652e0acfc319327d4/packages/core/src/protocol/capabilities.ts#L135)

Check if a server capability is enabled

## Type Parameters

### K

`K` *extends* `InternalPaths`\<`Required`\<[`ServerCapabilities`](../interfaces/ServerCapabilities.md)\<`any`\>\>, \{ `bracketNotation`: `false`; `depth`: `number`; `leavesOnly`: `false`; `maxRecursionDepth`: `5`; \}, `0`\>

### T

`T` *extends* `Partial`\<[`ServerCapabilities`](../interfaces/ServerCapabilities.md)\<`any`\>\>

## Parameters

### capabilities

`T`

### capability

`K`

## Returns

capabilities is T & \{ \[KeyType in string \| number \| symbol\]: UnionToIntersection\<\{ \[P in InternalPaths\<Required\<ServerCapabilities\<any\>\>, \{ bracketNotation: false; depth: number; leavesOnly: false; maxRecursionDepth: 5 \}, 0\>\]: \{ \[KeyType in string \| number \| symbol\]: PickDeepObject\<ServerCapabilities\<any\>, P\>\[KeyType\] \} \}\[K\]\>\[KeyType\] \}
