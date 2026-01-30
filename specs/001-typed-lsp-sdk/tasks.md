# Tasks: Strongly-Typed LSP SDK with MCP-Like Ergonomics

**Branch**: `001-typed-lsp-sdk` | **Generated**: 2026-01-29
**Input**: [spec.md](spec.md), [plan.md](plan.md), [data-model.md](data-model.md), [contracts/](contracts/)

## Format: `- [ ] [ID] [P?] [Story] Description`

- **Checkbox**: `- [ ]` for not started, `- [x]` for completed
- **[P]**: Parallelizable (different files, no dependencies on incomplete tasks)
- **[Story]**: User story label (US1, US2, US3, US4) from spec.md
- File paths are absolute from repository root

---

## Phase 1: Setup (Project Initialization)

**Purpose**: Initialize monorepo structure and tooling before any implementation

- [x] T001 Create monorepo structure: packages/core/, packages/server/, packages/client/, examples/, e2e/, docs/
- [x] T002 Initialize package.json for @lspy/core with TypeScript 5.x, Vitest, oxlint, oxfmt dependencies
- [x] T003 [P] Initialize package.json for @lspy/server with workspace dependency on @lspy/core
- [x] T004 [P] Initialize package.json for @lspy/client with workspace dependency on @lspy/core
- [x] T005 Configure TypeScript with strict mode, composite project references for monorepo
- [x] T006 [P] Setup oxlint and oxfmt with .oxlintrc.json and .oxfmtrc.json (2 spaces, single quotes, semicolons)
- [x] T007 [P] Configure simple-git-hooks and lint-staged for pre-commit checks
- [x] T008 Add size-limit configuration for bundle size enforcement (<100KB core, <50KB server/client gzipped)
- [x] T009 Create root tsconfig.json and per-package tsconfig.json with composite references

---

## Phase 2: Foundational (Blocking Prerequisites for All User Stories)

**Purpose**: Core infrastructure that MUST complete before any user story implementation begins

**⚠️ CRITICAL**: No user story work (Phase 3+) can start until Phase 2 is complete

### JSON-RPC 2.0 Implementation (Custom, MCP SDK Pattern)

- [x] T010 [P] Define JSON-RPC 2.0 message types in packages/core/src/jsonrpc/messages.ts (Message, RequestMessage, ResponseMessage, NotificationMessage) - Reference: @modelcontextprotocol/sdk/types.js Message types
- [x] T011 [P] Implement JSON-RPC message framing (Content-Length headers) in packages/core/src/jsonrpc/framing.ts - Pattern: MCP SDK's parseMessage with header parsing
- [x] T012 Implement MessageReader class for parsing JSON-RPC messages with framing in packages/core/src/jsonrpc/reader.ts - Pattern: MCP SDK's JSONRPCMessage handling
- [x] T013 Implement MessageWriter class for serializing JSON-RPC messages with framing in packages/core/src/jsonrpc/writer.ts - Pattern: MCP SDK's message serialization
- [x] T014 [P] Create Zod schemas for JSON-RPC message validation in packages/core/src/jsonrpc/schemas.ts - Pattern: MCP SDK's z.discriminatedUnion for message types

### Transport Layer

- [x] T015 Define Transport interface in packages/core/src/transport/transport.ts (send, onMessage, onError, close, isConnected)
- [x] T016 Implement StdioTransport in packages/core/src/transport/stdio.ts (reads from stdin, writes to stdout)
- [x] T017 Add Disposable interface and DisposableStore utility in packages/core/src/utils/disposable.ts
- [x] T018 [P] Implement connection lifecycle event emitter in packages/core/src/transport/events.ts (Events: 'connect', 'disconnect', 'error', 'message')

### Protocol Types Re-export

- [ ] T019 [P] Create hierarchical namespace structure (LSPRequest.*, LSPNotification.*) in packages/core/src/protocol/namespaces.ts - Use type-only imports: import type { HoverParams, Hover } from 'vscode-languageserver-protocol'
- [x] T020 [P] Re-export LSP types from vscode-languageserver-protocol (type-only imports) in packages/core/src/protocol/types.ts - Pattern: export type { Position, Range, Location, ... } from 'vscode-languageserver-protocol'
- [ ] T021 [P] Define InferRequestParams, InferRequestResult, InferNotificationParams type utilities in packages/core/src/protocol/infer.ts - Use conditional types to extract types from namespace structure
- [ ] T022 [P] Generate Zod schemas for LSP types (Position, Range, Location, etc.) in packages/core/src/protocol/schemas.ts - Runtime validators matching TypeScript types from vscode-languageserver-protocol

