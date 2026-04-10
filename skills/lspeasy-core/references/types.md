# Types & Enums

## capability-methods

### `AvailableRequests`
```ts
Simplify<RemoveNever<{ [Namespace in KeyAsString<LSPRequest> as CamelCase<Namespace>]: RemoveNeverFromNamespace<{ [Method in keyof Requests[Namespace] as CamelCase<Method & string>]: IsClientCapabilityEnabled<ClientCaps, Requests[Namespace][Method]> extends true ? Requests[Namespace][Method] : never }> }>>
```

### `AvailableNotifications`
```ts
Simplify<RemoveNever<{ [Namespace in KeyAsString<LSPNotification> as CamelCase<Namespace>]: RemoveNeverFromNamespace<{ [Method in keyof Notifications[Namespace] as CamelCase<StripNamespaceSuffix<Namespace & string, Method & string>>]: IsClientCapabilityEnabled<ClientCaps, Notifications[Namespace][Method]> extends true ? Notifications[Namespace][Method] : never }> }>>
```

### `AvailableRequests`
```ts
Simplify<RemoveNever<{ [Namespace in KeyAsString<LSPRequest> as CamelCase<Namespace>]: RemoveNeverFromNamespace<{ [Method in keyof Requests[Namespace] as CamelCase<Method & string>]: IsServerCapabilityEnabled<ServerCaps, Requests[Namespace][Method]> extends true ? Requests[Namespace][Method] : never }> }>>
```

### `AvailableNotifications`
```ts
Simplify<RemoveNever<{ [Namespace in KeyAsString<LSPNotification> as CamelCase<Namespace>]: RemoveNeverFromNamespace<{ [Method in keyof Notifications[Namespace] as CamelCase<StripNamespaceSuffix<Namespace & string, Method & string>>]: IsServerCapabilityEnabled<ServerCaps, Notifications[Namespace][Method]> extends true ? Notifications[Namespace][Method] : never }> }>>
```
