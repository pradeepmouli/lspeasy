# Research: Middleware System & Client/Server DX Improvements

**Date**: 2026-02-11
**For**: [spec.md](spec.md)
**Status**: Phase 0 Complete

## Research Questions

1. What middleware pattern best fits JSON-RPC message interception?
2. How to implement native WebSocket client support across Node.js and browsers?
3. What pattern for promise-based notification waiting minimizes resource leaks?
4. How to implement WebSocket heartbeat monitoring without blocking?
5. How do other LSP SDKs handle document version tracking?

---

## 1. Middleware Pattern Selection

### Decision: Onion/Pipeline Model with Async Context Passing

**Rationale**:
- FastMCP (Model Context Protocol SDK) uses this pattern: `async (context, call_next) => await call_next(context)`
- Express/Koa use similar patterns (`next()` callback)
- Enables composition: middleware A wraps middleware B wraps handler
- Execution order: registration order for clientToServer, reverse for serverToClient (onion model)
- Allows short-circuiting (return without calling `call_next`)
- Type-safe with TypeScript generics

**Implementation Pattern**:
```typescript
interface Middleware {
  (context: MiddlewareContext, next: MiddlewareNext): Promise<void | MiddlewareResult>;
}

interface MiddlewareContext {
  direction: 'clientToServer' | 'serverToClient';
  messageType: 'request' | 'response' | 'notification' | 'error';
  method: string;
  message: JSONRPCMessage;
  metadata: Record<string, unknown>;
}

type MiddlewareNext = () => Promise<void | MiddlewareResult>;
```

**Alternatives Considered**:
- **Event-based interception** (rejected): Less composable, harder to enforce order
- **Class-based middleware** (rejected): More boilerplate, less functional composition
- **Decorator-based** (rejected): Requires experimental TypeScript features

**Zero-Overhead Strategy**:
- Check `if (middlewares.length === 0)` before message handling
- Direct dispatch when no middleware registered
- No function wrapping or array iteration overhead

### Extension: Method-Scoped and Typed Middleware

**Rationale**:
- Many middleware patterns are method-specific (e.g., timing only hover requests)
- TypeScript can infer params/result types from LSP method names
- Reduces boilerplate and improves type safety

**Method-Scoped Middleware Pattern**:
```typescript
interface MethodFilter {
  methods: string[] | RegExp;
  direction?: 'clientToServer' | 'serverToClient' | 'both';
  messageType?: ('request' | 'response' | 'notification' | 'error')[];
}

interface ScopedMiddleware {
  filter: MethodFilter;
  middleware: Middleware;
}

// Usage
const scopedMiddleware = createScopedMiddleware(
  { methods: /^textDocument\//, direction: 'clientToServer' },
  async (context, next) => { /* ... */ }
);
```

**Typed Middleware Pattern**:
```typescript
type TypedMiddleware<M extends LSPMethod> = (
  context: TypedMiddlewareContext<M>,
  next: MiddlewareNext
) => Promise<void | MiddlewareResult>;

interface TypedMiddlewareContext<M> extends MiddlewareContext {
  method: M;
  params: RequestParams<M>;  // Inferred from M
  result: RequestResult<M>;  // Inferred from M
}

// Usage with type inference
const hoverMiddleware = createTypedMiddleware('textDocument/hover', async (context, next) => {
  // context.params is typed as HoverParams
  // context.result is typed as Hover | null
});
```

**Implementation Strategy**:
- Filter evaluation happens before middleware execution
- If filter doesn't match, skip middleware (no overhead)
- Type inference via conditional types and LSP method registry
- Factory functions (`createTypedMiddleware`, `createScopedMiddleware`) provide ergonomic API

**Alternatives Considered**:
- **Manual method checking in middleware** (rejected): Less declarative, more boilerplate
- **Separate registration per method** (rejected): Doesn't support pattern matching
- **Runtime type validation** (rejected): Adds overhead, TypeScript types sufficient

---

## 2. Native WebSocket Implementation

### Decision: Use `globalThis.WebSocket` for clients, `ws` as optional peer dep for servers

**Rationale**:
- Node.js >= 22.4 has native `WebSocket` class (`globalThis.WebSocket`)
- Browsers have native `WebSocket` (all modern browsers)
- `ws` library still needed for **server-side WebSocket listeners** (Node.js has no native `WebSocketServer`)
- Reduces dependency footprint for client-only use cases

**Implementation Strategy**:
```typescript
// packages/core/src/transport/websocket.ts
function createWebSocketClient(url: string): WebSocket {
  if (typeof globalThis.WebSocket !== 'undefined') {
    return new globalThis.WebSocket(url);
  }
  // Fallback for older Node.js with 'ws' installed
  try {
    const { WebSocket } = await import('ws');
    return new WebSocket(url) as any;
  } catch {
    throw new Error(
      'Native WebSocket not available. Node.js >= 22.4 required, or install "ws" package.'
    );
  }
}
```

