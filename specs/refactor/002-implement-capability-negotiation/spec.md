# Refactor 002: Eliminate Duplicate Event/Handler Management Code

## Status
- **ID**: REF-002
- **Created**: 2026-02-09
- **Status**: Draft
- **Risk Level**: Medium
- **Estimated Effort**: 2-3 days

## Overview
This refactor eliminates 380 lines of duplicate code by extracting shared utilities for event emitter management, handler registries, transport attachment, and pending request tracking from `client.ts` and `server.ts` into reusable components.

## User Stories

### US1 (P1): Shared Utilities
As a maintainer, I want shared utilities for event emission, handler registries, transport attachment, and pending request tracking so that client and server behavior stays consistent and easier to maintain.

**Acceptance Criteria**:
- Utilities exist in `packages/core/src/utils/` with unit tests.
- Only `DisposableEventEmitter` and `HandlerRegistry` are exported from the utils index.

### US2 (P2): Client Migration
As a maintainer, I want the client to use shared utilities so that behavior remains consistent while duplication is removed.

**Acceptance Criteria**:
- Client behavior remains consistent with existing tests.
- Request IDs are unique strings and timeouts are configurable.

### US3 (P3): Server Migration
As a maintainer, I want the server to use shared utilities so that behavior remains consistent while duplication is removed.

**Acceptance Criteria**:
- Server behavior remains consistent with existing tests.
- Handler registration and validation defaults remain strict unless explicitly disabled.

## Motivation

### Current Problems

The current implementation in `packages/client/src/client.ts` and `packages/server/src/server.ts` contains significant code duplication that creates maintenance burden and increases the risk of bugs:

#### 1. **Duplicate Event Emitter Management** (~80 lines duplicated)
Both client and server independently implement:
- Event listener attachment/detachment
- Event emission logic
- Disposable cleanup tracking
- Memory leak prevention patterns

**Code Smell**: The same disposable event emitter pattern is repeated in both files with identical structure but slightly different event types.

#### 2. **Duplicate Handler Registry Logic** (~120 lines duplicated)
Both client and server maintain separate but functionally identical implementations for:
- Request handler registration/unregistration
- Notification handler registration/unregistration
- Handler lookup and invocation
- Handler validation and error handling

**Code Smell**: The handler registry pattern is copy-pasted between files with only type parameter differences.

#### 3. **Duplicate Transport Attachment** (~60 lines duplicated)
Both client and server implement nearly identical logic for:
- Transport connection establishment
- Transport event listener setup
- Transport error handling
- Transport cleanup on disposal

**Code Smell**: The transport attachment logic differs only in the specific handlers being attached, not in the pattern itself.

#### 4. **Duplicate Pending Request Tracking** (~80 lines duplicated)
Both client and server maintain separate implementations for:
- Request ID generation
- Pending request storage (Map-based)
- Request timeout management
- Request resolution/rejection
- Cleanup of completed requests

**Code Smell**: The pending request tracking mechanism is identical in both files, tracking requests in a Map with the same lifecycle management.

#### 5. **Duplicate Disposal Logic** (~40 lines duplicated)
Both client and server implement their own disposal patterns for:
- Cleaning up event listeners
- Disposing transport connections
- Clearing pending requests
- Preventing use-after-disposal

**Code Smell**: The disposal orchestration follows the same pattern in both files with no semantic differences.

### Impact of Duplication

**Maintenance Burden**:
- Bug fixes must be applied in two places
- New features require parallel implementation
- Testing requires duplicate test suites
- Code reviews must check both implementations

**Inconsistency Risk**:
- Easy for implementations to diverge over time
- Bug in one file may not be fixed in the other
- Behavior differences can emerge unexpectedly

**Complexity**:
- Total of 380 lines of duplicate code
- Reduced code reusability
- Harder to understand the true abstractions

## Proposed Improvement

### Solution: Shared Utilities Architecture

Extract four reusable utility classes that encapsulate the common patterns:

#### 1. **DisposableEventEmitter<TEvents>**
- Generic event emitter with automatic cleanup
- Type-safe event emission and listening
- Disposable pattern integration
- Memory leak prevention

**Location**: `packages/core/src/utils/disposable-event-emitter.ts`

**API**:
```typescript
class DisposableEventEmitter<TEvents extends Record<string, any[]>> {
  on<K extends keyof TEvents>(event: K, listener: (...args: TEvents[K]) => void): Disposable;
  emit<K extends keyof TEvents>(event: K, ...args: TEvents[K]): void;
  dispose(): void;
}
```

#### 2. **HandlerRegistry<TRequest, TResponse>**
- Generic registry for request and notification handlers
- Type-safe handler registration and lookup
- Handler validation and error handling
- Unregistration support
- Method grouping derives from method prefix (e.g. `textDocument/`, `workspace/`) when categorization is needed

