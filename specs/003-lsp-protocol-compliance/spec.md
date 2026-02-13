# Feature Specification: LSP Protocol Compliance Gaps

**Feature Branch**: `003-lsp-protocol-compliance`
**Created**: 2026-02-11
**Status**: Draft
**Input**: User description: "LSP Protocol Compliance Gaps - Dynamic Registration, Transport Breadth, Partial Results & Notebook Sync"

## User Scenarios & Testing *(mandatory)*

## Clarifications

### Session 2026-02-12

- Q: How should TCP server mode handle additional incoming connections while one is active? → A: Accept first connection and reject additional connections until active one closes.
- Q: Which JSON-RPC error should be returned when `client/unregisterCapability` references an unknown registration ID? → A: `InvalidParams` (`-32602`).
- Q: How should the client handle `client/registerCapability` when `dynamicRegistration: true` was not declared? → A: Default to strict rejection, with an explicit opt-in compatibility flag to allow acceptance.
- Q: How should final partial-result aggregation behave? → A: Preserve partial batches in arrival order and append/merge final response payload when present.
- Q: How should cancellation return partial-result data to callers? → A: Resolve with a structured cancellation result containing accumulated partial results.

### User Story 1 - Dynamic Capability Registration (Priority: P1)

A developer building an LSP client needs to work with language servers that dynamically register and unregister capabilities after initialization. For example, a multi-language server may add formatting support for Python only after a Python plugin loads, or a TypeScript server may register additional code action capabilities when a specific project configuration is detected. The client must automatically track these dynamic changes and make newly registered capabilities available for use.

**Why this priority**: Dynamic capability registration is part of the core LSP 3.17 specification and is used by major language servers (TypeScript, Java, multi-language servers). Without it, the client cannot interoperate with servers that rely on dynamic registration, which is a protocol compliance gap that affects real-world compatibility.

**Independent Test**: Can be fully tested by connecting to a server that sends a `client/registerCapability` request after initialization, verifying the client tracks the registration and makes the new capability available, then verifying `client/unregisterCapability` removes it. Delivers immediate value by enabling compatibility with servers that depend on dynamic registration.

**Acceptance Scenarios**:

1. **Given** a connected client and an initialized server, **When** the server sends a `client/registerCapability` request to register completion support for `.py` files, **Then** the client acknowledges the registration and makes completion available for documents matching the registration's document selector.
2. **Given** a client with a dynamically registered capability, **When** the server sends a `client/unregisterCapability` request with the same registration ID, **Then** the client removes the capability and no longer routes requests for it.
3. **Given** a client that has received dynamic registrations, **When** a developer queries the client's available capabilities at runtime, **Then** both statically declared (from initialization) and dynamically registered capabilities are visible.
4. **Given** a server that sends a `client/registerCapability` request with a document selector, **When** the client receives a request for a document that does NOT match the selector, **Then** the dynamically registered capability is not invoked for that document.
5. **Given** a client that receives a `client/registerCapability` request but did not declare `dynamicRegistration: true` for that capability in its client capabilities, **Then** the client responds with an error indicating the capability was not declared as supporting dynamic registration.

---

### User Story 2 - Transport Breadth (TCP + Worker) (Priority: P2)

A developer needs to connect their LSP client to language servers running in non-stdio environments: over TCP sockets (e.g., `clangd`, Eclipse JDT LS, containerized servers) and in browser workers (Dedicated Worker and Shared Worker). They need transports that implement the same interface as existing transports while preserving JSON-RPC/LSP semantics.

**Why this priority**: TCP is the second most common LSP transport after stdio for server and containerized deployments, and worker-hosted servers are a core browser deployment pattern. Supporting both directly expands interoperability across desktop, remote, and browser-hosted LSP environments.

**Independent Test**: Can be fully tested by (a) starting a TCP server and completing an LSP initialization handshake over TCP, and (b) running browser-based LSP sessions over Dedicated Worker and Shared Worker transports to validate request/response flow, close/error handling, and ordering guarantees.

**Acceptance Scenarios**:

