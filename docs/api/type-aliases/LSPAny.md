[**lspeasy v1.0.0**](../README.md)

***

[lspeasy](../README.md) / LSPAny

# Type Alias: LSPAny

> **LSPAny** = `any`

Defined in: node\_modules/.pnpm/vscode-languageserver-types@3.17.5/node\_modules/vscode-languageserver-types/lib/esm/main.d.ts:66

The LSP any type.

In the current implementation we map LSPAny to any. This is due to the fact
that the TypeScript compilers can't infer string access signatures for
interface correctly (it can though for types). See the following issue for
details: https://github.com/microsoft/TypeScript/issues/15300.

When the issue is addressed LSPAny can be defined as follows:

```ts
export type LSPAny = LSPObject | LSPArray | string | integer | uinteger | decimal | boolean | null | undefined;
export type LSPObject = { [key: string]: LSPAny };
export type LSPArray = LSPAny[];
```

Please note that strictly speaking a property with the value `undefined`
can't be converted into JSON preserving the property name. However for
convenience it is allowed and assumed that all these properties are
optional as well.

## Since

3.17.0
