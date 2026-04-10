[**lspeasy v1.0.0**](../README.md)

***

[lspeasy](../README.md) / ParamsForNotification

# Type Alias: ParamsForNotification\<M\>

> **ParamsForNotification**\<`M`\> = `M` *extends* [`LSPNotificationMethod`](LSPNotificationMethod.md) ? `FlatNotificationMap`\[`M`\]\[`"Params"`\] : `never`

Defined in: [packages/core/src/protocol/infer.ts:88](https://github.com/pradeepmouli/lspeasy/blob/90e5dd09e9abc1eaec4942c3ce2bc68117367562/packages/core/src/protocol/infer.ts#L88)

Infer notification parameters from method name

## Type Parameters

### M

`M` *extends* `string`

## Example

```ts
type DidOpenParams = InferNotificationParams<'textDocument/didOpen'>
// Resolves to: DidOpenTextDocumentParams from vscode-languageserver-protocol
```
