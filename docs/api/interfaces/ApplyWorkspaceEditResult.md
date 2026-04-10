[**lspeasy v1.0.0**](../README.md)

***

[lspeasy](../README.md) / ApplyWorkspaceEditResult

# Interface: ApplyWorkspaceEditResult

Defined in: node\_modules/.pnpm/vscode-languageserver-protocol@3.17.5/node\_modules/vscode-languageserver-protocol/lib/common/protocol.d.ts:3221

The result returned from the apply workspace edit request.

## Since

3.17 renamed from ApplyWorkspaceEditResponse

## Properties

### applied

> **applied**: `boolean`

Defined in: node\_modules/.pnpm/vscode-languageserver-protocol@3.17.5/node\_modules/vscode-languageserver-protocol/lib/common/protocol.d.ts:3225

Indicates whether the edit was applied or not.

***

### failedChange?

> `optional` **failedChange?**: `number`

Defined in: node\_modules/.pnpm/vscode-languageserver-protocol@3.17.5/node\_modules/vscode-languageserver-protocol/lib/common/protocol.d.ts:3237

Depending on the client's failure handling strategy `failedChange` might
contain the index of the change that failed. This property is only available
if the client signals a `failureHandlingStrategy` in its client capabilities.

***

### failureReason?

> `optional` **failureReason?**: `string`

Defined in: node\_modules/.pnpm/vscode-languageserver-protocol@3.17.5/node\_modules/vscode-languageserver-protocol/lib/common/protocol.d.ts:3231

An optional textual description for why the edit was not applied.
This may be used by the server for diagnostic logging or to provide
a suitable error for a request that triggered the edit.