1. **Given** a language server listening on a TCP port, **When** a developer creates a TCP transport in client mode and connects to that port, **Then** the transport successfully establishes a connection and LSP messages flow correctly.
2. **Given** a TCP transport configured to accept connections on a port, **When** a language server connects to that port, **Then** the transport accepts the connection and messages flow correctly (server mode).
3. **Given** a TCP transport with reconnection enabled, **When** the connection drops unexpectedly, **Then** the transport attempts to reconnect using exponential backoff (same behavior as the WebSocket transport).
4. **Given** a TCP transport, **When** the developer calls `close()`, **Then** the underlying socket is gracefully closed and all resources are released.
5. **Given** a TCP client transport, **When** the server is not reachable on the specified host and port, **Then** the transport reports a clear connection error.
6. **Given** a browser client and a language server running in a Dedicated Worker, **When** a developer creates `DedicatedWorkerTransport`, **Then** the client and worker exchange LSP messages correctly with ordered delivery.
7. **Given** multiple browser clients connected through a Shared Worker `MessagePort`, **When** each client sends LSP requests via `SharedWorkerTransport`, **Then** responses are correlated to the originating client/request without cross-client misrouting.
8. **Given** a worker-backed transport, **When** the worker is terminated or its port closes unexpectedly, **Then** the transport emits a close/error signal and prevents further sends.

---

### User Story 3 - Node.js IPC Transport (Priority: P3)

A developer spawning a Node.js-based language server as a child process wants to communicate over the Node.js IPC channel rather than stdio. IPC offers better performance than stdio for Node.js servers (no serialization overhead for structured data) and keeps stdout free for other purposes (e.g., logging).

**Why this priority**: IPC is the preferred transport for Node.js-to-Node.js communication and is used by VS Code's language client when spawning Node.js servers. It avoids the pitfall of language servers accidentally writing to stdout and corrupting the LSP stream. However, it is narrower in applicability than TCP (Node.js-only).

**Independent Test**: Can be fully tested by forking a Node.js language server process with an IPC channel, creating an IPC transport, and completing an LSP session including initialization, requests, and shutdown. Delivers value for Node.js-based server integrations.

**Acceptance Scenarios**:

1. **Given** a Node.js child process spawned with an IPC channel, **When** a developer creates an IPC transport and connects to that child process, **Then** LSP messages are exchanged correctly via the IPC channel.
2. **Given** an IPC transport, **When** the child process exits unexpectedly, **Then** the transport detects the disconnection and fires a close event.
3. **Given** an IPC transport on the server side (running inside the child process), **When** the server listens on the transport, **Then** it receives messages from the parent process and can send responses back.
4. **Given** an IPC transport, **When** the developer calls `close()`, **Then** the IPC channel is disconnected and all resources are released without terminating the child process.

---

### User Story 4 - Partial Result Streaming (Priority: P4)

A developer using the LSP client to search for references in a large codebase wants to receive results incrementally as the server finds them, rather than waiting for the entire search to complete. They want the client to accumulate partial results and deliver them via a callback or stream, so the user can see early results while the search continues.

**Why this priority**: Partial results improve perceived performance for long-running operations in large codebases. While the existing progress infrastructure provides the foundation, the high-level API for consuming and producing partial results is missing. This is medium priority because it enhances performance perception rather than enabling new server compatibility.

**Independent Test**: Can be fully tested by sending a `textDocument/references` request with a `partialResultToken`, having the server send multiple `$/progress` notifications with batches of locations, and verifying the client delivers each batch to the caller as it arrives. Delivers value for large-codebase scenarios.

**Acceptance Scenarios**:

1. **Given** a client sending a request that supports partial results (e.g., `textDocument/references`), **When** the client includes a `partialResultToken` in the request, **Then** the server can send partial results via `$/progress` notifications using that token.
2. **Given** a client receiving partial results via `$/progress`, **When** each batch arrives, **Then** a developer-provided callback is invoked with the partial results immediately (not buffered until completion).
3. **Given** a client receiving partial results, **When** the final response arrives, **Then** the client delivers the complete result set (combining any partial results with the final response if applicable).
4. **Given** a client receiving partial results, **When** the request is cancelled before completion, **Then** the partial results accumulated so far remain available to the caller.
5. **Given** a server handling a request with a `partialResultToken`, **When** the server has a batch of results ready, **Then** a helper API allows the server to send the batch as a partial result without manually constructing the `$/progress` notification.
6. **Given** a client sending a request to a server that does NOT support partial results, **When** the server ignores the `partialResultToken`, **Then** the client still receives the final result normally with no errors.

