---

description: "Task list for REF-002 shared utilities refactor"
---

# Tasks: Eliminate Duplicate Event/Handler Management Code

**Input**: Design documents from `/specs/refactor/002-implement-capability-negotiation/`
**Prerequisites**: plan.md (required), spec.md (required), research.md, data-model.md, contracts/

**Tests**: Required by constitution and explicitly listed in spec.md; write tests first and ensure they fail before implementation.

**Organization**: Tasks grouped by user story for independent implementation and testing.

## Format: `[ID] [P?] [Story] Description`

- **[P]**: Can run in parallel (different files, no dependencies)
- **[Story]**: Which user story this task belongs to (e.g., US1, US2, US3)
- Include exact file paths in descriptions

## Phase 1: Setup (Shared Infrastructure)

**Purpose**: Establish baseline understanding and shared scaffolding

- [ ] T001 Review duplication hotspots in packages/core/src/client.ts and packages/core/src/server.ts
- [ ] T002 [P] Confirm utility export surface in packages/core/src/utils/index.ts (create file if missing)

---

## Phase 2: Foundational (Blocking Prerequisites)

**Purpose**: Shared prerequisites for all user stories

- [ ] T003 Create or update packages/core/src/utils/index.ts to export DisposableEventEmitter and HandlerRegistry
- [ ] T004 [P] Add utils test directory structure under packages/core/tests/utils/ (create folder and placeholder if needed)

**Checkpoint**: Foundations ready for utility implementations

---

## Phase 3: User Story 1 - Shared Utilities (Priority: P1) 🎯 MVP

**Goal**: Provide reusable, tested utilities for event emission, handler registry, transport attachment, and pending request tracking.

**Independent Test**: `pnpm run test:unit` and utils unit tests pass for the four utility classes.

### Tests for User Story 1 (REQUIRED)

- [ ] T005 [P] [US1] Add unit tests for DisposableEventEmitter in packages/core/tests/utils/disposable-event-emitter.test.ts
- [ ] T006 [P] [US1] Add unit tests for HandlerRegistry in packages/core/tests/utils/handler-registry.test.ts
- [ ] T007 [P] [US1] Add unit tests for TransportAttachment in packages/core/tests/utils/transport-attachment.test.ts
- [ ] T008 [P] [US1] Add unit tests for PendingRequestTracker in packages/core/tests/utils/pending-request-tracker.test.ts

### Implementation for User Story 1

- [ ] T009 [P] [US1] Implement DisposableEventEmitter in packages/core/src/utils/disposable-event-emitter.ts with TSDoc
- [ ] T010 [P] [US1] Implement HandlerRegistry in packages/core/src/utils/handler-registry.ts with TSDoc and prefix grouping
- [ ] T011 [P] [US1] Implement TransportAttachment in packages/core/src/utils/transport-attachment.ts with TSDoc
- [ ] T012 [P] [US1] Implement PendingRequestTracker in packages/core/src/utils/pending-request-tracker.ts using string IDs
- [ ] T013 [US1] Wire utils exports in packages/core/src/utils/index.ts (export only DisposableEventEmitter and HandlerRegistry)

**Checkpoint**: Utilities are tested, exported appropriately, and ready for consumption

---

## Phase 4: User Story 2 - Migrate Client (Priority: P2)

**Goal**: Replace client duplication with shared utilities while preserving behavior.

**Independent Test**: client tests pass and client workflows run without behavior changes.

### Tests for User Story 2 (REQUIRED)

- [ ] T014 [P] [US2] Update client integration tests in packages/core/tests/client.test.ts for new utilities behavior

### Implementation for User Story 2

- [ ] T015 [US2] Refactor packages/core/src/client.ts to use DisposableEventEmitter
- [ ] T016 [US2] Refactor packages/core/src/client.ts to use HandlerRegistry
- [ ] T017 [US2] Refactor packages/core/src/client.ts to use TransportAttachment
- [ ] T018 [US2] Refactor packages/core/src/client.ts to use PendingRequestTracker with configurable timeouts

**Checkpoint**: Client behavior preserved with shared utilities

---

## Phase 5: User Story 3 - Migrate Server (Priority: P3)

**Goal**: Replace server duplication with shared utilities while preserving behavior.

**Independent Test**: server tests pass and handler registration flows behave as before.

### Tests for User Story 3 (REQUIRED)

- [ ] T019 [P] [US3] Update server integration tests in packages/core/tests/server.test.ts for new utilities behavior

### Implementation for User Story 3

- [ ] T020 [US3] Refactor packages/core/src/server.ts to use DisposableEventEmitter
- [ ] T021 [US3] Refactor packages/core/src/server.ts to use HandlerRegistry
- [ ] T022 [US3] Refactor packages/core/src/server.ts to use TransportAttachment
- [ ] T023 [US3] Refactor packages/core/src/server.ts to use PendingRequestTracker with configurable timeouts

**Checkpoint**: Server behavior preserved with shared utilities

---

## Phase 6: Polish & Cross-Cutting Concerns

**Purpose**: Cross-story validation, cleanup, and documentation updates

- [ ] T024 [P] Update docs/DEVELOPMENT.md to mention shared utilities and test locations
- [ ] T025 Run quickstart validation steps from specs/refactor/002-implement-capability-negotiation/quickstart.md
- [ ] T026 [P] Remove leftover duplicate helper code from packages/core/src/client.ts and packages/core/src/server.ts

---

## Dependencies & Execution Order

### Phase Dependencies

- **Setup (Phase 1)**: No dependencies
- **Foundational (Phase 2)**: Depends on Setup completion
- **User Story 1 (Phase 3)**: Depends on Foundational completion
- **User Story 2 (Phase 4)**: Depends on User Story 1 completion
- **User Story 3 (Phase 5)**: Depends on User Story 1 completion
- **Polish (Phase 6)**: Depends on User Stories 1-3 completion

### User Story Dependencies

- **US1**: No dependencies beyond foundation
- **US2**: Depends on US1 utilities
- **US3**: Depends on US1 utilities

### Parallel Opportunities

- Utilities tests (T005-T008) can run in parallel
- Utility implementations (T009-T012) can run in parallel
- Client and server migrations (US2, US3) can proceed in parallel after US1

---

## Parallel Example: User Story 1

```bash
# Launch unit tests for utilities together
Task: "Add unit tests for DisposableEventEmitter in packages/core/tests/utils/disposable-event-emitter.test.ts"
Task: "Add unit tests for HandlerRegistry in packages/core/tests/utils/handler-registry.test.ts"
Task: "Add unit tests for TransportAttachment in packages/core/tests/utils/transport-attachment.test.ts"
Task: "Add unit tests for PendingRequestTracker in packages/core/tests/utils/pending-request-tracker.test.ts"

# Implement utilities in parallel
Task: "Implement DisposableEventEmitter in packages/core/src/utils/disposable-event-emitter.ts"
Task: "Implement HandlerRegistry in packages/core/src/utils/handler-registry.ts"
Task: "Implement TransportAttachment in packages/core/src/utils/transport-attachment.ts"
Task: "Implement PendingRequestTracker in packages/core/src/utils/pending-request-tracker.ts"
```

---

## Implementation Strategy

### MVP First (User Story 1 Only)

1. Complete Setup + Foundational phases
2. Implement and test shared utilities (US1)
3. Validate utilities in isolation
4. **STOP and VALIDATE** before migrating client/server

### Incremental Delivery

1. Complete Setup + Foundational
2. Implement US1 utilities and tests
3. Migrate client (US2) and validate
4. Migrate server (US3) and validate
5. Finish polish tasks
