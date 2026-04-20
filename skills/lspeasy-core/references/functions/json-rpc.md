# Functions

## JSON-RPC

### `isRequestMessage`
Returns `true` when `message` is a JSON-RPC request (has `id` + `method`).
```ts
isRequestMessage(message: Message): message is RequestMessage
```
**Parameters:**
- `message: Message`
**Returns:** `message is RequestMessage`

### `isNotificationMessage`
Returns `true` when `message` is a JSON-RPC notification (has `method`,
no `id`).
```ts
isNotificationMessage(message: Message): message is NotificationMessage
```
**Parameters:**
- `message: Message`
**Returns:** `message is NotificationMessage`

### `isResponseMessage`
Returns `true` when `message` is a JSON-RPC response (has `id`, no `method`).
```ts
isResponseMessage(message: Message): message is ResponseMessage
```
**Parameters:**
- `message: Message`
**Returns:** `message is ResponseMessage`

### `isSuccessResponse`
Returns `true` when `response` carries a `result` (success case).
```ts
isSuccessResponse(message: ResponseMessage): message is SuccessResponseMessage
```
**Parameters:**
- `message: ResponseMessage`
**Returns:** `message is SuccessResponseMessage`

### `isErrorResponse`
Returns `true` when `response` carries an `error` (error case).
```ts
isErrorResponse(message: ResponseMessage): message is ErrorResponseMessage
```
**Parameters:**
- `message: ResponseMessage`
**Returns:** `message is ErrorResponseMessage`

### `parseMessage`
Parses a single framed JSON-RPC 2.0 message from a raw byte buffer.

This is the low-level framing parser used internally by Node.js transports
(`StdioTransport`, `TcpTransport`). The buffer may contain partial data;
`null` is returned when more bytes are needed.

The framing format is the LSP base protocol:
`Content-Length: <n>\r\n\r\n<json-body>`.
```ts
parseMessage(buffer: Buffer): { message: Message; bytesRead: number } | null
```
**Parameters:**
- `buffer: Buffer` — Raw byte buffer that may contain one or more framed messages.
**Returns:** `{ message: Message; bytesRead: number } | null` — An object with the parsed `message` and `bytesRead`, or `null` if
  the buffer does not yet contain a complete framed message.
**Throws:** If `Content-Length` is missing or the JSON body cannot be parsed.

### `serializeMessage`
Serializes a JSON-RPC 2.0 message into a framed byte buffer with
`Content-Length` and `Content-Type` headers.

Counterpart of `parseMessage`. Used internally by Node.js transports.
The output format is:
`Content-Length: <n>\r\nContent-Type: application/vscode-jsonrpc; charset=utf-8\r\n\r\n<json>`.
```ts
serializeMessage(message: Message): Buffer
```
**Parameters:**
- `message: Message` — The JSON-RPC message to serialize.
**Returns:** `Buffer` — A `Buffer` containing the complete framed message ready for I/O.
