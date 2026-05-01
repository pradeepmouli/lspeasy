# Configuration

## DedicatedWorkerTransportOptions

### Properties

#### worker



**Type:** `WorkerLike`

**Required:** yes

#### terminateOnClose



**Type:** `boolean`

## SharedWorkerTransportOptions

### Properties

#### port



**Type:** `MessagePortLike`

#### worker



**Type:** `SharedWorkerLike`

#### clientId



**Type:** `string`

**Required:** yes

## WebSocketTransportOptions

Options for configuring a `WebSocketTransport`.

Provide either `url` (client mode — the transport opens the connection)
or `socket` (server mode — the transport wraps an already-accepted
WebSocket). Providing both or neither throws at construction time.

### Properties

#### url

WebSocket URL for client mode (e.g., `'ws://localhost:3000'`).
Mutually exclusive with `socket`.

**Type:** `string`

#### socket

Existing WebSocket instance for server mode.
Mutually exclusive with `url`.

**Type:** `WebSocketLike`

#### enableReconnect

Enable automatic reconnection on unexpected disconnect (client mode only).

**Type:** `boolean`

#### maxReconnectAttempts

Maximum number of reconnection attempts before giving up.

**Type:** `number`

#### reconnectDelay

Initial delay between reconnection attempts in milliseconds.

**Type:** `number`

#### maxReconnectDelay

Maximum delay between reconnection attempts in milliseconds.

**Type:** `number`

#### reconnectBackoffMultiplier

Multiplier for exponential back-off between reconnection attempts.

**Type:** `number`

## CheckMethodOptions

### Properties

#### method



**Type:** `string`

**Required:** yes

#### methodSets



**Type:** `{ all: Set<string>; alwaysAllowed: Set<string> }`

**Required:** yes

#### getCapabilityKey



**Type:** `(method: string) => string | null | undefined`

**Required:** yes

#### hasCapability



**Type:** `(key: string) => boolean`

**Required:** yes

#### actionLabel



**Type:** `string`

**Required:** yes

#### capabilityLabel



**Type:** `string`

**Required:** yes

#### logger



**Type:** `Logger`

**Required:** yes

#### strict



**Type:** `boolean`

**Required:** yes