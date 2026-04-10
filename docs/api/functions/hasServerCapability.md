[**lspeasy v1.0.0**](../README.md)

***

[lspeasy](../README.md) / hasServerCapability

# Function: hasServerCapability()

> **hasServerCapability**\<`K`, `T`\>(`capabilities`, `capability`): capabilities is T & \{ \[KeyType in string \| number \| symbol\]: UnionToIntersection\<\{ \[P in InternalPaths\<Required\<ServerCapabilities\<any\>\>, \{ bracketNotation: false; depth: number; leavesOnly: false; maxRecursionDepth: 5 \}, 0\>\]: \{ \[KeyType in string \| number \| symbol\]: PickDeepObject\<ServerCapabilities\<any\>, P\>\[KeyType\] \} \}\[K\]\>\[KeyType\] \}

Defined in: [packages/core/src/protocol/capabilities.ts:135](https://github.com/pradeepmouli/lspeasy/blob/376bc5f0c5c131f9052829a682564c2344e71fd6/packages/core/src/protocol/capabilities.ts#L135)

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
