[**lspeasy v1.0.0**](../README.md)

***

[lspeasy](../README.md) / hasClientCapability

# Function: hasClientCapability()

> **hasClientCapability**\<`K`, `T`\>(`capabilities`, `capability`): capabilities is T & \{ \[KeyType in string \| number \| symbol\]: UnionToIntersection\<\{ \[P in InternalPaths\<Required\<ClientCapabilities\>, \{ bracketNotation: false; depth: number; leavesOnly: false; maxRecursionDepth: 5 \}, 0\>\]: \{ \[KeyType in string \| number \| symbol\]: PickDeepObject\<ClientCapabilities, P\>\[KeyType\] \} \}\[K\]\>\[KeyType\] \}

Defined in: [packages/core/src/protocol/capabilities.ts:146](https://github.com/pradeepmouli/lspeasy/blob/74eda4ce2eb3e9f9d51dc27652e0acfc319327d4/packages/core/src/protocol/capabilities.ts#L146)

Check if a client capability is enabled

## Type Parameters

### K

`K` *extends* `InternalPaths`\<`Required`\<[`ClientCapabilities`](../interfaces/ClientCapabilities.md)\>, \{ `bracketNotation`: `false`; `depth`: `number`; `leavesOnly`: `false`; `maxRecursionDepth`: `5`; \}, `0`\>

### T

`T` *extends* `Partial`\<[`ClientCapabilities`](../interfaces/ClientCapabilities.md)\>

## Parameters

### capabilities

`T`

### capability

`K`

## Returns

capabilities is T & \{ \[KeyType in string \| number \| symbol\]: UnionToIntersection\<\{ \[P in InternalPaths\<Required\<ClientCapabilities\>, \{ bracketNotation: false; depth: number; leavesOnly: false; maxRecursionDepth: 5 \}, 0\>\]: \{ \[KeyType in string \| number \| symbol\]: PickDeepObject\<ClientCapabilities, P\>\[KeyType\] \} \}\[K\]\>\[KeyType\] \}