### Utilities

- [x] T023 [P] Implement CancellationToken and CancellationTokenSource in packages/core/src/utils/cancellation.ts
- [x] T024 [P] Create Logger interface and ConsoleLogger implementation (MCP SDK pattern) in packages/core/src/utils/logger.ts
- [x] T025 [P] Implement error code constants (LSP error codes: -32002, -32602, -32700, etc.) in packages/core/src/utils/errors.ts

### Core Package Export

- [x] T026 Create packages/core/src/index.ts exporting all public APIs (Transport, Message types, Protocol types, utilities)
- [ ] T027 Write unit tests for JSON-RPC message framing in packages/core/tests/unit/jsonrpc-framing.test.ts
- [ ] T028 [P] Write unit tests for StdioTransport in packages/core/tests/unit/stdio-transport.test.ts
- [ ] T029 [P] Write unit tests for CancellationToken in packages/core/tests/unit/cancellation.test.ts

**Checkpoint**: Foundation complete - User story implementation can begin in parallel

---

## Phase 3: User Story 1 - Build LSP Server with Simple API (P1) 🎯 MVP

**Goal**: Enable developers to create LSP servers in <30 lines with handler registration, automatic initialization, and typed request/response handling

**Independent Test**: Create minimal hover server, connect test client, verify typed request/response exchange

### Implementation for US1

- [x] T030 [P] [US1] Create LSPServer class skeleton in packages/server/src/server.ts with constructor(options: ServerOptions)
- [x] T031 [P] [US1] Define ServerOptions interface (name, version, logger, logLevel, onValidationError) in packages/server/src/types.ts
- [x] T032 [P] [US1] Define RequestHandler<Params, Result> and NotificationHandler<Params> types in packages/server/src/types.ts
- [x] T033 [US1] Implement handler registration: onRequest<M extends LSPRequestMethod>(method, handler) in packages/server/src/server.ts
- [x] T034 [US1] Implement handler registration: onNotification<M extends LSPNotificationMethod>(method, handler) in packages/server/src/server.ts
- [x] T035 [US1] Implement setCapabilities(capabilities: ServerCapabilities) method in packages/server/src/server.ts
- [x] T036 [US1] Implement listen(transport: Transport) to start server and accept connections in packages/server/src/server.ts
- [x] T037 [US1] Create message dispatcher: route incoming requests to registered handlers in packages/server/src/dispatcher.ts
- [x] T038 [US1] Implement automatic initialize/initialized handshake handling in packages/server/src/lifecycle.ts
- [x] T039 [US1] Add request parameter validation via Zod before calling handlers in packages/server/src/validation.ts
- [x] T040 [US1] Implement error response generation (LSP error codes, validation errors) in packages/server/src/errors.ts
- [x] T041 [US1] Add cancellation token support: handle $/cancelRequest notifications in packages/server/src/cancellation.ts
- [x] T042 [US1] Implement shutdown() and close() methods for graceful/forced shutdown in packages/server/src/server.ts
- [x] T043 [US1] Create packages/server/src/index.ts exporting LSPServer, ServerOptions, RequestHandler, NotificationHandler

### Examples for US1

- [x] T044 [P] [US1] Create minimal hover server example (<30 lines) in examples/server/minimal-server.ts
- [x] T045 [P] [US1] Create hover + completion server example in examples/server/hover-server.ts

### Tests for US1

- [x] T046 [P] [US1] Unit test: LSPServer constructor and setCapabilities in packages/server/tests/unit/server.test.ts
- [x] T047 [P] [US1] Unit test: Handler registration (onRequest, onNotification) in packages/server/tests/unit/handlers.test.ts
- [x] T048 [P] [US1] Unit test: Message dispatcher routing in packages/server/tests/unit/dispatcher.test.ts
- [x] T049 [P] [US1] Integration test: Initialize handshake with test client in packages/server/tests/integration/initialize.test.ts
- [x] T050 [P] [US1] Integration test: textDocument/hover request/response in packages/server/tests/integration/hover.test.ts
- [x] T051 [US1] Integration test: Parameter validation rejection (malformed request) in packages/server/tests/integration/validation.test.ts

