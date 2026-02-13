# Tasks: LSP Protocol Compliance Gaps

**Input**: Design documents from `/specs/003-lsp-protocol-compliance/`
**Prerequisites**: plan.md (required), spec.md (required for user stories), research.md, data-model.md, contracts/

**Tests**: This feature follows test-first development per constitution and spec intent. Write tests first and verify they fail before implementation.

**Organization**: Tasks are grouped by user story to enable independent implementation and testing of each story.

## Format: `[ID] [P?] [Story] Description`

- **[P]**: Can run in parallel (different files, no dependencies)
- **[Story]**: Which user story this task belongs to (e.g., US1, US2)
- Every task includes an exact file path

---

## Phase 1: Setup (Shared Infrastructure)

**Purpose**: Create test and contract scaffolding for protocol-compliance workstreams.

- [X] T001 Create feature documentation index links in specs/003-lsp-protocol-compliance/plan.md
- [X] T002 [P] Create transport test scaffolds in packages/core/test/unit/transport/tcp.test.ts and packages/core/test/unit/transport/worker.test.ts
- [X] T003 [P] Create dynamic registration test scaffold in packages/client/test/unit/dynamic-registration.test.ts
- [X] T004 [P] Create partial result streaming test scaffold in packages/client/test/unit/partial-results.test.ts
- [X] T005 [P] Create notebook sync test scaffold in packages/server/test/unit/notebook-sync.test.ts and packages/client/test/unit/notebook-sync.test.ts
- [X] T006 [P] Create e2e scenario files in e2e/transport-tcp.spec.ts, e2e/transport-dedicated-worker.spec.ts, e2e/transport-shared-worker.spec.ts, e2e/partial-results.spec.ts, and e2e/notebook-sync.spec.ts

---

## Phase 2: Foundational (Blocking Prerequisites)

**Purpose**: Establish shared primitives and exports required by all stories.

**⚠️ CRITICAL**: No user story work should be completed before this phase is done.

- [X] T007 Add shared dynamic registration types in packages/core/src/protocol/dynamic-registration.ts
- [X] T008 [P] Add partial result outcome types in packages/core/src/protocol/partial-results.ts
- [X] T009 [P] Add worker transport base event type definitions in packages/core/src/transport/worker-types.ts
- [X] T010 Create registration store utility skeleton in packages/client/src/connection/registration-store.ts
- [X] T011 [P] Export new protocol and transport types from packages/core/src/index.ts
- [X] T012 [P] Add client-side API type placeholders for new features in packages/client/src/types.ts
- [X] T013 [P] Add server-side notebook namespace type placeholders in packages/server/src/types.ts
- [X] T014 Add changelog entry stub for feature scope in CHANGELOG.md

**Checkpoint**: Shared model/types are in place and user stories can proceed independently.

---

## Phase 3: User Story 1 - Dynamic Capability Registration (Priority: P1) 🎯 MVP

**Goal**: Support `client/registerCapability` and `client/unregisterCapability` with strict-by-default behavior and runtime capability visibility.

**Independent Test**: Send register/unregister requests after initialization and verify merged runtime capability view updates correctly, including selector scoping and strict rejection behavior.

### Tests for User Story 1

- [X] T015 [P] [US1] Add register capability success test in packages/client/test/unit/dynamic-registration.test.ts
- [X] T016 [P] [US1] Add unregister capability success test in packages/client/test/unit/dynamic-registration.test.ts
- [X] T017 [P] [US1] Add unknown unregister ID error test (`-32602`) in packages/client/test/unit/dynamic-registration.test.ts
- [X] T018 [P] [US1] Add strict mode rejection test for unsupported dynamic registration in packages/client/test/unit/dynamic-registration.test.ts
- [X] T019 [P] [US1] Add compatibility-mode acceptance test in packages/client/test/unit/dynamic-registration.test.ts
- [X] T020 [P] [US1] Add document-selector scope test in packages/client/test/unit/dynamic-registration.test.ts
- [X] T021 [P] [US1] Add e2e dynamic registration flow test in e2e/dynamic-registration.spec.ts

### Implementation for User Story 1

