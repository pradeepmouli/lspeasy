# Types & Enums

## protocol

### `ApplyKind`
LSP Protocol Enums

Emitted as const objects + union type aliases for structural compatibility
with vscode-languageserver-protocol, which uses the same pattern.

Auto-generated from metaModel.json
DO NOT EDIT MANUALLY
```ts
1 | 2
```

### `CodeActionKind`
```ts
"" | "quickfix" | "refactor" | "refactor.extract" | "refactor.inline" | "refactor.move" | "refactor.rewrite" | "source" | "source.organizeImports" | "source.fixAll" | "notebook" | string
```

### `CodeActionTag`
```ts
1
```

### `CodeActionTriggerKind`
```ts
1 | 2
```

### `CompletionItemKind`
```ts
1 | 2 | 3 | 4 | 5 | 6 | 7 | 8 | 9 | 10 | 11 | 12 | 13 | 14 | 15 | 16 | 17 | 18 | 19 | 20 | 21 | 22 | 23 | 24 | 25
```

### `CompletionItemTag`
```ts
1
```

### `CompletionTriggerKind`
```ts
1 | 2 | 3
```

### `DiagnosticSeverity`
```ts
1 | 2 | 3 | 4
```

### `DiagnosticTag`
```ts
1 | 2
```

### `DocumentDiagnosticReportKind`
```ts
"full" | "unchanged"
```

### `DocumentHighlightKind`
```ts
1 | 2 | 3
```

### `ErrorCodes`
```ts
-32700 | -32600 | -32601 | -32602 | -32603 | -32002 | -32001 | number
```

### `FailureHandlingKind`
```ts
"abort" | "transactional" | "textOnlyTransactional" | "undo"
```

### `FileOperationPatternKind`
```ts
"file" | "folder"
```

### `FoldingRangeKind`
```ts
"comment" | "imports" | "region" | string
```

### `InlayHintKind`
```ts
1 | 2
```

### `InlineCompletionTriggerKind`
```ts
1 | 2
```

### `InsertTextFormat`
```ts
1 | 2
```

### `InsertTextMode`
```ts
1 | 2
```

### `LanguageKind`
```ts
"abap" | "bat" | "bibtex" | "clojure" | "coffeescript" | "c" | "cpp" | "csharp" | "css" | "d" | "pascal" | "diff" | "dart" | "dockerfile" | "elixir" | "erlang" | "fsharp" | "git-commit" | "git-rebase" | "go" | "groovy" | "handlebars" | "haskell" | "html" | "ini" | "java" | "javascript" | "javascriptreact" | "json" | "latex" | "less" | "lua" | "makefile" | "markdown" | "objective-c" | "objective-cpp" | "pascal" | "perl" | "perl6" | "php" | "plaintext" | "powershell" | "jade" | "python" | "r" | "razor" | "ruby" | "rust" | "scss" | "sass" | "scala" | "shaderlab" | "shellscript" | "sql" | "swift" | "typescript" | "typescriptreact" | "tex" | "vb" | "xml" | "xsl" | "yaml" | string
```

### `LSPErrorCodes`
```ts
-32803 | -32802 | -32801 | -32800 | number
```

### `MarkupKind`
```ts
"plaintext" | "markdown"
```

### `MessageType`
```ts
1 | 2 | 3 | 4 | 5
```

### `MonikerKind`
```ts
"import" | "export" | "local"
```

### `NotebookCellKind`
```ts
1 | 2
```

### `PositionEncodingKind`
```ts
"utf-8" | "utf-16" | "utf-32" | string
```

### `PrepareSupportDefaultBehavior`
```ts
1
```

### `ResourceOperationKind`
```ts
"create" | "rename" | "delete"
```

### `SemanticTokenModifiers`
```ts
"declaration" | "definition" | "readonly" | "static" | "deprecated" | "abstract" | "async" | "modification" | "documentation" | "defaultLibrary" | string
```

### `SemanticTokenTypes`
```ts
"namespace" | "type" | "class" | "enum" | "interface" | "struct" | "typeParameter" | "parameter" | "variable" | "property" | "enumMember" | "event" | "function" | "method" | "macro" | "keyword" | "modifier" | "comment" | "string" | "number" | "regexp" | "operator" | "decorator" | "label" | string
```

### `SignatureHelpTriggerKind`
```ts
1 | 2 | 3
```

### `SymbolKind`
```ts
1 | 2 | 3 | 4 | 5 | 6 | 7 | 8 | 9 | 10 | 11 | 12 | 13 | 14 | 15 | 16 | 17 | 18 | 19 | 20 | 21 | 22 | 23 | 24 | 25 | 26
```

