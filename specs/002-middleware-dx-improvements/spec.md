# Feature Specification: Middleware System & Client/Server DX Improvements

**Feature Branch**: `002-middleware-dx-improvements`
**Created**: 2026-02-11
**Status**: Draft
**Input**: User description: "LSP Client/Server DX Improvements & Middleware System - middleware support, native WebSocket, one-shot notifications, connection health, server-to-client request ergonomics, didChange ergonomics"

## Clarifications

### Session 2026-02-11

- Q: Should middleware be allowed to change JSON-RPC `id` (including via a renamed field like `$id`)? -> A: Keep `id` immutable.
- Q: Should `waitForNotification` have a required timeout, a default timeout, or no default timeout? -> A: Timeout must be provided explicitly (required).
- Q: How should document version tracking work for `didChange` helpers? -> A: Provide a `DocumentVersionTracker` utility; helpers accept either a tracker or an explicit version.
- Q: Should WebSocket heartbeat monitoring be enabled by default or opt-in? -> A: Opt-in (disabled by default).
- Q: Should there be a limit on the number of middleware that can be registered? -> A: Unlimited middleware supported.

## User Scenarios & Testing *(mandatory)*

### User Story 1 - Middleware-Based Message Interception (Priority: P1)

A developer building an LSP-based tool wants to intercept, inspect, and transform all JSON-RPC messages flowing through their client or server without modifying the core protocol handling. They want to compose multiple middleware functions (e.g., logging, retry, metrics) that apply to all messages in a predictable order.

**Why this priority**: Middleware is the foundational extensibility mechanism. It enables the pino logging package (a separate deliverable), retry logic, telemetry, and any other cross-cutting concern. Without middleware, each of these would require ad-hoc patches to core internals.

**Independent Test**: Can be fully tested by registering a middleware that records all messages, sending a request through the client or server, and verifying the middleware observed the correct inbound and outbound messages. Delivers immediate value for debugging and monitoring without any other feature.

**Acceptance Scenarios**:

1. **Given** a client with a logging middleware registered, **When** the client sends a request and receives a response, **Then** the middleware observes both the outbound request and the inbound response with full message contents.
2. **Given** a server with two middleware functions registered in order [A, B], **When** a request arrives, **Then** middleware A processes the message before middleware B (onion/pipeline model), and the response passes through B before A.
3. **Given** a client with an error-handling middleware, **When** a request fails with a transport error, **Then** the middleware can intercept the error, log it, and optionally transform or suppress it before it reaches the caller.
4. **Given** a client or server with no middleware registered, **When** messages are sent and received, **Then** behavior is identical to the current implementation with no measurable overhead.

---

### User Story 2 - Reduced Client Dependencies via Native WebSocket (Priority: P2)

A developer building a browser-based LSP client or a lightweight Node.js tool wants to use the WebSocket transport without installing the `ws` package. They expect the SDK to use the platform's native WebSocket implementation for client connections, while still supporting `ws` as an optional dependency for server-side WebSocket listeners.

**Why this priority**: Removing a mandatory native dependency reduces install size, eliminates build compatibility issues (node-gyp on some platforms), and enables browser environments. This is the second most impactful change because it directly affects every user who installs the core package.

**Independent Test**: Can be fully tested by creating a WebSocket client transport in a Node.js >= 22.4 environment without `ws` installed, connecting to a WebSocket server, and successfully exchanging LSP messages. Delivers immediate value by simplifying the dependency tree.

**Acceptance Scenarios**:

1. **Given** a Node.js >= 22.4 environment without `ws` installed, **When** a developer creates a WebSocket client transport and connects to an LSP server, **Then** the connection succeeds and messages flow correctly using the native WebSocket implementation.
2. **Given** a browser environment, **When** a developer creates a WebSocket client transport, **Then** the transport uses the browser's native WebSocket and operates correctly.
3. **Given** a server that needs to accept WebSocket connections, **When** `ws` is installed as an optional dependency, **Then** the server can create a WebSocket listener using `ws`'s WebSocketServer.
4. **Given** a server environment without `ws` installed, **When** a developer attempts to create a WebSocket server transport, **Then** a clear error message indicates that `ws` must be installed for server-side WebSocket support.
5. **Given** a client WebSocket connection using native WebSocket, **When** the connection drops unexpectedly, **Then** the existing reconnection logic (exponential backoff) continues to work as before.

---

### User Story 3 - One-Shot Notification Listening (Priority: P3)

