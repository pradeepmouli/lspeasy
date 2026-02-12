# Data Model: Middleware System & Client/Server DX Improvements

**Date**: 2026-02-11
**For**: [spec.md](spec.md)
**Status**: Phase 1 Complete

## Overview

This document defines the entities, types, and relationships for the middleware system, connection health monitoring, notification waiting, and document change helpers.

---

## Core Entities

### 1. Middleware

**Description**: A composable function that wraps JSON-RPC message processing.

**Fields**:
- `context`: `MiddlewareContext` - Metadata about the current message
- `next`: `MiddlewareNext` - Callback to invoke the next middleware in the chain (or the final handler)

**Behavior**:
- Executes in registration order for clientToServer messages
- Executes in reverse order for serverToClient messages (onion model)
- Can short-circuit by returning without calling `next()`
- Can modify `context.metadata` but NOT `context.message.id` (enforced by FR-008a)

**Type Signature**:
```typescript
type Middleware = (
  context: MiddlewareContext,
  next: MiddlewareNext
) => Promise<void | MiddlewareResult>;

// Method-specific typed middleware (generic)
type TypedMiddleware<M extends LSPMethod> = (
  context: TypedMiddlewareContext<M>,
  next: MiddlewareNext
) => Promise<void | MiddlewareResult>;
```

**Variants**:
- **Global middleware**: Applies to all messages
- **Method-scoped middleware**: Applies only to specific LSP method(s)
- **Typed middleware**: Type-safe context with method-specific params/result types

---

### 2. MiddlewareContext

**Description**: Metadata passed to each middleware function.

**Fields**:
- `direction`: `'clientToServer' | 'serverToClient'` - Message flow direction
- `messageType`: `'request' | 'response' | 'notification' | 'error'` - JSON-RPC message type
- `method`: `string` - LSP method name (e.g., `'textDocument/hover'`)
- `message`: `JSONRPCMessage` - The full JSON-RPC message (readonly `id` field)
- `metadata`: `Record<string, unknown>` - Arbitrary metadata for middleware communication
- `transport`: `string` - Transport identifier (e.g., `'websocket:ws://localhost:3000'`)

**Relationships**:
- Passed to every `Middleware` function
- `message.id` is **immutable** (enforced by type system: `readonly id`)

---

### 2a. TypedMiddlewareContext

**Description**: Strongly-typed middleware context for method-specific middleware.

**Generic Type**: `TypedMiddlewareContext<M extends LSPMethod>`

**Fields** (in addition to base `MiddlewareContext`):
- `method`: `M` - Narrowed method type (literal type, e.g., `'textDocument/hover'`)
- `params`: `RequestParams<M>` - Typed parameters for the method
- `result`: `RequestResult<M>` - Typed result for the method (available in serverToClient response context)

**Example**:
```typescript
// For 'textDocument/hover', context.params has type HoverParams
// and context.result has type Hover | null
type HoverMiddlewareContext = TypedMiddlewareContext<'textDocument/hover'>;
```

**Relationships**:
- Extends `MiddlewareContext` with narrowed types
- Used by `TypedMiddleware<M>` functions

---

### 2b. MethodFilter

**Description**: Configuration for method-scoped middleware.

**Fields**:
- `methods`: `string[] | RegExp` - LSP methods to apply middleware to
- `direction?`: `'clientToServer' | 'serverToClient' | 'both'` - Optional direction filter (default: `'both'`)
- `messageType?`: `('request' | 'response' | 'notification' | 'error')[]` - Optional message type filter

**Behavior**:
- Middleware only executes if message matches filter criteria
- String array: exact matches (e.g., `['textDocument/hover', 'textDocument/completion']`)
- RegExp: pattern matches (e.g., `/^textDocument\//` for all textDocument methods)

**Example**:
```typescript
{
  methods: /^textDocument\//,
  direction: 'clientToServer',
  messageType: ['request']
}
```

---

### 3. MiddlewareResult

**Description**: Optional return value from middleware (for short-circuiting or result transformation).

**Fields**:
- `shortCircuit`: `boolean` - If true, stop executing remaining middleware
- `response?`: `JSONRPCMessage` - Override response (for caching, mocking, etc.)
- `error?`: `JSONRPCError` - Return error without invoking handler

**Behavior**:
- If `shortCircuit` is true, `next()` is not called
- If `response` is provided, it is sent directly (bypassing handler)

---