### `SymbolTag`
```ts
1
```

### `TextDocumentSaveReason`
```ts
1 | 2 | 3
```

### `TextDocumentSyncKind`
```ts
0 | 1 | 2
```

### `TokenFormat`
```ts
"relative"
```

### `TraceValue`
```ts
"off" | "messages" | "compact" | "verbose"
```

### `UniquenessLevel`
```ts
"document" | "project" | "group" | "scheme" | "global"
```

### `LSPRequestMethod`
Union type of all valid LSP request method names
```ts
Direction extends "both" ? KeyAsString<FlatRequestMap> : ConditionalKeys<FlatRequestMap, { Direction: Direction | "both" }> & string
```

### `LSPNotificationMethod`
Union type of all valid LSP notification method names
```ts
Direction extends "both" ? KeyAsString<FlatNotificationMap> : ConditionalKeys<FlatNotificationMap, { Direction: Direction | "both" }> & string
```

### `ParamsForRequest`
Infer request parameters from method name
```ts
M extends LSPRequestMethod ? FlatRequestMap[M]["Params"] : never
```

### `ResultForRequest`
Infer request result from method name
```ts
M extends LSPRequestMethod ? FlatRequestMap[M]["Result"] : never
```

### `ServerCapabilityForRequest`
Resolves the `ServerCapabilities` path key required to enable a given LSP request method.
```ts
M extends LSPRequestMethod ? FlatRequestMap[M] extends { ServerCapability: infer C } ? C : never : never
```

### `ClientCapabilityForRequest`
Resolves the `ClientCapabilities` path key required for a client to send a given LSP request.
```ts
M extends LSPRequestMethod ? FlatRequestMap[M] extends { ClientCapability: infer C } ? C : never : never
```

### `ParamsForNotification`
Infer notification parameters from method name
```ts
M extends LSPNotificationMethod ? FlatNotificationMap[M]["Params"] : never
```

### `ServerCapabilityForNotification`
Resolves the `ServerCapabilities` path key required to enable a given LSP notification method.
```ts
M extends LSPNotificationMethod ? FlatNotificationMap[M] extends { ServerCapability: infer C } ? C : never : never
```

### `ClientCapabilityForNotification`
Resolves the `ClientCapabilities` path key required for a client to handle a given LSP notification.
```ts
M extends LSPNotificationMethod ? FlatNotificationMap[M] extends { ClientCapability: infer C } ? C : never : never
```

### `OptionsForRequest`
Resolves the registration options type for a given LSP request method.
```ts
M extends LSPRequestMethod ? FlatRequestMap[M] extends { Options: infer O } ? O : never : never
```

### `RegistrationOptionsForRequest`
Resolves the dynamic registration options type for a given LSP request method.
```ts
M extends LSPRequestMethod ? FlatRequestMap[M] extends { RegistrationOptions: infer R } ? R : never : never
```

### `DirectionForRequest`
Resolves the message direction (`'clientToServer'` | `'serverToClient'` | `'both'`)
for a given LSP request method.
```ts
M extends LSPRequestMethod ? FlatRequestMap[M] extends { Direction: infer D } ? D : never : never
```

### `DirectionForNotification`
Resolves the message direction for a given LSP notification method.
```ts
M extends LSPNotificationMethod ? FlatNotificationMap[M] extends { Direction: infer D } ? D : never : never
```

### `RequestDefinition`
The shape of a single LSP request definition entry (method, params, result,
direction, capability keys). Represents the structure of entries in the
`LSPRequest` namespace objects.
```ts
typeof IncomingCalls
```

### `ClientNotifications`
Client methods for sending requests to server
Methods are conditionally visible based on ServerCapabilities
```ts
Simplify<RemoveNever<{ [Namespace in KeyAsString<LSPRequest> as CamelCase<Namespace>]: RemoveNeverFromNamespace<{ [Method in ConditionalKeys<LSPRequest[Namespace], { Direction: "clientToServer" | "both" }> as CamelCase<Method>]: TransformToClientSendMethod<LSPRequest[Namespace][Method], ServerCaps> }> }>>
```

### `ClientRequests`
Typed namespace of client-to-server LSP request methods, filtered by the
server's declared capabilities.
```ts
Simplify<RemoveNever<{ [Namespace in KeyAsString<LSPRequest> as CamelCase<Namespace>]: RemoveNeverFromNamespace<{ [Method in ConditionalKeys<LSPRequest[Namespace], { Direction: "clientToServer" | "both" }> as CamelCase<Method>]: TransformToClientSendMethod<LSPRequest[Namespace][Method], ServerCaps> }> }>>
```