---

### User Story 5 - Notebook Document Sync (Priority: P5)

A developer building an LSP server for a notebook environment (e.g., Jupyter notebooks) needs to receive notifications about notebook lifecycle events — when notebooks are opened, changed (cells added, removed, reordered, or edited), saved, and closed. They also need to map notebook cells to virtual text documents for providing language features like completions and diagnostics within individual cells.

**Why this priority**: Notebook support is a niche LSP feature used primarily by Python and data science language servers. The protocol definitions and types already exist in the SDK's type system; what's missing is the developer-friendly convenience API (analogous to `textDocument.*` and `workspace.*` namespaces). This is lowest priority because the raw method-name API already works.

**Independent Test**: Can be fully tested by having a client send `notebookDocument/didOpen` with cell contents, verifying the server receives the notification, then sending `notebookDocument/didChange` with structural and content changes and verifying the server processes them correctly. Delivers value for notebook-based language server implementations.

**Acceptance Scenarios**:

1. **Given** a server with notebook sync capabilities declared, **When** the client opens a notebook, **Then** the server receives a `notebookDocument/didOpen` notification containing the notebook type, all cell URIs, cell languages, and cell contents.
2. **Given** a server tracking an open notebook, **When** a cell is added, removed, or reordered, **Then** the server receives a `notebookDocument/didChange` notification with the structural change details.
3. **Given** a server tracking an open notebook, **When** a cell's text content is edited, **Then** the server receives a `notebookDocument/didChange` notification with the content change for that specific cell.
4. **Given** a server with notebook capabilities, **When** convenience methods are available (e.g., on the `notebookDocument` namespace), **Then** handlers can be registered with the same ergonomics as `textDocument.didOpen` or `workspace.didChangeConfiguration`.
5. **Given** a client sending notebook notifications, **When** convenience methods are available on the client, **Then** the developer can call them (e.g., `client.notebookDocument.didOpen(params)`) with the same ergonomics as text document methods.

---

### Edge Cases

- What happens when a server sends `client/registerCapability` with an ID that was already registered? The client must replace the existing registration with the new one (per LSP spec).
- What happens when a server sends `client/unregisterCapability` with an ID that was never registered? The client must respond with `InvalidParams` (`-32602`).
- What happens when a TCP connection receives a partial LSP message (split across TCP packets)? The transport must buffer and reassemble using Content-Length framing, identical to stdio behavior.
- What happens when an IPC transport receives a message that is not a valid JSON-RPC message? The transport must report an error via the error handler without crashing.
- What happens when partial results arrive after the final response for the same request? The late partial results must be ignored.
- What happens when a notebook `didChange` notification includes both structural changes and content changes in the same message? Both must be processed (the LSP spec allows this).
- What happens when a TCP transport in server mode receives multiple incoming connections? Only the first connection is accepted; all subsequent connections are rejected while an active connection exists.
- What happens when multiple clients send concurrent requests through a Shared Worker transport? Request and response routing must remain isolated per client/port and correlated by request ID without cross-client leakage.
- What happens when a Shared Worker `MessagePort` handoff or activation fails? The transport must emit a clear error, transition to closed/unavailable state, and reject subsequent sends until reinitialized.

## Requirements *(mandatory)*

### Functional Requirements

#### Dynamic Capability Registration

