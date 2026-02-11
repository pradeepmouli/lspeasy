# Refactor Spec: Refactor Client/Server to Use Shared Utilities

**Refactor ID**: refactor-002
**Branch**: `refactor/002-shared-utilities`
**Created**: 2026-02-09
**Type**: [x] Maintainability | [x] Architecture | [x] Tech Debt
**Impact**: [x] Medium Risk
**Status**: [x] Planning | [ ] Baseline Captured | [ ] In Progress | [ ] Validation | [ ] Complete

## Input
User description: "Eliminate 380 lines of duplicate code (68% reduction) by refactoring client and server to use shared utilities: DisposableEventEmitter, HandlerRegistry, TransportAttachment, PendingRequestTracker"

## Motivation

### Current State Problems
**Code Smell(s)**:
- [x] Duplication (DRY violation)
- [x] Tight Coupling
- [x] God Object/Class (too many responsibilities)

**Concrete Examples**:
1. **Duplicated Event Handling** (54 lines duplicate):
   - `/packages/client/src/client.ts` lines 352-393: Client implements onConnected/onDisconnected/onError with identical EventEmitter subscription patterns
   - `/packages/server/src/server.ts` lines 361-405: Server implements onListening/onShutdown/onError with identical EventEmitter subscription patterns
   - Pattern: Both create Disposable wrappers around EventEmitter.on/off in the exact same way (6 methods total)

2. **Duplicated Handler Registration** (30+ lines duplicate):
   - `/packages/client/src/client.ts` lines 60-67, 312-343: Client maintains `requestHandlers` and `notificationHandlers` Maps with identical add/remove/dispose logic
   - `/packages/server/src/server.ts` lines 103-148, 159-204: Server uses dispatcher which internally maintains handler Maps with similar patterns
   - Pattern: Both use `Map<string, Handler>` with Disposable cleanup, but implemented separately

3. **Duplicated Transport Lifecycle** (40+ lines duplicate):
   - `/packages/client/src/client.ts` lines 120-132, 188-210, 604-630: Client attaches transport with onMessage/onError/onClose handlers, stores disposables, and cleans up on close
   - `/packages/server/src/server.ts` lines 283-300, 320-357: Server attaches transport with same three handlers and manages disposable cleanup
   - Pattern: Both implement attach (store transport + subscribe to 3 events) and detach (dispose subscriptions + clear transport) separately

4. **Duplicated Request Tracking** (80+ lines duplicate):
   - `/packages/client/src/client.ts` lines 60-67, 220-285, 479-498, 620-627: Client tracks pending requests with resolve/reject/cancel logic, manages cancellation tokens
   - `/packages/server/src/server.ts` lines 51-52, 320-357: Server tracks cancellation tokens separately
   - Pattern: Request ID tracking, promise management, cancellation handling could be unified

5. **Duplicated Disposable Management** (throughout both files):
   - Both maintain arrays of disposables (`transportDisposables` in client, `disposables` in server)
   - Both implement manual dispose loops
   - Pattern: Could use existing DisposableStore from `/packages/core/src/utils/disposable.ts`

**Total Duplication**: Approximately 380 lines across 5 patterns representing 67.86% duplication rate between client and server implementations.

### Business/Technical Justification
[x] Developer velocity impact - Changes to lifecycle management must be made in both places
[x] Causing frequent bugs - Inconsistent behavior between client and server error handling
[x] Technical debt accumulation - Each new feature duplicates more code
[x] Blocking new features - Cannot easily add shared transport middleware

**Why is this refactoring needed NOW?**
- Current refactor-001 is modernizing the protocol layer; refactor-002 should follow to modernize the implementation layer
- 65 existing tests provide safety net for behavior preservation
- Further features (connection retry, middleware, telemetry) will compound duplication if not addressed

## Proposed Improvement

### Refactoring Pattern/Technique
**Primary Techniques**: 
- Extract Class (for event emitter, handler registry, transport attachment, request tracker)
- Replace Temp with Query (for repeated disposable patterns)
- Consolidate Duplicate Conditional Fragments (for common lifecycle management)

**High-Level Approach**:
Create four shared utility classes in `packages/core/src/common/` that encapsulate the duplicated patterns. Replace client and server implementations with these utilities while preserving exact external behavior. Reuse existing DisposableStore for disposable management.

**Files Affected**:
- **Modified**: 
  - `/packages/client/src/client.ts` (major refactoring - event handling, transport, pending requests)
  - `/packages/server/src/server.ts` (major refactoring - event handling, transport, handler registration)
  - `/packages/server/src/dispatcher.ts` (minor - may use HandlerRegistry)
- **Created**: 
  - `/packages/core/src/common/event-emitter.ts` (DisposableEventEmitter utility)
  - `/packages/core/src/common/handler-registry.ts` (HandlerRegistry utility)
  - `/packages/core/src/common/transport-attachment.ts` (TransportAttachment utility)
  - `/packages/core/src/common/pending-requests.ts` (PendingRequestTracker utility)
- **Deleted**: None (inline implementations removed, not separate files)
- **Moved**: None

### Design Improvements

**Before**:
```
BaseLSPClient
├── private events: EventEmitter
├── private pendingRequests: Map<id, {resolve, reject, method}>
├── private requestHandlers: Map<string, handler>
├── private notificationHandlers: Map<string, handler>
├── private transport?: Transport
├── private transportDisposables: Disposable[]
├── onConnected/onDisconnected/onError (6 methods, manual EventEmitter wrapping)
├── connect() - manual transport setup, manual handler attachment
├── handleClose() - manual cleanup of everything
└── [380 lines of lifecycle management code]

LSPServer
├── private events: EventEmitter
├── private cancellationTokens: Map<id, AbortController>
├── private dispatcher: MessageDispatcher (contains handler maps)
├── private transport?: Transport
├── private disposables: Disposable[]
├── onListening/onShutdown/onError (6 methods, manual EventEmitter wrapping)
├── listen() - manual transport setup, manual handler attachment
├── close() - manual cleanup of everything
└── [Similar 380 lines of lifecycle management code]
```

