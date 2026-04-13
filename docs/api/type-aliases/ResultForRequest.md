[**lspeasy v1.0.0**](../README.md)

***

[lspeasy](../README.md) / ResultForRequest

# Type Alias: ResultForRequest\<M\>

> **ResultForRequest**\<`M`\> = `M` *extends* [`LSPRequestMethod`](LSPRequestMethod.md) ? `FlatRequestMap`\[`M`\]\[`"Result"`\] : `never`

Defined in: [packages/core/src/protocol/infer.ts:65](https://github.com/pradeepmouli/lspeasy/blob/1dc2e704391f3b32ce8185dadf1a265a4beb41d3/packages/core/src/protocol/infer.ts#L65)

Infer request result from method name

## Type Parameters

### M

`M` *extends* `string`

## Example

```ts
type HoverResult = InferRequestResult<'textDocument/hover'>
// Resolves to: Hover | null
```
