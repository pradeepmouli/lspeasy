# Configuration

## ServerOptions

Configuration for an `LSPServer` instance.

Passed to the `LSPServer` constructor. All fields are optional; the server
works with zero configuration and sensible defaults.

### Properties

#### name

Server name (sent in initialize response)

**Type:** `string`

#### version

Server version (sent in initialize response)

**Type:** `string`

#### logger

Logger instance (defaults to ConsoleLogger)

**Type:** `any`

#### logLevel

Log level (defaults to 'info')

**Type:** `any`

#### requestTimeout

Default request timeout in milliseconds for server-initiated requests

**Type:** `number`

#### onValidationError

Custom validation error handler

**Type:** `(error: ZodError, message: RequestContext | NotificationContext) => any`

#### validateParams

Enable parameter validation for requests and notifications
Defaults to true

**Type:** `boolean`

#### capabilities

Capabilities to declare during initialization

**Type:** `Capabilities`

#### resolveCapabilities

Resolve the capabilities to advertise for a specific connection, computed
from that connection's `initialize` params.

**Type:** `(params: InitializeParams) => Capabilities | Promise<Capabilities>`

Takes precedence over `registerCapabilities()` for the value returned in
`InitializeResult` only. `registerCapabilities()` still governs the
compile-time capability-aware namespaces and the handler-registration
guard, both of which must remain static — handlers register once, before
any connection exists, so they cannot depend on a specific connection's
resolved capabilities.

#### preInitializeMethods

Request methods allowed to be answered before the `initialize` handshake
completes, in addition to `initialize`/`shutdown` themselves.

**Type:** `string[]`

Use for cheap, non-LSP meta-endpoints (health checks, status queries)
that a caller may need to reach without paying for a full session
bring-up. Methods here must still be registered via `onRequest` as usual
— this only exempts them from the `serverNotInitialized` gate.

#### strictCapabilities

Strict capability checking mode
When true, throws error if handler registered for unsupported capability
When false, logs warning and allows registration (default: false)

**Type:** `boolean`

#### middleware

Optional middleware chain for clientToServer/serverToClient messages.

**Type:** `any[]`