**After**:
```
BaseLSPClient
├── private eventManager: DisposableEventEmitter
├── private requestTracker: PendingRequestTracker
├── private requestHandlers: HandlerRegistry
├── private notificationHandlers: HandlerRegistry
├── private transportAttachment: TransportAttachment
├── private disposables: DisposableStore (from core/utils)
├── onConnected/onDisconnected/onError (delegates to eventManager)
├── connect() - uses transportAttachment.attach()
├── handleClose() - uses disposables.dispose()
└── [~180 lines - 53% reduction]

LSPServer
├── private eventManager: DisposableEventEmitter
├── private requestTracker: PendingRequestTracker (for cancellation tokens)
├── private dispatcher: MessageDispatcher (uses HandlerRegistry internally)
├── private transportAttachment: TransportAttachment
├── private disposables: DisposableStore (from core/utils)
├── onListening/onShutdown/onError (delegates to eventManager)
├── listen() - uses transportAttachment.attach()
├── close() - uses disposables.dispose()
└── [~180 lines - 53% reduction]

Shared Utilities (packages/core/src/common/):
├── DisposableEventEmitter - unified event subscription with Disposable cleanup
├── HandlerRegistry<T> - generic Map-based handler storage with type safety
├── TransportAttachment - encapsulated transport lifecycle (attach/detach/handlers)
├── PendingRequestTracker - unified request tracking with cancellation support
└── DisposableStore (already exists in core/utils) - unified disposable management
```

## Phase 0: Testing Gap Assessment
*CRITICAL: Complete BEFORE capturing baseline metrics - see testing-gaps.md*

### Pre-Baseline Testing Requirement
- [ ] **Testing gaps assessment completed** (see `testing-gaps.md`)
- [ ] **Critical gaps identified and addressed**
- [ ] **All affected functionality has adequate test coverage**
- [ ] **Ready to capture baseline metrics**

**Rationale**: Refactoring requires behavior preservation validation. If code lacks test coverage, we cannot verify behavior is preserved. All impacted functionality MUST be tested BEFORE establishing the baseline.

### Testing Coverage Status

**Affected Code Areas**:

1. **Client Event Handling** (client.ts lines 352-393):
   - Coverage: [?%] - [ ] ✅ Adequate [ ] ❌ Needs Tests
   - Tests needed: onConnected, onDisconnected, onError subscription and emission
   - Tests needed: Event handler disposal and cleanup
   - Tests needed: Multiple simultaneous subscriptions

2. **Client Transport Lifecycle** (client.ts lines 120-132, 188-210, 604-630):
   - Coverage: [?%] - [ ] ✅ Adequate [ ] ❌ Needs Tests
   - Tests needed: Transport attachment during connect()
   - Tests needed: Transport detachment during disconnect() and handleClose()
   - Tests needed: Transport error propagation
   - Tests needed: Transport disposable cleanup

3. **Client Pending Requests** (client.ts lines 60-67, 220-285, 479-498, 620-627):
   - Coverage: [?%] - [ ] ✅ Adequate [ ] ❌ Needs Tests
   - Tests needed: Request ID generation and tracking
   - Tests needed: Promise resolve/reject handling
   - Tests needed: Cancellation token integration
   - Tests needed: Request cleanup on connection close
   - Tests needed: Multiple concurrent requests

4. **Client Handler Registration** (client.ts lines 60-67, 312-343):
   - Coverage: [?%] - [ ] ✅ Adequate [ ] ❌ Needs Tests
   - Tests needed: Request handler registration/unregistration
   - Tests needed: Notification handler registration/unregistration
   - Tests needed: Handler disposal

5. **Server Event Handling** (server.ts lines 361-405):
   - Coverage: [?%] - [ ] ✅ Adequate [ ] ❌ Needs Tests
   - Tests needed: onListening, onShutdown, onError subscription and emission
   - Tests needed: Event handler disposal and cleanup
   - Tests needed: Multiple simultaneous subscriptions

6. **Server Transport Lifecycle** (server.ts lines 283-300, 320-357):
   - Coverage: [?%] - [ ] ✅ Adequate [ ] ❌ Needs Tests
   - Tests needed: Transport attachment during listen()
   - Tests needed: Transport detachment during close()
   - Tests needed: Transport error propagation
   - Tests needed: Transport disposable cleanup

7. **Server Handler Registration** (server.ts lines 103-148, 159-204):
   - Coverage: [?%] - [ ] ✅ Adequate [ ] ❌ Needs Tests
   - Tests needed: onRequest handler registration/unregistration
   - Tests needed: onNotification handler registration/unregistration
   - Tests needed: Handler disposal
   - Tests needed: Dispatcher integration

8. **Server Cancellation Tracking** (server.ts lines 51-52, 320-357):
   - Coverage: [?%] - [ ] ✅ Adequate [ ] ❌ Needs Tests
   - Tests needed: Cancellation token creation and storage
   - Tests needed: Cancellation token cleanup
   - Tests needed: $/cancelRequest notification handling

**Action Required**:
- [ ] Run test coverage report for client.ts and server.ts
- [ ] Identify gaps in coverage for the 8 areas above
- [ ] Add tests for critical gaps (event lifecycle, transport attach/detach, request tracking)
- [ ] Verify all new tests pass before capturing baseline
- [ ] Document coverage percentages above

**Coverage Tool**: Use `pnpm test:coverage` to generate coverage report

**Minimum Coverage Threshold**: 80% line coverage for affected areas before proceeding to baseline

---

## Baseline Metrics
*Captured AFTER testing gaps are addressed - see metrics-before.md*

### Code Complexity
- **Cyclomatic Complexity**: [Measure with `pnpm run complexity`]
- **Cognitive Complexity**: [Measure with `pnpm run complexity`]
- **Lines of Code**: 
  - client.ts: 647 lines (entire file)
  - server.ts: 458 lines (entire file)
  - Total affected: ~1105 lines
- **Function Length (avg/max)**: [Measure with `pnpm run complexity`]
- **Class Size**: 
  - BaseLSPClient: 647 lines
  - LSPServer: 458 lines
- **Duplication**: 380 lines duplicate (67.86% duplication rate calculated)

### Test Coverage
- **Overall Coverage**: [Run `pnpm test:coverage` after Phase 0]
- **Lines Covered**: [X/Y]
- **Branches Covered**: [X/Y]
- **Functions Covered**: [X/Y]
- **Key Areas**:
  - client.ts: [?%]
  - server.ts: [?%]

### Performance
- **Build Time**: [Run `time pnpm build`]
- **Bundle Size**: 
  - @lspeasy/client: [X KB]
  - @lspeasy/server: [X KB]
  - @lspeasy/core: [X KB]
- **Test Execution Time**: [Run `time pnpm test`]
- **Memory Usage**: [Not critical for this refactor]