**Checkpoint**: User Story 1 complete - Developers can build working LSP servers with typed handlers

---

## Phase 4: User Story 2 - Build LSP Client to Connect to Any Server (P2)

**Goal**: Enable programmatic interaction with real LSP servers using high-level TypeScript API

**Independent Test**: Connect to typescript-language-server, send initialize + textDocument/definition request, receive typed responses

### Implementation for US2

- [ ] T052 [P] [US2] Create LSPClient class skeleton in packages/client/src/client.ts with constructor(options: ClientOptions)
- [ ] T053 [P] [US2] Define ClientOptions interface (name, version, capabilities, logger, logLevel, onValidationError) in packages/client/src/types.ts
- [ ] T054 [US2] Implement connect(transport: Transport): Promise<InitializeResult> with automatic initialization in packages/client/src/client.ts
- [ ] T055 [US2] Implement disconnect(): Promise<void> with shutdown + exit sequence in packages/client/src/client.ts
- [ ] T056 [US2] Implement low-level sendRequest<M extends LSPRequestMethod>(method, params) in packages/client/src/client.ts
- [ ] T057 [US2] Implement low-level sendNotification<M extends LSPNotificationMethod>(method, params) in packages/client/src/client.ts
- [ ] T058 [US2] Implement sendCancellableRequest<M>(method, params) returning { promise, cancel } in packages/client/src/client.ts
- [ ] T059 [P] [US2] Create high-level textDocument.* method builders (hover, completion, definition, references, documentSymbol) in packages/client/src/requests/text-document.ts
- [ ] T060 [P] [US2] Create high-level workspace.* method builders (symbol, didChangeWorkspaceFolders) in packages/client/src/requests/workspace.ts
- [ ] T061 [US2] Implement response validation via Zod schemas in packages/client/src/validation.ts
- [ ] T062 [US2] Implement server-to-client request handling: onRequest<M>(method, handler) in packages/client/src/client.ts
- [ ] T063 [US2] Add isConnected() method and connection state tracking in packages/client/src/client.ts
- [ ] T064 [US2] Create packages/client/src/index.ts exporting LSPClient, ClientOptions, high-level methods

### Examples for US2

- [ ] T065 [P] [US2] Create basic client example connecting to typescript-language-server in examples/client/basic-client.ts
- [ ] T066 [P] [US2] Create test client harness for automated testing in examples/client/test-client.ts

### Tests for US2

- [ ] T067 [P] [US2] Unit test: LSPClient constructor and connect/disconnect in packages/client/tests/unit/client.test.ts
- [ ] T068 [P] [US2] Unit test: sendRequest and sendNotification type inference in packages/client/tests/unit/requests.test.ts
- [ ] T069 [P] [US2] Unit test: High-level method builders (textDocument.hover, etc.) in packages/client/tests/unit/builders.test.ts
- [ ] T070 [US2] Integration test: Connect to typescript-language-server and send initialize in packages/client/tests/integration/connect.test.ts
- [ ] T071 [US2] Integration test: Send textDocument/definition request to real server in packages/client/tests/integration/definition.test.ts
- [ ] T072 [US2] Integration test: Response validation rejection (malformed server response) in packages/client/tests/integration/validation.test.ts
- [ ] T073 [US2] Integration test: Graceful shutdown sequence (shutdown → exit) in packages/client/tests/integration/shutdown.test.ts

**Checkpoint**: User Story 2 complete - Clients can connect to and interact with real LSP servers

---

## Phase 5: User Story 3 - Use Multiple Transport Layers (P3)

**Goal**: Enable transport switching (stdio, WebSocket) without server logic changes

**Independent Test**: Create one server, test with stdio transport, then WebSocket transport without code changes

### Implementation for US3

- [ ] T074 [P] [US3] Implement WebSocketTransport in packages/core/src/transport/websocket.ts (client + server modes)
- [ ] T075 [P] [US3] Add WebSocketTransportOptions (url for client, socket for server, reconnect options) in packages/core/src/transport/websocket.ts
- [ ] T076 [US3] Add reconnection logic for WebSocketTransport (maxReconnectAttempts, reconnectDelay) in packages/core/src/transport/websocket.ts
- [ ] T077 [US3] Implement transport error handling and resource cleanup in packages/core/src/transport/error-handling.ts
- [ ] T078 [P] [US3] Update LSPServer.listen() to accept any Transport implementation in packages/server/src/server.ts
- [ ] T079 [P] [US3] Update LSPClient.connect() to accept any Transport implementation in packages/client/src/client.ts

