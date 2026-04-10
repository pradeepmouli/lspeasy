[**lspeasy v1.0.0**](../../../../README.md)

***

[lspeasy](../../../../README.md) / [Server](../README.md) / AvailableRequests

# Type Alias: AvailableRequests\<ServerCaps, Requests\>

> **AvailableRequests**\<`ServerCaps`, `Requests`\> = `Simplify`\<`RemoveNever`\<`{ [Namespace in KeyAsString<LSPRequest> as CamelCase<Namespace>]: RemoveNeverFromNamespace<{ [Method in keyof Requests[Namespace] as CamelCase<Method & string>]: IsServerCapabilityEnabled<ServerCaps, Requests[Namespace][Method]> extends true ? Requests[Namespace][Method] : never }> }`\>\>

Defined in: [packages/core/src/protocol/capability-methods.ts:291](https://github.com/pradeepmouli/lspeasy/blob/376bc5f0c5c131f9052829a682564c2344e71fd6/packages/core/src/protocol/capability-methods.ts#L291)

## Type Parameters

### ServerCaps

`ServerCaps` *extends* `Partial`\<[`ServerCapabilities`](../../../../interfaces/ServerCapabilities.md)\>

### Requests

`Requests` *extends* `Partial`\<[`LSPRequest`](../../../../type-aliases/LSPRequest.md)\> = [`LSPRequest`](../../../../type-aliases/LSPRequest.md)