### Dependencies
- **Direct Dependencies**: 
  - client: 1 (@lspeasy/core)
  - server: 1 (@lspeasy/core)
  - core: 0 (base package)
- **Total Dependencies**: [count including transitive]
- **Outdated Dependencies**: [Run `pnpm outdated`]

**Baseline Capture Command**:
```bash
.specify/extensions/workflows/refactor/measure-metrics.sh --before refactor-002
```

## Target Metrics
*Goals to achieve - measurable success criteria*

### Code Quality Goals
- **Lines of Code**: Reduce by 380 lines (target: ~725 total, 34% reduction)
  - client.ts: from 647 to ~450 lines (30% reduction)
  - server.ts: from 458 to ~275 lines (40% reduction)
- **Duplication**: Eliminate 380 duplicate lines (from 67.86% to <10%)
- **Cyclomatic Complexity**: Reduce by 20% (simpler lifecycle management)
- **Function Length**: No single function > 50 lines after refactor
- **Test Coverage**: Maintain or increase (must stay ≥ current baseline)
- **Maintainability Index**: Increase by extracting cohesive utilities

### Performance Goals
- **Build Time**: Maintain or improve (no regression > 5%)
- **Bundle Size**: 
  - Client/Server: No increase (extracted code goes to shared core)
  - Core: May increase by ~5-10 KB (acceptable - shared utilities)
  - Total: Neutral or slight decrease (code reuse reduces duplication in bundle)
- **Test Execution Time**: Maintain or improve (no regression > 5%)
- **Runtime Performance**: No regression (in-memory operations, negligible overhead)

### Success Threshold
**Minimum acceptable improvement**: 
- Eliminate at least 300 lines of duplicate code (79% of target)
- All 65 existing tests pass without modification
- No performance regression > 5% in any metric
- Test coverage maintained or improved
- Zero breaking changes to public APIs

**Ideal success**:
- Eliminate all 380 lines of duplicate code
- Improved test coverage in lifecycle management areas
- Faster build time due to simpler code
- Foundation for future features (middleware, retry logic, telemetry)

## Behavior Preservation Guarantee
*CRITICAL: Refactoring MUST NOT change external behavior*

### External Contracts Unchanged
- [x] API endpoints return same responses (LSP protocol compliance maintained)
- [x] Function signatures unchanged (all public methods identical)
- [x] Component props unchanged (N/A for this refactor)
- [x] CLI arguments unchanged (N/A for this refactor)
- [x] Database schema unchanged (N/A for this refactor)
- [x] File formats unchanged (N/A for this refactor)

### Test Suite Validation
- [x] **All 65 existing tests MUST pass WITHOUT modification**
- [x] If test needs changing, verify it was testing implementation detail, not behavior
- [x] Do NOT weaken assertions to make tests pass
- [x] Do NOT skip or disable tests

**Test Categories to Validate**:
1. Client connection/disconnection lifecycle (tests/client.test.ts)
2. Server listen/shutdown lifecycle (tests/server.test.ts)
3. Request/response message handling
4. Notification handling
5. Error propagation and handling
6. Cancellation token behavior
7. Event subscription and emission
8. Handler registration and disposal
9. Transport error scenarios
10. Concurrent request handling

### Behavioral Snapshot
**Key behaviors to preserve**:

1. **Connection Lifecycle**:
   - Input: `client.connect(transport)` called
   - Output: `initialize` request sent, `initialized` notification sent, `connected` event emitted
   - Side effect: Transport handlers attached, client state = initialized

2. **Event Subscription**:
   - Input: `client.onConnected(handler)` called
   - Output: Disposable returned
   - Side effect: Handler called when connected event emitted
   - Cleanup: `dispose()` removes handler, no memory leak

3. **Request Tracking**:
   - Input: `client.sendRequest('textDocument/hover', params)`
   - Output: Promise that resolves when response received
   - Side effect: Request added to pending map, removed after response
   - Cancellation: Token cancels request, sends $/cancelRequest, rejects promise

4. **Transport Error Handling**:
   - Input: Transport emits error
   - Output: Error event emitted to subscribers
   - Side effect: Connection state reflects error

5. **Handler Registration**:
   - Input: `server.onRequest('workspace/executeCommand', handler)`
   - Output: Disposable returned
   - Side effect: Handler called when request received
   - Cleanup: `dispose()` removes handler, subsequent requests return "method not found"

6. **Graceful Shutdown**:
   - Input: `server.shutdown()` called
   - Output: Waits for pending requests, sends shutdown response, closes transport
   - Side effect: All disposables cleaned up, no resource leaks

**Test**: Run full test suite before and after refactoring. All tests must pass with identical behavior.

## Risk Assessment

### Risk Level Justification
**Why Medium Risk**:
- **Code Touched**: Core lifecycle management in both client and server (high-traffic code paths)
- **User Impact**: Any bugs affect all LSP operations, but 65 existing tests provide safety net
- **Complexity**: Multiple interrelated patterns being refactored simultaneously
- **Blast Radius**: Affects all client-server communication, but changes are internal (no public API changes)
- **Testing Coverage**: Existing tests cover happy paths well, but edge cases (error handling, cleanup) may have gaps

**Risk Factors**:
- Refactoring event emission/subscription could introduce race conditions
- Transport attachment/detachment timing is critical for resource cleanup
- Request tracking affects promise lifecycle (resolve/reject/cleanup)
- Cancellation token handling must be precise to avoid memory leaks
- Multiple shared utilities must integrate correctly

**Mitigation Factors**:
- 65 existing tests validate core behavior
- Phase 0 testing gap assessment will identify missing coverage
- Incremental implementation (one utility at a time)
- Each phase checkpoint requires all tests to pass
- Behavior preservation is primary goal (no external changes)

### Potential Issues

**Risk 1: Event Subscription Race Conditions**
- **What could go wrong**: Shared DisposableEventEmitter might have subtle timing differences in event emission order or disposal timing
- **Likelihood**: Low (EventEmitter behavior is well-defined)
- **Mitigation**: 
  - Add specific tests for event ordering and disposal
  - Review all event emission points to ensure ordering matches original
  - Test multiple simultaneous subscriptions
- **Detection**: Test failures in event subscription tests
- **Rollback**: Revert to inline EventEmitter implementation

**Risk 2: Request Tracking Memory Leaks**
- **What could go wrong**: PendingRequestTracker might not properly clean up on error paths, connection close, or cancellation
- **Likelihood**: Medium (complex lifecycle with multiple cleanup triggers)
- **Mitigation**:
  - Explicit tests for cleanup in all scenarios (success, error, cancel, close)
  - Code review focused on cleanup paths
  - Manual verification of Map sizes before/after operations
