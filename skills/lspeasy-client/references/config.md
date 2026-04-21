# Configuration

## ClientOptions

Configuration for an `LSPClient` instance.

Passed to the `LSPClient` constructor. All fields are optional; the client
works with zero configuration.

### Properties

#### name

Client identification (sent in initialize request)

**Type:** `string`

#### version

Client version

**Type:** `string`

#### capabilities

Client capabilities to advertise

**Type:** `ClientCaps`

#### logger

Logger instance for client logging

**Type:** `Logger`

#### logLevel

Log level for built-in console logger

**Type:** `LogLevel`

#### requestTimeout

Default request timeout in milliseconds for outgoing requests

**Type:** `number`

#### strictCapabilities

Strict capability checking mode
When true, throws error if handler registered or request sent for unsupported capability
When false, logs warning and allows registration/sending (default: false)

**Type:** `boolean`

#### middleware

Optional middleware chain for clientToServer/serverToClient messages.

**Type:** `(Middleware | ScopedMiddleware)[]`

#### heartbeat

Optional heartbeat configuration (disabled by default).

**Type:** `HeartbeatConfig`

#### dynamicRegistration

Behavior controls for server-driven dynamic registration.

**Type:** `DynamicRegistrationBehavior`

#### onValidationError

Callback for response validation errors

**Type:** `(error: ZodError, response: ResponseMessage) => void`

## PartialRequestOptions

Options for `LSPClient.sendRequestWithPartialResults`.

### Properties

#### token

Custom `partialResultToken` value; auto-generated when omitted.

**Type:** `string | number`

#### onPartial

Called for each `$/progress` notification carrying a partial result.

**Type:** `(partial: TPartial) => void`

**Required:** yes

## HeartbeatConfig

Configuration for optional heartbeat monitoring.

When `enabled` is `true`, the client sends a `$/ping` request at each
`interval` milliseconds. If no response arrives within `timeout`
milliseconds, the connection is marked unresponsive.

### Properties

#### enabled

Whether heartbeat monitoring is active.

**Type:** `boolean`

#### interval

Interval between pings in milliseconds.

**Type:** `number`

**Required:** yes

#### timeout

Time to wait for a pong response in milliseconds.

**Type:** `number`

**Required:** yes

## NotificationWaitOptions

Options for `NotificationWaiter` and `LSPClient.waitForNotification`.

### Properties

#### timeout

Maximum time to wait in milliseconds before rejecting with a timeout error.

**Type:** `number`

**Required:** yes

#### filter

Optional predicate to skip notifications that don't match the expected
content. The waiter continues listening until a matching notification
arrives or the timeout expires.

**Type:** `(params: TParams) => boolean`