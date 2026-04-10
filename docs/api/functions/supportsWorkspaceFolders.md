[**lspeasy v1.0.0**](../README.md)

***

[lspeasy](../README.md) / supportsWorkspaceFolders

# Function: supportsWorkspaceFolders()

> **supportsWorkspaceFolders**(`capabilities`): `capabilities is ServerCapabilities<any> & { workspace: { workspaceFolders: { supported: true } } }`

Defined in: [packages/core/src/protocol/capabilities.ts:212](https://github.com/pradeepmouli/lspeasy/blob/376bc5f0c5c131f9052829a682564c2344e71fd6/packages/core/src/protocol/capabilities.ts#L212)

Helper to check if workspace folders are supported

## Parameters

### capabilities

[`ServerCapabilities`](../interfaces/ServerCapabilities.md)

## Returns

`capabilities is ServerCapabilities<any> & { workspace: { workspaceFolders: { supported: true } } }`
