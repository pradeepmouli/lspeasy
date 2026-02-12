# Tasks: Middleware System & Client/Server DX Improvements

**Input**: Design documents from `/specs/002-middleware-dx-improvements/`
**Prerequisites**: plan.md, spec.md, research.md, data-model.md, contracts/

**Tests**: This feature follows test-first development per the project constitution. Tests must be written FIRST and must FAIL before implementation.

**Organization**: Tasks are grouped by user story to enable independent implementation and testing of each story.

## Format: `[ID] [P?] [Story] Description`

- **[P]**: Can run in parallel (different files, no dependencies)
- **[Story]**: Which user story this task belongs to (e.g., US1, US2, US3)
- Include exact file paths in descriptions

---

## Phase 1: Setup (Shared Infrastructure)

**Purpose**: Project initialization and basic structure

- [X] T001 Create middleware directory structure in packages/core/src/middleware/
- [X] T002 Create connection health directory in packages/client/src/connection/
- [X] T003 Create notifications directory in packages/client/src/notifications/
- [X] T004 Create utils directory with document helpers in packages/core/src/utils/
- [X] T005 Create new package @lspeasy/middleware-pino with src/ and test/ directories
- [X] T006 Add e2e test files: e2e/middleware-integration.spec.ts, e2e/websocket-native.spec.ts, e2e/notification-wait.spec.ts, e2e/connection-health.spec.ts

---

## Phase 2: Foundational (Blocking Prerequisites)

**Purpose**: Core infrastructure that MUST be complete before ANY user story can be implemented

**⚠️ CRITICAL**: No user story work can begin until this phase is complete

- [X] T007 Define base type system in packages/core/src/middleware/types.ts (JSONRPCMessage, MiddlewareContext, Middleware, MiddlewareNext, MiddlewareResult)
- [X] T008 [P] Update packages/core/package.json to mark 'ws' as optional peer dependency
- [X] T009 [P] Update packages/client/package.json and packages/server/package.json to depend on updated @lspeasy/core
- [X] T010 Create packages/middleware/pino/package.json with peer dependencies on @lspeasy/core and pino

**Checkpoint**: Foundation ready - user story implementation can now begin in parallel

---

## Phase 3: User Story 1 - Middleware-Based Message Interception (Priority: P1) 🎯 MVP

**Goal**: Enable composable middleware functions to intercept, inspect, and transform JSON-RPC messages with zero overhead when no middleware is registered. Support global, method-scoped, and strongly-typed middleware.

**Independent Test**: Register a logging middleware on a client, send a request, verify the middleware observes both outbound request and inbound response. Verify zero overhead when no middleware registered.

### Tests for User Story 1

> **NOTE: Write these tests FIRST, ensure they FAIL before implementation**

- [X] T011 [P] [US1] Unit test for middleware execution order in packages/core/test/unit/middleware/pipeline.test.ts
- [X] T011a [P] [US1] Unit test for compile-time readonly enforcement of context.message.id in packages/core/test/unit/middleware/types.test.ts
- [X] T012 [P] [US1] Unit test for middleware context immutability (readonly id) in packages/core/test/unit/middleware/types.test.ts
- [X] T013 [P] [US1] Unit test for middleware composition in packages/core/test/unit/middleware/compose.test.ts
- [X] T014 [P] [US1] Unit test for method-scoped middleware filtering in packages/core/test/unit/middleware/scoped.test.ts
- [X] T015 [P] [US1] Unit test for typed middleware type inference in packages/core/test/unit/middleware/typed.test.ts
- [X] T016 [P] [US1] Integration test for client middleware registration in packages/client/test/unit/middleware.test.ts
- [X] T017 [P] [US1] Integration test for server middleware registration in packages/server/test/unit/middleware.test.ts
- [X] T018 [P] [US1] E2E test for middleware pipeline with multiple middleware in e2e/middleware-integration.spec.ts
- [X] T019 [P] [US1] Benchmark test for zero-overhead validation in packages/core/test/unit/middleware/benchmark.test.ts

### Implementation for User Story 1

