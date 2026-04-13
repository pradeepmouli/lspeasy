[**lspeasy v1.0.0**](../README.md)

***

[lspeasy](../README.md) / DeclarationLink

# Type Alias: DeclarationLink

> **DeclarationLink** = [`LocationLink`](../interfaces/LocationLink.md)

Defined in: node\_modules/.pnpm/vscode-languageserver-types@3.17.5/node\_modules/vscode-languageserver-types/lib/esm/main.d.ts:1767

Information about where a symbol is declared.

Provides additional metadata over normal [location](../interfaces/Location.md) declarations, including the range of
the declaring symbol.

Servers should prefer returning `DeclarationLink` over `Declaration` if supported
by the client.