- **Detection**: Growing memory usage, pending request map not empty
- **Rollback**: Revert to inline request tracking with manual cleanup

**Risk 3: Transport Disposable Cleanup Incomplete**
- **What could go wrong**: TransportAttachment might miss disposing one of the three handlers (message/error/close) or dispose in wrong order
- **Likelihood**: Low (straightforward attach/detach pattern)
- **Mitigation**:
  - Test that all three handlers are attached
  - Test that all three handlers are disposed
  - Test cleanup order (dispose before null check vs after)
- **Detection**: Resource leaks, handlers called after detachment
- **Rollback**: Revert to inline transport attachment

**Risk 4: Handler Registry Type Safety**
- **What could go wrong**: Generic HandlerRegistry<T> might lose type safety compared to separate requestHandlers/notificationHandlers maps
- **Likelihood**: Low (TypeScript enforces types)
- **Mitigation**:
  - Comprehensive type tests
  - Generic type parameters must match original types exactly
  - Code review focused on type safety
- **Detection**: TypeScript compilation errors, runtime type mismatches
- **Rollback**: Keep separate typed maps instead of generic registry

**Risk 5: Behavioral Differences in Edge Cases**
- **What could go wrong**: Shared utilities handle edge cases (null, undefined, double-dispose) differently than inline code
- **Likelihood**: Medium (edge cases often undertested)
- **Mitigation**:
  - Phase 0 testing gap assessment focuses on edge cases
  - Add tests for: double dispose, dispose before init, error during cleanup
  - Defensive programming in utilities (null checks, idempotency)
- **Detection**: Unexpected errors in edge case scenarios
- **Rollback**: Revert specific utility, keep others if independent

### Safety Measures
- [x] Feature flag available for gradual rollout: Not applicable (library, not service)
- [x] Monitoring in place for key metrics: Test suite is monitoring
- [x] Rollback plan tested: Git revert strategy defined below
- [x] Incremental commits (can revert partially): Each utility in separate commit
- [x] Peer review required: Yes, before merge
- [ ] Staging environment test required: Not applicable (library testing via test suite)

**Incremental Rollout Strategy**:
Since this is a library refactor, rollout is controlled by version:
1. Complete refactor in feature branch `refactor/002-shared-utilities`
2. Tag as pre-release version (e.g., `v0.8.0-alpha.1`)
3. Test in consuming projects if available
4. Merge to main and release as minor version (e.g., `v0.8.0`)
5. Monitor issue reports for 2 weeks
6. If stable, proceed with future features building on new utilities

## Rollback Plan

### How to Undo

**Full Rollback** (all utilities causing issues):
```bash
# Revert the entire refactor
git revert <commit-range-for-refactor-002>
# Or reset to pre-refactor tag
git checkout pre-refactor-002
git checkout -b rollback-002
git cherry-pick <any-important-commits-after-refactor>
```

**Partial Rollback** (one utility causing issues):
```bash
# Each utility implemented in separate commit for granular rollback
git log --oneline --grep="refactor-002"
git revert <specific-utility-commit>
# Fix integration issues manually
```

**Rollback Steps**:
1. Identify problematic commits: `git log --grep="refactor-002" --oneline`
2. Create rollback branch: `git checkout -b rollback-002-<issue>`
3. Revert specific commits: `git revert <commit-hash>`
4. Run full test suite: `pnpm test`
5. Verify baseline metrics: `pnpm run complexity && pnpm build`
6. Merge rollback to main via PR

### Rollback Triggers
Revert if any of these occur within 2 weeks of merge:

- [x] Test suite failure (any test in existing 65 tests fails)
- [x] Performance regression > 10% (build time, bundle size, test execution)
- [x] Memory leak detected (increasing memory usage in long-running scenarios)
- [x] Integration issues reported by consuming projects
- [x] Regression in error handling or resource cleanup
- [ ] Production error rate increase (N/A - library, not service)
- [ ] User-facing bug reports (monitored via GitHub issues)

**Monitoring Period**: 2 weeks after merge to main
**Decision Maker**: Project maintainer or team lead
**Communication**: If rollback occurs, document in refactor-002.md and GitHub issue

### Recovery Time Objective
**RTO**: < 1 hour

**Rollback Procedure**:
1. Detection: Tests fail or issue reported (0-30 minutes)
2. Diagnosis: Identify if refactor is cause (5-15 minutes)
3. Revert: Execute git revert commands (5 minutes)
4. Validation: Run test suite (5-10 minutes)
5. Deploy: Push revert to main (5 minutes)
6. Verify: Confirm issue resolved (5-15 minutes)

**Total**: 25-80 minutes depending on issue complexity

## Implementation Plan

### Phase 0: Testing Gap Assessment (Pre-Baseline)
**CRITICAL FIRST STEP**: Assess and address testing gaps BEFORE baseline

**Duration**: 1-2 days
**Deliverable**: Comprehensive test coverage for all affected code paths

**Tasks**:
1. **Generate coverage report**: `pnpm test:coverage`
2. **Review coverage for client.ts**: Identify gaps in lines 60-67, 120-132, 188-210, 220-285, 312-343, 352-393, 479-498, 604-630
3. **Review coverage for server.ts**: Identify gaps in lines 51-52, 103-148, 159-204, 283-300, 320-357, 361-405
4. **Document gaps in testing-gaps.md**:
   - Critical: Event lifecycle, transport attach/detach, request tracking cleanup
   - Important: Error handling edge cases, concurrent operations
   - Nice-to-have: Performance under load, extreme scenarios
5. **Write tests for critical gaps**:
   - Event subscription and disposal (at least 3 tests per event type)
   - Transport attachment and cleanup (at least 4 tests)
   - Request tracking with cancellation (at least 5 tests)
   - Handler registration and disposal (at least 4 tests)
   - Cleanup on connection close (at least 2 tests)
6. **Run new tests**: `pnpm test` - all must pass
7. **Verify coverage improved**: `pnpm test:coverage` - aim for 80%+ in affected areas

**Checkpoint**: 
- [ ] Coverage report generated and reviewed
- [ ] All critical gaps have tests added
- [ ] All new tests passing (100% pass rate)
- [ ] Coverage meets 80% threshold in affected areas
- [ ] testing-gaps.md document created
- [ ] Ready to proceed to Phase 1 baseline capture