- [X] T022 [US1] Implement registration store CRUD and merge logic in packages/client/src/connection/registration-store.ts
- [X] T023 [US1] Handle `client/registerCapability` request in packages/client/src/client.ts
- [X] T024 [US1] Handle `client/unregisterCapability` request and `-32602` unknown ID behavior in packages/client/src/client.ts
- [X] T025 [US1] Add strict/compatibility toggle wiring in packages/client/src/types.ts and packages/client/src/client.ts
- [X] T026 [US1] Integrate dynamic registrations into runtime capability resolution in packages/client/src/capability-proxy.ts
- [X] T027 [US1] Expose runtime merged capability query API in packages/client/src/client.ts
- [X] T028 [US1] Document dynamic registration behavior in packages/client/README.md
- [X] T028a [US1] Add JSON-RPC schema validation for register/unregister handlers in packages/client/src/client.ts
- [X] T028b [US1] Add schema-validation unit tests for register/unregister paths in packages/client/test/unit/dynamic-registration.test.ts

**Checkpoint**: Dynamic registration/unregistration is functional and independently testable.

---

## Phase 4: User Story 2 - Transport Breadth (TCP + Worker) (Priority: P2)

**Goal**: Add TCP, Dedicated Worker, and Shared Worker transport implementations with correct ordering, correlation, and failure semantics.

**Independent Test**: Validate full LSP sessions over TCP and worker transports, including TCP multi-connection rule and Shared Worker per-port isolation.

### Tests for User Story 2

- [X] T029 [P] [US2] Add TCP client connect/message flow test in packages/core/test/unit/transport/tcp.test.ts
- [X] T030 [P] [US2] Add TCP server-mode single-active-connection rejection test in packages/core/test/unit/transport/tcp.test.ts
- [X] T031 [P] [US2] Add TCP reconnect backoff test in packages/core/test/unit/transport/tcp.test.ts
- [X] T032 [P] [US2] Add TCP partial message reassembly test in packages/core/test/unit/transport/tcp.test.ts
- [X] T033 [P] [US2] Add Dedicated Worker ordered delivery test in packages/core/test/unit/transport/worker.test.ts
- [X] T034 [P] [US2] Add Shared Worker request correlation per client/port test in packages/core/test/unit/transport/worker.test.ts
- [X] T035 [P] [US2] Add Shared Worker handoff/activation failure test in packages/core/test/unit/transport/worker.test.ts
- [X] T036 [P] [US2] Add e2e TCP session test in e2e/transport-tcp.spec.ts
- [X] T037 [P] [US2] Add e2e Dedicated Worker session test in e2e/transport-dedicated-worker.spec.ts
- [X] T038 [P] [US2] Add e2e Shared Worker multi-client isolation test in e2e/transport-shared-worker.spec.ts

### Implementation for User Story 2

- [X] T039 [US2] Implement TCP transport in packages/core/src/transport/tcp.ts
- [X] T040 [US2] Implement Dedicated Worker transport in packages/core/src/transport/dedicated-worker.ts
- [X] T041 [US2] Implement Shared Worker transport with per-port routing isolation in packages/core/src/transport/shared-worker.ts
- [X] T042 [US2] Add worker transport shared primitives in packages/core/src/transport/worker-types.ts
- [X] T043 [US2] Export TCP and worker transports from packages/core/src/index.ts
- [X] T044 [US2] Add transport documentation and usage examples in packages/core/README.md
- [X] T044a [US2] Add transport ingress JSON-RPC schema validation in packages/core/src/transport/tcp.ts and packages/core/src/transport/shared-worker.ts
- [X] T044b [US2] Verify built-in-only dependency usage for TCP/worker transports in packages/core/package.json and pnpm-lock.yaml

**Checkpoint**: TCP and worker transports are independently usable and validated.

---

## Phase 5: User Story 3 - Node.js IPC Transport (Priority: P3)

**Goal**: Ensure IPC transport fully supports parent/child usage and robust close/error semantics.

**Independent Test**: Fork a child process with IPC channel, run initialize/request/shutdown, and verify close behavior on unexpected exit and explicit disconnect.

### Tests for User Story 3

- [X] T045 [P] [US3] Add parent-side IPC message flow test in packages/core/test/unit/transport/ipc.test.ts
- [X] T046 [P] [US3] Add child-side IPC message flow test in packages/core/test/unit/transport/ipc.test.ts
- [X] T047 [P] [US3] Add child exit close-event test in packages/core/test/unit/transport/ipc.test.ts
- [X] T048 [P] [US3] Add explicit close() resource-release test in packages/core/test/unit/transport/ipc.test.ts
- [X] T049 [P] [US3] Add e2e IPC session test in e2e/transport-ipc.spec.ts

### Implementation for User Story 3

