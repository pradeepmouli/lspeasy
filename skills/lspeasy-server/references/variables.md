# Variables & Constants

## Server

### `LSPServer`
Constructs an LSPServer instance.
```ts
let LSPServer: (options?: ServerOptions<ServerCaps>) => LSPServer<ServerCaps>
```

## Errors

### `JSONRPCErrorCode`
Numeric error codes defined by JSON-RPC 2.0 and the LSP specification.
```ts
const JSONRPCErrorCode: { ParseError: -32700; InvalidRequest: -32600; MethodNotFound: -32601; InvalidParams: -32602; InternalError: -32603; ServerNotInitialized: -32002; UnknownErrorCode: -32001; ServerErrorStart: -32099; ServerErrorEnd: -32000; RequestCancelled: -32800; ContentModified: -32801; ServerCancelled: -32802 }
```
