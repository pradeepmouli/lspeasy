[**lspeasy v1.0.0**](../README.md)

***

[lspeasy](../README.md) / InitializeError

# Interface: InitializeError

Defined in: node\_modules/.pnpm/vscode-languageserver-protocol@3.17.5/node\_modules/vscode-languageserver-protocol/lib/common/protocol.d.ts:1127

The data type of the ResponseError if the
initialize request fails.

## Properties

### retry

> **retry**: `boolean`

Defined in: node\_modules/.pnpm/vscode-languageserver-protocol@3.17.5/node\_modules/vscode-languageserver-protocol/lib/common/protocol.d.ts:1134

Indicates whether the client execute the following retry logic:
(1) show the message provided by the ResponseError to the user
(2) user selects retry or cancel
(3) if user selected retry the initialize method is sent again.