- [X] T020 [US1] Implement MiddlewareContext and Middleware types in packages/core/src/middleware/types.ts
- [X] T021 [US1] Implement middleware pipeline execution (onion model) in packages/core/src/middleware/pipeline.ts
- [X] T022 [US1] Implement middleware composition utility (composeMiddleware) in packages/core/src/middleware/compose.ts
- [X] T023 [US1] Implement MethodFilter and ScopedMiddleware types in packages/core/src/middleware/types.ts
- [X] T024 [US1] Implement createScopedMiddleware factory in packages/core/src/middleware/scoped.ts
- [X] T025 [US1] Implement TypedMiddleware<M> with type inference in packages/core/src/middleware/typed.ts
- [X] T026 [US1] Implement createTypedMiddleware factory with method type inference in packages/core/src/middleware/typed.ts
- [X] T027 [US1] Export all middleware types and utilities from packages/core/src/middleware/index.ts
- [X] T028 [US1] Add middleware registration to LSPClient constructor options in packages/client/src/client.ts
- [X] T029 [US1] Add middleware registration to LSPServer constructor options in packages/server/src/server.ts
- [X] T030 [US1] Integrate middleware pipeline into client send(), sendRequest(), and sendNotification() paths in packages/client/src/client.ts
- [X] T031 [US1] Integrate middleware pipeline into server send(), sendRequest(), and sendNotification() paths in packages/server/src/server.ts
- [X] T032 [US1] Add middleware error handling (catch and emit via error event) in packages/core/src/middleware/pipeline.ts
- [X] T033 [US1] Document middleware API in packages/core/README.md with examples

**Checkpoint**: At this point, middleware system is fully functional with global, method-scoped, and typed middleware support. Zero overhead validated.

---

## Phase 4: User Story 2 - Native WebSocket Client (Priority: P2)

**Goal**: Replace `ws` dependency with native WebSocket for client connections, reducing dependency footprint and enabling browser environments.

**Independent Test**: Create a WebSocket client transport in Node.js >= 22.4 without `ws` installed, connect to a WebSocket server, successfully exchange LSP messages.

### Tests for User Story 2

- [X] T034 [P] [US2] Unit test for native WebSocket detection in packages/core/test/unit/transport/websocket.test.ts
- [X] T035 [P] [US2] Unit test for fallback to `ws` library when native unavailable in packages/core/test/unit/transport/websocket.test.ts
- [X] T036 [P] [US2] Unit test for error message when neither native nor `ws` available in packages/core/test/unit/transport/websocket.test.ts
- [X] T036a [P] [US2] Unit test for WebSocket error messages (Node.js < 22.4, missing ws) in packages/core/test/unit/transport/websocket.test.ts
- [X] T037 [P] [US2] Integration test for WebSocket client reconnection with native WebSocket in packages/client/test/unit/websocket-reconnect.test.ts
- [X] T038 [P] [US2] E2E test for native WebSocket client/server message exchange in e2e/websocket-native.spec.ts

### Implementation for User Story 2

- [X] T039 [US2] Implement native WebSocket detection in packages/core/src/transport/websocket.ts
- [X] T040 [US2] Implement createWebSocketClient factory with native WebSocket support in packages/core/src/transport/websocket.ts
- [X] T041 [US2] Implement fallback to `ws` library for older Node.js versions in packages/core/src/transport/websocket.ts
- [X] T042 [US2] Add clear error messages for unavailable WebSocket implementations in packages/core/src/transport/websocket.ts
- [ ] T043 [US2] Update WebSocket client transport to use new factory in packages/client/src/transports/websocket.ts
- [ ] T044 [US2] Verify reconnection logic works with native WebSocket in packages/client/src/transports/websocket.ts
- [X] T045 [US2] Update WebSocket server transport documentation to clarify `ws` requirement in packages/server/README.md
- [X] T046 [US2] Document native WebSocket support and Node.js >= 22.4 requirement in packages/core/README.md

**Checkpoint**: Native WebSocket client transport functional, `ws` removed from core dependencies, reconnection preserved.

---

## Phase 5: User Story 3 - One-Shot Notification Listening (Priority: P3)

**Goal**: Provide promise-based API for waiting on specific server notifications with optional filtering and timeout.

**Independent Test**: Call `waitForNotification('textDocument/publishDiagnostics')`, open a document, verify promise resolves with diagnostics payload.

### Tests for User Story 3

