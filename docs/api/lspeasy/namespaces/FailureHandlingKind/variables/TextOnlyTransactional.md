[**lspeasy v1.0.0**](../../../../README.md)

***

[lspeasy](../../../../README.md) / [FailureHandlingKind](../README.md) / TextOnlyTransactional

# Variable: TextOnlyTransactional

> `const` **TextOnlyTransactional**: [`FailureHandlingKind`](../../../../type-aliases/FailureHandlingKind.md)

Defined in: node\_modules/.pnpm/vscode-languageserver-protocol@3.17.5/node\_modules/vscode-languageserver-protocol/lib/common/protocol.d.ts:285

If the workspace edit contains only textual file changes they are executed transactional.
If resource changes (create, rename or delete file) are part of the change the failure
handling strategy is abort.
