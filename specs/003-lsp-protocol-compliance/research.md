# Research: LSP Protocol Compliance Gaps

**Date**: 2026-02-12  
**Spec**: [spec.md](./spec.md)

## Decision 1: Dynamic registration strictness model

- **Decision**: Enforce strict behavior by default for unsupported dynamic registration, with an explicit opt-in compatibility mode.
- **Rationale**: Matches LSP compliance expectations while preserving interoperability for non-conformant servers.
- **Alternatives considered**:
  - Always strict reject: most compliant, but hurts compatibility.
  - Always accept: improves compatibility, weakens protocol guarantees.
  - Ad hoc per-capability behavior: inconsistent and hard to test.

## Decision 2: Unknown unregister registration ID error

- **Decision**: Return JSON-RPC `InvalidParams` (`-32602`) when `client/unregisterCapability` references an unknown ID.
- **Rationale**: The request shape is syntactically valid but semantically invalid for current client state.
- **Alternatives considered**:
  - `MethodNotFound` (`-32601`): incorrect category (method exists).
  - Silent success: hides protocol/state mismatches.
  - Generic server error: less precise for callers and tests.

## Decision 3: TCP server-mode multi-connection behavior

- **Decision**: Accept only the first active incoming connection; reject additional connections until the active one closes.
- **Rationale**: LSP sessions are typically 1:1; deterministic behavior simplifies resource and state handling.
- **Alternatives considered**:
  - Queue additional connections: more complexity, little value for protocol semantics.
  - Replace existing with newest: breaks active session unexpectedly.
  - Configurable queue/reject: more flexible but unnecessary for this scope.

## Decision 4: Worker transport scope

- **Decision**: Include both `DedicatedWorkerTransport` and `SharedWorkerTransport` in this feature scope.
- **Rationale**: Browser-hosted servers are first-class deployment targets; transport breadth objective explicitly includes worker scenarios.
- **Alternatives considered**:
  - Defer both worker transports: leaves browser gap unresolved.
  - Include dedicated worker only: incomplete for shared server hosting pattern.

## Decision 5: Shared worker routing guarantees

- **Decision**: Isolate request/response routing per client `MessagePort` and preserve request ID correlation.
- **Rationale**: Prevents cross-client leakage and enforces correctness in multi-client shared-worker topology.
- **Alternatives considered**:
  - Global shared queue: risks misrouting under concurrency.
  - Single-client shared worker assumption: unrealistic and brittle.

## Decision 6: Shared worker handoff/activation failures

- **Decision**: Emit clear error, transition transport to unavailable/closed state, reject subsequent sends until reinitialized.
- **Rationale**: Fail-fast behavior provides deterministic recovery contract.
- **Alternatives considered**:
  - Silent retry loops: obscures failure source and complicates observability.
  - Auto-reinitialize without signaling: surprising behavior for callers.

## Decision 7: Partial result aggregation behavior

- **Decision**: Preserve partial batches in arrival order; append/merge final response payload when present.
- **Rationale**: Aligns with streaming expectations and deterministic test assertions.
- **Alternatives considered**:
  - Replace partials with final: discards incremental value.
  - Deduplicate/reorder automatically: can change semantic ordering.

## Decision 8: Partial-result cancellation return shape

- **Decision**: Resolve with structured cancellation result: `{ cancelled: true, partialResults, finalResult?: undefined }`.
- **Rationale**: Ensures callers receive accumulated data in a stable, typed shape without overloading error channels.
- **Alternatives considered**:
  - Reject with error + side-effect callback data: fragmented API semantics.
  - Wait for final response post-cancel: violates cancellation intent.

## Decision 9: Implementation boundaries in monorepo

- **Decision**: Keep transport primitives in `packages/core`, client runtime registration/partial APIs in `packages/client`, and server notebook helpers in `packages/server`.
- **Rationale**: Preserves package responsibilities and constitution DAG expectations.
- **Alternatives considered**:
  - Centralize all logic in client package: weak reuse and architecture drift.
  - Introduce new transport package now: unnecessary package churn for current scope.