### Examples for US3

- [ ] T080 [P] [US3] Create WebSocket server example using ws library in examples/server/websocket-server.ts
- [ ] T081 [P] [US3] Create WebSocket client example connecting to ws:// URL in examples/client/websocket-client.ts
- [ ] T082 [P] [US3] Create custom HTTP transport example in examples/custom-transport.ts

### Tests for US3

- [ ] T083 [P] [US3] Unit test: WebSocketTransport send/receive in packages/core/tests/unit/websocket-transport.test.ts
- [ ] T084 [P] [US3] Unit test: WebSocket reconnection logic in packages/core/tests/unit/websocket-reconnect.test.ts
- [ ] T085 [US3] Integration test: Server with stdio transport, then WebSocket without code change in e2e/transport-switching.spec.ts
- [ ] T086 [US3] Integration test: Concurrent clients on different transports in e2e/concurrent-transports.spec.ts
- [ ] T087 [US3] Integration test: Transport disconnection and resource cleanup in e2e/transport-disconnect.spec.ts

**Checkpoint**: User Story 3 complete - Transport layer is pluggable and production-ready

---

## Phase 6: User Story 4 - Handle Advanced LSP Features (P4)

**Goal**: Support workspace folders, file watching, progress reporting, partial results

**Independent Test**: Implement workspace/didChangeWorkspaceFolders handler and verify multi-folder support

### Implementation for US4

- [ ] T088 [P] [US4] Add workspace folder support: WorkspaceFoldersChangeEvent types in packages/core/src/protocol/workspace.ts
- [ ] T089 [P] [US4] Implement file watching types: DidChangeWatchedFilesParams in packages/core/src/protocol/watching.ts
- [ ] T090 [P] [US4] Add progress reporting: WorkDoneProgress types (begin, report, end) in packages/core/src/protocol/progress.ts
- [ ] T091 [P] [US4] Implement partial result streaming: PartialResultParams in packages/core/src/protocol/partial.ts
- [ ] T092 [US4] Add server method createProgressToken() for progress reporting in packages/server/src/progress.ts
- [ ] T093 [US4] Add client method onProgress(handler) for receiving progress in packages/client/src/progress.ts
- [ ] T094 [P] [US4] Add capability-aware type filtering: MethodsForCapabilities<Caps> utility type in packages/core/src/protocol/capabilities.ts

### Examples for US4

- [ ] T095 [P] [US4] Create advanced server example with workspace folders + progress in examples/server/advanced-server.ts
- [ ] T096 [P] [US4] Create client example handling progress notifications in examples/client/progress-client.ts

### Tests for US4

- [ ] T097 [P] [US4] Integration test: workspace/didChangeWorkspaceFolders notification in e2e/workspace-folders.spec.ts
- [ ] T098 [P] [US4] Integration test: Progress reporting (begin → report → end) in e2e/progress-reporting.spec.ts
- [ ] T099 [P] [US4] Integration test: Partial result streaming for large completion in e2e/partial-results.spec.ts

**Checkpoint**: User Story 4 complete - Advanced LSP features supported

---

## Phase 7: Polish & Cross-Cutting Concerns

**Purpose**: Documentation, performance optimization, compliance validation

### Performance & Benchmarks

- [ ] T100 [P] Create benchmark suite in packages/core/tests/benchmarks/message-parse.bench.ts (target: <1ms p95)
- [ ] T101 [P] Create benchmark suite in packages/server/tests/benchmarks/handler-dispatch.bench.ts (target: <0.1ms p95)
- [ ] T102 [P] Create benchmark suite for cancellation propagation in packages/core/tests/benchmarks/cancellation.bench.ts (target: <100ms)
- [ ] T103 Add vitest.benchmark.config.ts for running performance tests

### LSP Compliance

