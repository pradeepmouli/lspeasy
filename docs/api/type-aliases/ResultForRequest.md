[**lspeasy v1.0.0**](../README.md)

***

[lspeasy](../README.md) / ResultForRequest

# Type Alias: ResultForRequest\<M\>

> **ResultForRequest**\<`M`\> = `M` *extends* [`LSPRequestMethod`](LSPRequestMethod.md) ? `FlatRequestMap`\[`M`\]\[`"Result"`\] : `never`

Defined in: [packages/core/src/protocol/infer.ts:65](https://github.com/pradeepmouli/lspeasy/blob/90e5dd09e9abc1eaec4942c3ce2bc68117367562/packages/core/src/protocol/infer.ts#L65)

Infer request result from method name

## Type Parameters

### M

`M` *extends* `string`

## Example

```ts
type HoverResult = InferRequestResult<'textDocument/hover'>
// Resolves to: Hover | null
```
