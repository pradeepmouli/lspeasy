[**lspeasy v1.0.0**](../README.md)

***

[lspeasy](../README.md) / RenameFilesParams

# Interface: RenameFilesParams

Defined in: node\_modules/.pnpm/vscode-languageserver-protocol@3.17.5/node\_modules/vscode-languageserver-protocol/lib/common/protocol.fileOperations.d.ts:185

The parameters sent in notifications/requests for user-initiated renames of
files.

## Since

3.16.0

## Properties

### files

> **files**: [`FileRename`](FileRename.md)[]

Defined in: node\_modules/.pnpm/vscode-languageserver-protocol@3.17.5/node\_modules/vscode-languageserver-protocol/lib/common/protocol.fileOperations.d.ts:190

An array of all files/folders renamed in this operation. When a folder is renamed, only
the folder will be included, and not its children.