- **FR-001**: The client MUST handle incoming `client/registerCapability` requests from the server by tracking each registration with its unique ID, method, and registration options.
- **FR-002**: The client MUST handle incoming `client/unregisterCapability` requests from the server by removing the registration matching the provided ID.
- **FR-002a**: If `client/unregisterCapability` references an unknown registration ID, the client MUST respond with JSON-RPC `InvalidParams` (`-32602`).
- **FR-003**: When a capability is dynamically registered, the client MUST make the corresponding method available through the capability-aware API (e.g., a newly registered completion provider makes `textDocument.completion` available).
- **FR-004**: When a capability is dynamically unregistered, the client MUST remove the corresponding method from the capability-aware API if no other registration covers it.
- **FR-005**: Dynamic registrations with document selectors MUST scope the capability to documents matching the selector.
- **FR-006**: The client MUST respond with an error when a `client/registerCapability` request targets a capability for which the client did not declare `dynamicRegistration: true` support.
- **FR-006a**: The client MUST provide an explicit compatibility option to allow accepting such registrations; this option MUST default to disabled (strict mode).
- **FR-007**: The client MUST store both static (from initialization) and dynamic registrations and correctly merge them when determining available capabilities.

#### TCP Transport

- **FR-008**: The SDK MUST provide a TCP transport that implements the existing `Transport` interface.
- **FR-009**: The TCP transport MUST support client mode (connecting to a host and port) and server mode (listening on a port and accepting a connection).
- **FR-009a**: In TCP server mode, the transport MUST accept only the first connection and reject all additional incoming connections while one connection is active.
- **FR-010**: The TCP transport MUST use Content-Length header framing for message boundaries, identical to the stdio transport.
- **FR-011**: The TCP transport MUST support configurable reconnection with exponential backoff in client mode, consistent with the WebSocket transport's reconnection behavior.
- **FR-012**: The TCP transport MUST gracefully handle partial messages split across TCP packets by buffering until a complete message is received.
- **FR-013**: The TCP transport MUST use only built-in Node.js modules (no external dependencies).

#### IPC Transport

- **FR-014**: The SDK MUST provide an IPC transport that implements the existing `Transport` interface, communicating via the Node.js child process IPC channel.
- **FR-015**: The IPC transport MUST support both parent-side (communicating with a child process) and child-side (communicating with the parent process) usage.
- **FR-016**: The IPC transport MUST detect child process exit and fire a close event.
- **FR-017**: The IPC transport MUST use only built-in Node.js modules (no external dependencies).

#### Worker Transports

- **FR-017a**: The SDK MUST provide a `DedicatedWorkerTransport` that implements the existing `Transport` interface for browser-based 1:1 communication with a Dedicated Worker-hosted language server.
- **FR-017b**: The SDK MUST provide a `SharedWorkerTransport` that implements the existing `Transport` interface via `MessagePort` for browser-based communication with a Shared Worker-hosted language server.
- **FR-017c**: Worker transports MUST preserve message ordering and JSON-RPC request/response correlation semantics.
- **FR-017d**: Worker transports MUST provide clear error and close signaling when the worker or port becomes unavailable.
- **FR-017e**: `SharedWorkerTransport` MUST isolate routing per client `MessagePort` so concurrent clients cannot receive each other’s responses or notifications.
- **FR-017f**: If `SharedWorkerTransport` cannot establish or activate a required `MessagePort`, it MUST emit an error, transition to unavailable/closed state, and reject subsequent sends until reinitialized.

#### Partial Result Streaming

- **FR-018**: The client MUST support sending a `partialResultToken` with requests that declare partial result support in the protocol.
- **FR-019**: The client MUST deliver partial results to the caller via a callback as each `$/progress` notification arrives for the corresponding token.
- **FR-020**: The client MUST combine partial results with the final response when the request completes.
- **FR-020a**: Partial result aggregation MUST preserve arrival order of partial batches; if the final response contains payload, it MUST be appended as the last aggregate element (no structural merge).
- **FR-021**: When a request with partial results is cancelled, the client MUST make accumulated partial results available to the caller.
- **FR-021a**: On cancellation, the client MUST resolve with a structured result `{ cancelled: true, partialResults, finalResult?: undefined }` rather than waiting for a final response.
- **FR-022**: The server MUST provide a helper for sending partial result batches during request handling, abstracting away the `$/progress` notification construction.
- **FR-023**: The partial result system MUST be backward-compatible — requests sent without a `partialResultToken` must behave identically to the current implementation.

#### Notebook Document Sync