**Browser Compatibility**:
- Chrome 4+, Firefox 11+, Safari 5+, Edge 12+ (all stable)
- `wss://` (secure WebSocket) fully supported

**Reconnection Logic**:
- Preserve existing exponential backoff (already implemented in SDK)
- Native WebSocket emits same events as `ws` (`open`, `message`, `error`, `close`)
- No changes needed to reconnection code

**Error Handling**:
- Clear error messages when WebSocket unavailable
- Suggest Node.js upgrade or `ws` installation

---

## 3. Promise-Based Notification Waiting

### Decision: EventEmitter-based promise wrapper with automatic cleanup

**Rationale**:
- Common pattern in Node.js testing libraries (e.g., `waitForExpect`, VSCode API `onDidChange` wrappers)
- Ensures single-use listener (no leaks)
- Supports filtering and timeout
- Multiple concurrent waits handled via separate listeners

**Implementation Pattern**:
```typescript
async function waitForNotification<M extends LSPNotificationMethod>(
  method: M,
  options?: {
    filter?: (params: NotificationParams<M>) => boolean;
    timeout?: number;
  }
): Promise<NotificationParams<M>> {
  return new Promise((resolve, reject) => {
    const timeoutId = options?.timeout
      ? setTimeout(() => {
          cleanup();
          reject(new Error(`Timeout waiting for ${method}`));
        }, options.timeout)
      : undefined;

    const handler = (params: NotificationParams<M>) => {
      if (options?.filter && !options.filter(params)) return;
      cleanup();
      resolve(params);
    };

    const cleanup = () => {
      this.off(method, handler);
      if (timeoutId) clearTimeout(timeoutId);
    };

    this.on(method, handler);

    // Also clean up on disconnect
    this.once('disconnect', () => {
      cleanup();
      reject(new Error(`Connection closed while waiting for ${method}`));
    });
  });
}
```

**Alternatives Considered**:
- **AbortController** (rejected): More complex API for this use case
- **Observable-based** (rejected): Heavier dependency (RxJS)
- **Generator-based** (rejected): Less intuitive for one-shot wait

**Resource Leak Prevention**:
- Listener removed on resolution, rejection, timeout, or disconnect
- `once()` for disconnect listener (auto-cleanup)
- No dangling timeouts

---

## 4. WebSocket Heartbeat Monitoring

### Decision: Opt-in ping/pong with configurable interval and timeout

**Rationale**:
- WebSocket spec defines ping/pong frames (not visible to JS in browsers, but available in Node.js `ws`)
- Native WebSocket in browsers doesn't expose ping/pong API
- Solution: Use LSP-level heartbeat or rely on transport-level TCP keepalive
- For `ws` (server-side), can use `ws.ping()` and `ws.on('pong')`

**Implementation Strategy**:
```typescript
interface HeartbeatConfig {
  enabled: boolean;       // Default: false (opt-in)
  interval: number;       // Default: 30000 ms (30s)
  timeout: number;        // Default: 10000 ms (10s)
}

// Server-side (using 'ws' library)
if (config.heartbeat.enabled && isWebSocketServer) {
  setInterval(() => {
    ws.ping();
    const timer = setTimeout(() => {
      ws.terminate(); // Force close if no pong received
    }, config.heartbeat.timeout);
    ws.once('pong', () => clearTimeout(timer));
  }, config.heartbeat.interval);
}

// Client-side (browser or Node.js native WebSocket)
// Cannot use ping/pong in browser WebSocket
// Alternative: Send LSP-level keepalive messages (custom notification)
```

**Browser Limitation**:
- Browser `WebSocket` API doesn't expose `ping()`/`pong()`
- Fallback: Use application-level heartbeat (custom JSON-RPC notification)
- Or rely on `readyState` check + message activity timestamps

**Decision**:
- Use `ws.ping()`/`ws.pong()` for server-side WebSocket (Node.js)
- For client-side (including browser), use **timestamp tracking** (last message sent/received) instead of ping/pong
- Document that heartbeat is limited to server-side WebSocket or requires custom LSP messages

---

## 5. Document Version Tracking Patterns

### Decision: Stateful `DocumentVersionTracker` utility + explicit version helpers

**Rationale**:
- VSCode LSP libraries use internal `TextDocuments` class to track versions
- Microsoft's `vscode-languageserver-node` has `TextDocumentChangeEvent` with version tracking
- Our SDK should provide a lighter-weight utility for users who don't need full document state