### `ServerHandlers`
Server handler registration methods (for requests from client)
Handlers are conditionally visible based on ServerCapabilities
```ts
Simplify<RemoveNever<{ [Namespace in KeyAsString<LSPRequest> as CamelCase<Namespace>]: RemoveNeverFromNamespace<{ [Method in keyof LSPRequest[Namespace] as `on${Method & string}`]: TransformToServerHandler<LSPRequest[Namespace][Method], ServerCaps> }> }>>
```

### `ClientRequestHandlers`
Client handler registration methods (for requests from server)
```ts
RemoveNever<{ [Namespace in keyof LSPRequest as CamelCase<Namespace>]: { [Method in keyof ConditionalPick<LSPRequest[Namespace], { Direction: "serverToClient" | "both" }> as `on${Method & string}Request`]: TransformToClientHandler<LSPRequest[Namespace][Method & keyof LSPRequest[Namespace]], _ClientCaps> } }>
```

### `ClientNotificationHandlers`
Typed namespace of server-to-client notification handler registration methods,
filtered by the client's declared capabilities.
```ts
RemoveNever<{ [Namespace in keyof LSPNotification as CamelCase<Namespace>]: { [Method in keyof ConditionalPick<LSPNotification[Namespace], { Direction: "serverToClient" | "both" }> as `on${Method & string}Notification`]: TransformToClientHandler<LSPNotification[Namespace][Method & keyof LSPNotification[Namespace]], _ClientCaps> } }>
```

### `ServerSendMethods`
Typed namespace of server-to-client request send methods, filtered by the
client's declared capabilities.
```ts
Simplify<{ [Namespace in KeyAsString<LSPRequest> as CamelCase<Namespace>]: RemoveNever<{ [Method in keyof LSPRequest[Namespace] as CamelCase<Method & string>]: TransformToServerSendMethod<LSPRequest[Namespace][Method], _ClientCaps> }> }>
```

### `ToRequestSignature`
Converts an LSP request type definition into a callable method signature
`(params: P) => Promise<R>`.
```ts
T extends { Method: string; Params: infer P; Result?: infer R } ? (params: P) => Promise<R> : never
```

### `ToNotificationSignature`
Converts an LSP notification type definition into a fire-and-forget method
signature `(params: P) => void`.
```ts
T extends { Method: string; Params: infer P } ? (params: P) => void : never
```

### `ToRequestHandlerSignature`
Converts an LSP request type definition into a handler registration signature
`(handler: (params: P) => Promise<R> | R) => void`.
```ts
T extends { Method: string; Params: infer P; Result?: infer R } ? (handler: (params: P) => Promise<R> | R) => void : never
```

### `ToNotificationHandlerSignature`
Converts an LSP notification type definition into a handler registration
signature `(handler: (params: P) => void) => void`.
```ts
T extends { Method: string; Params: infer P } ? (handler: (params: P) => void) => void : never
```

### `AvailableMethods`
The complete set of available LSP methods for a client/server capability pair,
split by direction (client send, server send, handlers).

### `LSPRequest`
LSP Request type definitions organized by namespace

### `LSPNotification`
LSP Notification type definitions organized by namespace

### `Client`
Capability-aware interface for an LSP client, combining typed request send
methods, notification send methods, and server-to-client handler registrations.
```ts
SimplifyDeep<{ [K in keyof AvailableMethods<ClientCaps, ServerCaps>["client"]["requests"]]: { [Q in keyof AvailableMethods<ClientCaps, ServerCaps>["client"]["requests"][K]]: ToRequestSignature<AvailableMethods<ClientCaps, ServerCaps>["client"]["requests"][K][Q]> } } & { [K in keyof AvailableMethods<ClientCaps, ServerCaps>["client"]["notifications"]]: { [Q in keyof AvailableMethods<ClientCaps, ServerCaps>["client"]["notifications"][K]]: ToNotificationSignature<AvailableMethods<ClientCaps, ServerCaps>["client"]["notifications"][K][Q]> } } & { [K in keyof AvailableMethods<ClientCaps, ServerCaps>["client"]["requestHandlers"]]: { [Q in keyof AvailableMethods<ClientCaps, ServerCaps>["client"]["requestHandlers"][K] as `on${PascalCase<string & Q, { preserveConsecutiveUppercase: true }>}`]: ToRequestHandlerSignature<AvailableMethods<ClientCaps, ServerCaps>["client"]["requestHandlers"][K][Q]> } } & { [K in keyof AvailableMethods<ClientCaps, ServerCaps>["client"]["notificationHandlers"]]: { [Q in keyof AvailableMethods<ClientCaps, ServerCaps>["client"]["notificationHandlers"][K] as `on${PascalCase<string & Q, { preserveConsecutiveUppercase: true }>}`]: ToNotificationHandlerSignature<AvailableMethods<ClientCaps, ServerCaps>["client"]["notificationHandlers"][K][Q]> } }>
```