- **FR-024**: The server MUST support registering handlers for all four notebook document notifications: `notebookDocument/didOpen`, `notebookDocument/didChange`, `notebookDocument/didSave`, `notebookDocument/didClose`.
- **FR-025**: The client MUST support sending all four notebook document notifications.
- **FR-026**: Notebook document methods MUST be accessible via a `notebookDocument` namespace with the same ergonomics as the existing `textDocument` and `workspace` namespaces (e.g., `server.onNotification('notebookDocument/didOpen', handler)` with full type inference, and `client.notebookDocument.didOpen(params)` as a convenience method).
- **FR-027**: The notebook sync capability MUST be declarable in `ServerCapabilities` via `notebookDocumentSync` with full type support.

### Key Entities

- **DynamicRegistration**: A record of a capability dynamically registered by the server, containing a unique ID, the LSP method it covers, and optional registration options (including document selectors).
- **RegistrationStore**: A collection that tracks all dynamic registrations alongside static capabilities, supporting lookup by method name and document URI.
- **TCPTransport**: A transport implementation that communicates over TCP sockets with Content-Length framing and optional reconnection.
- **IPCTransport**: A transport implementation that communicates via Node.js child process IPC channels.
- **DedicatedWorkerTransport**: A browser-focused transport variant that communicates 1:1 between a page/client context and a Dedicated Worker-hosted language server via `postMessage`.
- **SharedWorkerTransport**: A browser-focused transport variant that communicates through a Shared Worker `MessagePort`, enabling multiple clients to connect to a shared server host process.
- **PartialResultCollector**: A client-side accumulator that receives partial result batches for a given token and delivers them to the caller, combining with the final result on completion.
- **PartialResultSender**: A server-side helper that sends partial result batches via `$/progress` notifications for a given token.

## Success Criteria *(mandatory)*

### Measurable Outcomes

- **SC-001**: The SDK can successfully complete a full LSP session (initialize, register capabilities dynamically, use those capabilities, unregister, shutdown) with language servers that depend on dynamic capability registration.
- **SC-002**: The SDK can connect to language servers over TCP sockets, enabling interoperability with servers that do not support stdio (e.g., containerized or remote servers).
- **SC-003**: The SDK can communicate with Node.js-based language servers over IPC channels, eliminating the risk of stdout pollution corrupting the LSP message stream.
- **SC-004**: For long-running operations like find-all-references in large codebases, users see initial results arriving incrementally rather than waiting for the complete result set.
- **SC-005**: Developers building notebook-aware language servers can register handlers and send notifications using the same ergonomic patterns as text document methods, with no loss of type safety.
- **SC-006**: All existing tests continue to pass without modification after these changes (backward compatibility preserved).
- **SC-007**: The TCP and IPC transports require zero external dependencies beyond Node.js built-in modules.
- **SC-008**: The SDK can complete a full LSP session over `DedicatedWorkerTransport` and `SharedWorkerTransport` in browser-hosted scenarios.

## Assumptions

- Dynamic capability registration follows the LSP 3.17 specification strictly, including the requirement that clients declare `dynamicRegistration: true` for each capability that supports it.
- Dynamic capability registration handling is strict by default; an explicit compatibility option may relax strict rejection for non-conformant servers.
- TCP transport uses the same Content-Length header framing as stdio, as specified by the LSP base protocol. This is standard across all stream-based LSP transports.
- The IPC transport is specific to Node.js environments. Browser environments do not have access to `child_process` and will use browser-capable transports (WebSocket, Dedicated Worker, Shared Worker).
- Partial result streaming uses the existing `$/progress` notification infrastructure. No new protocol messages are introduced.
- Notebook document sync follows the LSP 3.17 specification. The protocol method definitions and types already exist in the codebase via `vscode-languageserver-protocol` re-exports.
- The TCP transport in server mode accepts a single connection at a time (one language server per transport instance), consistent with how LSP operates as a 1:1 client-server protocol.

## Out of Scope

- Named pipe / Unix domain socket transport (can be added later using the same pattern as TCP)
- Automatic server process spawning and management (will use `procxy` library separately, as decided in feature 002)
- Changes to the existing stdio or WebSocket transport implementations
- Middleware system (covered by feature 002-middleware-dx-improvements)
