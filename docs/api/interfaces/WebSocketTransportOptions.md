[**lspeasy v1.0.0**](../README.md)

***

[lspeasy](../README.md) / WebSocketTransportOptions

# Interface: WebSocketTransportOptions

Defined in: [packages/core/src/transport/websocket.ts:32](https://github.com/pradeepmouli/lspeasy/blob/9cfbcabb7e5a7111a570b29f368656ea6b98ee25/packages/core/src/transport/websocket.ts#L32)

## Properties

### enableReconnect?

> `optional` **enableReconnect?**: `boolean`

Defined in: [packages/core/src/transport/websocket.ts:46](https://github.com/pradeepmouli/lspeasy/blob/9cfbcabb7e5a7111a570b29f368656ea6b98ee25/packages/core/src/transport/websocket.ts#L46)

Enable automatic reconnection (client mode only)

***

### maxReconnectAttempts?

> `optional` **maxReconnectAttempts?**: `number`

Defined in: [packages/core/src/transport/websocket.ts:52](https://github.com/pradeepmouli/lspeasy/blob/9cfbcabb7e5a7111a570b29f368656ea6b98ee25/packages/core/src/transport/websocket.ts#L52)

Maximum number of reconnection attempts

#### Default

```ts
5
```

***

### maxReconnectDelay?

> `optional` **maxReconnectDelay?**: `number`

Defined in: [packages/core/src/transport/websocket.ts:64](https://github.com/pradeepmouli/lspeasy/blob/9cfbcabb7e5a7111a570b29f368656ea6b98ee25/packages/core/src/transport/websocket.ts#L64)

Maximum delay between reconnection attempts in milliseconds

#### Default

```ts
30000
```

***

### reconnectBackoffMultiplier?

> `optional` **reconnectBackoffMultiplier?**: `number`

Defined in: [packages/core/src/transport/websocket.ts:70](https://github.com/pradeepmouli/lspeasy/blob/9cfbcabb7e5a7111a570b29f368656ea6b98ee25/packages/core/src/transport/websocket.ts#L70)

Multiplier for exponential backoff

#### Default

```ts
2
```

***

### reconnectDelay?

> `optional` **reconnectDelay?**: `number`

Defined in: [packages/core/src/transport/websocket.ts:58](https://github.com/pradeepmouli/lspeasy/blob/9cfbcabb7e5a7111a570b29f368656ea6b98ee25/packages/core/src/transport/websocket.ts#L58)

Initial delay between reconnection attempts in milliseconds

#### Default

```ts
1000
```

***

### socket?

> `optional` **socket?**: `WebSocketLike`

Defined in: [packages/core/src/transport/websocket.ts:41](https://github.com/pradeepmouli/lspeasy/blob/9cfbcabb7e5a7111a570b29f368656ea6b98ee25/packages/core/src/transport/websocket.ts#L41)

Existing WebSocket instance for server mode

***

### url?

> `optional` **url?**: `string`

Defined in: [packages/core/src/transport/websocket.ts:36](https://github.com/pradeepmouli/lspeasy/blob/9cfbcabb7e5a7111a570b29f368656ea6b98ee25/packages/core/src/transport/websocket.ts#L36)

WebSocket URL for client mode (e.g., 'ws://localhost:3000')
