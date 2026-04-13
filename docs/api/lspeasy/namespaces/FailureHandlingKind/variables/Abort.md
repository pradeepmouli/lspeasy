[**lspeasy v1.0.0**](../../../../README.md)

***

[lspeasy](../../../../README.md) / [FailureHandlingKind](../README.md) / Abort

# Variable: Abort

> `const` **Abort**: [`FailureHandlingKind`](../../../../type-aliases/FailureHandlingKind.md)

Defined in: node\_modules/.pnpm/vscode-languageserver-protocol@3.17.5/node\_modules/vscode-languageserver-protocol/lib/common/protocol.d.ts:274

Applying the workspace change is simply aborted if one of the changes provided
fails. All operations executed before the failing operation stay executed.
