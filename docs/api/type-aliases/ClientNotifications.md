[**lspeasy v1.0.0**](../README.md)

***

[lspeasy](../README.md) / ClientNotifications

# Type Alias: ClientNotifications\<ServerCaps\>

> **ClientNotifications**\<`ServerCaps`\> = `Simplify`\<`RemoveNever`\<\{ \[Namespace in KeyAsString\<LSPRequest\> as CamelCase\<Namespace\>\]: RemoveNeverFromNamespace\<\{ \[Method in ConditionalKeys\<LSPRequest\[Namespace\], \{ Direction: "clientToServer" \| "both" \}\> as CamelCase\<Method\>\]: TransformToClientSendMethod\<LSPRequest\[Namespace\]\[Method\], ServerCaps\> \}\> \}\>\>

Defined in: [packages/core/src/protocol/capability-methods.ts:127](https://github.com/pradeepmouli/lspeasy/blob/376bc5f0c5c131f9052829a682564c2344e71fd6/packages/core/src/protocol/capability-methods.ts#L127)

Client methods for sending requests to server
Methods are conditionally visible based on ServerCapabilities

## Type Parameters

### ServerCaps

`ServerCaps` *extends* `Partial`\<[`ServerCapabilities`](../interfaces/ServerCapabilities.md)\>

## Example

```ts
type MyCaps = { hoverProvider: true; completionProvider: { triggerCharacters: ['.'] } };
type MyMethods = ClientSendMethods<MyCaps>;
// MyMethods.textDocument.hover is available
// MyMethods.textDocument.completion is available
// MyMethods.textDocument.definition is 'never' (not in capabilities)
```