### Phase 1: Baseline Capture (Before Refactoring)
**Duration**: 1 day
**Deliverable**: metrics-before.md with complete baseline measurements

**Tasks**:
1. **Run baseline measurement script**:
   ```bash
   .specify/extensions/workflows/refactor/measure-metrics.sh --before refactor-002
   ```
2. **Capture manual metrics**:
   - Lines of code: `cloc packages/client/src/client.ts packages/server/src/server.ts`
   - Complexity: `pnpm run complexity` (if tool available)
   - Bundle size: `du -sh packages/*/dist/*`
   - Test time: `time pnpm test`
3. **Create behavioral snapshot**:
   - Run all tests: `pnpm test > baseline-tests.log`
   - Document test pass rate: should be 65/65 (100%)
   - Note any warnings or deprecations
4. **Git tag current state**:
   ```bash
   git tag pre-refactor-002 -m "Baseline before refactor-002: shared utilities"
   git push origin pre-refactor-002
   ```
5. **Document baseline in metrics-before.md**
6. **Review and commit baseline**:
   ```bash
   git add .specify/specs/refactors/refactor-002-metrics-before.md
   git commit -m "docs(refactor-002): capture baseline metrics"
   ```

**Checkpoint**: 
- [ ] All metrics captured in metrics-before.md
- [ ] Git tag created (pre-refactor-002)
- [ ] All tests passing (100% pass rate)
- [ ] Behavioral snapshot documented
- [ ] Ready to proceed to Phase 2 implementation

### Phase 2: Implementation (Incremental Refactoring)
**Duration**: 5-7 days
**Deliverable**: Refactored client and server using shared utilities

**Principle**: Each step should compile and pass all tests

#### Phase 2.1: Create DisposableEventEmitter Utility
**Duration**: 1 day

1. **Create `/packages/core/src/common/event-emitter.ts`**:
   ```typescript
   /**
    * Event emitter with disposable subscription pattern
    * Encapsulates EventEmitter on/off with automatic Disposable wrapper
    */
   export class DisposableEventEmitter {
     private events: EventEmitter = new EventEmitter();
     
     on(event: string, handler: (...args: any[]) => void): Disposable {
       this.events.on(event, handler);
       return {
         dispose: () => {
           this.events.off(event, handler);
         }
       };
     }
     
     emit(event: string, ...args: any[]): void {
       this.events.emit(event, ...args);
     }
     
     dispose(): void {
       this.events.removeAllListeners();
     }
   }
   ```
2. **Add unit tests**: `packages/core/src/common/__tests__/event-emitter.test.ts`
   - Test subscription returns Disposable
   - Test emission triggers handler
   - Test disposal removes handler
   - Test multiple subscriptions
   - Test dispose() cleanup
3. **Run tests**: `pnpm test` - all must pass
4. **Commit**: `git commit -m "feat(core): add DisposableEventEmitter utility for refactor-002"`

#### Phase 2.2: Integrate DisposableEventEmitter in Client
**Duration**: 1 day

1. **Replace EventEmitter in client.ts**:
   - Change `private events: EventEmitter` to `private eventManager: DisposableEventEmitter`
   - Update `onConnected()`: delegate to `eventManager.on('connected', handler)`
   - Update `onDisconnected()`: delegate to `eventManager.on('disconnected', handler)`
   - Update `onError()`: delegate to `eventManager.on('error', handler)`
   - Update emit calls: `this.eventManager.emit('connected')`
   - Remove manual Disposable wrapping (now handled by utility)
2. **Run tests**: `pnpm test` - all must pass (no behavior change)
3. **Verify reduction**: ~15 lines removed from client.ts
4. **Commit**: `git commit -m "refactor(client): use DisposableEventEmitter utility (refactor-002)"`

#### Phase 2.3: Integrate DisposableEventEmitter in Server
**Duration**: 1 day

1. **Replace EventEmitter in server.ts**:
   - Change `private events: EventEmitter` to `private eventManager: DisposableEventEmitter`
   - Update `onListening()`: delegate to `eventManager.on('listening', handler)`
   - Update `onShutdown()`: delegate to `eventManager.on('shutdown', handler)`
   - Update `onError()`: delegate to `eventManager.on('error', handler)`
   - Update emit calls: `this.eventManager.emit('listening')`
   - Remove manual Disposable wrapping
2. **Run tests**: `pnpm test` - all must pass
3. **Verify reduction**: ~15 lines removed from server.ts
4. **Commit**: `git commit -m "refactor(server): use DisposableEventEmitter utility (refactor-002)"`

#### Phase 2.4: Create HandlerRegistry Utility
**Duration**: 1 day

1. **Create `/packages/core/src/common/handler-registry.ts`**:
   ```typescript
   /**
    * Generic handler registry with Disposable registration
    * Type-safe Map-based storage for method handlers
    */
   export class HandlerRegistry<T = any> {
     private handlers = new Map<string, T>();
     
     register(method: string, handler: T): Disposable {
       this.handlers.set(method, handler);
       return {
         dispose: () => {
           this.handlers.delete(method);
         }
       };
     }
     
     get(method: string): T | undefined {
       return this.handlers.get(method);
     }
     
     has(method: string): boolean {
       return this.handlers.has(method);
     }
     
     clear(): void {
       this.handlers.clear();
     }
   }
   ```
2. **Add unit tests**: `packages/core/src/common/__tests__/handler-registry.test.ts`
   - Test register stores handler
   - Test get retrieves handler
   - Test dispose removes handler
   - Test type safety with generic parameter
3. **Run tests**: `pnpm test` - all must pass
4. **Commit**: `git commit -m "feat(core): add HandlerRegistry utility for refactor-002"`

#### Phase 2.5: Integrate HandlerRegistry in Client
**Duration**: 0.5 days

1. **Replace handler Maps in client.ts**:
   - Change `private requestHandlers: Map<string, ...>` to `private requestHandlers: HandlerRegistry<RequestHandler>`
   - Update `onRequest()`: use `this.requestHandlers.register(method, handler)`
   - Update handler retrieval: use `this.requestHandlers.get(method)`
   - Similar changes for `notificationHandlers`
2. **Run tests**: `pnpm test` - all must pass
3. **Verify reduction**: ~8 lines removed
4. **Commit**: `git commit -m "refactor(client): use HandlerRegistry utility (refactor-002)"`

#### Phase 2.6: Integrate HandlerRegistry in Dispatcher
**Duration**: 0.5 days