A developer writing an LSP client wants to perform an action and then wait for a specific notification from the server (e.g., open a document and wait for `textDocument/publishDiagnostics`). They want a promise-based API that resolves when the matching notification arrives, with optional filtering and timeout.

**Why this priority**: This is the most common pattern in LSP tooling and testing but currently requires manual event listener setup and cleanup. A first-class API dramatically simplifies the most frequent client-side workflow.

**Independent Test**: Can be fully tested by opening a document, calling `waitForNotification('textDocument/publishDiagnostics')`, and verifying the promise resolves with the correct diagnostics payload. Delivers immediate value for testing and automation scripts.

**Acceptance Scenarios**:

1. **Given** a connected client, **When** the developer calls `waitForNotification('textDocument/publishDiagnostics')` and the server later sends that notification, **Then** the returned promise resolves with the notification parameters.
2. **Given** a connected client, **When** the developer calls `waitForNotification` with a filter function and the server sends multiple notifications, **Then** the promise resolves only when a notification matching the filter arrives.
3. **Given** a connected client, **When** the developer calls `waitForNotification` with a timeout and no matching notification arrives within that period, **Then** the promise rejects with a timeout error.
4. **Given** a connected client, **When** the developer calls `waitForNotification` and the client disconnects before the notification arrives, **Then** the promise rejects with a disconnection error.
5. **Given** a connected client, **When** `waitForNotification` resolves, **Then** the internal listener is automatically cleaned up (no resource leak).

---

### User Story 4 - Connection Health Monitoring (Priority: P4)

A developer operating an LSP client in a long-running process (e.g., an IDE extension or CI tool) wants to monitor the health of the connection to the language server. They need to know when the connection state changes, when the last successful communication occurred, and whether the server is still responsive.

**Why this priority**: Connection health is critical for production reliability but is not needed for basic usage. It builds on the transport layer changes from User Story 2.

**Independent Test**: Can be fully tested by connecting a client, observing state change events, simulating a disconnection, and verifying the health status reflects the correct state and timestamps. Delivers value for monitoring and diagnostics in production environments.

**Acceptance Scenarios**:

1. **Given** a client with connection health monitoring, **When** the connection transitions through states (connecting, connected, disconnecting, disconnected), **Then** a state change event fires for each transition with the previous and current state.
2. **Given** a connected client, **When** messages are sent and received, **Then** the last-message-sent and last-message-received timestamps are updated accordingly.
3. **Given** a WebSocket-based client connection, **When** the developer enables heartbeat monitoring, **Then** periodic ping/pong exchanges verify server responsiveness.
4. **Given** a WebSocket client with heartbeat enabled, **When** the server stops responding to pings within the configured timeout, **Then** the connection is considered unhealthy and a state change event fires.
5. **Given** a stdio-based client connection, **When** the developer queries connection health, **Then** timestamps are available but heartbeat is not (since stdio has no ping/pong mechanism).

---

### User Story 5 - Server-to-Client Request Ergonomics (Priority: P5)

A developer building an LSP client needs to handle requests initiated by the server (e.g., `workspace/applyEdit`, `window/showMessageRequest`, `workspace/configuration`). They want the handler registration to be as ergonomic as server-side request handlers, with clear type inference and automatic response correlation.

**Why this priority**: Server-to-client requests are essential for a fully functional LSP client, but the current `onRequest` API already works. This story focuses on ergonomic improvements and ensuring the pattern is well-supported, not on fundamental new capability.

**Independent Test**: Can be fully tested by registering a handler for `workspace/applyEdit` on the client, having the server send that request, and verifying the handler executes and the response is automatically sent back to the server. Delivers value for developers building full-featured LSP clients.

**Acceptance Scenarios**:

1. **Given** a client with a registered handler for `workspace/applyEdit`, **When** the server sends a `workspace/applyEdit` request, **Then** the handler receives properly typed parameters and the return value is automatically sent as the response.
2. **Given** a client with a registered handler for `window/showMessageRequest`, **When** the handler returns a selected action, **Then** the server receives the response with the correct request ID correlation.
3. **Given** a client with no handler for a server-initiated request, **When** the server sends that request, **Then** the client responds with a "method not found" error rather than silently dropping the request.
4. **Given** a client with a handler that throws an error, **When** the server sends the corresponding request, **Then** the client responds with a properly formatted JSON-RPC error response.

---

### User Story 6 - Document Change Sync Ergonomics (Priority: P6)

A developer using the LSP client wants ergonomic helpers for the most common document synchronization workflow: opening a document, making incremental changes, and closing it. They want helpers that correctly manage document versions and construct the required parameter structures without memorizing the LSP specification details.

