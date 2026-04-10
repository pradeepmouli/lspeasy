[**lspeasy v1.0.0**](../README.md)

***

[lspeasy](../README.md) / ClientRequests

# Type Alias: ClientRequests\<ServerCaps\>

> **ClientRequests**\<`ServerCaps`\> = `Simplify`\<`RemoveNever`\<\{ \[Namespace in KeyAsString\<LSPRequest\> as CamelCase\<Namespace\>\]: RemoveNeverFromNamespace\<\{ \[Method in ConditionalKeys\<LSPRequest\[Namespace\], \{ Direction: "clientToServer" \| "both" \}\> as CamelCase\<Method\>\]: TransformToClientSendMethod\<LSPRequest\[Namespace\]\[Method\], ServerCaps\> \}\> \}\>\>

Defined in: [packages/core/src/protocol/capability-methods.ts:141](https://github.com/pradeepmouli/lspeasy/blob/376bc5f0c5c131f9052829a682564c2344e71fd6/packages/core/src/protocol/capability-methods.ts#L141)

## Type Parameters

### ServerCaps

`ServerCaps` *extends* `Partial`\<[`ServerCapabilities`](../interfaces/ServerCapabilities.md)\>