**Location**: `packages/core/src/utils/handler-registry.ts`

**API**:
```typescript
class HandlerRegistry<TRequest, TResponse> {
  register(method: string, handler: Handler<TRequest, TResponse>): Disposable;
  unregister(method: string): void;
  get(method: string): Handler<TRequest, TResponse> | undefined;
  clear(): void;
}
```

#### 3. **TransportAttachment**
- Manages transport connection lifecycle
- Sets up message and error listeners
- Handles transport disposal
- Provides reconnection hooks

**Location**: `packages/core/src/utils/transport-attachment.ts`

**API**:
```typescript
class TransportAttachment {
  attach(transport: Transport, handlers: TransportHandlers): Disposable;
  detach(): void;
  isAttached(): boolean;
}
```

#### 4. **PendingRequestTracker<TResponse>**
- Tracks in-flight requests with unique IDs
- Manages request timeouts
- Handles request resolution/rejection
- Automatic cleanup on completion

**Location**: `packages/core/src/utils/pending-request-tracker.ts`

**API**:
```typescript
class PendingRequestTracker<TResponse> {
  create(timeout?: number): { id: string; promise: Promise<TResponse> };
  resolve(id: string, response: TResponse): void;
  reject(id: string, error: Error): void;
  clear(): void;
}
```

**Timeout Defaults**:
- Default request timeout is configurable via client/server options; no hardcoded default.

**API Exposure Decision**:
- Export only `DisposableEventEmitter` and `HandlerRegistry` from `packages/core/src/utils/index.ts` for reuse.
- Keep `TransportAttachment` and `PendingRequestTracker` internal to avoid expanding the public API surface.

### Benefits

**Code Reduction**:
- Eliminates ~380 lines of duplicate code
- Reduces client.ts and server.ts by 40-50% each
- Centralizes common patterns in reusable utilities

**Maintainability**:
- Single source of truth for each pattern
- Bug fixes apply to both client and server automatically
- Easier to add new features to both components

**Testability**:
- Utilities can be tested in isolation
- Reduces test duplication
- Easier to achieve comprehensive coverage

**Type Safety**:
- Generic type parameters ensure type safety
- Compiler catches type mismatches
- Better IDE autocomplete support
- Strict parameter validation enabled by default; allow opt-out via options

## Affected Files

### Files to Create
1. `/packages/core/src/utils/disposable-event-emitter.ts` - New utility class
2. `/packages/core/src/utils/handler-registry.ts` - New utility class
3. `/packages/core/src/utils/transport-attachment.ts` - New utility class
4. `/packages/core/src/utils/pending-request-tracker.ts` - New utility class
5. `/packages/core/src/utils/index.ts` - Export barrel file

### Files to Modify
1. `/packages/client/src/client.ts` - Replace inline implementations with utilities (~190 lines removed)
2. `/packages/server/src/server.ts` - Replace inline implementations with utilities (~190 lines removed)
3. `/packages/core/src/dispatcher.ts` - May benefit from HandlerRegistry

### Test Files to Create/Modify
1. `/packages/core/test/utils/disposable-event-emitter.test.ts` - New tests
2. `/packages/core/test/utils/handler-registry.test.ts` - New tests
3. `/packages/core/test/utils/transport-attachment.test.ts` - New tests
4. `/packages/core/test/utils/pending-request-tracker.test.ts` - New tests
5. `/packages/client/test/unit/client.test.ts` - Update to verify integration
6. `/packages/server/test/unit/server.test.ts` - Update to verify integration

## Behavior Preservation Requirements

### Critical Behaviors to Maintain

1. **Event Emission Order**: Events must be emitted in the same order as before
2. **Handler Invocation**: Handlers must be called with identical parameters and context
3. **Error Propagation**: Errors must propagate through the same paths
4. **Disposal Semantics**: Disposal must clean up resources in the same order
5. **Request ID Generation**: Request IDs must remain unique; format may change to strings
6. **Timeout Behavior**: Request timeouts must behave identically
7. **Memory Management**: No new memory leaks should be introduced
8. **Thread Safety**: Any concurrent access patterns must be preserved

### Verification Strategy

1. **Unit Tests**: Comprehensive tests for each utility class
2. **Integration Tests**: Verify client and server work with new utilities
3. **Behavior Tests**: Compare before/after behavior for critical paths
4. **Performance Tests**: Ensure no performance regressions
5. **Memory Tests**: Verify no new memory leaks

## Risk Assessment

**Risk Level**: Medium

### Risks

