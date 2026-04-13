[**lspeasy v1.0.0**](../README.md)

***

[lspeasy](../README.md) / parseMessage

# Function: parseMessage()

> **parseMessage**(`buffer`): \{ `bytesRead`: `number`; `message`: [`Message`](../type-aliases/Message.md); \} \| `null`

Defined in: [packages/core/src/jsonrpc/framing.ts:58](https://github.com/pradeepmouli/lspeasy/blob/1dc2e704391f3b32ce8185dadf1a265a4beb41d3/packages/core/src/jsonrpc/framing.ts#L58)

Parse a complete message from buffer
Returns { message, bytesRead } or null if incomplete

## Parameters

### buffer

`Buffer`

## Returns

\{ `bytesRead`: `number`; `message`: [`Message`](../type-aliases/Message.md); \} \| `null`
