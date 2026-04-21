# Functions

## Middleware

### `composeMiddleware`
Combines multiple middleware functions into a single middleware that runs
them left-to-right, each delegating to the next via `next()`.

Use `composeMiddleware` when you have a set of independent middleware that
you want to treat as a single unit — for example, bundling a logger and a
tracer into one reusable package middleware.
```ts
composeMiddleware(middlewares: Middleware[]): Middleware
```
**Parameters:**
- `middlewares: Middleware[]` — The middleware functions to compose, in execution order.
**Returns:** `Middleware` — A single middleware that chains all provided middlewares.
```ts
import { composeMiddleware } from '@lspeasy/core';

const bundled = composeMiddleware(loggerMiddleware, tracingMiddleware);
const server = new LSPServer({ middleware: [bundled] });
```

### `executeMiddlewarePipeline`
Runs the registered middleware chain for a single JSON-RPC message, then
calls `finalHandler` if no middleware short-circuits.

This is the core dispatch loop used by `LSPClient` and `LSPServer`. Each
middleware receives `context` and a `next` callback; calling `next()` hands
control to the following middleware. If a middleware returns a result with
`shortCircuit: true` the remaining middleware and `finalHandler` are skipped.

Scoped middleware (created with `createScopedMiddleware`) is automatically
filtered: it only executes when `matchesFilter` returns `true` for the
current message.
```ts
executeMiddlewarePipeline(registrations: MiddlewareRegistration[] | undefined, context: MiddlewareContext, finalHandler: () => Promise<void | MiddlewareResult>): Promise<void | MiddlewareResult>
```
**Parameters:**
- `registrations: MiddlewareRegistration[] | undefined` — The list of middleware or scoped-middleware to run.
- `context: MiddlewareContext` — The shared context for the current message.
- `finalHandler: () => Promise<void | MiddlewareResult>` — The handler to call after all middleware have run.
**Returns:** `Promise<void | MiddlewareResult>` — The result of the first short-circuiting middleware, or the result
  of `finalHandler`.

### `createScopedMiddleware`
Wraps a middleware with a filter so it only runs for matching LSP messages.

Prefer this over putting an `if (context.method === '...')` guard inside
your middleware — scoped middleware is skipped before the function is even
called, which keeps the pipeline overhead low.
```ts
createScopedMiddleware(filter: MethodFilter, middleware: Middleware): ScopedMiddleware
```
**Parameters:**
- `filter: MethodFilter` — A MethodFilter describing which messages to intercept.
- `middleware: Middleware` — The middleware function to run when the filter matches.
**Returns:** `ScopedMiddleware` — A ScopedMiddleware object ready to pass to `ServerOptions.middleware`
  or `ClientOptions.middleware`.
```ts
import { createScopedMiddleware } from '@lspeasy/core';

const hoverLogger = createScopedMiddleware(
  { methods: ['textDocument/hover'], direction: 'clientToServer' },
  async (ctx, next) => {
    console.log('hover params:', ctx.message);
    return next();
  }
);
```

### `createTypedMiddleware`
Creates a typed, method-scoped middleware with full TypeScript inference for
the message params and result.

`createTypedMiddleware` is the ergonomic alternative to `createScopedMiddleware`
when you want both method filtering and typed access to `context.params` and
`context.result`. The method literal is used at the type level to narrow the
context object, so no casting is required inside the middleware body.
```ts
createTypedMiddleware<M>(method: M, middleware: TypedMiddleware<M>): ScopedMiddleware
```
**Parameters:**
- `method: M` — The exact LSP method string to intercept (e.g. `'textDocument/hover'`).
- `middleware: TypedMiddleware<M>` — The typed middleware function to run for that method.
**Returns:** `ScopedMiddleware` — A ScopedMiddleware filtered to the given method.
```ts
import { createTypedMiddleware } from '@lspeasy/core';

const hoverMiddleware = createTypedMiddleware(
  'textDocument/hover',
  async (ctx, next) => {
    // ctx.params is typed as HoverParams
    console.log('hover at', ctx.params.position);
    return next();
  }
);
```