- [X] T047 [P] [US3] Unit test for NotificationWaiter promise resolution in packages/client/test/unit/notifications/wait.test.ts
- [X] T048 [P] [US3] Unit test for NotificationWaiter with filter function in packages/client/test/unit/notifications/wait.test.ts
- [X] T049 [P] [US3] Unit test for NotificationWaiter timeout rejection in packages/client/test/unit/notifications/wait.test.ts
- [X] T050 [P] [US3] Unit test for NotificationWaiter cleanup on resolution in packages/client/test/unit/notifications/wait.test.ts
- [X] T051 [P] [US3] Unit test for multiple concurrent waitForNotification calls in packages/client/test/unit/notifications/wait.test.ts
- [X] T052 [P] [US3] E2E test for waitForNotification with textDocument/publishDiagnostics in e2e/notification-wait.spec.ts

### Implementation for User Story 3

- [X] T053 [US3] Implement NotificationWaiter class in packages/client/src/notifications/wait.ts
- [X] T054 [US3] Implement waitForNotification method on LSPClient in packages/client/src/client.ts
- [X] T055 [US3] Add filter function support to NotificationWaiter in packages/client/src/notifications/wait.ts
- [X] T056 [US3] Add timeout support (required parameter) to NotificationWaiter in packages/client/src/notifications/wait.ts
- [X] T057 [US3] Implement automatic cleanup on resolution/rejection/timeout in packages/client/src/notifications/wait.ts
- [X] T058 [US3] Add disconnection handling (reject if client disconnects) in packages/client/src/notifications/wait.ts
- [X] T059 [US3] Export NotificationWaiter types from packages/client/src/notifications/index.ts
- [X] T060 [US3] Document waitForNotification API with examples in packages/client/README.md

**Checkpoint**: waitForNotification fully functional with filtering, timeout, and automatic cleanup. Multiple concurrent calls supported.

---

## Phase 6: User Story 4 - Connection Health Monitoring (Priority: P4)

**Goal**: Monitor connection state transitions, track last message timestamps, and provide optional WebSocket heartbeat monitoring (opt-in).

**Independent Test**: Connect a client, observe state change events, simulate disconnection, verify health status reflects correct state and timestamps.

### Tests for User Story 4

- [X] T061 [P] [US4] Unit test for ConnectionState enum and state transitions in packages/client/test/unit/connection/health.test.ts
- [X] T062 [P] [US4] Unit test for ConnectionHealth timestamp tracking in packages/client/test/unit/connection/health.test.ts
- [X] T063 [P] [US4] Unit test for HeartbeatStatus (opt-in) in packages/client/test/unit/connection/health.test.ts
- [X] T064 [P] [US4] Unit test for state change event emission in packages/client/test/unit/connection/health.test.ts
- [X] T065 [P] [US4] E2E test for connection health monitoring with WebSocket in e2e/connection-health.spec.ts

### Implementation for User Story 4

- [X] T066 [P] [US4] Define ConnectionState enum in packages/client/src/connection/types.ts
- [X] T067 [P] [US4] Define ConnectionHealth interface in packages/client/src/connection/types.ts
- [X] T068 [P] [US4] Define HeartbeatStatus interface in packages/client/src/connection/types.ts
- [X] T069 [US4] Implement ConnectionHealthTracker class in packages/client/src/connection/health.ts
- [X] T070 [US4] Integrate health tracking into LSPClient constructor in packages/client/src/client.ts
- [X] T071 [US4] Update timestamps on message send/receive in packages/client/src/client.ts
- [X] T072 [US4] Emit state change events on connection state transitions in packages/client/src/client.ts
- [X] T073 [US4] Implement optional WebSocket heartbeat monitoring (disabled by default) in packages/client/src/connection/heartbeat.ts
- [X] T074 [US4] Add heartbeat configuration to LSPClient options in packages/client/src/client.ts
- [X] T075 [US4] Export connection health types from packages/client/src/connection/index.ts
- [X] T076 [US4] Document connection health API with examples in packages/client/README.md

**Checkpoint**: Connection health monitoring operational with state tracking, timestamps, and optional heartbeat for WebSocket.

---

## Phase 7: User Story 5 - Server-to-Client Request Ergonomics (Priority: P5)

**Goal**: Improve ergonomics of server-to-client request handlers with type-safe parameter/return types and automatic response correlation.

**Independent Test**: Register handler for `workspace/applyEdit` on client, have server send that request, verify handler executes and response is automatically sent back.

### Tests for User Story 5

- [X] T077 [P] [US5] Unit test for typed server-to-client request handler in packages/client/test/unit/server-requests.test.ts
- [X] T078 [P] [US5] Unit test for automatic response correlation in packages/client/test/unit/server-requests.test.ts
- [X] T079 [P] [US5] Unit test for "method not found" error when no handler registered in packages/client/test/unit/server-requests.test.ts
- [X] T080 [P] [US5] Unit test for error response when handler throws in packages/client/test/unit/server-requests.test.ts

