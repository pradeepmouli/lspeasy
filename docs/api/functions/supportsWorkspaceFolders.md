[**lspeasy v1.0.0**](../README.md)

***

[lspeasy](../README.md) / supportsWorkspaceFolders

# Function: supportsWorkspaceFolders()

> **supportsWorkspaceFolders**(`capabilities`): `capabilities is ServerCapabilities<any> & { workspace: { workspaceFolders: { supported: true } } }`

Defined in: [packages/core/src/protocol/capabilities.ts:212](https://github.com/pradeepmouli/lspeasy/blob/90e5dd09e9abc1eaec4942c3ce2bc68117367562/packages/core/src/protocol/capabilities.ts#L212)

Helper to check if workspace folders are supported

## Parameters

### capabilities

[`ServerCapabilities`](../interfaces/ServerCapabilities.md)

## Returns

`capabilities is ServerCapabilities<any> & { workspace: { workspaceFolders: { supported: true } } }`
