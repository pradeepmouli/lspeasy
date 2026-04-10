[**lspeasy v1.0.0**](../README.md)

***

[lspeasy](../README.md) / clientSupportsNotification

# Function: clientSupportsNotification()

> **clientSupportsNotification**\<`M`, `T`\>(`method`, `capabilities`): capabilities is T & \{ \[KeyType in string \| number \| symbol\]: UnionToIntersection\<\{ \[P in "window.showMessage" \| "textDocument.publishDiagnostics"\]: \{ \[KeyType in string \| number \| symbol\]: PickDeepObject\<ClientCapabilities, P\>\[KeyType\] \} \}\[ClientCapabilityForNotification\<M\>\]\>\[KeyType\] \}

Defined in: [packages/core/src/protocol/capabilities.ts:117](https://github.com/pradeepmouli/lspeasy/blob/1dc2e704391f3b32ce8185dadf1a265a4beb41d3/packages/core/src/protocol/capabilities.ts#L117)

## Type Parameters

### M

`M` *extends* `"window/showMessage"` \| `"window/logMessage"` \| `"telemetry/event"` \| `"textDocument/publishDiagnostics"` \| `"$/cancelRequest"` \| `"$/progress"` \| `"$/logTrace"`

### T

`T` *extends* `Partial`\<[`ClientCapabilities`](../interfaces/ClientCapabilities.md)\>

## Parameters

### method

`M`

### capabilities

`T`

## Returns

capabilities is T & \{ \[KeyType in string \| number \| symbol\]: UnionToIntersection\<\{ \[P in "window.showMessage" \| "textDocument.publishDiagnostics"\]: \{ \[KeyType in string \| number \| symbol\]: PickDeepObject\<ClientCapabilities, P\>\[KeyType\] \} \}\[ClientCapabilityForNotification\<M\>\]\>\[KeyType\] \}