### Implementation for User Story 5

- [X] T081 [US5] Update LSPClient.onRequest to infer parameter types from method name in packages/client/src/client.ts
- [X] T082 [US5] Update LSPClient.onRequest to infer return types from method name in packages/client/src/client.ts
- [X] T083 [US5] Implement automatic "method not found" error response (JSON-RPC -32601) in packages/client/src/client.ts
- [X] T084 [US5] Implement automatic error response with JSON-RPC error object when handler throws in packages/client/src/client.ts
- [X] T085 [US5] Document server-to-client request handling with examples in packages/client/README.md

**Checkpoint**: Server-to-client requests ergonomically handled with type safety and automatic response management.

---

## Phase 8: User Story 6 - Document Change Sync Ergonomics (Priority: P6)

**Goal**: Provide ergonomic helpers for constructing document change notifications with automatic version tracking.

**Independent Test**: Use helper functions to open a document, apply incremental changes, verify emitted notifications contain correct version numbers and content change events.

### Tests for User Story 6

- [X] T086 [P] [US6] Unit test for DocumentVersionTracker class in packages/core/test/unit/utils/document.test.ts
- [X] T087 [P] [US6] Unit test for incremental change helper in packages/core/test/unit/utils/document.test.ts
- [X] T088 [P] [US6] Unit test for full document replacement helper in packages/core/test/unit/utils/document.test.ts
- [X] T089 [P] [US6] Unit test for version auto-increment in packages/core/test/unit/utils/document.test.ts

### Implementation for User Story 6

- [X] T090 [P] [US6] Implement DocumentVersionTracker class in packages/core/src/utils/document.ts
- [X] T091 [P] [US6] Implement helper for incremental text change (didChangeTextDocument) in packages/core/src/utils/document.ts
- [X] T092 [P] [US6] Implement helper for full document replacement in packages/core/src/utils/document.ts
- [X] T093 [US6] Export document helpers from packages/core/src/utils/index.ts
- [X] T094 [US6] Document document change helpers with examples in packages/core/README.md

**Checkpoint**: Document change helpers operational with automatic version tracking for incremental and full-document sync.

---

## Phase 9: Middleware Pino Package (Separate Deliverable)

**Goal**: Provide pino-based structured logging as a composable middleware (separate package, no pino dependency in core).

**Independent Test**: Install @lspeasy/middleware-pino, register on client, verify all messages are logged with structured format.

### Tests for Middleware Pino

- [X] T095 [P] [PINO] Unit test for pino logging middleware in packages/middleware/pino/test/unit/logger.test.ts
- [X] T096 [P] [PINO] Unit test for log format customization in packages/middleware/pino/test/unit/logger.test.ts

### Implementation for Middleware Pino

- [X] T097 [P] [PINO] Implement pino logging middleware in packages/middleware/pino/src/logger.ts
- [X] T098 [P] [PINO] Add configurable log levels and formatting in packages/middleware/pino/src/logger.ts
- [X] T099 [PINO] Create package.json with peer dependencies on @lspeasy/core and pino in packages/middleware/pino/package.json
- [X] T100 [PINO] Document pino middleware usage in packages/middleware/pino/README.md

**Checkpoint**: Pino middleware package complete and independently usable.

---

## Phase 10: Polish & Cross-Cutting Concerns

**Purpose**: Improvements that affect multiple user stories

- [X] T101 [P] Update main repository README.md with feature overview and links to package READMEs
- [X] T102 [P] Update CHANGELOG.md with all new features
- [ ] T103 Code cleanup and refactoring across all modified packages
- [ ] T104 [P] Add TypeScript JSDoc comments to all new public APIs
- [X] T105 [P] Run oxlint across all packages to ensure code quality
- [X] T106 [P] Run oxfmt to format all source files
- [X] T107 Run type-checking (pnpm run type-check) across all packages
- [X] T108 Run all unit tests (pnpm test) to verify implementation
- [X] T109 Run all e2e tests to verify end-to-end integration
- [ ] T110 Validate quickstart.md examples (manual or scripted verification)
- [X] T111 [P] Create migration guide for users upgrading from previous versions (N/A pre-publication)
- [ ] T112 Performance benchmarking to verify zero-overhead claim