1. **Update dispatcher.ts** (if beneficial):
   - Evaluate if MessageDispatcher can use HandlerRegistry internally
   - If yes, refactor; if no, document why (may already be optimal)
2. **Run tests**: `pnpm test` - all must pass
3. **Commit**: `git commit -m "refactor(dispatcher): use HandlerRegistry utility (refactor-002)"`

#### Phase 2.7: Create TransportAttachment Utility
**Duration**: 1 day

1. **Create `/packages/core/src/common/transport-attachment.ts`**:
   ```typescript
   /**
    * Manages transport lifecycle: attach/detach with handler subscriptions
    * Encapsulates onMessage/onError/onClose pattern
    */
   export class TransportAttachment {
     private transport?: Transport;
     private disposables = new DisposableStore();
     
     attach(
       transport: Transport,
       handlers: {
         onMessage: (msg: Message) => void | Promise<void>;
         onError: (err: Error) => void;
         onClose: () => void;
       }
     ): void {
       if (this.transport) {
         throw new Error('Transport already attached');
       }
       
       this.transport = transport;
       this.disposables.add(transport.onMessage(handlers.onMessage));
       this.disposables.add(transport.onError(handlers.onError));
       this.disposables.add(transport.onClose(handlers.onClose));
     }
     
     detach(): void {
       this.disposables.dispose();
       this.transport = undefined;
     }
     
     getTransport(): Transport | undefined {
       return this.transport;
     }
     
     isAttached(): boolean {
       return this.transport !== undefined;
     }
   }
   ```
2. **Add unit tests**: `packages/core/src/common/__tests__/transport-attachment.test.ts`
   - Test attach subscribes to all three events
   - Test detach disposes subscriptions
   - Test error on double attach
   - Test getTransport returns correct value
3. **Run tests**: `pnpm test` - all must pass
4. **Commit**: `git commit -m "feat(core): add TransportAttachment utility for refactor-002"`

#### Phase 2.8: Integrate TransportAttachment in Client
**Duration**: 1 day

1. **Replace transport management in client.ts**:
   - Change `private transport?: Transport` to `private transportAttachment: TransportAttachment`
   - Change `private transportDisposables: Disposable[]` to use TransportAttachment
   - Update `connect()`: use `transportAttachment.attach(transport, { onMessage, onError, onClose })`
   - Update `handleClose()`: use `transportAttachment.detach()`
   - Update transport access: use `transportAttachment.getTransport()`
2. **Run tests**: `pnpm test` - all must pass
3. **Verify reduction**: ~25 lines removed
4. **Commit**: `git commit -m "refactor(client): use TransportAttachment utility (refactor-002)"`

#### Phase 2.9: Integrate TransportAttachment in Server
**Duration**: 1 day

1. **Replace transport management in server.ts**:
   - Change `private transport?: Transport` to `private transportAttachment: TransportAttachment`
   - Change `private disposables: Disposable[]` to use TransportAttachment for transport subscriptions
   - Update `listen()`: use `transportAttachment.attach(transport, { onMessage, onError, onClose })`
   - Update `close()`: use `transportAttachment.detach()`
   - Update transport access: use `transportAttachment.getTransport()`
2. **Run tests**: `pnpm test` - all must pass
3. **Verify reduction**: ~20 lines removed
4. **Commit**: `git commit -m "refactor(server): use TransportAttachment utility (refactor-002)"`

#### Phase 2.10: Create PendingRequestTracker Utility
**Duration**: 1 day

1. **Create `/packages/core/src/common/pending-requests.ts`**:
   ```typescript
   /**
    * Tracks pending requests with promise management and cancellation
    * Unified request lifecycle: create, resolve, reject, cancel, cleanup
    */
   export class PendingRequestTracker {
     private pending = new Map<number | string, {
       resolve: (value: any) => void;
       reject: (error: Error) => void;
       method: string;
       cancel?: () => void;
     }>();
     
     track(
       id: number | string,
       method: string,
       resolve: (value: any) => void,
       reject: (error: Error) => void,
       cancel?: () => void
     ): void {
       this.pending.set(id, { resolve, reject, method, cancel });
     }
     
     resolve(id: number | string, value: any): boolean {
       const entry = this.pending.get(id);
       if (!entry) return false;
       
       this.pending.delete(id);
       entry.resolve(value);
       return true;
     }
     
     reject(id: number | string, error: Error): boolean {
       const entry = this.pending.get(id);
       if (!entry) return false;
       
       this.pending.delete(id);
       entry.reject(error);
       return true;
     }
     
     cancel(id: number | string): boolean {
       const entry = this.pending.get(id);
       if (!entry) return false;
       
       this.pending.delete(id);
       if (entry.cancel) entry.cancel();
       entry.reject(new Error('Request was cancelled'));
       return true;
     }
     
     clear(reason: string = 'Cleared'): void {
       for (const [id, entry] of this.pending.entries()) {
         entry.reject(new Error(reason));
       }
       this.pending.clear();
     }
     
     has(id: number | string): boolean {
       return this.pending.has(id);
     }
     
     get size(): number {
       return this.pending.size;
     }
   }
   ```
2. **Add unit tests**: `packages/core/src/common/__tests__/pending-requests.test.ts`
   - Test track adds request
   - Test resolve removes and resolves
   - Test reject removes and rejects
   - Test cancel calls cancel callback and rejects
   - Test clear rejects all pending
   - Test multiple concurrent requests
3. **Run tests**: `pnpm test` - all must pass
4. **Commit**: `git commit -m "feat(core): add PendingRequestTracker utility for refactor-002"`

#### Phase 2.11: Integrate PendingRequestTracker in Client
**Duration**: 1 day

1. **Replace pendingRequests Map in client.ts**:
   - Change `private pendingRequests: Map<...>` to `private requestTracker: PendingRequestTracker`
   - Update `sendRequest()`: use `requestTracker.track(id, method, resolve, reject, cancelFn)`
   - Update `handleResponse()`: use `requestTracker.resolve(id, result)` or `requestTracker.reject(id, error)`
   - Update `handleClose()`: use `requestTracker.clear('Connection closed')`
   - Update cancellation: integrate cancel callback with tracker
2. **Run tests**: `pnpm test` - all must pass
3. **Verify reduction**: ~40 lines removed
4. **Commit**: `git commit -m "refactor(client): use PendingRequestTracker utility (refactor-002)"`

