[**lspeasy v1.0.0**](../README.md)

***

[lspeasy](../README.md) / supportsFileWatching

# Function: supportsFileWatching()

> **supportsFileWatching**(`capabilities`): `capabilities is ClientCapabilities & { workspace: { didChangeWatchedFiles: { dynamicRegistration: true } } }`

Defined in: [packages/core/src/protocol/capabilities.ts:231](https://github.com/pradeepmouli/lspeasy/blob/1dc2e704391f3b32ce8185dadf1a265a4beb41d3/packages/core/src/protocol/capabilities.ts#L231)

Helper to check if file watching is supported

## Parameters

### capabilities

[`ClientCapabilities`](../interfaces/ClientCapabilities.md)

## Returns

`capabilities is ClientCapabilities & { workspace: { didChangeWatchedFiles: { dynamicRegistration: true } } }`