---

## Dependencies & Execution Order

### Phase Dependencies

- **Setup (Phase 1)**: No dependencies - can start immediately
- **Foundational (Phase 2)**: Depends on Setup completion - BLOCKS all user stories
- **User Story 1 (Phase 3)**: Depends on Foundational (Phase 2) - MVP target
- **User Story 2 (Phase 4)**: Depends on Foundational (Phase 2) - Can run in parallel with US1
- **User Story 3 (Phase 5)**: Depends on Foundational (Phase 2) - Can run in parallel with US1/US2
- **User Story 4 (Phase 6)**: Depends on Foundational (Phase 2) - Can run in parallel with US1/US2/US3
- **User Story 5 (Phase 7)**: Depends on Foundational (Phase 2) - Can run in parallel with US1/US2/US3/US4
- **User Story 6 (Phase 8)**: Depends on Foundational (Phase 2) - Can run in parallel with all other stories
- **Middleware Pino (Phase 9)**: Depends on User Story 1 completion (requires middleware system)
- **Polish (Phase 10)**: Depends on all desired user stories being complete

### User Story Dependencies

| User Story 1 (P1)**: No dependencies on other stories - FOUNDATIONAL for Phase 9 (pino middleware)
- **User Story 2 (P2)**: No dependencies on other stories - Can start immediately after Phase 2
- **User Story 3 (P3)**: No dependencies on other stories - Can start immediately after Phase 2
- **User Story 4 (P4)**: No dependencies on other stories - Can start immediately after Phase 2
- **User Story 5 (P5)**: No dependencies on other stories - Can start immediately after Phase 2
- **User Story 6 (P6)**: No dependencies on other stories - Can start immediately after Phase 2
- **Middleware Pino (Phase 9)**: DEPENDS on User Story 1 completion (middleware system must exist)

### Within Each User Story

- Tests MUST be written and FAIL before implementation (test-first development per constitution)
- Type definitions before implementations
- Core logic before integrations
- Error handling after core logic
- Documentation after implementation and tests pass
- Story complete before moving to next priority

### Parallel Opportunities

- **Setup (Phase 1)**: All tasks T001-T006 can run in parallel (creating directories)
- **Foundational (Phase 2)**: Tasks T008, T009, T010 can run in parallel (package.json updates)
- **Once Foundational phase completes**: ALL user stories (US1-US6) can start in parallel if team capacity allows
- **Within each user story**: All test tasks marked [P] can run in parallel
- **Within US1**: Tasks T020-T027 (middleware types and utilities) can run in parallel initially, then T028-T033 (integrations)
- **Within US2**: Tasks T039-T042 (native WebSocket implementation) can run in parallel
- **Within US4**: Tasks T066-T068 (type definitions) can run in parallel
- **Within US6**: Tasks T090-T092 (document helper implementations) can run in parallel
- **Middleware Pino (Phase 9)**: Tasks T097-T098 can run in parallel, then T099-T100
- **Polish (Phase 10)**: Tasks T101, T102, T104, T105, T106, T111 can run in parallel (documentation and formatting)

---

## Parallel Example: User Story 1 (Middleware)

```bash
# Launch all test files for User Story 1 together:
Task T011: "Unit test for middleware execution order in packages/core/test/unit/middleware/pipeline.test.ts"
Task T012: "Unit test for middleware context immutability in packages/core/test/unit/middleware/types.test.ts"
Task T013: "Unit test for middleware composition in packages/core/test/unit/middleware/compose.test.ts"
Task T014: "Unit test for method-scoped middleware filtering in packages/core/test/unit/middleware/scoped.test.ts"
Task T015: "Unit test for typed middleware type inference in packages/core/test/unit/middleware/typed.test.ts"
# (All fail initially - as expected)

# Launch initial type/core implementations together:
Task T020: "Implement MiddlewareContext and Middleware types in packages/core/src/middleware/types.ts"
Task T021: "Implement middleware pipeline execution in packages/core/src/middleware/pipeline.ts"
Task T022: "Implement middleware composition utility in packages/core/src/middleware/compose.ts"
```

---

## Parallel Example: User Story 4 (Connection Health)

```bash
# Launch all type definitions together:
Task T066: "Define ConnectionState enum in packages/client/src/connection/types.ts"
Task T067: "Define ConnectionHealth interface in packages/client/src/connection/types.ts"
Task T068: "Define HeartbeatStatus interface in packages/client/src/connection/types.ts"
```