### 4. ConnectionState

**Description**: Enumeration of transport connection states.

**Values**:
- `connecting`: Initial state when establishing connection
- `connected`: Active connection, ready to send/receive messages
- `disconnecting`: Graceful shutdown in progress
- `disconnected`: Connection closed (may reconnect automatically)

**State Transitions**:
```
[disconnected] → connecting → connected
               ↓              ↓
               disconnected ← disconnecting
```

**Relationships**:
- Used by `ConnectionHealth` to track current state
- Emitted via `StateChangeEvent` on transitions

---

### 5. ConnectionHealth

**Description**: Aggregate of connection state, activity timestamps, and optional heartbeat status.

**Fields**:
- `state`: `ConnectionState` - Current connection state
- `lastMessageSent`: `Date | null` - Timestamp of last outbound message
- `lastMessageReceived`: `Date | null` - Timestamp of last inbound message
- `heartbeat?`: `HeartbeatStatus` - Optional heartbeat monitoring status (WebSocket only)

**Computed Properties** (not stored):
- `isHealthy`: `boolean` - Computed from `state === 'connected'` and optional heartbeat
- `timeSinceLastMessage`: `number` - Milliseconds since last activity

**Relationships**:
- Tracked per `LSPClient` or `LSPServer` instance
- Updated on every message send/receive
- Emitted via `HealthChangeEvent` when state changes

---

### 6. HeartbeatStatus

**Description**: WebSocket heartbeat monitoring state (opt-in).

**Fields**:
- `enabled`: `boolean` - Whether heartbeat monitoring is active
- `interval`: `number` - Milliseconds between ping messages
- `timeout`: `number` - Milliseconds to wait for pong before marking unhealthy
- `lastPing`: `Date | null` - Timestamp of last ping sent
- `lastPong`: `Date | null` - Timestamp of last pong received
- `isResponsive`: `boolean` - Whether pong was received within timeout

**Behavior**:
- Only available for WebSocket transports
- Disabled by default (per user clarification: opt-in)
- For client-side WebSocket (browser or Node.js native), uses timestamp tracking instead of ping/pong

---

### 7. DocumentVersionTracker

**Description**: Stateful utility for tracking document version numbers.

**Fields** (internal):
- `versions`: `Map<string, number>` - Maps document URI to current version

**Methods**:
- `open(uri: string, initialVersion: number = 0): void` - Initialize tracking for a document
- `nextVersion(uri: string): number` - Increment and return next version
- `currentVersion(uri: string): number | undefined` - Get current version without incrementing
- `close(uri: string): void` - Stop tracking and remove from map

**Behavior**:
- Version auto-increments on each `nextVersion()` call
- Returns `undefined` for unknown URIs
- `close()` cleans up internal state (prevents memory leaks)

**Relationships**:
- Used by document change helper functions
- Alternative to explicit version passing (user choice)

---

### 8. NotificationWaiter

**Description**: Internal helper for `waitForNotification` implementation.

**Fields** (internal):
- `method`: `string` - Notification method to wait for
- `filter?`: `(params: unknown) => boolean` - Optional filter function
- `timeout?`: `number` - Timeout in milliseconds (required per user clarification)
- `promise`: `Promise<unknown>` - Promise that resolves when notification arrives
- `cleanup`: `() => void` - Cleanup function to remove listeners

**Behavior**:
- Registers temporary event listener on client
- Resolves promise on first matching notification
- Rejects on timeout or disconnect
- Auto-removes listener on resolution/rejection/timeout

**Relationships**:
- Created by `LSPClient.waitForNotification()`
- Multiple `NotificationWaiter` instances can coexist for the same method

---

## Type Definitions

### JSONRPCMessage

```typescript
type JSONRPCMessage = JSONRPCRequest | JSONRPCResponse | JSONRPCNotification | JSONRPCError;

interface JSONRPCRequest {
  jsonrpc: '2.0';
  id: string | number;  // IMMUTABLE (readonly in MiddlewareContext)
  method: string;
  params?: unknown;
}

interface JSONRPCResponse {
  jsonrpc: '2.0';
  id: string | number;  // IMMUTABLE
  result?: unknown;
}

interface JSONRPCNotification {
  jsonrpc: '2.0';
  method: string;
  params?: unknown;
}

interface JSONRPCError {
  jsonrpc: '2.0';
  id: string | number | null;
  error: {
    code: number;
    message: string;
    data?: unknown;
  };
}
```

