# Variables & Constants

## `ParseError`
```ts
const ParseError: -32700
```

## `InvalidRequest`
```ts
const InvalidRequest: -32600
```

## `MethodNotFound`
```ts
const MethodNotFound: -32601
```

## `InvalidParams`
```ts
const InvalidParams: -32602
```

## `InternalError`
```ts
const InternalError: -32603
```

## `jsonrpcReservedErrorRangeStart`
This is the start range of JSON RPC reserved error codes.
It doesn't denote a real error code. No application error codes should
be defined between the start and end range. For backwards
compatibility the `ServerNotInitialized` and the `UnknownErrorCode`
are left in the range.
```ts
const jsonrpcReservedErrorRangeStart: -32099
```

## `serverErrorStart`
```ts
const serverErrorStart: -32099
```

## `MessageWriteError`
An error occurred when write a message to the transport layer.
```ts
const MessageWriteError: -32099
```

## `MessageReadError`
An error occurred when reading a message from the transport layer.
```ts
const MessageReadError: -32098
```

## `PendingResponseRejected`
The connection got disposed or lost and all pending responses got
rejected.
```ts
const PendingResponseRejected: -32097
```

## `ConnectionInactive`
The connection is inactive and a use of it failed.
```ts
const ConnectionInactive: -32096
```

## `ServerNotInitialized`
Error code indicating that a server received a notification or
request before the server has received the `initialize` request.
```ts
const ServerNotInitialized: -32002
```

## `UnknownErrorCode`
```ts
const UnknownErrorCode: -32001
```

## `jsonrpcReservedErrorRangeEnd`
This is the end range of JSON RPC reserved error codes.
It doesn't denote a real error code.
```ts
const jsonrpcReservedErrorRangeEnd: -32000
```

## `serverErrorEnd`
```ts
const serverErrorEnd: -32000
```

## `None`
```ts
const None: 0
```

## `First`
```ts
const First: 1
```

## `AsOld`
```ts
const AsOld: 1
```

## `Last`
```ts
const Last: 2
```

## `AsNew`
```ts
const AsNew: 2
```

## `None`
```ts
const None: Event<any>
```

## `Off`
Turn tracing off.
```ts
const Off: "off"
```

## `Messages`
Trace messages only.
```ts
const Messages: "messages"
```

## `Compact`
Compact message tracing.
```ts
const Compact: "compact"
```

## `Verbose`
Verbose message tracing.
```ts
const Verbose: "verbose"
```

## `type`
```ts
const type: NotificationType<SetTraceParams>
```

## `type`
```ts
const type: NotificationType<LogTraceParams>
```

## `Message`
```ts
const Message: CancellationReceiverStrategy
```

## `Message`
```ts
const Message: CancellationSenderStrategy
```

## `Message`
```ts
const Message: CancellationStrategy
```
