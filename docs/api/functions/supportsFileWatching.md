[**lspeasy v1.0.0**](../README.md)

***

[lspeasy](../README.md) / supportsFileWatching

# Function: supportsFileWatching()

> **supportsFileWatching**(`capabilities`): `capabilities is ClientCapabilities & { workspace: { didChangeWatchedFiles: { dynamicRegistration: true } } }`

Defined in: [packages/core/src/protocol/capabilities.ts:231](https://github.com/pradeepmouli/lspeasy/blob/376bc5f0c5c131f9052829a682564c2344e71fd6/packages/core/src/protocol/capabilities.ts#L231)

Helper to check if file watching is supported

## Parameters

### capabilities

[`ClientCapabilities`](../interfaces/ClientCapabilities.md)

## Returns

`capabilities is ClientCapabilities & { workspace: { didChangeWatchedFiles: { dynamicRegistration: true } } }`
