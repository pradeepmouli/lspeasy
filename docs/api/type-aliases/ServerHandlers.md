[**lspeasy v1.0.0**](../README.md)

***

[lspeasy](../README.md) / ServerHandlers

# Type Alias: ServerHandlers\<ServerCaps\>

> **ServerHandlers**\<`ServerCaps`\> = `Simplify`\<`RemoveNever`\<`` { [Namespace in KeyAsString<LSPRequest> as CamelCase<Namespace>]: RemoveNeverFromNamespace<{ [Method in keyof LSPRequest[Namespace] as `on${Method & string}`]: TransformToServerHandler<LSPRequest[Namespace][Method], ServerCaps> }> } ``\>\>

Defined in: [packages/core/src/protocol/capability-methods.ts:165](https://github.com/pradeepmouli/lspeasy/blob/74eda4ce2eb3e9f9d51dc27652e0acfc319327d4/packages/core/src/protocol/capability-methods.ts#L165)

Server handler registration methods (for requests from client)
Handlers are conditionally visible based on ServerCapabilities

## Type Parameters

### ServerCaps

`ServerCaps` *extends* `Partial`\<[`ServerCapabilities`](../interfaces/ServerCapabilities.md)\>

## Example

```ts
type MyCaps = { hoverProvider: true };
type MyHandlers = ServerHandlers<MyCaps>;
// MyHandlers.textDocument.onHover is available
// MyHandlers.textDocument.onCompletion is removed
```
