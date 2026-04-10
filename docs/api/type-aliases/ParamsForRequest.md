[**lspeasy v1.0.0**](../README.md)

***

[lspeasy](../README.md) / ParamsForRequest

# Type Alias: ParamsForRequest\<M\>

> **ParamsForRequest**\<`M`\> = `M` *extends* [`LSPRequestMethod`](LSPRequestMethod.md) ? `FlatRequestMap`\[`M`\]\[`"Params"`\] : `never`

Defined in: [packages/core/src/protocol/infer.ts:54](https://github.com/pradeepmouli/lspeasy/blob/74eda4ce2eb3e9f9d51dc27652e0acfc319327d4/packages/core/src/protocol/infer.ts#L54)

Infer request parameters from method name

## Type Parameters

### M

`M` *extends* `string`

## Example

```ts
type HoverParams = InferRequestParams<'textDocument/hover'>
// Resolves to: HoverParams from vscode-languageserver-protocol
```
