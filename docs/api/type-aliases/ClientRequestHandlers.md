[**lspeasy v1.0.0**](../README.md)

***

[lspeasy](../README.md) / ClientRequestHandlers

# Type Alias: ClientRequestHandlers\<_ClientCaps\>

> **ClientRequestHandlers**\<`_ClientCaps`\> = `RemoveNever`\<\{ \[Namespace in keyof LSPRequest as CamelCase\<Namespace\>\]: \{ \[Method in keyof ConditionalPick\<LSPRequest\[Namespace\], \{ Direction: "serverToClient" \| "both" \}\> as \`on$\{Method & string\}Request\`\]: TransformToClientHandler\<LSPRequest\[Namespace\]\[Method\], \_ClientCaps\> \} \}\>

Defined in: [packages/core/src/protocol/capability-methods.ts:193](https://github.com/pradeepmouli/lspeasy/blob/74eda4ce2eb3e9f9d51dc27652e0acfc319327d4/packages/core/src/protocol/capability-methods.ts#L193)

Client handler registration methods (for requests from server)

## Type Parameters

### _ClientCaps

`_ClientCaps` *extends* `Partial`\<[`ClientCapabilities`](../interfaces/ClientCapabilities.md)\>

## Example

```ts
type MyHandlers = ClientHandlers<ClientCapabilities>;
// client.onShowMessageRequest(handler)
// client.onApplyWorkspaceEdit(handler)
```
