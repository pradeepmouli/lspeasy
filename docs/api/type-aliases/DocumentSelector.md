[**lspeasy v1.0.0**](../README.md)

***

[lspeasy](../README.md) / DocumentSelector

# Type Alias: DocumentSelector

> **DocumentSelector** = (`string` \| [`DocumentFilter`](DocumentFilter.md))[]

Defined in: node\_modules/.pnpm/vscode-languageserver-protocol@3.17.5/node\_modules/vscode-languageserver-protocol/lib/common/protocol.d.ts:157

A document selector is the combination of one or many document filters.

## Sample

`let sel:DocumentSelector = [{ language: 'typescript' }, { language: 'json', pattern: '**∕tsconfig.json' }]`;

The use of a string as a document filter is deprecated

## Since

3.16.0.