**Implementation Pattern**:
```typescript
class DocumentVersionTracker {
  private versions = new Map<string, number>();

  open(uri: string, initialVersion: number = 0): void {
    this.versions.set(uri, initialVersion);
  }

  nextVersion(uri: string): number {
    const current = this.versions.get(uri) ?? 0;
    const next = current + 1;
    this.versions.set(uri, next);
    return next;
  }

  currentVersion(uri: string): number | undefined {
    return this.versions.get(uri);
  }

  close(uri: string): void {
    this.versions.delete(uri);
  }
}

// Helper functions
function createIncrementalChange(
  uri: string,
  versionOrTracker: number | DocumentVersionTracker,
  range: Range,
  text: string
): DidChangeTextDocumentParams {
  const version = typeof versionOrTracker === 'number'
    ? versionOrTracker
    : versionOrTracker.nextVersion(uri);

  return {
    textDocument: { uri, version },
    contentChanges: [{ range, text }]
  };
}
```

**Alternatives Considered**:
- **Full TextDocumentManager** (rejected): Out of scope, tracked as separate package
- **Auto-version via proxy/decorator** (rejected): Too magical, hard to debug
- **Global singleton tracker** (rejected): Doesn't support multiple client instances

**Design Choice**:
- Provide both **stateful tracker** (for convenience) and **explicit version** (for flexibility)
- User decides which to use based on lifecycle needs

---

## Summary of Key Decisions

| Question | Decision | Rationale |
|----------|----------|-----------|
| Middleware pattern | Onion/pipeline with `async (context, next)` | Composable, type-safe, matches FastMCP/Express patterns |
| Method-scoped middleware | Support filter-based scoping with `MethodFilter` | Reduces boilerplate, declarative, supports patterns |
| Typed middleware | Factory with type inference from LSP method | Type safety, autocomplete, reduces errors |
| Native WebSocket | `globalThis.WebSocket` for clients, `ws` peer dep for servers | Reduces deps, works in Node.js 22.4+ and browsers |
| Notification waiting | EventEmitter promise wrapper with auto-cleanup | Prevents leaks, supports filtering and timeout |
| Heartbeat | Opt-in, server-side `ws.ping()`/`ws.pong()`, client-side timestamps | Browser WebSocket has no ping API, timestamps sufficient |
| Version tracking | Stateful `DocumentVersionTracker` + explicit helpers | Flexible for different lifecycles, user choice |

---

## Technology Choices

### Middleware System
- **Pattern**: Functional composition, onion model
- **Context**: Typed `MiddlewareContext` with direction, method, message
- **Short-circuiting**: Return without `call_next()`
- **Zero overhead**: Direct dispatch when no middleware
- **Method scoping**: `MethodFilter` with string array or RegExp matching
- **Typed middleware**: `TypedMiddleware<M>` with inferred params/result types
- **Factory functions**: `createTypedMiddleware`, `createScopedMiddleware` for ergonomics

### Native WebSocket
- **Client**: `globalThis.WebSocket` (Node.js >= 22.4, all browsers)
- **Server**: `ws` package (optional peer dependency)
- **Fallback**: Clear error with upgrade instructions
- **Compatibility**: Detected via `typeof globalThis.WebSocket`

### Notification Waiting
- **API**: `waitForNotification(method, { filter?, timeout })`
- **Cleanup**: Automatic on resolve/reject/timeout/disconnect
- **Timeout**: Required (explicit, per user clarification)
- **Concurrency**: Multiple waits supported (independent listeners)

### Connection Health
- **State**: Enum (`connecting`, `connected`, `disconnecting`, `disconnected`)
- **Events**: State change events with previous/current state
- **Timestamps**: Last message sent/received
- **Heartbeat**: Opt-in (disabled by default, per user clarification)

### Document Helpers
- **Tracker**: `DocumentVersionTracker` class (open/close/nextVersion)
- **Helpers**: Accept `version: number | DocumentVersionTracker`
- **Incremental**: `createIncrementalChange(uri, version, range, text)`
- **Full**: `createFullChange(uri, version, text)`

---

## Best Practices from Other SDKs

### FastMCP (Model Context Protocol)
- Unlimited middleware composition (no artificial limits)
- Middleware context includes request method and metadata
- Error handling: catch and log, don't crash server

### VSCode LSM (Language Server Manager)
- Document version tracked per URI in `TextDocuments` class
- Auto-increment on `didChange` events
- Close event clears version state

### Microsoft's vscode-languageserver-node SDK
- Connection class has `onNotification` and `onRequest` methods
- No built-in `waitForNotification`, users implement manually
- Native WebSocket not used (stdio/IPC focus)

---

## Implementation Risks & Mitigations

| Risk | Mitigation |
|------|------------|
| Middleware modifying `id` breaks correlation | FR-008a prohibits `id` mutation, enforce via type system (readonly) |
| Native WebSocket unavailable in old Node.js | Clear error message, suggest upgrade or `ws` install |
| Resource leaks from notification waiting | Auto-cleanup on all termination paths (resolve/reject/timeout/disconnect) |
| Heartbeat ping/pong not available in browsers | Use timestamp tracking instead, document limitation |
| Document version out of sync | User choice: stateful tracker or explicit version management |

---

**Phase 0 Status**: ✅ Complete - All research questions resolved. Ready for Phase 1 (data model and contracts).