**Why this priority**: While `textDocument/didChange` is already supported as a raw notification, the parameter construction for incremental sync is verbose and error-prone. Ergonomic helpers reduce boilerplate for the single most common LSP interaction. This is lowest priority because it's a convenience layer, not a capability gap.

**Independent Test**: Can be fully tested by using the helper functions to open a document, apply incremental changes, and verifying the emitted notifications contain correct version numbers and content change events. Delivers value by reducing boilerplate for the most common LSP operation.

**Acceptance Scenarios**:

1. **Given** a connected client, **When** the developer uses a helper to notify the server of an incremental text change (e.g., inserting text at a position), **Then** the helper constructs the correct `DidChangeTextDocumentParams` with incremental content changes and auto-incremented version number.
2. **Given** a connected client, **When** the developer uses a helper to notify of a full document replacement, **Then** the helper constructs the correct parameters with `TextDocumentSyncKind.Full` semantics.
3. **Given** a series of incremental changes to the same document, **When** each change is sent via the helper, **Then** the version number auto-increments for each change notification.

---

### Edge Cases

- What happens when middleware throws an error during message processing? The error must not crash the client/server; it should be caught and reported via the error event system.
- What happens when a native WebSocket connection is created in a Node.js version older than 22.4 where WebSocket is not available? A clear error message must indicate the minimum Node.js version required or suggest installing `ws`.
- What happens when multiple `waitForNotification` calls are active for the same method? Each must resolve independently when its filter matches.
- What happens when middleware modifies a message's `id` field? The system must prevent this and surface a clear error.
- What happens when connection health heartbeat detects an unresponsive server? The system must fire a state change event but not automatically disconnect (that decision belongs to the consumer).
- What happens when a server-to-client request handler is registered after the client is already connected? The handler must be available for subsequent requests.

## Requirements *(mandatory)*

### Functional Requirements

#### Middleware System

- **FR-001**: The SDK MUST provide a composable middleware interface that intercepts JSON-RPC messages at defined hook points (outbound requests/notifications, inbound responses/notifications, errors).
- **FR-002**: Middleware MUST execute in a deterministic order matching their registration sequence (pipeline/onion model).
- **FR-003**: Both the client and server MUST accept middleware via their options at construction time.
- **FR-004**: Middleware MUST be composable — multiple middleware functions can be combined into a single middleware via a composition utility.
- **FR-005**: The middleware system MUST impose zero overhead when no middleware is registered (no additional function calls, allocations, or async wrapping on the message path).
- **FR-006**: A separate package (`@lspeasy/middleware-pino`) MUST provide pino-based structured logging as a middleware, with no pino dependency in the core, client, or server packages.
- **FR-007**: Middleware MUST be able to short-circuit the pipeline (e.g., return a cached response without forwarding to the server).
- **FR-008**: Middleware MUST receive sufficient context to distinguish message types (request vs. notification, inbound vs. outbound) and access the method name.
- **FR-008a**: Middleware MUST NOT modify a JSON-RPC message `id`; attempts MUST be rejected with a clear error.

#### Native WebSocket

- **FR-009**: The client WebSocket transport MUST use the platform-native WebSocket (`globalThis.WebSocket`) instead of the `ws` library.
- **FR-010**: The `ws` package MUST be removed as a required dependency of `@lspeasy/core` and retained only as an optional peer dependency for server-side WebSocket listener support.
- **FR-011**: The WebSocket client transport MUST work in both Node.js (>= 22.4) and browser environments without code changes.
- **FR-012**: Existing reconnection behavior (exponential backoff, configurable attempts) MUST be preserved with the native WebSocket implementation.
- **FR-013**: The SDK MUST provide a clear, actionable error message when native WebSocket is unavailable (older Node.js) or when `ws` is needed but not installed (server-side).

#### One-Shot Notification Listening

- **FR-014**: The client MUST provide a `waitForNotification(method, options?)` method that returns a Promise resolving with the next matching notification's parameters.
- **FR-015**: The `waitForNotification` method MUST support an optional filter function to match specific notifications.
- **FR-016**: The `waitForNotification` method MUST support an optional timeout, rejecting with a descriptive error if the timeout elapses.
- **FR-017**: The `waitForNotification` method MUST automatically clean up its internal listener upon resolution, rejection, or timeout (no resource leaks).
- **FR-018**: Multiple concurrent `waitForNotification` calls for the same method MUST each resolve independently.
- **FR-018a**: The `waitForNotification` method MUST require an explicit timeout option; no default timeout is applied.

#### Connection Health Monitoring