---

## Implementation Strategy

### MVP First (User Story 1 Only)

1. Complete Phase 1: Setup (T001-T006)
2. Complete Phase 2: Foundational (T007-T010) - CRITICAL - blocks all stories
3. Complete Phase 3: User Story 1 - Middleware System (T011-T033)
4. **STOP and VALIDATE**: Test middleware system independently, verify zero overhead
5. Deploy/demo if ready

### Incremental Delivery

1. Complete Setup + Foundational (Phases 1-2) → Foundation ready
2. Add User Story 1 (Middleware) → Test independently → Deploy/Demo (MVP!)
3. Add User Story 2 (Native WebSocket) → Test independently → Deploy/Demo
4. Add User Story 3 (Notification waiting) → Test independently → Deploy/Demo
5. Add User Story 4 (Connection health) → Test independently → Deploy/Demo
6. Add User Story 5 (Server-to-client requests) → Test independently → Deploy/Demo
7. Add User Story 6 (Document helpers) → Test independently → Deploy/Demo
8. Add Middleware Pino package → Test independently → Deploy/Demo
9. Each story adds value without breaking previous stories

### Parallel Team Strategy

With multiple developers:

1. Team completes Setup + Foundational together (Phases 1-2)
2. Once Foundational is done:
   - Developer A: User Story 1 (Middleware)
   - Developer B: User Story 2 (Native WebSocket)
   - Developer C: User Story 3 (Notification waiting)
   - Developer D: User Story 4 (Connection health)
   - Developer E: User Story 5 (Server-to-client requests)
   - Developer F: User Story 6 (Document helpers)
3. After User Story 1 completes:
   - Developer A moves to Phase 9 (Pino middleware package)
4. Stories complete and integrate independently

---

## Task Summary

- **Total Tasks**: 114
- **Setup (Phase 1)**: 6 tasks
- **Foundational (Phase 2)**: 4 tasks (CRITICAL - blocks all stories)
- **User Story 1 (Middleware)**: 24 tasks (10 tests + 14 implementation)
- **User Story 2 (Native WebSocket)**: 14 tasks (6 tests + 8 implementation)
- **User Story 3 (Notification waiting)**: 13 tasks (6 tests + 7 implementation)
- **User Story 4 (Connection health)**: 16 tasks (5 tests + 11 implementation)
- **User Story 5 (Server-to-client requests)**: 9 tasks (4 tests + 5 implementation)
- **User Story 6 (Document helpers)**: 9 tasks (4 tests + 5 implementation)
- **Middleware Pino (Phase 9)**: 6 tasks (2 tests + 4 implementation)
- **Polish (Phase 10)**: 12 tasks (documentation, quality, validation)

**Parallel Opportunities**: ~42+ tasks can run in parallel (all test files, type definitions, isolated implementations)

**Independent Test Criteria**:
- **US1**: Register logging middleware → send request → verify middleware observed both directions
- **US2**: Create WebSocket client without `ws` in Node.js >= 22.4 → connect → exchange messages
- **US3**: Call `waitForNotification('textDocument/publishDiagnostics')` → open document → verify promise resolves
- **US4**: Connect client → observe state events → simulate disconnect → verify health status correct
- **US5**: Register `workspace/applyEdit` handler → server sends request → verify handler executes and response sent
- **US6**: Use helpers to open document and apply changes → verify correct version numbers in notifications

**Suggested MVP Scope**:
- Phase 1 (Setup) + Phase 2 (Foundational) + Phase 3 (User Story 1 - Middleware)
- This delivers the core extensibility mechanism and unblocks the pino logging package (separate deliverable)
- Estimated: ~30 tasks for MVP

---

## Notes

- [P] tasks = different files, no dependencies on in-progress work
- [Story] label maps task to specific user story for traceability (e.g., [US1], [US2], [PINO])
- Each user story should be independently completable and testable
- Constitution requires test-first development: Write tests, verify they fail, implement, verify they pass
- Commit after each task or logical group
- Stop at any checkpoint to validate story independently
- Zero-overhead validation is critical for User Story 1 (benchmark test T019)
- Native WebSocket requires Node.js >= 22.4 (document in README)
- Heartbeat monitoring is opt-in (disabled by default per user clarification)
- Middleware cannot modify message `id` field (enforced via readonly type)
- Document helpers accept either explicit version or DocumentVersionTracker instance