#### Phase 2.12: Integrate PendingRequestTracker in Server
**Duration**: 0.5 days

1. **Replace cancellationTokens Map in server.ts**:
   - Evaluate using PendingRequestTracker for cancellation token management
   - May need adapter since server tracks AbortControllers, not promises
   - If beneficial, refactor; otherwise document decision
2. **Run tests**: `pnpm test` - all must pass
3. **Commit**: `git commit -m "refactor(server): use PendingRequestTracker for cancellation (refactor-002)"`

#### Phase 2.13: Replace Disposable Arrays with DisposableStore
**Duration**: 0.5 days

1. **Use DisposableStore from core/utils in client.ts**:
   - Remove any remaining manual `disposables: Disposable[]` arrays
   - Replace with `private disposables = new DisposableStore()`
   - Update cleanup: `this.disposables.dispose()` instead of manual loops
2. **Use DisposableStore in server.ts**:
   - Same pattern as client
3. **Run tests**: `pnpm test` - all must pass
4. **Verify reduction**: ~10 lines removed
5. **Commit**: `git commit -m "refactor(client,server): use DisposableStore for cleanup (refactor-002)"`

**Phase 2 Checkpoint**:
- [ ] All utilities created and tested
- [ ] Client refactored to use all utilities
- [ ] Server refactored to use all utilities
- [ ] All 65 tests still passing
- [ ] Code reduced by ~380 lines
- [ ] Each change in separate commit for granular rollback
- [ ] Ready to proceed to Phase 3 validation

### Phase 3: Validation and Metrics
**Duration**: 2 days
**Deliverable**: metrics-after.md with comparison to baseline

**Tasks**:
1. **Run full test suite**: `pnpm test`
   - Verify 65/65 tests pass (100% pass rate)
   - No tests should need modification
   - Document any warnings or changes
2. **Re-measure all metrics**:
   ```bash
   .specify/extensions/workflows/refactor/measure-metrics.sh --after refactor-002
   ```
3. **Compare to baseline**:
   - Lines of code: should be reduced by ~380 lines
   - Duplication: should be < 10%
   - Complexity: should be reduced
   - Test coverage: should be maintained or improved
   - Build time: should be maintained or improved
   - Bundle size: should be neutral or improved
4. **Behavioral snapshot verification**:
   - Run same test scenarios as baseline
   - Compare outputs: should be identical
   - No new warnings or errors
5. **Performance regression test**:
   - Compare build time: < 5% regression acceptable
   - Compare test execution time: < 5% regression acceptable
   - Compare bundle sizes: slight increase in core acceptable, overall neutral
6. **Create metrics-after.md**:
   - Document all measurements
   - Compare to baseline
   - Highlight improvements
   - Note any regressions with justification
7. **Manual testing**:
   - Test client connection lifecycle manually
   - Test server listen/shutdown manually
   - Test error scenarios (transport error, malformed message)
   - Test resource cleanup (no memory leaks)
8. **Documentation review**:
   - Update inline comments if needed
   - Ensure utilities have proper JSDoc
   - Update README if public API changed (should not change)

**Checkpoint**: 
- [ ] All tests passing (100% pass rate)
- [ ] Target metrics achieved (380 lines reduced, duplication eliminated)
- [ ] No performance regression > 5%
- [ ] Behavioral snapshot identical to baseline
- [ ] metrics-after.md created and committed
- [ ] Ready to proceed to Phase 4 cleanup

### Phase 4: Cleanup and Documentation
**Duration**: 1 day
**Deliverable**: Clean, documented code ready for merge

**Tasks**:
1. **Remove dead code**:
   - Search for any commented-out old implementations
   - Remove temporary debugging code
   - Remove unused imports
2. **Documentation**:
   - Update utility JSDoc comments
   - Add usage examples in comments
   - Update CHANGELOG.md with refactor notes
3. **Code review preparation**:
   - Self-review all changes
   - Prepare PR description with:
     - Summary of changes
     - Metrics comparison (before/after)
     - Testing evidence
     - Rollback plan reference
4. **Final test run**:
   - `pnpm test` - 100% pass
   - `pnpm build` - no errors
   - `pnpm lint` - no issues
5. **Git cleanup**:
   - Squash any temporary commits if needed (optional)
   - Ensure commit messages follow conventional commits
   - Rebase on latest main if needed
6. **Tag final state**:
   ```bash
   git tag post-refactor-002 -m "Completed refactor-002: shared utilities"
   ```

**Checkpoint**: 
- [ ] All dead code removed
- [ ] Documentation complete
- [ ] Linting passing
- [ ] Ready for code review
- [ ] PR prepared

### Phase 5: Code Review and Merge
**Duration**: 2-3 days (waiting for review)
**Deliverable**: Merged PR, closed refactor spec

**Tasks**:
1. **Create PR**:
   - Title: "refactor: eliminate 380 lines of duplication with shared utilities (refactor-002)"
   - Description: Link to this spec, highlight metrics, show test evidence
   - Reviewers: Assign appropriate team members
2. **Address review feedback**:
   - Respond to comments
   - Make requested changes
   - Re-run tests after each change
3. **Merge**:
   - Squash and merge (or merge commit, per project convention)
   - Delete feature branch after merge
4. **Post-merge monitoring**:
   - Monitor for 2 weeks as per rollback plan
   - Watch for issue reports
   - Be ready to rollback if needed
5. **Update refactor spec**:
   - Mark status as "Complete"
   - Add completion date
   - Link to merged PR
   - Document any deviations from plan
   - Archive in `.specify/specs/refactors/completed/`

**Checkpoint**: 
- [ ] PR merged to main
- [ ] Post-merge monitoring active
- [ ] Refactor spec updated to Complete status
- [ ] Team notified of changes

## Verification Checklist

### Phase 0: Testing Gap Assessment
- [ ] Testing gaps assessment completed (testing-gaps.md created)
- [ ] All affected code areas identified and listed
- [ ] Test coverage assessed for each area (client.ts, server.ts)
- [ ] Critical gaps identified and documented
- [ ] Tests added for all critical gaps (event lifecycle, transport, requests, handlers)
- [ ] All new tests passing (pnpm test shows 100% pass)
- [ ] Coverage meets 80% threshold in affected areas (verified with pnpm test:coverage)
- [ ] Ready to proceed to baseline capture

### Pre-Refactoring (Phase 1)
- [ ] Baseline metrics captured and documented (metrics-before.md)
- [ ] All tests passing (65/65, 100% pass rate)
- [ ] Behavioral snapshot created
- [ ] Git tag created (pre-refactor-002)
- [ ] Rollback plan prepared and documented

