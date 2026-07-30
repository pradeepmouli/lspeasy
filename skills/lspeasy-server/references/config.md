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

**Type:** `Logger`

#### logLevel

Log level (defaults to 'info')

**Type:** `LogLevel`

#### requestTimeout

Default request timeout in milliseconds for server-initiated requests

**Type:** `number`

#### onValidationError

Custom validation error handler

**Type:** `(error: ZodError, message: RequestContext | NotificationContext) => void | ResponseError`

#### validateParams

Enable parameter validation for requests and notifications
Defaults to true

**Type:** `boolean`

#### capabilities

Capabilities to declare during initialization

**Type:** `Capabilities`

#### strictCapabilities

Strict capability checking mode
When true, throws error if handler registered for unsupported capability
When false, logs warning and allows registration (default: false)

**Type:** `boolean`

#### middleware

Optional middleware chain for clientToServer/serverToClient messages.

**Type:** `(Middleware | ScopedMiddleware)[]`