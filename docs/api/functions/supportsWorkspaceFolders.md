[**lspeasy v1.0.0**](../README.md)

***

[lspeasy](../README.md) / supportsWorkspaceFolders

# Function: supportsWorkspaceFolders()

> **supportsWorkspaceFolders**(`capabilities`): `capabilities is ServerCapabilities<any> & { workspace: { workspaceFolders: { supported: true } } }`

Defined in: [packages/core/src/protocol/capabilities.ts:212](https://github.com/pradeepmouli/lspeasy/blob/74eda4ce2eb3e9f9d51dc27652e0acfc319327d4/packages/core/src/protocol/capabilities.ts#L212)

Helper to check if workspace folders are supported

## Parameters

### capabilities

[`ServerCapabilities`](../interfaces/ServerCapabilities.md)

## Returns

`capabilities is ServerCapabilities<any> & { workspace: { workspaceFolders: { supported: true } } }`