---

## Events

### StateChangeEvent

**Description**: Emitted when connection state transitions.

**Fields**:
- `previous`: `ConnectionState` - State before transition
- `current`: `ConnectionState` - State after transition
- `timestamp`: `Date` - When the transition occurred
- `reason?`: `string` - Optional reason for transition (e.g., `'timeout'`, `'user-initiated'`)

**Emitted By**: `LSPClient`, `LSPServer`

---

### HealthChangeEvent

**Description**: Emitted when connection health changes (superset of StateChangeEvent).

**Fields**:
- `state`: `ConnectionState` - Current connection state
- `lastMessageSent`: `Date | null` - Timestamp of last outbound message
- `lastMessageReceived`: `Date | null` - Timestamp of last inbound message
- `heartbeat?`: `HeartbeatStatus` - Optional heartbeat status

**Emitted By**: `LSPClient` when health monitoring is enabled

---

## Validation Rules

### Middleware
- `context.message.id` MUST NOT be modified (enforced by `readonly` type)
- `next()` MUST be called unless short-circuiting
- Middleware MUST handle errors and not crash the client/server

### ConnectionState
- State transitions MUST follow the defined graph (no invalid transitions)
- `disconnected → connecting` requires explicit `connect()` call

### HeartbeatStatus
- `enabled` MUST be explicitly set to `true` (default: `false`)
- `interval` MUST be > 0 (minimum: 1000ms recommended)
- `timeout` MUST be > 0 and < `interval` (recommended: timeout = interval / 3)

### DocumentVersionTracker
- Version MUST increment monotonically (never decrement)
- `open()` MUST be called before `nextVersion()` or `currentVersion()`
- `close()` MUST be called to prevent memory leaks when document is closed

### NotificationWaiter
- `timeout` MUST be provided (per user clarification: required)
- `filter` MUST return boolean (if provided)
- Cleanup MUST execute on all termination paths

---

## Relationships Diagram

```
┌─────────────────────────────────────────────────────────────┐
│                       LSPClient / LSPServer                   │
│                                                               │
│  ┌─────────────────┐         ┌─────────────────┐            │
│  │   Middleware    │─────────│ MiddlewareContext│            │
│  │   Pipeline      │         │   (per message)  │            │
│  └────────┬────────┘         └─────────────────┘            │
│           │                                                   │
│           │ processes                                         │
│           ↓                                                   │
│  ┌─────────────────┐                                         │
│  │  JSONRPCMessage │ (id is immutable)                       │
│  └─────────────────┘                                         │
│                                                               │
│  ┌──────────────────┐        ┌─────────────────┐            │
│  │ ConnectionHealth │────────│ ConnectionState │            │
│  │  (timestamps +   │        │   (enum)        │            │
│  │   heartbeat)     │        └─────────────────┘            │
│  └──────────────────┘                                        │
│           │ emits                                             │
│           ↓                                                   │
│  ┌──────────────────┐                                        │
│  │ HealthChangeEvent│                                        │
│  └──────────────────┘                                        │
│                                                               │
│  ┌─────────────────────┐                                     │
│  │ NotificationWaiter  │ (internal, one per waitFor call)    │
│  └─────────────────────┘                                     │
│                                                               │
│  ┌──────────────────────┐                                    │
│  │DocumentVersionTracker│ (optional, user-managed)           │
│  └──────────────────────┘                                    │
└─────────────────────────────────────────────────────────────┘
```

---

## Implementation Notes

### Middleware Pipeline
- Middleware functions stored in array (registration order)
- Execution: `await middleware[0](context, () => middleware[1](context, ...)`
- Zero-overhead path: `if (middlewares.length === 0) { execute handler directly }`

### Connection Health
- Timestamps updated on every `send()` and `receive()` call
- State transitions trigger `StateChangeEvent` emission
- Heartbeat monitoring runs in background interval (opt-in)

### Notification Waiting
- Each `waitForNotification()` call creates a temporary listener
- Listener removed on first match, timeout, or disconnect
- No global state (each promise independent)

### Document Version Tracking
- `DocumentVersionTracker` instance can be shared or per-document
- Helpers accept either explicit `version: number` or `tracker: DocumentVersionTracker`
- User chooses pattern based on lifecycle needs

---

**Phase 1 Status (data-model.md)**: ✅ Complete - All entities defined. Ready for contracts/ generation.