- **FR-019**: The SDK MUST expose connection state as a finite set of states: connecting, connected, disconnecting, disconnected.
- **FR-020**: The SDK MUST emit state change events with previous and current state when transitions occur.
- **FR-021**: The SDK MUST track and expose timestamps of the last message sent and last message received.
- **FR-022**: For WebSocket transports, the SDK MUST support optional ping/pong heartbeat monitoring with configurable interval and timeout.
- **FR-022a**: Heartbeat monitoring MUST be opt-in (disabled by default).
- **FR-023**: When heartbeat monitoring detects an unresponsive server, the SDK MUST emit a health event but MUST NOT automatically disconnect.

#### Server-to-Client Request Handling

- **FR-024**: The client's `onRequest` handler MUST provide type-safe parameter and return types inferred from the LSP method name (consistent with server-side handler registration).
- **FR-025**: The client MUST automatically correlate response IDs to the originating server request.
- **FR-026**: When no handler is registered for a server-initiated request, the client MUST respond with a JSON-RPC "method not found" error.
- **FR-027**: When a handler throws, the client MUST respond with a JSON-RPC error containing the error message.

#### Document Change Sync Ergonomics

- **FR-028**: The SDK MUST provide helper functions for constructing `DidChangeTextDocumentParams` for both incremental and full-document sync modes.
- **FR-029**: Helper functions MUST auto-increment the document version number for successive changes to the same document URI.
- **FR-030**: Helper functions MUST correctly construct `TextDocumentContentChangeEvent` objects for range-based (incremental) changes.
- **FR-030a**: Helpers MUST accept either an explicit version or a `DocumentVersionTracker` instance to manage versions.

### Key Entities

- **Middleware**: A composable function that wraps message processing, with access to message content, direction (inbound/outbound), and the ability to pass through, modify, or short-circuit.
- **MiddlewareContext**: Metadata passed to middleware including message direction, method name, message type (request/notification/response), and transport identity.
- **ConnectionState**: An enumeration of transport connection states (connecting, connected, disconnecting, disconnected) with associated timestamps.
- **ConnectionHealth**: An aggregate of connection state, last-activity timestamps, and optional heartbeat status.
- **DocumentVersionTracker**: A stateful utility that maps document URIs to their current version numbers and auto-increments on each change notification.

## Success Criteria *(mandatory)*

### Measurable Outcomes

- **SC-001**: Developers can add cross-cutting concerns (logging, metrics, retry) to any client or server instance using a single configuration option, without modifying core SDK code.
- **SC-002**: The `@lspeasy/core` package installs with zero native dependencies when used for client-side WebSocket connections on Node.js >= 22.4 or in browsers.
- **SC-003**: Developers can wait for a specific server notification in a single line of code (one method call returning a Promise) instead of manually managing event listeners and cleanup.
- **SC-004**: Long-running LSP client processes can detect server unresponsiveness within a configurable heartbeat interval without polling or manual health checks.
- **SC-005**: All server-to-client requests receive a response (either from a registered handler or an automatic "method not found" error), eliminating silent request drops.
- **SC-006**: Developers can send incremental document change notifications with correct version tracking using helper functions, reducing parameter construction code by at least 50% compared to manual construction.
- **SC-007**: All existing tests continue to pass without modification after these changes (backward compatibility preserved).
- **SC-008**: A client or server with no middleware registered shows no measurable performance regression on message throughput benchmarks.

## Assumptions

- Node.js >= 22.4 is the minimum supported version for native WebSocket client usage. Users on older Node.js versions can install `ws` to restore WebSocket client support via the existing transport.
- The `ws` library will continue to be the standard for WebSocket server support in Node.js, as Node.js has no native `WebSocketServer`.
- Middleware execution order follows the registration order (first registered = first to process outbound, last to process inbound — onion model).
- The `@lspeasy/middleware-pino` package is a separate deliverable that depends on `@lspeasy/core` and `pino`, shipped in the same monorepo but as an independent package.
- The `procxy` library will be used separately for process spawning/management and is explicitly out of scope for this feature.
- A separate `@lspeasy/document-manager` package for full document state tracking is out of scope; only helper functions for constructing change notifications are included here.

## Out of Scope

- Process spawning helper for language server subprocesses (will use `procxy` library separately)
- Full document state management / `TextDocumentManager` abstraction (will be a separate `@lspeasy/document-manager` package)
- Changes to the custom JSON-RPC 2.0 implementation
- WebSocket server transport changes (server-side `ws` usage remains as-is)
- New LSP method support beyond what is already implemented