- [X] T050 [US3] Implement/complete IPC transport contract in packages/core/src/transport/ipc.ts
- [X] T051 [US3] Integrate IPC transport export path in packages/core/src/index.ts
- [X] T052 [US3] Add IPC transport guidance and constraints in packages/core/README.md
- [X] T052a [US3] Verify built-in-only dependency usage for IPC transport in packages/core/package.json and pnpm-lock.yaml

**Checkpoint**: IPC transport behavior is complete and independently testable.

---

## Phase 6: User Story 4 - Partial Result Streaming (Priority: P4)

**Goal**: Add client/server partial result ergonomics with ordered aggregation and structured cancellation results.

**Independent Test**: Send request with `partialResultToken`, stream batches through `$/progress`, verify callback streaming, ordered aggregate, and cancellation result shape.

### Tests for User Story 4

- [X] T053 [P] [US4] Add partial callback invocation-per-batch test in packages/client/test/unit/partial-results.test.ts
- [X] T054 [P] [US4] Add ordered aggregation test in packages/client/test/unit/partial-results.test.ts
- [X] T055 [P] [US4] Add cancellation structured-result test in packages/client/test/unit/partial-results.test.ts
- [X] T056 [P] [US4] Add late-partial-after-final ignored test in packages/client/test/unit/partial-results.test.ts
- [X] T057 [P] [US4] Add server helper emission test in packages/server/test/unit/partial-results.test.ts
- [X] T058 [P] [US4] Add e2e partial result streaming test in e2e/partial-results.spec.ts
- [X] T058a [P] [US4] Add backward-compat test for requests without partialResultToken in packages/client/test/unit/partial-results.test.ts

### Implementation for User Story 4

- [X] T059 [US4] Implement partial result collector in packages/client/src/connection/partial-result-collector.ts
- [X] T060 [US4] Implement `sendRequestWithPartialResults` API in packages/client/src/client.ts
- [X] T061 [US4] Wire `$/progress` token routing to collector in packages/client/src/client.ts
- [X] T062 [US4] Implement structured cancellation outcome types in packages/core/src/protocol/partial-results.ts
- [X] T063 [US4] Implement server partial-result sender helper in packages/server/src/progress/partial-result-sender.ts
- [X] T064 [US4] Export partial result APIs in packages/client/src/index.ts and packages/server/src/index.ts
- [X] T065 [US4] Document partial streaming APIs in packages/client/README.md and packages/server/README.md

**Checkpoint**: Partial result streaming is functional with deterministic ordering and cancellation semantics.

---

## Phase 7: User Story 5 - Notebook Document Sync Ergonomics (Priority: P5)

**Goal**: Provide ergonomic notebook document namespace APIs for client send and server handler registration.

**Independent Test**: Use notebook namespace methods for open/change/save/close and verify server receives matching notifications with expected payloads.

### Tests for User Story 5

- [X] T066 [P] [US5] Add client notebook namespace method tests in packages/client/test/unit/notebook-sync.test.ts
- [X] T067 [P] [US5] Add server notebook handler registration tests in packages/server/test/unit/notebook-sync.test.ts
- [X] T068 [P] [US5] Add notebook structural+content combined change test in packages/server/test/unit/notebook-sync.test.ts
- [X] T069 [P] [US5] Add e2e notebook sync flow test in e2e/notebook-sync.spec.ts

### Implementation for User Story 5

- [X] T070 [US5] Implement client notebook namespace convenience methods in packages/client/src/client.ts
- [X] T071 [US5] Implement server notebook namespace handler ergonomics in packages/server/src/server.ts
- [X] T072 [US5] Add notebook sync capability declaration typing in packages/core/src/protocol/capabilities.ts
- [X] T073 [US5] Export notebook namespace typings in packages/client/src/index.ts and packages/server/src/index.ts
- [X] T074 [US5] Document notebook namespace usage in packages/client/README.md and packages/server/README.md

**Checkpoint**: Notebook sync namespace APIs are ergonomic and independently testable.

---

## Phase 8: Polish & Cross-Cutting Concerns

**Purpose**: Final hardening, docs, and validation across stories.