- [ ] T104 [P] Create LSP 3.17 conformance test suite in e2e/lsp-compliance.spec.ts (all message types, error codes)
- [ ] T105 [P] Create test against typescript-language-server in e2e/real-servers.spec.ts
- [ ] T106 [P] Create test against rust-analyzer in e2e/real-servers.spec.ts
- [ ] T107 [P] Create test against pyright in e2e/real-servers.spec.ts

### Documentation

- [ ] T108 [P] Write docs/ARCHITECTURE.md explaining package design, JSON-RPC implementation, transport layer
- [ ] T109 [P] Write docs/API.md with complete API reference for all three packages
- [ ] T110 [P] Update root README.md with quickstart, installation, examples
- [ ] T111 [P] Update packages/core/README.md with Transport interface guide
- [ ] T112 [P] Update packages/server/README.md with server building guide
- [ ] T113 [P] Update packages/client/README.md with client connection guide
- [ ] T114 Add JSDoc comments to all public APIs (LSPServer, LSPClient, Transport)

### CI/CD & Quality

- [ ] T115 Setup GitHub Actions workflow for linting (oxlint) in .github/workflows/lint.yml
- [ ] T116 [P] Setup GitHub Actions workflow for type checking in .github/workflows/typecheck.yml
- [ ] T117 [P] Setup GitHub Actions workflow for unit tests in .github/workflows/test.yml
- [ ] T118 [P] Setup GitHub Actions workflow for integration tests in .github/workflows/integration.yml
- [ ] T119 [P] Setup GitHub Actions workflow for bundle size checks (size-limit) in .github/workflows/size.yml
- [ ] T120 Add test coverage reporting with minimum 80% threshold
- [ ] T121 [P] Create performance benchmark suite for load testing (SC-005: 1000 concurrent requests, <100ms p95 latency) in packages/core/tests/benchmark/load.bench.ts
- [ ] T122 [P] Conduct API similarity audit against MCP SDK patterns (SC-006: document ergonomic differences in docs/MCP_SDK_COMPARISON.md, ensure <10 conceptual differences)
- [ ] T123 [P] Plan user testing session with 3-5 developers (SC-007: setup test project, define tasks, collect feedback on quickstart experience)

---

## Implementation Strategy

### MVP Scope (Phase 1-3 Complete)
Ship with **User Story 1** complete:
- @lspy/core with JSON-RPC, Transport, protocol types
- @lspy/server with handler registration
- StdioTransport only
- Minimal examples
- Basic tests

**Value**: Developers can build working LSP servers immediately

### Incremental Delivery
- **Phase 4**: Add client support (US2) → full bidirectional communication
- **Phase 5**: Add WebSocket transport (US3) → production deployment flexibility
- **Phase 6**: Add advanced features (US4) → feature parity with major language servers
- **Phase 7**: Polish → production-ready SDK

### Parallel Execution Opportunities

**After Phase 2 Complete**:
- US1 (server), US2 (client), US3 (WebSocket transport) can be developed in parallel
- Examples can be written alongside implementation
- Unit tests can be written in parallel with implementation files

**Within Each Phase**:
- Tasks marked `[P]` can run concurrently
- Tests can be written before or alongside implementation (TDD)

---

## Dependencies Between User Stories

```
Phase 1 (Setup)
    ↓
Phase 2 (Foundational) ← BLOCKING for all user stories
    ↓
    ├─→ Phase 3 (US1: Server) [Independent]
    ├─→ Phase 4 (US2: Client) [Independent]
    └─→ Phase 5 (US3: Transports) [Depends on US1 or US2]
         ↓
Phase 6 (US4: Advanced) [Depends on US1 + US2]
    ↓
Phase 7 (Polish)
```

**Key Insight**: US1 and US2 are independently testable and can be developed in parallel after Phase 2 completes.

---

## Task Summary

- **Total Tasks**: 123
- **Setup Tasks**: 9 (T001-T009)
- **Foundational Tasks**: 20 (T010-T029)
- **US1 Tasks**: 22 (T030-T051) - MVP
- **US2 Tasks**: 22 (T052-T073)
- **US3 Tasks**: 14 (T074-T087)
- **US4 Tasks**: 12 (T088-T099)
- **Polish Tasks**: 24 (T100-T123)

**Parallelizable Tasks**: 71 tasks marked `[P]` (58%)

**Suggested MVP**: Phase 1-3 (51 tasks) delivers working LSP server SDK