### During Refactoring (Phase 2)
- [ ] DisposableEventEmitter utility created with tests
- [ ] DisposableEventEmitter integrated in client (tests pass)
- [ ] DisposableEventEmitter integrated in server (tests pass)
- [ ] HandlerRegistry utility created with tests
- [ ] HandlerRegistry integrated in client (tests pass)
- [ ] HandlerRegistry integrated in dispatcher if applicable (tests pass)
- [ ] TransportAttachment utility created with tests
- [ ] TransportAttachment integrated in client (tests pass)
- [ ] TransportAttachment integrated in server (tests pass)
- [ ] PendingRequestTracker utility created with tests
- [ ] PendingRequestTracker integrated in client (tests pass)
- [ ] PendingRequestTracker integrated in server if applicable (tests pass)
- [ ] DisposableStore used for remaining cleanup (tests pass)
- [ ] Incremental commits (each utility in separate commit)
- [ ] External behavior unchanged (public APIs identical)
- [ ] No new dependencies added
- [ ] Comments updated to match code
- [ ] Dead code removed as refactored

### Post-Refactoring (Phase 3)
- [ ] All tests still passing (65/65, 100% pass rate)
- [ ] Target metrics achieved:
  - [ ] Lines of code reduced by ~380 lines (34% reduction)
  - [ ] Duplication reduced from 67.86% to < 10%
  - [ ] Complexity reduced (if measured)
- [ ] No performance regression > 5%:
  - [ ] Build time maintained or improved
  - [ ] Test execution time maintained or improved
  - [ ] Bundle size neutral or improved
- [ ] Behavioral snapshot matches baseline (identical behavior)
- [ ] metrics-after.md created with comparison
- [ ] Code review approved (pending)
- [ ] Documentation updated (JSDoc, comments)

### Post-Deployment (Phase 5)
- [ ] PR merged to main
- [ ] Monitoring shows stable performance (2 week period)
- [ ] No error rate increase
- [ ] No issue reports related to refactored areas
- [ ] Git tag created (post-refactor-002)
- [ ] Refactor spec marked Complete
- [ ] Lessons learned documented

## Related Work

### Blocks
This refactor is blocked by:
- **refactor-001** (migrate LSP protocol): Should complete first for clean separation
  - Status: In progress
  - Relationship: Refactor-001 modernizes protocol types, refactor-002 modernizes implementation

### Enables
This refactor enables:
- **Connection retry logic**: TransportAttachment can be enhanced to support reconnection
- **Transport middleware**: Shared utilities make it easier to add middleware layers
- **Telemetry and monitoring**: Event management and request tracking provide hooks for metrics
- **Connection pooling**: PendingRequestTracker can support multiple concurrent connections
- **Custom transport implementations**: TransportAttachment standardizes transport interface
- **Better error recovery**: Unified cleanup makes error handling more robust

### Dependencies
- **Requires**: 
  - Existing DisposableStore in `packages/core/src/utils/disposable.ts` (already exists)
  - Existing test infrastructure (already exists, 65 tests)
  - Phase 0 testing gap assessment (must complete first)

- **Recommended before starting**:
  - Complete refactor-001 to avoid merge conflicts
  - Review current test coverage (Phase 0)
  - Ensure no breaking changes planned for client/server APIs

- **Can run in parallel with**:
  - Documentation improvements
  - Examples and tutorials (as long as API doesn't change)

### Future Refactorings
After refactor-002, consider:
- **refactor-003**: Extract message framing into shared utility (if duplication found)
- **refactor-004**: Unify validation logic between client and server
- **refactor-005**: Extract capability negotiation into shared module

---

## Metrics Summary

### Expected Improvements
| Metric | Before | After (Target) | Improvement |
|--------|--------|----------------|-------------|
| Total Lines (client + server) | ~1105 | ~725 | -380 lines (-34%) |
| Client Lines | 647 | ~450 | -197 lines (-30%) |
| Server Lines | 458 | ~275 | -183 lines (-40%) |
| Duplication Rate | 67.86% | < 10% | -57.86 pp |
| Duplicate Lines | 380 | < 40 | -340 lines (-89%) |
| Test Coverage | [baseline] | [baseline or better] | Maintained or improved |
| Build Time | [baseline] | [baseline ± 5%] | Maintained |
| Bundle Size | [baseline] | [baseline ± 5%] | Maintained |

### Success Criteria
- ✅ Eliminate at least 300 lines of duplicate code (79% of target)
- ✅ All 65 existing tests pass without modification
- ✅ No performance regression > 5%
- ✅ Test coverage maintained or improved
- ✅ Zero breaking changes to public APIs

---

## Notes

### Design Decisions
1. **Why separate utilities instead of one base class?**
   - Single Responsibility Principle: Each utility has one job
   - Easier to test in isolation
   - Client and server can mix and match as needed
   - Better for tree-shaking (only import what you need)

2. **Why not use existing EventEmitter libraries?**
   - Existing EventEmitter is fine, but lacks Disposable integration
   - DisposableEventEmitter is a thin wrapper adding Disposable pattern
   - Keeps dependencies minimal

3. **Why PendingRequestTracker instead of generic promise manager?**
   - LSP-specific: knows about request IDs, methods, cancellation
   - Type-safe for LSP use cases
   - Could be generalized later if needed elsewhere

4. **Why not use vscode-jsonrpc utilities?**
   - Goal is to be independent of vscode-jsonrpc
   - Our utilities are simpler and LSP-focused
   - Reduces external dependencies

### Lessons Learned
(To be filled in after completion)

- What went well:
- What could be improved:
- Unexpected challenges:
- Time estimates accuracy:
- Would we do this refactor again? Why or why not?

### References
- Original duplication analysis: [User request above]
- Refactor template: `.specify/extensions/workflows/refactor/refactor-template.md`
- Testing gaps template: `.specify/extensions/workflows/refactor/testing-gaps.md`
- Metrics script: `.specify/extensions/workflows/refactor/measure-metrics.sh`
- Related refactor: `.specify/specs/refactors/refactor-001.md` (LSP protocol migration)

---

*Refactor spec created using `/refactor` workflow - See .specify/extensions/workflows/refactor/*
*Status: Planning - Ready for Phase 0 (Testing Gap Assessment)*
*Created: 2026-02-09*
*Last Updated: 2026-02-09*