### `AvailableRequests`
Mapped type of all available LSP request methods and their handler signatures
```ts
Simplify<RemoveNever<{ [Namespace in KeyAsString<LSPRequest> as CamelCase<Namespace>]: RemoveNeverFromNamespace<{ [Method in keyof Requests[Namespace] as CamelCase<Method & string>]: IsClientCapabilityEnabled<ClientCaps, Requests[Namespace][Method]> extends true ? Requests[Namespace][Method] : never }> }>>
```

### `AvailableNotifications`
Mapped type of all available LSP notification methods and their handler signatures
```ts
Simplify<RemoveNever<{ [Namespace in KeyAsString<LSPNotification> as CamelCase<Namespace>]: RemoveNeverFromNamespace<{ [Method in keyof Notifications[Namespace] as CamelCase<StripNamespaceSuffix<Namespace & string, Method & string>>]: IsClientCapabilityEnabled<ClientCaps, Notifications[Namespace][Method]> extends true ? Notifications[Namespace][Method] : never }> }>>
```

### `Server`
Combined Server type with handlers and send methods
```ts
SimplifyDeep<{ [K in keyof AvailableMethods<ClientCaps, ServerCaps>["server"]["requests"]]: { [Q in keyof AvailableMethods<ClientCaps, ServerCaps>["server"]["requests"][K]]: ToRequestSignature<AvailableMethods<ClientCaps, ServerCaps>["server"]["requests"][K][Q]> } } & { [K in keyof AvailableMethods<ClientCaps, ServerCaps>["server"]["notifications"]]: { [Q in keyof AvailableMethods<ClientCaps, ServerCaps>["server"]["notifications"][K]]: ToNotificationSignature<AvailableMethods<ClientCaps, ServerCaps>["server"]["notifications"][K][Q]> } } & { [K in keyof AvailableMethods<ClientCaps, ServerCaps>["server"]["requestHandlers"]]: { [Q in keyof AvailableMethods<ClientCaps, ServerCaps>["server"]["requestHandlers"][K] as `on${PascalCase<string & Q, { preserveConsecutiveUppercase: true }>}`]: ToRequestHandlerSignature<AvailableMethods<ClientCaps, ServerCaps>["server"]["requestHandlers"][K][Q]> } } & { [K in keyof AvailableMethods<ClientCaps, ServerCaps>["server"]["notificationHandlers"]]: { [Q in keyof AvailableMethods<ClientCaps, ServerCaps>["server"]["notificationHandlers"][K] as `on${PascalCase<string & Q, { preserveConsecutiveUppercase: true }>}`]: ToNotificationHandlerSignature<AvailableMethods<ClientCaps, ServerCaps>["server"]["notificationHandlers"][K][Q]> } }>
```

### `AvailableRequests`
Mapped type of all available LSP request methods and their handler signatures
```ts
Simplify<RemoveNever<{ [Namespace in KeyAsString<LSPRequest> as CamelCase<Namespace>]: RemoveNeverFromNamespace<{ [Method in keyof Requests[Namespace] as CamelCase<Method & string>]: IsServerCapabilityEnabled<ServerCaps, Requests[Namespace][Method]> extends true ? Requests[Namespace][Method] : never }> }>>
```

### `AvailableNotifications`
Mapped type of all available LSP notification methods and their handler signatures
```ts
Simplify<RemoveNever<{ [Namespace in KeyAsString<LSPNotification> as CamelCase<Namespace>]: RemoveNeverFromNamespace<{ [Method in keyof Notifications[Namespace] as CamelCase<StripNamespaceSuffix<Namespace & string, Method & string>>]: IsServerCapabilityEnabled<ServerCaps, Notifications[Namespace][Method]> extends true ? Notifications[Namespace][Method] : never }> }>>
```

### `FileChangeType`

### `FileChangeType`
```ts
1 | 2 | 3
```

### `WatchKind`

### `WatchKind`
```ts
1 | 2 | 4 | number
```

### `WorkDoneProgressValue`
WorkDoneProgress value types
```ts
WorkDoneProgressBegin | WorkDoneProgressReport | WorkDoneProgressEnd
```

### `PartialResultParams`
A parameter literal used to pass a partial result token.
**Properties:**
- `partialResultToken: ProgressToken` (optional) — An optional token that a server can use to report partial results
(e.g., streaming) to the client.

### `DynamicRegistration`
A single LSP dynamic capability registration entry.
**Properties:**

<!-- truncated -->
