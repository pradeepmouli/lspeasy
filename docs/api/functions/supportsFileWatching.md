[**lspeasy v1.0.0**](../README.md)

***

[lspeasy](../README.md) / supportsFileWatching

# Function: supportsFileWatching()

> **supportsFileWatching**(`capabilities`): `capabilities is ClientCapabilities & { workspace: { didChangeWatchedFiles: { dynamicRegistration: true } } }`

Defined in: [packages/core/src/protocol/capabilities.ts:231](https://github.com/pradeepmouli/lspeasy/blob/90e5dd09e9abc1eaec4942c3ce2bc68117367562/packages/core/src/protocol/capabilities.ts#L231)

Helper to check if file watching is supported

## Parameters

### capabilities

[`ClientCapabilities`](../interfaces/ClientCapabilities.md)

## Returns

`capabilities is ClientCapabilities & { workspace: { didChangeWatchedFiles: { dynamicRegistration: true } } }`
