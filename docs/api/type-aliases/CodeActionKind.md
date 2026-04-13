[**lspeasy v1.0.0**](../README.md)

***

[lspeasy](../README.md) / CodeActionKind

# Type Alias: CodeActionKind

> **CodeActionKind** = `string`

Defined in: node\_modules/.pnpm/vscode-languageserver-types@3.17.5/node\_modules/vscode-languageserver-types/lib/esm/main.d.ts:2038

The kind of a code action.

Kinds are a hierarchical list of identifiers separated by `.`, e.g. `"refactor.extract.function"`.

The set of kinds is open and client needs to announce the kinds it supports to the server during
initialization.
