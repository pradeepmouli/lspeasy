[**lspeasy v1.0.0**](../README.md)

***

[lspeasy](../README.md) / Definition

# Type Alias: Definition

> **Definition** = [`Location`](../interfaces/Location.md) \| [`Location`](../interfaces/Location.md)[]

Defined in: node\_modules/.pnpm/vscode-languageserver-types@3.17.5/node\_modules/vscode-languageserver-types/lib/esm/main.d.ts:1746

The definition of a symbol represented as one or many [locations](../interfaces/Location.md).
For most programming languages there is only one location at which a symbol is
defined.

Servers should prefer returning `DefinitionLink` over `Definition` if supported
by the client.