- [X] T075 [P] Update feature docs with transport matrix and compatibility notes in docs/ARCHITECTURE.md and docs/EXAMPLES.md
- [X] T076 [P] Add API docs for new public contracts in docs/API.md
- [X] T077 Perform code cleanup/refactor pass across packages/core/src and packages/client/src and packages/server/src
- [X] T078 [P] Add/verify TSDoc comments for all newly exported APIs in packages/core/src, packages/client/src, and packages/server/src
- [X] T079 Run lint and fix issues with pnpm run lint from package.json
- [X] T080 Run type-check verification with pnpm run type-check from package.json
- [X] T081 Run test verification with pnpm test from package.json
- [X] T081a Run coverage verification with pnpm test:coverage and enforce >=80% for core packages
- [X] T081b Document coverage results and threshold check in specs/003-lsp-protocol-compliance/quickstart.md
- [X] T082 Validate quickstart scenarios in specs/003-lsp-protocol-compliance/quickstart.md

---

## Dependencies & Execution Order

### Phase Dependencies

- **Phase 1 (Setup)**: No dependencies
- **Phase 2 (Foundational)**: Depends on Phase 1 and blocks all user stories
- **Phase 3 (US1)**: Depends on Phase 2; establishes MVP
- **Phase 4 (US2)**: Depends on Phase 2; can run parallel with US3/US4/US5 after foundation
- **Phase 5 (US3)**: Depends on Phase 2
- **Phase 6 (US4)**: Depends on Phase 2
- **Phase 7 (US5)**: Depends on Phase 2
- **Phase 8 (Polish)**: Depends on completion of desired user stories

### User Story Dependencies

- **US1 (P1)**: No dependency on other stories (MVP anchor)
- **US2 (P2)**: Independent of US1 implementation, shares foundation only
- **US3 (P3)**: Independent of US1/US2, shares transport interfaces from foundation
- **US4 (P4)**: Independent of transport stories, depends on client/server runtime hooks from foundation
- **US5 (P5)**: Independent of US2/US3/US4, depends on core protocol typing exports from foundation

### Within Each Story

- Tests first (fail) → implementation → exports/docs → independent verification

---

## Parallel Opportunities

- **Setup**: T002–T006 can run in parallel.
- **Foundational**: T008, T009, T011, T012, T013 can run in parallel after T007 starts.
- **US1**: T015–T021 parallel test authoring; T025 and T026 can proceed in parallel after T022–T024.
- **US2**: T029–T038 parallel test authoring; T040 and T041 can run in parallel after shared worker type primitives (T042) are defined.
- **US3**: T045–T049 parallel test authoring; implementation T050–T052 sequential light chain.
- **US4**: T053–T058 parallel test authoring; T062 and T063 can run in parallel with collector implementation.
- **US5**: T066–T069 parallel tests; T070 and T071 can run in parallel.
- **Polish**: T075, T076, T078 can run in parallel before final validation commands.

---

## Parallel Example: User Story 2

```bash
# Parallel test work for transport breadth:
Task: "T029 [US2] Add TCP client connect/message flow test in packages/core/test/unit/transport/tcp.test.ts"
Task: "T033 [US2] Add Dedicated Worker ordered delivery test in packages/core/test/unit/transport/worker.test.ts"
Task: "T034 [US2] Add Shared Worker request correlation per client/port test in packages/core/test/unit/transport/worker.test.ts"
Task: "T037 [US2] Add e2e Dedicated Worker session test in e2e/transport-dedicated-worker.spec.ts"
```

## Parallel Example: User Story 4

```bash
# Parallel partial-result API and server helper work after tests exist:
Task: "T059 [US4] Implement partial result collector in packages/client/src/connection/partial-result-collector.ts"
Task: "T062 [US4] Implement structured cancellation outcome types in packages/core/src/protocol/partial-results.ts"
Task: "T063 [US4] Implement server partial-result sender helper in packages/server/src/progress/partial-result-sender.ts"
```

---

## Implementation Strategy

### MVP First (US1)

1. Complete Phase 1 and Phase 2.
2. Deliver US1 (dynamic registration) end-to-end.
3. Validate US1 independently before expanding to transport breadth.

### Incremental Delivery

1. Foundation complete.
2. US1 (MVP protocol compliance gap closure).
3. US2 + US3 (transport breadth completion: TCP/Worker + IPC).
4. US4 (partial results ergonomics).
5. US5 (notebook sync ergonomics).
6. Polish and full-suite validation.

### Multi-Developer Parallel Strategy

1. Team finishes Phase 1 + 2 together.
2. Assign independent story tracks:
   - Dev A: US1
   - Dev B: US2
   - Dev C: US3
   - Dev D: US4
   - Dev E: US5
3. Merge story branches after each independent checkpoint passes.
