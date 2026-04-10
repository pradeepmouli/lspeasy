[**lspeasy v1.0.0**](../README.md)

***

[lspeasy](../README.md) / ParamsForRequest

# Type Alias: ParamsForRequest\<M\>

> **ParamsForRequest**\<`M`\> = `M` *extends* [`LSPRequestMethod`](LSPRequestMethod.md) ? `FlatRequestMap`\[`M`\]\[`"Params"`\] : `never`

Defined in: [packages/core/src/protocol/infer.ts:54](https://github.com/pradeepmouli/lspeasy/blob/376bc5f0c5c131f9052829a682564c2344e71fd6/packages/core/src/protocol/infer.ts#L54)

Infer request parameters from method name

## Type Parameters

### M

`M` *extends* `string`

## Example

```ts
type HoverParams = InferRequestParams<'textDocument/hover'>
// Resolves to: HoverParams from vscode-languageserver-protocol
```