1. **Subtle Behavior Changes**: Extraction may inadvertently change edge case behavior
   - *Mitigation*: Comprehensive test coverage before and after refactor
   - *Impact*: High (could break existing integrations)

2. **Type System Complexity**: Generic utilities may be harder to type correctly
   - *Mitigation*: Start with simple types, iterate based on usage
   - *Impact*: Medium (could cause type errors)

3. **Performance Regression**: Additional abstraction layers may impact performance
   - *Mitigation*: Benchmark critical paths before and after
   - *Impact*: Low (modern JS engines optimize well)

4. **Breaking Changes**: May expose internal APIs that consumers depend on
  - *Mitigation*: Export only `DisposableEventEmitter` and `HandlerRegistry`; keep transport and pending tracker internal
   - *Impact*: Low (utilities are internal implementation details)

### Migration Strategy

1. **Phase 1**: Create utility classes with comprehensive tests
2. **Phase 2**: Migrate client.ts to use utilities (verify all tests pass)
3. **Phase 3**: Migrate server.ts to use utilities (verify all tests pass)
4. **Phase 4**: Remove old duplicate code
5. **Phase 5**: Update dispatcher.ts if beneficial

Each phase should be a separate commit that can be reverted independently.

## Implementation Phases

### Phase 1: Create DisposableEventEmitter (2-3 hours)
- Create `disposable-event-emitter.ts`
- Implement generic event emitter with disposable pattern
- Write comprehensive unit tests
- Verify memory leak prevention

### Phase 2: Create HandlerRegistry (2-3 hours)
- Create `handler-registry.ts`
- Implement generic handler registration and lookup
- Write comprehensive unit tests
- Verify error handling

### Phase 3: Create TransportAttachment (2-3 hours)
- Create `transport-attachment.ts`
- Implement transport lifecycle management
- Write comprehensive unit tests
- Verify cleanup behavior

### Phase 4: Create PendingRequestTracker (2-3 hours)
- Create `pending-request-tracker.ts`
- Implement request tracking with timeouts
- Write comprehensive unit tests
- Verify timeout and cleanup behavior

### Phase 5: Migrate client.ts (3-4 hours)
- Replace inline event emitter with DisposableEventEmitter
- Replace inline handler registry with HandlerRegistry
- Replace inline transport attachment with TransportAttachment
- Replace inline pending request tracking with PendingRequestTracker
- Run all client tests and verify behavior
- Remove ~190 lines of duplicate code

### Phase 6: Migrate server.ts (3-4 hours)
- Replace inline event emitter with DisposableEventEmitter
- Replace inline handler registry with HandlerRegistry
- Replace inline transport attachment with TransportAttachment
- Replace inline pending request tracking with PendingRequestTracker
- Run all server tests and verify behavior
- Remove ~190 lines of duplicate code

### Phase 7: Verify and Optimize (2-3 hours)
- Run full test suite
- Benchmark critical paths
- Check for memory leaks
- Update documentation
- Consider migrating dispatcher.ts if beneficial

## Success Criteria

1. **Code Reduction**: Remove at least 360 lines of duplicate code (95% of identified duplication)
2. **Test Coverage**: Maintain or improve test coverage (target: 95%+)
3. **Behavior Preservation**: All existing tests pass without modification
4. **No Performance Regression**: Critical paths perform within 5% of baseline
5. **No Memory Leaks**: Memory tests pass with no new leaks detected
6. **Type Safety**: No loss of type safety, all generic types work correctly
7. **Documentation**: All new utilities are documented with examples

## Rollback Plan

Each phase is isolated and can be rolled back independently:
- Revert the specific commit for the phase
- No breaking changes to public APIs
- Utilities are internal implementation details

If critical issues are discovered:
1. Revert the problematic phase commit
2. Fix the issue in the utility class
3. Re-apply the migration after verification

## Related Work

- **REF-001**: Migrate LSP protocol types generation (completed)
- **REF-003**: Standardize error handling patterns (planned)
- **REF-004**: Extract connection lifecycle management (planned)

## References

- Duplicate code analysis: Internal code review (2026-02-09)
- Design patterns: Disposable pattern, Registry pattern, Proxy pattern
- Related refactorings: Extract Class, Replace Conditional with Polymorphism

## Clarifications

### Session 2026-02-09
- Q: Should the new utilities be exported as part of the public core API? → A: Export only `DisposableEventEmitter` and `HandlerRegistry`.
- Q: Request ID format? → A: Use UUID/string request IDs; backward compatibility is not a priority.
- Q: Default request timeout? → A: Make it configurable via client/server options.
- Q: How should method categories be derived? → A: Use method prefix (e.g. `textDocument/`, `workspace/`).
- Q: Validation strictness default? → A: Strict validation by default; allow opt-out via options.
