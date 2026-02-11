# Refactor-002: Shared Utilities Implementation Plan

> **For Claude:** REQUIRED SUB-SKILL: Use executing-plans skill to implement this plan task-by-task.

**Goal:** Eliminate 380 lines of duplicate code (68% → <10% duplication) by refactoring client and server to use shared utilities: DisposableEventEmitter, HandlerRegistry, TransportAttachment, and PendingRequestTracker.

**Architecture:** Extract four reusable utility classes into `packages/core/src/common/` that encapsulate duplicated patterns. Replace inline implementations in client.ts and server.ts with these utilities while preserving exact external behavior. Use incremental integration with tests passing at each phase.

**Tech Stack:** TypeScript, EventEmitter, Disposable pattern, Map-based registries

**Timeline:** 2-3 days (16-24 hours total)

**Spec Reference:** `/Users/pmouli/GitHub.nosync/lspy/.specify/specs/refactors/refactor-002.md`

---

## Prerequisites

**Before starting:**
- [x] Refactor-002 spec reviewed and understood
- [ ] All 65 existing tests passing (baseline verification)
- [ ] Phase 0 testing gap assessment completed
- [ ] Critical test coverage at 80%+ in affected areas
- [ ] Baseline metrics captured in metrics-before.md
- [ ] Git tag created: `pre-refactor-002`
- [ ] Feature branch created: `refactor/002-shared-utilities`

## Success Criteria

- [ ] All 65 tests passing without modification
- [ ] Code duplication reduced from 67.86% to <10%
- [ ] ~380 lines of duplicate code eliminated
- [ ] No breaking API changes (public interfaces identical)
- [ ] No performance regression >5% (build time, bundle size, test execution)
- [ ] Improved type safety through generic utilities
- [ ] Each utility in separate commit for granular rollback

---

## Phase 0: Testing Gap Assessment

**Duration:** 1-2 days (8-16 hours)
**Goal:** Ensure adequate test coverage exists for all code being refactored before capturing baseline

### Task 0.1: Generate Coverage Report

**Files:**
- Read: `packages/client/src/client.ts`
- Read: `packages/server/src/server.ts`
- Generate: Coverage report

**Step 1: Run coverage analysis**

```bash
cd /Users/pmouli/GitHub.nosync/lspy
pnpm test:coverage
```

Expected: Coverage report generated showing per-file line/branch/function coverage

**Step 2: Review coverage for affected areas**

Focus on these specific line ranges:
- client.ts: 60-67, 120-132, 188-210, 220-285, 312-343, 352-393, 479-498, 604-630
- server.ts: 51-52, 103-148, 159-204, 283-300, 320-357, 361-405

**Step 3: Document findings**

Create `.specify/specs/refactors/refactor-002-testing-gaps.md` with coverage percentages for each area.

**Step 4: Commit documentation**

```bash
git add .specify/specs/refactors/refactor-002-testing-gaps.md
git commit -m "docs(refactor-002): document testing coverage gaps"
```

---

### Task 0.2: Identify Critical Gaps

**Files:**
- Read: `packages/client/tests/client.test.ts`
- Read: `packages/server/tests/server.test.ts`
- Modify: `.specify/specs/refactors/refactor-002-testing-gaps.md`

**Step 1: Categorize gaps by criticality**

For each of 8 affected areas (event handling, transport lifecycle, request tracking, handler registration in both client and server):
- **Critical:** Core functionality with <80% coverage
- **Important:** Error handling and edge cases with <60% coverage
- **Nice-to-have:** Rare scenarios with any coverage

**Step 2: List specific missing tests**

Example format in testing-gaps.md:
```markdown
### Client Event Handling (Critical - 45% coverage)
Missing tests:
- [ ] Multiple simultaneous subscriptions to same event
- [ ] Event handler disposal cleanup
- [ ] Event emission before subscription
```

**Step 3: Prioritize gaps**

Mark which gaps MUST be addressed before baseline capture vs. which can be deferred.

**Step 4: Commit updated gaps**

```bash
git add .specify/specs/refactors/refactor-002-testing-gaps.md
git commit -m "docs(refactor-002): identify and prioritize testing gaps"
```

---

### Task 0.3: Add Tests for Client Event Handling

**Files:**
- Modify: `packages/client/tests/client.test.ts`

**Step 1: Write test for multiple subscriptions**

```typescript
test('should support multiple simultaneous subscriptions to same event', async () => {
  const client = new BaseLSPClient();
  const handler1 = jest.fn();
  const handler2 = jest.fn();
  
  const disposable1 = client.onConnected(handler1);
  const disposable2 = client.onConnected(handler2);
  
  await client.connect(mockTransport);
  
  expect(handler1).toHaveBeenCalledTimes(1);
  expect(handler2).toHaveBeenCalledTimes(1);
  
  disposable1.dispose();
  disposable2.dispose();
});
```

**Step 2: Write test for event handler disposal**

```typescript
test('should not call handler after disposal', async () => {
  const client = new BaseLSPClient();
  const handler = jest.fn();
  
  const disposable = client.onConnected(handler);
  disposable.dispose();
  
  await client.connect(mockTransport);
  
  expect(handler).not.toHaveBeenCalled();
});
```

**Step 3: Write test for onDisconnected event**

```typescript
test('should emit disconnected event on disconnect', async () => {
  const client = new BaseLSPClient();
  const handler = jest.fn();
  
  client.onDisconnected(handler);
  await client.connect(mockTransport);
  await client.disconnect();
  
  expect(handler).toHaveBeenCalledTimes(1);
});
```

**Step 4: Run tests to verify they pass**

```bash
pnpm test packages/client
```

Expected: All new tests pass, existing tests still pass

**Step 5: Commit new tests**

```bash
git add packages/client/tests/client.test.ts
git commit -m "test(client): add event handling coverage for refactor-002"
```

---

### Task 0.4: Add Tests for Client Transport Lifecycle

**Files:**
- Modify: `packages/client/tests/client.test.ts`

**Step 1: Write test for transport attachment**

```typescript
test('should attach transport handlers during connect', async () => {
  const client = new BaseLSPClient();
  const mockTransport = createMockTransport();
  
  await client.connect(mockTransport);
  
  expect(mockTransport.onMessage).toHaveBeenCalled();
  expect(mockTransport.onError).toHaveBeenCalled();
  expect(mockTransport.onClose).toHaveBeenCalled();
});
```

**Step 2: Write test for transport detachment**

```typescript
test('should detach transport handlers on disconnect', async () => {
  const client = new BaseLSPClient();
  const mockTransport = createMockTransport();
  const messageDisposable = { dispose: jest.fn() };
  const errorDisposable = { dispose: jest.fn() };
  const closeDisposable = { dispose: jest.fn() };
  
  mockTransport.onMessage.mockReturnValue(messageDisposable);
  mockTransport.onError.mockReturnValue(errorDisposable);
  mockTransport.onClose.mockReturnValue(closeDisposable);
  
  await client.connect(mockTransport);
  await client.disconnect();
  
  expect(messageDisposable.dispose).toHaveBeenCalled();
  expect(errorDisposable.dispose).toHaveBeenCalled();
  expect(closeDisposable.dispose).toHaveBeenCalled();
});
```

**Step 3: Write test for transport error propagation**

```typescript
test('should propagate transport errors to error event', async () => {
  const client = new BaseLSPClient();
  const mockTransport = createMockTransport();
  const errorHandler = jest.fn();
  
  client.onError(errorHandler);
  await client.connect(mockTransport);
  
  const testError = new Error('Transport error');
  mockTransport.simulateError(testError);
  
  expect(errorHandler).toHaveBeenCalledWith(testError);
});
```

**Step 4: Run tests**

```bash
pnpm test packages/client
```

Expected: All tests pass

**Step 5: Commit**

```bash
git add packages/client/tests/client.test.ts
git commit -m "test(client): add transport lifecycle coverage for refactor-002"
```

---

### Task 0.5: Add Tests for Client Request Tracking

**Files:**
- Modify: `packages/client/tests/client.test.ts`

**Step 1: Write test for concurrent requests**

```typescript
test('should track multiple concurrent requests', async () => {
  const client = new BaseLSPClient();
  await client.connect(mockTransport);
  
  const promise1 = client.sendRequest('method1', {});
  const promise2 = client.sendRequest('method2', {});
  const promise3 = client.sendRequest('method3', {});
  
  mockTransport.simulateResponse({ id: 1, result: 'result1' });
  mockTransport.simulateResponse({ id: 2, result: 'result2' });
  mockTransport.simulateResponse({ id: 3, result: 'result3' });
  
  const results = await Promise.all([promise1, promise2, promise3]);
  expect(results).toEqual(['result1', 'result2', 'result3']);
});
```

**Step 2: Write test for request cleanup on connection close**

```typescript
test('should reject pending requests on connection close', async () => {
  const client = new BaseLSPClient();
  await client.connect(mockTransport);
  
  const promise = client.sendRequest('method', {});
  
  mockTransport.simulateClose();
  
  await expect(promise).rejects.toThrow('Connection closed');
});
```

**Step 3: Write test for cancellation**

```typescript
test('should support request cancellation', async () => {
  const client = new BaseLSPClient();
  await client.connect(mockTransport);
  
  const cancellationToken = new CancellationToken();
  const promise = client.sendRequest('method', {}, cancellationToken);
  
  cancellationToken.cancel();
  
  await expect(promise).rejects.toThrow('Request was cancelled');
  expect(mockTransport.sentMessages).toContainEqual(
    expect.objectContaining({ method: '$/cancelRequest' })
  );
});
```

**Step 4: Run tests**

```bash
pnpm test packages/client
```

Expected: All tests pass

**Step 5: Commit**

```bash
git add packages/client/tests/client.test.ts
git commit -m "test(client): add request tracking coverage for refactor-002"
```

---

### Task 0.6: Add Tests for Server Event Handling

**Files:**
- Modify: `packages/server/tests/server.test.ts`

**Step 1: Write test for server event subscriptions**

```typescript
test('should emit listening event when server starts', async () => {
  const server = new LSPServer();
  const handler = jest.fn();
  
  server.onListening(handler);
  await server.listen(mockTransport);
  
  expect(handler).toHaveBeenCalledTimes(1);
});

test('should emit shutdown event when server closes', async () => {
  const server = new LSPServer();
  const handler = jest.fn();
  
  server.onShutdown(handler);
  await server.listen(mockTransport);
  await server.shutdown();
  
  expect(handler).toHaveBeenCalledTimes(1);
});
```

**Step 2: Write test for multiple subscriptions**

```typescript
test('should support multiple error event subscriptions', async () => {
  const server = new LSPServer();
  const handler1 = jest.fn();
  const handler2 = jest.fn();
  
  server.onError(handler1);
  server.onError(handler2);
  
  await server.listen(mockTransport);
  mockTransport.simulateError(new Error('Test error'));
  
  expect(handler1).toHaveBeenCalled();
  expect(handler2).toHaveBeenCalled();
});
```

**Step 3: Run tests**

```bash
pnpm test packages/server
```

Expected: All tests pass

**Step 4: Commit**

```bash
git add packages/server/tests/server.test.ts
git commit -m "test(server): add event handling coverage for refactor-002"
```

---

### Task 0.7: Add Tests for Server Transport and Handler Lifecycle

**Files:**
- Modify: `packages/server/tests/server.test.ts`

**Step 1: Write test for transport attachment**

```typescript
test('should attach transport handlers during listen', async () => {
  const server = new LSPServer();
  const mockTransport = createMockTransport();
  
  await server.listen(mockTransport);
  
  expect(mockTransport.onMessage).toHaveBeenCalled();
  expect(mockTransport.onError).toHaveBeenCalled();
  expect(mockTransport.onClose).toHaveBeenCalled();
});
```

**Step 2: Write test for handler registration and disposal**

```typescript
test('should register and call request handler', async () => {
  const server = new LSPServer();
  const handler = jest.fn().mockResolvedValue({ result: 'success' });
  
  const disposable = server.onRequest('test/method', handler);
  await server.listen(mockTransport);
  
  mockTransport.simulateRequest({ id: 1, method: 'test/method', params: {} });
  
  expect(handler).toHaveBeenCalled();
  disposable.dispose();
});

test('should not call handler after disposal', async () => {
  const server = new LSPServer();
  const handler = jest.fn();
  
  const disposable = server.onRequest('test/method', handler);
  disposable.dispose();
  
  await server.listen(mockTransport);
  mockTransport.simulateRequest({ id: 1, method: 'test/method', params: {} });
  
  expect(handler).not.toHaveBeenCalled();
});
```

**Step 3: Run tests**

```bash
pnpm test packages/server
```

Expected: All tests pass

**Step 4: Commit**

```bash
git add packages/server/tests/server.test.ts
git commit -m "test(server): add transport and handler coverage for refactor-002"
```

---

### Task 0.8: Verify Coverage and Update Documentation

**Files:**
- Modify: `.specify/specs/refactors/refactor-002-testing-gaps.md`

**Step 1: Run coverage report again**

```bash
pnpm test:coverage
```

**Step 2: Update testing-gaps.md with new coverage percentages**

Document coverage for each of the 8 areas:
- Client event handling: [X%] → [Y%] (improved)
- Client transport lifecycle: [X%] → [Y%] (improved)
- Client request tracking: [X%] → [Y%] (improved)
- Client handler registration: [X%] → [Y%] (improved)
- Server event handling: [X%] → [Y%] (improved)
- Server transport lifecycle: [X%] → [Y%] (improved)
- Server handler registration: [X%] → [Y%] (improved)
- Server cancellation tracking: [X%] → [Y%] (improved)

**Step 3: Mark testing gap assessment complete**

Update refactor-002.md Phase 0 checklist:
- [x] Testing gaps assessment completed
- [x] All critical gaps identified and addressed
- [x] Coverage meets 80% threshold
- [x] Ready to capture baseline metrics

**Step 4: Commit final documentation**

```bash
git add .specify/specs/refactors/refactor-002-testing-gaps.md .specify/specs/refactors/refactor-002.md
git commit -m "docs(refactor-002): complete Phase 0 testing gap assessment"
```

**Checkpoint:**
- [ ] Coverage report shows 80%+ for all affected areas
- [ ] At least 20 new tests added across client and server
- [ ] All tests passing (baseline + new tests)
- [ ] Documentation updated
- [ ] Ready to proceed to Phase 1 (baseline capture)

---

## Phase 1: Baseline Capture

**Duration:** 0.5 days (4 hours)
**Goal:** Capture comprehensive baseline metrics before refactoring begins

### Task 1.1: Run Baseline Measurement Script

**Files:**
- Execute: `.specify/extensions/workflows/refactor/measure-metrics.sh`
- Create: `.specify/specs/refactors/refactor-002-metrics-before.md`

**Step 1: Run automated metrics**

```bash
cd /Users/pmouli/GitHub.nosync/lspy
.specify/extensions/workflows/refactor/measure-metrics.sh --before refactor-002
```

Expected: Script generates metrics-before.md with automated measurements

**Step 2: Capture manual metrics**

```bash
# Lines of code
cloc packages/client/src/client.ts packages/server/src/server.ts

# Bundle sizes
pnpm build
du -sh packages/client/dist/* packages/server/dist/* packages/core/dist/*

# Test execution time
time pnpm test

# Build time
time pnpm build
```

**Step 3: Document manual metrics**

Add to metrics-before.md:
- Total lines: client.ts (647) + server.ts (458) = 1105
- Duplicate lines: 380 (67.86% duplication)
- Test execution time: [X seconds]
- Build time: [X seconds]
- Bundle sizes: client ([X KB]), server ([Y KB]), core ([Z KB])

**Step 4: Commit baseline**

```bash
git add .specify/specs/refactors/refactor-002-metrics-before.md
git commit -m "docs(refactor-002): capture baseline metrics"
```

---

### Task 1.2: Create Behavioral Snapshot

**Files:**
- Create: `.specify/specs/refactors/refactor-002-behavioral-snapshot.md`

**Step 1: Run all tests and capture output**

```bash
pnpm test > /tmp/baseline-tests.log 2>&1
```

**Step 2: Document test results**

Create behavioral-snapshot.md:
```markdown
# Refactor-002 Behavioral Snapshot

**Date:** 2026-02-09
**Commit:** [current commit hash]

## Test Results
- Total tests: 65
- Passing: 65
- Failing: 0
- Pass rate: 100%

## Test Execution
- Duration: [X seconds]
- No warnings
- No deprecation notices

## Key Behaviors Verified
1. Client connection lifecycle
2. Server listen/shutdown lifecycle
3. Request/response handling
4. Event subscription and emission
5. Handler registration and disposal
6. Transport error propagation
7. Cancellation token handling
8. Cleanup on connection close
```

**Step 3: Commit snapshot**

```bash
git add .specify/specs/refactors/refactor-002-behavioral-snapshot.md
git commit -m "docs(refactor-002): capture behavioral snapshot"
```

---

### Task 1.3: Tag Baseline State

**Files:**
- None (Git operation)

**Step 1: Create pre-refactor tag**

```bash
git tag -a pre-refactor-002 -m "Baseline before refactor-002: shared utilities refactoring"
```

**Step 2: Push tag to remote**

```bash
git push origin pre-refactor-002
```

**Step 3: Verify tag created**

```bash
git tag -l "pre-refactor-002"
git show pre-refactor-002 --stat
```

Expected: Tag shows current state with all baseline documentation

**Checkpoint:**
- [ ] Baseline metrics captured and documented
- [ ] Behavioral snapshot created
- [ ] Git tag created (pre-refactor-002)
- [ ] All tests passing (65/65)
- [ ] Ready to proceed to Phase 2 (implementation)

---

## Phase 2: Create Shared Utilities

**Duration:** 1 day (8 hours)
**Goal:** Build and test the four shared utilities in isolation

### Task 2.1: Create DisposableEventEmitter Utility

**Files:**
- Create: `packages/core/src/common/event-emitter.ts`
- Create: `packages/core/src/common/__tests__/event-emitter.test.ts`
- Modify: `packages/core/src/common/index.ts` (export)

**Step 1: Implement DisposableEventEmitter**

```typescript
// packages/core/src/common/event-emitter.ts
import { EventEmitter } from 'events';
import { Disposable } from '../utils/disposable';

/**
 * Event emitter with disposable subscription pattern.
 * Wraps Node.js EventEmitter to provide automatic Disposable cleanup.
 */
export class DisposableEventEmitter {
  private emitter: EventEmitter;

  constructor() {
    this.emitter = new EventEmitter();
  }

  /**
   * Subscribe to an event with automatic Disposable cleanup.
   * @param event Event name
   * @param handler Event handler function
   * @returns Disposable that removes the handler when disposed
   */
  on(event: string, handler: (...args: any[]) => void): Disposable {
    this.emitter.on(event, handler);
    return {
      dispose: () => {
        this.emitter.off(event, handler);
      },
    };
  }

  /**
   * Emit an event to all subscribed handlers.
   * @param event Event name
   * @param args Event arguments
   */
  emit(event: string, ...args: any[]): void {
    this.emitter.emit(event, ...args);
  }

  /**
   * Remove all event handlers.
   */
  dispose(): void {
    this.emitter.removeAllListeners();
  }
}
```

**Step 2: Create unit tests**

```typescript
// packages/core/src/common/__tests__/event-emitter.test.ts
import { DisposableEventEmitter } from '../event-emitter';

describe('DisposableEventEmitter', () => {
  let emitter: DisposableEventEmitter;

  beforeEach(() => {
    emitter = new DisposableEventEmitter();
  });

  test('should call handler when event is emitted', () => {
    const handler = jest.fn();
    emitter.on('test', handler);
    
    emitter.emit('test', 'arg1', 'arg2');
    
    expect(handler).toHaveBeenCalledWith('arg1', 'arg2');
    expect(handler).toHaveBeenCalledTimes(1);
  });

  test('should return disposable from on()', () => {
    const handler = jest.fn();
    const disposable = emitter.on('test', handler);
    
    expect(disposable).toHaveProperty('dispose');
    expect(typeof disposable.dispose).toBe('function');
  });

  test('should not call handler after disposal', () => {
    const handler = jest.fn();
    const disposable = emitter.on('test', handler);
    
    disposable.dispose();
    emitter.emit('test');
    
    expect(handler).not.toHaveBeenCalled();
  });

  test('should support multiple subscriptions to same event', () => {
    const handler1 = jest.fn();
    const handler2 = jest.fn();
    
    emitter.on('test', handler1);
    emitter.on('test', handler2);
    
    emitter.emit('test', 'data');
    
    expect(handler1).toHaveBeenCalledWith('data');
    expect(handler2).toHaveBeenCalledWith('data');
  });

  test('should only remove specific handler on dispose', () => {
    const handler1 = jest.fn();
    const handler2 = jest.fn();
    
    const disposable1 = emitter.on('test', handler1);
    emitter.on('test', handler2);
    
    disposable1.dispose();
    emitter.emit('test');
    
    expect(handler1).not.toHaveBeenCalled();
    expect(handler2).toHaveBeenCalled();
  });

  test('should remove all handlers on dispose()', () => {
    const handler1 = jest.fn();
    const handler2 = jest.fn();
    
    emitter.on('event1', handler1);
    emitter.on('event2', handler2);
    
    emitter.dispose();
    emitter.emit('event1');
    emitter.emit('event2');
    
    expect(handler1).not.toHaveBeenCalled();
    expect(handler2).not.toHaveBeenCalled();
  });

  test('should handle disposal idempotently', () => {
    const handler = jest.fn();
    const disposable = emitter.on('test', handler);
    
    disposable.dispose();
    disposable.dispose();
    
    // Should not throw
    expect(() => emitter.emit('test')).not.toThrow();
  });
});
```

**Step 3: Export from index**

```typescript
// packages/core/src/common/index.ts (add to existing exports)
export * from './event-emitter';
```

**Step 4: Run tests**

```bash
pnpm test packages/core/src/common/__tests__/event-emitter.test.ts
```

Expected: All 7 tests pass

**Step 5: Commit**

```bash
git add packages/core/src/common/event-emitter.ts packages/core/src/common/__tests__/event-emitter.test.ts packages/core/src/common/index.ts
git commit -m "feat(core): add DisposableEventEmitter utility for refactor-002"
```

---

### Task 2.2: Create HandlerRegistry Utility

**Files:**
- Create: `packages/core/src/common/handler-registry.ts`
- Create: `packages/core/src/common/__tests__/handler-registry.test.ts`
- Modify: `packages/core/src/common/index.ts`

**Step 1: Implement HandlerRegistry**

```typescript
// packages/core/src/common/handler-registry.ts
import { Disposable } from '../utils/disposable';

/**
 * Generic handler registry with type-safe method-to-handler mapping.
 * Provides Disposable registration pattern for LSP request/notification handlers.
 */
export class HandlerRegistry<T = any> {
  private handlers = new Map<string, T>();

  /**
   * Register a handler for a method.
   * @param method LSP method name
   * @param handler Handler function
   * @returns Disposable that unregisters the handler when disposed
   */
  register(method: string, handler: T): Disposable {
    this.handlers.set(method, handler);
    return {
      dispose: () => {
        this.handlers.delete(method);
      },
    };
  }

  /**
   * Get the handler for a method.
   * @param method LSP method name
   * @returns Handler function or undefined if not registered
   */
  get(method: string): T | undefined {
    return this.handlers.get(method);
  }

  /**
   * Check if a handler is registered for a method.
   * @param method LSP method name
   * @returns true if handler is registered
   */
  has(method: string): boolean {
    return this.handlers.has(method);
  }

  /**
   * Remove all handlers.
   */
  clear(): void {
    this.handlers.clear();
  }

  /**
   * Get the number of registered handlers.
   */
  get size(): number {
    return this.handlers.size;
  }
}
```

**Step 2: Create unit tests**

```typescript
// packages/core/src/common/__tests__/handler-registry.test.ts
import { HandlerRegistry } from '../handler-registry';

describe('HandlerRegistry', () => {
  test('should register and retrieve handler', () => {
    const registry = new HandlerRegistry<() => string>();
    const handler = () => 'result';
    
    registry.register('test/method', handler);
    
    expect(registry.get('test/method')).toBe(handler);
  });

  test('should return undefined for unregistered method', () => {
    const registry = new HandlerRegistry();
    
    expect(registry.get('unknown/method')).toBeUndefined();
  });

  test('should return disposable from register', () => {
    const registry = new HandlerRegistry();
    const handler = () => {};
    
    const disposable = registry.register('method', handler);
    
    expect(disposable).toHaveProperty('dispose');
    expect(typeof disposable.dispose).toBe('function');
  });

  test('should unregister handler on dispose', () => {
    const registry = new HandlerRegistry();
    const handler = () => {};
    
    const disposable = registry.register('method', handler);
    expect(registry.has('method')).toBe(true);
    
    disposable.dispose();
    expect(registry.has('method')).toBe(false);
  });

  test('should support has() check', () => {
    const registry = new HandlerRegistry();
    const handler = () => {};
    
    expect(registry.has('method')).toBe(false);
    
    registry.register('method', handler);
    expect(registry.has('method')).toBe(true);
  });

  test('should clear all handlers', () => {
    const registry = new HandlerRegistry();
    
    registry.register('method1', () => {});
    registry.register('method2', () => {});
    registry.register('method3', () => {});
    
    expect(registry.size).toBe(3);
    
    registry.clear();
    
    expect(registry.size).toBe(0);
    expect(registry.has('method1')).toBe(false);
  });

  test('should track size', () => {
    const registry = new HandlerRegistry();
    
    expect(registry.size).toBe(0);
    
    const disposable1 = registry.register('method1', () => {});
    expect(registry.size).toBe(1);
    
    registry.register('method2', () => {});
    expect(registry.size).toBe(2);
    
    disposable1.dispose();
    expect(registry.size).toBe(1);
  });

  test('should maintain type safety with generic parameter', () => {
    type TestHandler = (param: number) => string;
    const registry = new HandlerRegistry<TestHandler>();
    
    const handler: TestHandler = (n) => n.toString();
    registry.register('method', handler);
    
    const retrieved = registry.get('method');
    expect(retrieved).toBe(handler);
    
    // TypeScript should enforce type
    if (retrieved) {
      const result = retrieved(42);
      expect(result).toBe('42');
    }
  });

  test('should allow overwriting handler', () => {
    const registry = new HandlerRegistry<() => number>();
    const handler1 = () => 1;
    const handler2 = () => 2;
    
    registry.register('method', handler1);
    registry.register('method', handler2);
    
    const retrieved = registry.get('method');
    expect(retrieved).toBe(handler2);
    expect(retrieved?.()).toBe(2);
  });
});
```

**Step 3: Export from index**

```typescript
// packages/core/src/common/index.ts (add to existing exports)
export * from './handler-registry';
```

**Step 4: Run tests**

```bash
pnpm test packages/core/src/common/__tests__/handler-registry.test.ts
```

Expected: All 9 tests pass

**Step 5: Commit**

```bash
git add packages/core/src/common/handler-registry.ts packages/core/src/common/__tests__/handler-registry.test.ts packages/core/src/common/index.ts
git commit -m "feat(core): add HandlerRegistry utility for refactor-002"
```

---

### Task 2.3: Create TransportAttachment Utility

**Files:**
- Create: `packages/core/src/common/transport-attachment.ts`
- Create: `packages/core/src/common/__tests__/transport-attachment.test.ts`
- Modify: `packages/core/src/common/index.ts`

**Step 1: Implement TransportAttachment**

```typescript
// packages/core/src/common/transport-attachment.ts
import { DisposableStore } from '../utils/disposable';
import { Transport, Message } from '../protocol/types';

/**
 * Manages transport lifecycle with handler subscriptions.
 * Encapsulates the attach/detach pattern with onMessage/onError/onClose handlers.
 */
export class TransportAttachment {
  private transport?: Transport;
  private disposables = new DisposableStore();

  /**
   * Attach a transport with event handlers.
   * @param transport Transport to attach
   * @param handlers Event handlers for message, error, and close
   * @throws Error if transport is already attached
   */
  attach(
    transport: Transport,
    handlers: {
      onMessage: (msg: Message) => void | Promise<void>;
      onError: (err: Error) => void;
      onClose: () => void;
    }
  ): void {
    if (this.transport) {
      throw new Error('Transport already attached. Call detach() first.');
    }

    this.transport = transport;
    this.disposables.add(transport.onMessage(handlers.onMessage));
    this.disposables.add(transport.onError(handlers.onError));
    this.disposables.add(transport.onClose(handlers.onClose));
  }

  /**
   * Detach the transport and cleanup all handlers.
   */
  detach(): void {
    this.disposables.dispose();
    this.transport = undefined;
  }

  /**
   * Get the attached transport.
   * @returns Transport or undefined if not attached
   */
  getTransport(): Transport | undefined {
    return this.transport;
  }

  /**
   * Check if a transport is attached.
   * @returns true if transport is attached
   */
  isAttached(): boolean {
    return this.transport !== undefined;
  }

  /**
   * Send a message through the attached transport.
   * @param message Message to send
   * @throws Error if no transport is attached
   */
  async send(message: Message): Promise<void> {
    if (!this.transport) {
      throw new Error('No transport attached');
    }
    await this.transport.send(message);
  }
}
```

**Step 2: Create unit tests**

```typescript
// packages/core/src/common/__tests__/transport-attachment.test.ts
import { TransportAttachment } from '../transport-attachment';
import { Transport, Message } from '../../protocol/types';

function createMockTransport(): jest.Mocked<Transport> {
  return {
    onMessage: jest.fn().mockReturnValue({ dispose: jest.fn() }),
    onError: jest.fn().mockReturnValue({ dispose: jest.fn() }),
    onClose: jest.fn().mockReturnValue({ dispose: jest.fn() }),
    send: jest.fn().mockResolvedValue(undefined),
  };
}

describe('TransportAttachment', () => {
  let attachment: TransportAttachment;
  let mockTransport: jest.Mocked<Transport>;

  beforeEach(() => {
    attachment = new TransportAttachment();
    mockTransport = createMockTransport();
  });

  test('should attach transport with handlers', () => {
    const handlers = {
      onMessage: jest.fn(),
      onError: jest.fn(),
      onClose: jest.fn(),
    };

    attachment.attach(mockTransport, handlers);

    expect(mockTransport.onMessage).toHaveBeenCalledWith(handlers.onMessage);
    expect(mockTransport.onError).toHaveBeenCalledWith(handlers.onError);
    expect(mockTransport.onClose).toHaveBeenCalledWith(handlers.onClose);
    expect(attachment.isAttached()).toBe(true);
  });

  test('should throw error on double attach', () => {
    const handlers = {
      onMessage: jest.fn(),
      onError: jest.fn(),
      onClose: jest.fn(),
    };

    attachment.attach(mockTransport, handlers);

    expect(() => {
      attachment.attach(mockTransport, handlers);
    }).toThrow('Transport already attached');
  });

  test('should detach transport and dispose handlers', () => {
    const messageDisposable = { dispose: jest.fn() };
    const errorDisposable = { dispose: jest.fn() };
    const closeDisposable = { dispose: jest.fn() };

    mockTransport.onMessage.mockReturnValue(messageDisposable);
    mockTransport.onError.mockReturnValue(errorDisposable);
    mockTransport.onClose.mockReturnValue(closeDisposable);

    const handlers = {
      onMessage: jest.fn(),
      onError: jest.fn(),
      onClose: jest.fn(),
    };

    attachment.attach(mockTransport, handlers);
    attachment.detach();

    expect(messageDisposable.dispose).toHaveBeenCalled();
    expect(errorDisposable.dispose).toHaveBeenCalled();
    expect(closeDisposable.dispose).toHaveBeenCalled();
    expect(attachment.isAttached()).toBe(false);
  });

  test('should return transport from getTransport()', () => {
    const handlers = {
      onMessage: jest.fn(),
      onError: jest.fn(),
      onClose: jest.fn(),
    };

    expect(attachment.getTransport()).toBeUndefined();

    attachment.attach(mockTransport, handlers);
    expect(attachment.getTransport()).toBe(mockTransport);

    attachment.detach();
    expect(attachment.getTransport()).toBeUndefined();
  });

  test('should report attached status correctly', () => {
    const handlers = {
      onMessage: jest.fn(),
      onError: jest.fn(),
      onClose: jest.fn(),
    };

    expect(attachment.isAttached()).toBe(false);

    attachment.attach(mockTransport, handlers);
    expect(attachment.isAttached()).toBe(true);

    attachment.detach();
    expect(attachment.isAttached()).toBe(false);
  });

  test('should send message through transport', async () => {
    const handlers = {
      onMessage: jest.fn(),
      onError: jest.fn(),
      onClose: jest.fn(),
    };
    const message = { jsonrpc: '2.0', method: 'test' } as Message;

    attachment.attach(mockTransport, handlers);
    await attachment.send(message);

    expect(mockTransport.send).toHaveBeenCalledWith(message);
  });

  test('should throw error when sending without transport', async () => {
    const message = { jsonrpc: '2.0', method: 'test' } as Message;

    await expect(attachment.send(message)).rejects.toThrow(
      'No transport attached'
    );
  });

  test('should allow re-attach after detach', () => {
    const handlers = {
      onMessage: jest.fn(),
      onError: jest.fn(),
      onClose: jest.fn(),
    };

    attachment.attach(mockTransport, handlers);
    attachment.detach();
    
    // Should not throw
    expect(() => {
      attachment.attach(mockTransport, handlers);
    }).not.toThrow();
    
    expect(attachment.isAttached()).toBe(true);
  });
});
```

**Step 3: Export from index**

```typescript
// packages/core/src/common/index.ts (add to existing exports)
export * from './transport-attachment';
```

**Step 4: Run tests**

```bash
pnpm test packages/core/src/common/__tests__/transport-attachment.test.ts
```

Expected: All 8 tests pass

**Step 5: Commit**

```bash
git add packages/core/src/common/transport-attachment.ts packages/core/src/common/__tests__/transport-attachment.test.ts packages/core/src/common/index.ts
git commit -m "feat(core): add TransportAttachment utility for refactor-002"
```

---

### Task 2.4: Create PendingRequestTracker Utility

**Files:**
- Create: `packages/core/src/common/pending-requests.ts`
- Create: `packages/core/src/common/__tests__/pending-requests.test.ts`
- Modify: `packages/core/src/common/index.ts`

**Step 1: Implement PendingRequestTracker**

```typescript
// packages/core/src/common/pending-requests.ts

/**
 * Tracks pending LSP requests with promise lifecycle management.
 * Manages request ID to promise resolver mapping with cancellation support.
 */
export class PendingRequestTracker {
  private pending = new Map<
    number | string,
    {
      resolve: (value: any) => void;
      reject: (error: Error) => void;
      method: string;
      cancel?: () => void;
    }
  >();

  /**
   * Track a new pending request.
   * @param id Request ID
   * @param method LSP method name
   * @param resolve Promise resolve function
   * @param reject Promise reject function
   * @param cancel Optional cancellation callback
   */
  track(
    id: number | string,
    method: string,
    resolve: (value: any) => void,
    reject: (error: Error) => void,
    cancel?: () => void
  ): void {
    this.pending.set(id, { resolve, reject, method, cancel });
  }

  /**
   * Resolve a pending request.
   * @param id Request ID
   * @param value Response value
   * @returns true if request was found and resolved
   */
  resolve(id: number | string, value: any): boolean {
    const entry = this.pending.get(id);
    if (!entry) {
      return false;
    }

    this.pending.delete(id);
    entry.resolve(value);
    return true;
  }

  /**
   * Reject a pending request.
   * @param id Request ID
   * @param error Error to reject with
   * @returns true if request was found and rejected
   */
  reject(id: number | string, error: Error): boolean {
    const entry = this.pending.get(id);
    if (!entry) {
      return false;
    }

    this.pending.delete(id);
    entry.reject(error);
    return true;
  }

  /**
   * Cancel a pending request.
   * Calls the cancel callback if provided, then rejects the promise.
   * @param id Request ID
   * @returns true if request was found and cancelled
   */
  cancel(id: number | string): boolean {
    const entry = this.pending.get(id);
    if (!entry) {
      return false;
    }

    this.pending.delete(id);
    if (entry.cancel) {
      entry.cancel();
    }
    entry.reject(new Error(`Request '${entry.method}' was cancelled`));
    return true;
  }

  /**
   * Clear all pending requests with a rejection reason.
   * @param reason Reason for clearing (e.g., 'Connection closed')
   */
  clear(reason: string = 'Cleared'): void {
    for (const [id, entry] of this.pending.entries()) {
      entry.reject(new Error(`${reason}: ${entry.method}`));
    }
    this.pending.clear();
  }

  /**
   * Check if a request is pending.
   * @param id Request ID
   * @returns true if request is pending
   */
  has(id: number | string): boolean {
    return this.pending.has(id);
  }

  /**
   * Get the number of pending requests.
   */
  get size(): number {
    return this.pending.size;
  }

  /**
   * Get the method name for a pending request.
   * @param id Request ID
   * @returns Method name or undefined if not found
   */
  getMethod(id: number | string): string | undefined {
    return this.pending.get(id)?.method;
  }
}
```

**Step 2: Create unit tests**

```typescript
// packages/core/src/common/__tests__/pending-requests.test.ts
import { PendingRequestTracker } from '../pending-requests';

describe('PendingRequestTracker', () => {
  let tracker: PendingRequestTracker;

  beforeEach(() => {
    tracker = new PendingRequestTracker();
  });

  test('should track pending request', () => {
    const resolve = jest.fn();
    const reject = jest.fn();

    tracker.track(1, 'test/method', resolve, reject);

    expect(tracker.has(1)).toBe(true);
    expect(tracker.size).toBe(1);
    expect(tracker.getMethod(1)).toBe('test/method');
  });

  test('should resolve pending request', () => {
    const resolve = jest.fn();
    const reject = jest.fn();

    tracker.track(1, 'test/method', resolve, reject);
    const result = tracker.resolve(1, { data: 'success' });

    expect(result).toBe(true);
    expect(resolve).toHaveBeenCalledWith({ data: 'success' });
    expect(reject).not.toHaveBeenCalled();
    expect(tracker.has(1)).toBe(false);
  });

  test('should reject pending request', () => {
    const resolve = jest.fn();
    const reject = jest.fn();
    const error = new Error('Test error');

    tracker.track(1, 'test/method', resolve, reject);
    const result = tracker.reject(1, error);

    expect(result).toBe(true);
    expect(reject).toHaveBeenCalledWith(error);
    expect(resolve).not.toHaveBeenCalled();
    expect(tracker.has(1)).toBe(false);
  });

  test('should return false when resolving non-existent request', () => {
    const result = tracker.resolve(999, 'value');

    expect(result).toBe(false);
  });

  test('should return false when rejecting non-existent request', () => {
    const result = tracker.reject(999, new Error('error'));

    expect(result).toBe(false);
  });

  test('should cancel pending request', () => {
    const resolve = jest.fn();
    const reject = jest.fn();
    const cancel = jest.fn();

    tracker.track(1, 'test/method', resolve, reject, cancel);
    const result = tracker.cancel(1);

    expect(result).toBe(true);
    expect(cancel).toHaveBeenCalled();
    expect(reject).toHaveBeenCalledWith(
      expect.objectContaining({
        message: expect.stringContaining('was cancelled'),
      })
    );
    expect(resolve).not.toHaveBeenCalled();
    expect(tracker.has(1)).toBe(false);
  });

  test('should cancel without cancel callback', () => {
    const resolve = jest.fn();
    const reject = jest.fn();

    tracker.track(1, 'test/method', resolve, reject);
    const result = tracker.cancel(1);

    expect(result).toBe(true);
    expect(reject).toHaveBeenCalled();
    expect(tracker.has(1)).toBe(false);
  });

  test('should clear all pending requests', () => {
    const resolve1 = jest.fn();
    const reject1 = jest.fn();
    const resolve2 = jest.fn();
    const reject2 = jest.fn();
    const resolve3 = jest.fn();
    const reject3 = jest.fn();

    tracker.track(1, 'method1', resolve1, reject1);
    tracker.track(2, 'method2', resolve2, reject2);
    tracker.track(3, 'method3', resolve3, reject3);

    expect(tracker.size).toBe(3);

    tracker.clear('Connection closed');

    expect(tracker.size).toBe(0);
    expect(reject1).toHaveBeenCalledWith(
      expect.objectContaining({
        message: 'Connection closed: method1',
      })
    );
    expect(reject2).toHaveBeenCalledWith(
      expect.objectContaining({
        message: 'Connection closed: method2',
      })
    );
    expect(reject3).toHaveBeenCalledWith(
      expect.objectContaining({
        message: 'Connection closed: method3',
      })
    );
  });

  test('should track multiple concurrent requests', () => {
    const requests = [
      { id: 1, method: 'method1', resolve: jest.fn(), reject: jest.fn() },
      { id: 2, method: 'method2', resolve: jest.fn(), reject: jest.fn() },
      { id: 3, method: 'method3', resolve: jest.fn(), reject: jest.fn() },
    ];

    requests.forEach((req) => {
      tracker.track(req.id, req.method, req.resolve, req.reject);
    });

    expect(tracker.size).toBe(3);
    expect(tracker.has(1)).toBe(true);
    expect(tracker.has(2)).toBe(true);
    expect(tracker.has(3)).toBe(true);

    // Resolve out of order
    tracker.resolve(2, 'result2');
    expect(requests[1].resolve).toHaveBeenCalledWith('result2');
    expect(tracker.size).toBe(2);

    tracker.resolve(1, 'result1');
    tracker.resolve(3, 'result3');
    expect(tracker.size).toBe(0);
  });

  test('should handle string IDs', () => {
    const resolve = jest.fn();
    const reject = jest.fn();

    tracker.track('request-abc', 'test/method', resolve, reject);

    expect(tracker.has('request-abc')).toBe(true);
    tracker.resolve('request-abc', 'success');
    expect(resolve).toHaveBeenCalledWith('success');
  });

  test('should return undefined for non-existent method', () => {
    expect(tracker.getMethod(999)).toBeUndefined();
  });

  test('should handle edge case of clearing empty tracker', () => {
    expect(() => {
      tracker.clear('Test reason');
    }).not.toThrow();
    expect(tracker.size).toBe(0);
  });
});
```

**Step 3: Export from index**

```typescript
// packages/core/src/common/index.ts (add to existing exports)
export * from './pending-requests';
```

**Step 4: Run tests**

```bash
pnpm test packages/core/src/common/__tests__/pending-requests.test.ts
```

Expected: All 13 tests pass

**Step 5: Commit**

```bash
git add packages/core/src/common/pending-requests.ts packages/core/src/common/__tests__/pending-requests.test.ts packages/core/src/common/index.ts
git commit -m "feat(core): add PendingRequestTracker utility for refactor-002"
```

**Checkpoint:**
- [ ] All 4 utilities created with complete implementations
- [ ] All utility tests passing (7 + 9 + 8 + 13 = 37 new tests)
- [ ] Utilities exported from core/common/index.ts
- [ ] Each utility in separate commit
- [ ] Ready to proceed to Phase 3 (integration)

---

## Phase 3: Integrate Utilities into Client

**Duration:** 1 day (8 hours)
**Goal:** Replace inline implementations in client.ts with shared utilities

### Task 3.1: Integrate DisposableEventEmitter in Client

**Files:**
- Modify: `packages/client/src/client.ts`

**Step 1: Import DisposableEventEmitter**

```typescript
// Add to imports at top of client.ts
import { DisposableEventEmitter } from '@lspeasy/core/common';
```

**Step 2: Replace EventEmitter with DisposableEventEmitter**

Find:
```typescript
private events: EventEmitter;
```

Replace with:
```typescript
private eventManager: DisposableEventEmitter;
```

**Step 3: Update constructor**

Find:
```typescript
this.events = new EventEmitter();
```

Replace with:
```typescript
this.eventManager = new DisposableEventEmitter();
```

**Step 4: Simplify onConnected() method**

Find:
```typescript
onConnected(handler: () => void): Disposable {
  this.events.on('connected', handler);
  return {
    dispose: () => {
      this.events.off('connected', handler);
    },
  };
}
```

Replace with:
```typescript
onConnected(handler: () => void): Disposable {
  return this.eventManager.on('connected', handler);
}
```

**Step 5: Simplify onDisconnected() method**

Find:
```typescript
onDisconnected(handler: () => void): Disposable {
  this.events.on('disconnected', handler);
  return {
    dispose: () => {
      this.events.off('disconnected', handler);
    },
  };
}
```

Replace with:
```typescript
onDisconnected(handler: () => void): Disposable {
  return this.eventManager.on('disconnected', handler);
}
```

**Step 6: Simplify onError() method**

Find:
```typescript
onError(handler: (error: Error) => void): Disposable {
  this.events.on('error', handler);
  return {
    dispose: () => {
      this.events.off('error', handler);
    },
  };
}
```

Replace with:
```typescript
onError(handler: (error: Error) => void): Disposable {
  return this.eventManager.on('error', handler);
}
```

**Step 7: Update event emissions**

Find all instances of:
```typescript
this.events.emit('connected');
this.events.emit('disconnected');
this.events.emit('error', error);
```

Replace with:
```typescript
this.eventManager.emit('connected');
this.eventManager.emit('disconnected');
this.eventManager.emit('error', error);
```

**Step 8: Update dispose() method**

Find:
```typescript
this.events.removeAllListeners();
```

Replace with:
```typescript
this.eventManager.dispose();
```

**Step 9: Run tests**

```bash
pnpm test packages/client
```

Expected: All existing client tests pass (no behavior change)

**Step 10: Verify line reduction**

```bash
git diff --stat packages/client/src/client.ts
```

Expected: Approximately 15-18 lines removed

**Step 11: Commit**

```bash
git add packages/client/src/client.ts
git commit -m "refactor(client): use DisposableEventEmitter utility (refactor-002)"
```

---

### Task 3.2: Integrate HandlerRegistry in Client

**Files:**
- Modify: `packages/client/src/client.ts`

**Step 1: Import HandlerRegistry**

```typescript
// Add to imports
import { HandlerRegistry } from '@lspeasy/core/common';
```

**Step 2: Replace handler Maps with HandlerRegistry**

Find:
```typescript
private requestHandlers: Map<string, RequestHandler>;
private notificationHandlers: Map<string, NotificationHandler>;
```

Replace with:
```typescript
private requestHandlers: HandlerRegistry<RequestHandler>;
private notificationHandlers: HandlerRegistry<NotificationHandler>;
```

**Step 3: Update constructor initialization**

Find:
```typescript
this.requestHandlers = new Map();
this.notificationHandlers = new Map();
```

Replace with:
```typescript
this.requestHandlers = new HandlerRegistry<RequestHandler>();
this.notificationHandlers = new HandlerRegistry<NotificationHandler>();
```

**Step 4: Simplify onRequest() method**

Find:
```typescript
onRequest<P, R>(method: string, handler: RequestHandler<P, R>): Disposable {
  this.requestHandlers.set(method, handler);
  return {
    dispose: () => {
      this.requestHandlers.delete(method);
    },
  };
}
```

Replace with:
```typescript
onRequest<P, R>(method: string, handler: RequestHandler<P, R>): Disposable {
  return this.requestHandlers.register(method, handler);
}
```

**Step 5: Simplify onNotification() method**

Find:
```typescript
onNotification<P>(method: string, handler: NotificationHandler<P>): Disposable {
  this.notificationHandlers.set(method, handler);
  return {
    dispose: () => {
      this.notificationHandlers.delete(method);
    },
  };
}
```

Replace with:
```typescript
onNotification<P>(method: string, handler: NotificationHandler<P>): Disposable {
  return this.notificationHandlers.register(method, handler);
}
```

**Step 6: Update handler lookups**

Find instances of:
```typescript
const handler = this.requestHandlers.get(method);
const handler = this.notificationHandlers.get(method);
```

These remain the same (HandlerRegistry has same get() method)

**Step 7: Run tests**

```bash
pnpm test packages/client
```

Expected: All tests pass

**Step 8: Commit**

```bash
git add packages/client/src/client.ts
git commit -m "refactor(client): use HandlerRegistry utility (refactor-002)"
```

---

### Task 3.3: Integrate TransportAttachment in Client

**Files:**
- Modify: `packages/client/src/client.ts`

**Step 1: Import TransportAttachment**

```typescript
// Add to imports
import { TransportAttachment } from '@lspeasy/core/common';
```

**Step 2: Replace transport fields with TransportAttachment**

Find:
```typescript
private transport?: Transport;
private transportDisposables: Disposable[] = [];
```

Replace with:
```typescript
private transportAttachment: TransportAttachment;
```

**Step 3: Update constructor**

Add:
```typescript
this.transportAttachment = new TransportAttachment();
```

**Step 4: Refactor connect() method**

Find the transport attachment code (approximately):
```typescript
this.transport = transport;
this.transportDisposables.push(
  transport.onMessage(this.handleMessage.bind(this)),
  transport.onError(this.handleError.bind(this)),
  transport.onClose(this.handleClose.bind(this))
);
```

Replace with:
```typescript
this.transportAttachment.attach(transport, {
  onMessage: this.handleMessage.bind(this),
  onError: this.handleError.bind(this),
  onClose: this.handleClose.bind(this),
});
```

**Step 5: Refactor disconnect/handleClose methods**

Find:
```typescript
for (const disposable of this.transportDisposables) {
  disposable.dispose();
}
this.transportDisposables = [];
this.transport = undefined;
```

Replace with:
```typescript
this.transportAttachment.detach();
```

**Step 6: Update transport access**

Find instances of:
```typescript
if (!this.transport) {
  throw new Error('Not connected');
}
await this.transport.send(message);
```

Replace with:
```typescript
if (!this.transportAttachment.isAttached()) {
  throw new Error('Not connected');
}
await this.transportAttachment.send(message);
```

Or use getTransport() where needed:
```typescript
const transport = this.transportAttachment.getTransport();
if (!transport) {
  throw new Error('Not connected');
}
await transport.send(message);
```

**Step 7: Run tests**

```bash
pnpm test packages/client
```

Expected: All tests pass

**Step 8: Verify reduction**

```bash
git diff --stat packages/client/src/client.ts
```

Expected: Approximately 20-25 lines removed

**Step 9: Commit**

```bash
git add packages/client/src/client.ts
git commit -m "refactor(client): use TransportAttachment utility (refactor-002)"
```

---

### Task 3.4: Integrate PendingRequestTracker in Client

**Files:**
- Modify: `packages/client/src/client.ts`

**Step 1: Import PendingRequestTracker**

```typescript
// Add to imports
import { PendingRequestTracker } from '@lspeasy/core/common';
```

**Step 2: Replace pendingRequests Map**

Find:
```typescript
private pendingRequests: Map<number, {
  resolve: (value: any) => void;
  reject: (error: Error) => void;
  method: string;
}>;
```

Replace with:
```typescript
private requestTracker: PendingRequestTracker;
```

**Step 3: Update constructor**

Find:
```typescript
this.pendingRequests = new Map();
```

Replace with:
```typescript
this.requestTracker = new PendingRequestTracker();
```

**Step 4: Refactor sendRequest() method**

Find (approximately):
```typescript
const id = this.nextRequestId++;
const promise = new Promise((resolve, reject) => {
  this.pendingRequests.set(id, {
    resolve,
    reject,
    method,
  });
  
  if (cancellationToken) {
    cancellationToken.onCancellationRequested(() => {
      this.sendNotification('$/cancelRequest', { id });
      this.pendingRequests.delete(id);
      reject(new Error('Request was cancelled'));
    });
  }
});

await this.transport.send({ jsonrpc: '2.0', id, method, params });
return promise;
```

Replace with:
```typescript
const id = this.nextRequestId++;
const promise = new Promise((resolve, reject) => {
  const cancel = cancellationToken
    ? () => {
        this.sendNotification('$/cancelRequest', { id });
      }
    : undefined;
    
  this.requestTracker.track(id, method, resolve, reject, cancel);
  
  if (cancellationToken) {
    cancellationToken.onCancellationRequested(() => {
      this.requestTracker.cancel(id);
    });
  }
});

await this.transportAttachment.send({ jsonrpc: '2.0', id, method, params });
return promise;
```

**Step 5: Refactor handleResponse() method**

Find (approximately):
```typescript
const entry = this.pendingRequests.get(id);
if (!entry) {
  return; // Response for unknown request
}

this.pendingRequests.delete(id);

if (response.error) {
  entry.reject(new Error(response.error.message));
} else {
  entry.resolve(response.result);
}
```

Replace with:
```typescript
if (response.error) {
  this.requestTracker.reject(id, new Error(response.error.message));
} else {
  this.requestTracker.resolve(id, response.result);
}
```

**Step 6: Refactor handleClose() cleanup**

Find:
```typescript
for (const [id, entry] of this.pendingRequests.entries()) {
  entry.reject(new Error('Connection closed'));
}
this.pendingRequests.clear();
```

Replace with:
```typescript
this.requestTracker.clear('Connection closed');
```

**Step 7: Run tests**

```bash
pnpm test packages/client
```

Expected: All tests pass

**Step 8: Verify reduction**

```bash
git diff --stat packages/client/src/client.ts
```

Expected: Approximately 30-40 lines removed

**Step 9: Commit**

```bash
git add packages/client/src/client.ts
git commit -m "refactor(client): use PendingRequestTracker utility (refactor-002)"
```

**Checkpoint:**
- [ ] All 4 utilities integrated into client.ts
- [ ] All client tests passing (no behavior change)
- [ ] Approximately 70-85 lines removed from client.ts
- [ ] Each integration in separate commit
- [ ] Ready to proceed to server integration

---

## Phase 4: Integrate Utilities into Server

**Duration:** 1 day (8 hours)
**Goal:** Replace inline implementations in server.ts with shared utilities

### Task 4.1: Integrate DisposableEventEmitter in Server

**Files:**
- Modify: `packages/server/src/server.ts`

**Step 1: Import DisposableEventEmitter**

```typescript
// Add to imports
import { DisposableEventEmitter } from '@lspeasy/core/common';
```

**Step 2: Replace EventEmitter**

Find:
```typescript
private events: EventEmitter;
```

Replace with:
```typescript
private eventManager: DisposableEventEmitter;
```

**Step 3: Update constructor**

Find:
```typescript
this.events = new EventEmitter();
```

Replace with:
```typescript
this.eventManager = new DisposableEventEmitter();
```

**Step 4: Simplify event subscription methods**

Simplify onListening(), onShutdown(), onError() similar to client:

```typescript
onListening(handler: () => void): Disposable {
  return this.eventManager.on('listening', handler);
}

onShutdown(handler: () => void): Disposable {
  return this.eventManager.on('shutdown', handler);
}

onError(handler: (error: Error) => void): Disposable {
  return this.eventManager.on('error', handler);
}
```

**Step 5: Update event emissions**

Replace:
```typescript
this.events.emit('listening');
this.events.emit('shutdown');
this.events.emit('error', error);
```

With:
```typescript
this.eventManager.emit('listening');
this.eventManager.emit('shutdown');
this.eventManager.emit('error', error);
```

**Step 6: Update cleanup**

Replace:
```typescript
this.events.removeAllListeners();
```

With:
```typescript
this.eventManager.dispose();
```

**Step 7: Run tests**

```bash
pnpm test packages/server
```

Expected: All server tests pass

**Step 8: Commit**

```bash
git add packages/server/src/server.ts
git commit -m "refactor(server): use DisposableEventEmitter utility (refactor-002)"
```

---

### Task 4.2: Integrate HandlerRegistry in Server (via Dispatcher)

**Files:**
- Modify: `packages/server/src/dispatcher.ts` (if applicable)
- Modify: `packages/server/src/server.ts`

**Step 1: Evaluate dispatcher architecture**

Read dispatcher.ts to understand current handler storage:
```bash
cat packages/server/src/dispatcher.ts | head -100
```

**Step 2: Decision point**

If dispatcher already uses Map-based storage similar to HandlerRegistry:
- Consider updating dispatcher to use HandlerRegistry internally
- This may provide minimal benefit if dispatcher has additional logic

If dispatcher has complex logic beyond simple Map:
- Document decision to keep dispatcher as-is
- Focus HandlerRegistry integration in client only

**Step 3: Document decision**

Add comment to refactor-002.md:
```markdown
### Design Decision: Dispatcher Integration
Decision: [Keep dispatcher as-is / Integrate HandlerRegistry]
Rationale: [Explanation]
Impact: [Lines saved or not saved]
```

**Step 4: Run tests**

```bash
pnpm test packages/server
```

Expected: All tests pass

**Step 5: Commit (if changes made)**

```bash
git add packages/server/src/dispatcher.ts .specify/specs/refactors/refactor-002.md
git commit -m "refactor(server): evaluate HandlerRegistry in dispatcher (refactor-002)"
```

---

### Task 4.3: Integrate TransportAttachment in Server

**Files:**
- Modify: `packages/server/src/server.ts`

**Step 1: Import TransportAttachment**

```typescript
// Add to imports
import { TransportAttachment } from '@lspeasy/core/common';
```

**Step 2: Replace transport fields**

Find:
```typescript
private transport?: Transport;
private disposables: Disposable[] = [];
```

Replace transport-specific disposables with:
```typescript
private transportAttachment: TransportAttachment;
private disposables: Disposable[] = []; // Keep for non-transport disposables
```

**Step 3: Update constructor**

Add:
```typescript
this.transportAttachment = new TransportAttachment();
```

**Step 4: Refactor listen() method**

Find transport attachment code:
```typescript
this.transport = transport;
this.disposables.push(
  transport.onMessage(this.handleMessage.bind(this)),
  transport.onError(this.handleError.bind(this)),
  transport.onClose(this.handleClose.bind(this))
);
```

Replace with:
```typescript
this.transportAttachment.attach(transport, {
  onMessage: this.handleMessage.bind(this),
  onError: this.handleError.bind(this),
  onClose: this.handleClose.bind(this),
});
```

**Step 5: Refactor close/shutdown methods**

Find transport detachment code and replace with:
```typescript
this.transportAttachment.detach();
```

**Step 6: Update transport access**

Replace direct transport access with:
```typescript
this.transportAttachment.send(message);
// or
const transport = this.transportAttachment.getTransport();
```

**Step 7: Run tests**

```bash
pnpm test packages/server
```

Expected: All tests pass

**Step 8: Commit**

```bash
git add packages/server/src/server.ts
git commit -m "refactor(server): use TransportAttachment utility (refactor-002)"
```

---

### Task 4.4: Integrate PendingRequestTracker for Cancellation (Server)

**Files:**
- Modify: `packages/server/src/server.ts`

**Step 1: Import PendingRequestTracker**

```typescript
// Add to imports
import { PendingRequestTracker } from '@lspeasy/core/common';
```

**Step 2: Evaluate current cancellation token storage**

Review how server stores cancellation tokens:
```typescript
private cancellationTokens: Map<number | string, AbortController>;
```

**Step 3: Decision: Adapt or create specialized tracker**

Option A: Use PendingRequestTracker for cancellation tokens
- May need adapter since server doesn't track promises, just AbortControllers

Option B: Keep cancellation token Map as-is
- Document decision if PendingRequestTracker doesn't fit server use case

**Step 4: Implement chosen approach**

If using PendingRequestTracker:
```typescript
private cancellationTracker: PendingRequestTracker;

// Store cancellation token with dummy promise
storeCancellationToken(id, abortController) {
  this.cancellationTracker.track(
    id,
    'cancellation',
    () => {}, // No-op resolve
    () => {}, // No-op reject
    () => abortController.abort()
  );
}

cancelRequest(id) {
  this.cancellationTracker.cancel(id);
}
```

If keeping Map:
```typescript
// Document decision in refactor-002.md
// No changes needed
```

**Step 5: Run tests**

```bash
pnpm test packages/server
```

Expected: All tests pass

**Step 6: Commit**

```bash
git add packages/server/src/server.ts .specify/specs/refactors/refactor-002.md
git commit -m "refactor(server): evaluate PendingRequestTracker for cancellation (refactor-002)"
```

**Checkpoint:**
- [ ] DisposableEventEmitter integrated in server
- [ ] TransportAttachment integrated in server
- [ ] HandlerRegistry evaluated for dispatcher
- [ ] PendingRequestTracker evaluated for cancellation
- [ ] All server tests passing
- [ ] Design decisions documented
- [ ] Ready for final cleanup

---

## Phase 5: Final Cleanup and Verification

**Duration:** 0.5 days (4 hours)
**Goal:** Clean up code, verify all goals met, prepare for review

### Task 5.1: Use DisposableStore for Remaining Cleanup

**Files:**
- Modify: `packages/client/src/client.ts`
- Modify: `packages/server/src/server.ts`

**Step 1: Review remaining Disposable[] arrays**

Check if client or server still has manual disposable arrays:
```bash
grep -n "Disposable\[\]" packages/client/src/client.ts packages/server/src/server.ts
```

**Step 2: Import DisposableStore**

```typescript
// Already in core, import where needed
import { DisposableStore } from '@lspeasy/core/utils';
```

**Step 3: Replace arrays with DisposableStore**

Find:
```typescript
private disposables: Disposable[] = [];

// Adding
this.disposables.push(disposable);

// Cleanup
for (const d of this.disposables) {
  d.dispose();
}
this.disposables = [];
```

Replace with:
```typescript
private disposables = new DisposableStore();

// Adding
this.disposables.add(disposable);

// Cleanup
this.disposables.dispose();
```

**Step 4: Run tests**

```bash
pnpm test
```

Expected: All 65+ tests pass

**Step 5: Commit**

```bash
git add packages/client/src/client.ts packages/server/src/server.ts
git commit -m "refactor(client,server): use DisposableStore for cleanup (refactor-002)"
```

---

### Task 5.2: Remove Dead Code and Clean Up

**Files:**
- Modify: `packages/client/src/client.ts`
- Modify: `packages/server/src/server.ts`

**Step 1: Search for commented-out code**

```bash
grep -n "^\\s*//" packages/client/src/client.ts | grep -i "old\|todo\|fixme\|temp"
grep -n "^\\s*//" packages/server/src/server.ts | grep -i "old\|todo\|fixme\|temp"
```

**Step 2: Remove any refactoring artifacts**

- Old commented-out implementations
- Temporary debugging console.logs
- Unused imports

**Step 3: Remove unused imports**

Run linter to identify unused imports:
```bash
pnpm lint --fix
```

**Step 4: Run tests**

```bash
pnpm test
```

Expected: All tests pass

**Step 5: Commit**

```bash
git add packages/client/src/client.ts packages/server/src/server.ts
git commit -m "chore(refactor-002): remove dead code and clean up"
```

---

### Task 5.3: Verify All Tests Pass

**Files:**
- None (verification only)

**Step 1: Run full test suite**

```bash
pnpm test
```

Expected: All tests pass (65 original + 37 new utility tests = 102+ total)

**Step 2: Check for warnings**

Review test output for:
- Deprecation warnings
- Console errors
- Unhandled promise rejections

**Step 3: Document results**

If all tests pass:
```markdown
✓ All 102 tests passing
✓ No warnings
✓ No errors
```

If any issues:
- Fix immediately
- Re-run tests
- Don't proceed until 100% pass rate

**Step 4: Capture test output**

```bash
pnpm test > /tmp/refactor-002-final-tests.log 2>&1
```

---

### Task 5.4: Measure Final Metrics

**Files:**
- Create: `.specify/specs/refactors/refactor-002-metrics-after.md`

**Step 1: Run metrics script**

```bash
.specify/extensions/workflows/refactor/measure-metrics.sh --after refactor-002
```

**Step 2: Capture manual metrics**

```bash
# Lines of code
cloc packages/client/src/client.ts packages/server/src/server.ts

# Bundle sizes
pnpm build
du -sh packages/client/dist/* packages/server/dist/* packages/core/dist/*

# Test execution time
time pnpm test

# Build time
time pnpm build
```

**Step 3: Calculate reductions**

Compare to baseline:
- client.ts: 647 lines → [X lines] = [Y lines removed]
- server.ts: 458 lines → [X lines] = [Y lines removed]
- Total reduction: [Z lines] (target: 380 lines)
- Duplication rate: 67.86% → [X%] (target: <10%)

**Step 4: Create metrics-after.md**

Document all measurements with comparison to baseline.

**Step 5: Commit metrics**

```bash
git add .specify/specs/refactors/refactor-002-metrics-after.md
git commit -m "docs(refactor-002): capture final metrics"
```

---

### Task 5.5: Verify Success Criteria

**Files:**
- Update: `.specify/specs/refactors/refactor-002.md`

**Step 1: Check each success criterion**

- [ ] All 65 tests passing without modification: [✓/✗]
- [ ] Code duplication <10%: [X%] [✓/✗]
- [ ] ~380 lines removed: [X lines] [✓/✗]
- [ ] No breaking API changes: [✓/✗]
- [ ] No performance regression >5%: [✓/✗]
- [ ] Improved type safety: [✓/✗]
- [ ] Granular commits: [✓/✗]

**Step 2: Document any deviations**

If any criterion not met:
- Document why
- Assess impact
- Decide if acceptable or needs fixing

**Step 3: Update refactor-002.md**

Mark verification checklist complete in spec file.

**Step 4: Commit**

```bash
git add .specify/specs/refactors/refactor-002.md
git commit -m "docs(refactor-002): verify success criteria met"
```

**Checkpoint:**
- [ ] All cleanup complete
- [ ] All tests passing (100%)
- [ ] Metrics captured and compared
- [ ] Success criteria verified
- [ ] Ready for documentation and review

---

## Phase 6: Documentation and PR Preparation

**Duration:** 0.5 days (4 hours)
**Goal:** Document changes, prepare for code review and merge

### Task 6.1: Update JSDoc and Code Comments

**Files:**
- Review: `packages/client/src/client.ts`
- Review: `packages/server/src/server.ts`
- Review: All utility files in `packages/core/src/common/`

**Step 1: Review existing JSDoc**

Ensure all public methods have:
- Brief description
- @param tags
- @returns tags
- @throws tags (if applicable)

**Step 2: Add high-level comments**

Add comments explaining major refactoring points:
```typescript
// Event management delegated to DisposableEventEmitter utility
private eventManager: DisposableEventEmitter;

// Request tracking delegated to PendingRequestTracker utility
private requestTracker: PendingRequestTracker;
```

**Step 3: Verify utility documentation**

Check that all 4 utilities have:
- Class-level JSDoc explaining purpose
- Method-level JSDoc for all public methods
- Usage examples in comments

**Step 4: Run docs generation (if available)**

```bash
pnpm run docs # if doc generation exists
```

**Step 5: Commit documentation updates**

```bash
git add packages/client/src/client.ts packages/server/src/server.ts packages/core/src/common/
git commit -m "docs(refactor-002): update JSDoc and comments"
```

---

### Task 6.2: Update CHANGELOG

**Files:**
- Modify: `CHANGELOG.md` (if exists)

**Step 1: Add refactor-002 entry**

```markdown
## [Unreleased]

### Changed
- **BREAKING**: None - internal refactoring only
- Refactored client and server to use shared utilities (refactor-002)
  - Eliminated 380 lines of duplicate code (68% → <10% duplication)
  - Improved maintainability with DisposableEventEmitter, HandlerRegistry, TransportAttachment, PendingRequestTracker
  - No API changes - all existing tests pass

### Added
- DisposableEventEmitter utility for event subscription management
- HandlerRegistry utility for type-safe handler storage
- TransportAttachment utility for transport lifecycle management
- PendingRequestTracker utility for request tracking with cancellation

### Internal
- Reduced client.ts by ~200 lines
- Reduced server.ts by ~180 lines
- Added 37 new utility tests
- Improved type safety through generic utilities
```

**Step 2: Commit CHANGELOG**

```bash
git add CHANGELOG.md
git commit -m "docs(refactor-002): update CHANGELOG"
```

---

### Task 6.3: Tag Final State

**Files:**
- None (Git operation)

**Step 1: Create post-refactor tag**

```bash
git tag -a post-refactor-002 -m "Completed refactor-002: shared utilities refactoring"
```

**Step 2: Push tag**

```bash
git push origin post-refactor-002
```

---

### Task 6.4: Prepare PR Description

**Files:**
- Create: `.specify/specs/refactors/refactor-002-pr-description.md`

**Step 1: Write comprehensive PR description**

```markdown
# Refactor: Eliminate Duplicate Code with Shared Utilities (refactor-002)

## Summary
This PR eliminates 380 lines of duplicate code (68% duplication → <10%) by extracting four reusable utilities that encapsulate common patterns in client and server implementations.

## Motivation
Client and server had significant code duplication across 5 patterns:
1. Event handling (54 lines duplicate)
2. Handler registration (30+ lines duplicate)
3. Transport lifecycle (40+ lines duplicate)
4. Request tracking (80+ lines duplicate)
5. Disposable management (throughout)

This technical debt was:
- Requiring double implementation of bug fixes
- Blocking new features (middleware, retry logic)
- Increasing maintenance burden

## Changes

### New Utilities (packages/core/src/common/)
- **DisposableEventEmitter**: Event subscription with automatic Disposable cleanup
- **HandlerRegistry<T>**: Type-safe method-to-handler mapping with Disposable registration
- **TransportAttachment**: Transport lifecycle management (attach/detach/handlers)
- **PendingRequestTracker**: Request tracking with promise lifecycle and cancellation

### Refactored Files
- `packages/client/src/client.ts`: Reduced from 647 to ~450 lines (-197 lines, -30%)
- `packages/server/src/server.ts`: Reduced from 458 to ~275 lines (-183 lines, -40%)

## Metrics Comparison

| Metric | Before | After | Change |
|--------|--------|-------|--------|
| Total Lines | 1,105 | ~725 | -380 (-34%) |
| Duplication | 67.86% | <10% | -57.86 pp |
| Tests | 65 | 102 | +37 utility tests |
| Test Pass Rate | 100% | 100% | No change |
| Build Time | [X]s | [Y]s | [±Z%] |
| Bundle Size | [X]KB | [Y]KB | [±Z%] |

## Testing
- ✅ All 65 existing tests pass without modification
- ✅ 37 new tests added for utilities
- ✅ No behavioral changes (verified via test suite)
- ✅ No performance regression

## Breaking Changes
**None** - This is an internal refactoring. All public APIs remain identical.

## Rollback Plan
Each utility is in a separate commit. Can be reverted granularly:
- DisposableEventEmitter: [commit hash]
- HandlerRegistry: [commit hash]
- TransportAttachment: [commit hash]
- PendingRequestTracker: [commit hash]

Full rollback: `git revert <range>` or `git checkout pre-refactor-002`

## Review Focus Areas
1. Verify behavior preservation (check test results)
2. Review utility implementations for edge cases
3. Confirm type safety improvements
4. Validate error handling in attach/detach logic

## Related
- Spec: `.specify/specs/refactors/refactor-002.md`
- Plan: `.specify/plans/refactor/002-plan.md`
- Metrics: `.specify/specs/refactors/refactor-002-metrics-*.md`
- Enables: Connection retry, transport middleware, telemetry features
```

**Step 2: Save PR description**

```bash
cat > .specify/specs/refactors/refactor-002-pr-description.md <<'EOF'
[paste description above]
EOF
```

**Step 3: Commit PR description**

```bash
git add .specify/specs/refactors/refactor-002-pr-description.md
git commit -m "docs(refactor-002): prepare PR description"
```

---

### Task 6.5: Final Self-Review

**Files:**
- None (review only)

**Step 1: Review all commits**

```bash
git log --oneline pre-refactor-002..HEAD
```

Expected: See logical progression of commits:
1. Testing gap assessment
2. Baseline capture
3. Create utilities (4 commits)
4. Integrate in client (4 commits)
5. Integrate in server (3-4 commits)
6. Cleanup
7. Documentation

**Step 2: Review full diff**

```bash
git diff pre-refactor-002..HEAD --stat
git diff pre-refactor-002..HEAD packages/client/src/client.ts | head -200
git diff pre-refactor-002..HEAD packages/server/src/server.ts | head -200
```

**Step 3: Self-review checklist**

- [ ] No console.log statements left
- [ ] No commented-out code
- [ ] Imports organized and minimal
- [ ] JSDoc complete
- [ ] Tests comprehensive
- [ ] Commit messages follow convention
- [ ] No sensitive information
- [ ] Build succeeds
- [ ] Lint passes

**Step 4: Run final verification**

```bash
pnpm build
pnpm lint
pnpm test
```

All must pass.

**Step 5: Push branch**

```bash
git push origin refactor/002-shared-utilities
```

**Checkpoint:**
- [ ] All documentation complete
- [ ] PR description prepared
- [ ] Self-review complete
- [ ] All checks passing
- [ ] Branch pushed
- [ ] Ready to create PR

---

## Phase 7: Code Review and Merge

**Duration:** Variable (1-3 days for review)
**Goal:** Get approval, merge to main, monitor

### Task 7.1: Create Pull Request

**Files:**
- None (GitHub UI)

**Step 1: Create PR on GitHub**

- Navigate to repository
- Create PR from `refactor/002-shared-utilities` to `main`
- Use PR description from refactor-002-pr-description.md
- Add labels: `refactoring`, `internal`, `no-breaking-changes`
- Request reviewers

**Step 2: Link PR to spec**

Update refactor-002.md with PR link:
```markdown
**PR**: #[number] - https://github.com/.../pull/[number]
```

**Step 3: Verify CI passes**

Watch CI/CD pipeline:
- Build succeeds
- Tests pass
- Linting passes
- Coverage maintains

**Step 4: Respond to review comments**

- Address feedback promptly
- Make requested changes
- Re-run tests after changes
- Push updates to branch

---

### Task 7.2: Merge and Monitor

**Files:**
- Update: `.specify/specs/refactors/refactor-002.md`

**Step 1: Merge PR**

Once approved:
- Squash and merge (or regular merge per project convention)
- Use commit message: `refactor: eliminate duplicate code with shared utilities (#[PR])`
- Delete feature branch after merge

**Step 2: Update spec to Complete**

```markdown
**Status**: [x] Complete
**Completed**: 2026-02-[date]
**PR**: #[number]
**Merged**: 2026-02-[date]
```

**Step 3: Monitor for issues**

For 2 weeks:
- Watch for issue reports
- Monitor consuming projects
- Be ready to rollback if needed

**Step 4: Document lessons learned**

Update refactor-002.md Lessons Learned section:
```markdown
### Lessons Learned

**What went well:**
- Incremental approach kept tests passing
- Utility-first design was easy to integrate
- Granular commits enabled easy debugging

**What could be improved:**
- [Fill in after completion]

**Unexpected challenges:**
- [Fill in after completion]

**Time estimates accuracy:**
- Estimated: 2-3 days
- Actual: [X days]
- Variance: [±Y%]

**Would we do this refactor again?**
Yes/No - [Explanation]
```

**Step 5: Archive spec**

```bash
mkdir -p .specify/specs/refactors/completed
git mv .specify/specs/refactors/refactor-002.md .specify/specs/refactors/completed/
git commit -m "docs(refactor-002): archive completed refactor spec"
```

---

## Post-Completion Verification

### Final Checklist

- [ ] All 65+ original tests passing
- [ ] 37 new utility tests passing
- [ ] ~380 lines removed (client: ~197, server: ~183)
- [ ] Duplication <10%
- [ ] No performance regression >5%
- [ ] No breaking API changes
- [ ] All utilities have >80% test coverage
- [ ] JSDoc complete for all utilities
- [ ] CHANGELOG updated
- [ ] PR merged to main
- [ ] Branch deleted
- [ ] Tags created (pre and post)
- [ ] Spec marked complete and archived
- [ ] Lessons learned documented
- [ ] 2-week monitoring period started

### Rollback Triggers (Monitor for 2 weeks)

Revert if any occur:
- [ ] Test failures in consuming projects
- [ ] Memory leaks detected
- [ ] Performance regression >10% in production
- [ ] Integration issues reported
- [ ] Regression in error handling

---

## Notes

### Implementation Guidelines

1. **Test-Driven**: Run tests after every change
2. **Incremental**: Each utility integrated separately
3. **Behavioral Preservation**: No external changes
4. **Granular Commits**: One logical change per commit
5. **Documentation**: Update as you go, not at end

### Common Pitfalls to Avoid

- Don't skip testing gaps assessment
- Don't integrate all utilities at once
- Don't modify tests to make them pass
- Don't skip baseline capture
- Don't forget to run full test suite between phases

### Success Indicators

- Tests passing consistently
- Line count decreasing
- Code duplication metrics improving
- Type errors caught earlier
- Easier to understand code flow

---

## Appendix

### Commit Message Convention

```
type(scope): description

type: feat | refactor | test | docs | chore
scope: client | server | core | refactor-002
description: imperative, lowercase, no period
```

Examples:
- `feat(core): add DisposableEventEmitter utility for refactor-002`
- `refactor(client): use TransportAttachment utility (refactor-002)`
- `test(core): add HandlerRegistry test coverage for refactor-002`
- `docs(refactor-002): capture baseline metrics`

### Testing Commands Quick Reference

```bash
# Run all tests
pnpm test

# Run specific package
pnpm test packages/client
pnpm test packages/server
pnpm test packages/core

# Run with coverage
pnpm test:coverage

# Run specific test file
pnpm test packages/core/src/common/__tests__/event-emitter.test.ts

# Build
pnpm build

# Lint
pnpm lint
pnpm lint --fix

# Clean build
pnpm clean && pnpm build
```

### Metrics Commands Quick Reference

```bash
# Lines of code
cloc packages/client/src/client.ts packages/server/src/server.ts

# Bundle sizes
du -sh packages/*/dist/*

# Time tests
time pnpm test

# Time build
time pnpm build

# Coverage report
pnpm test:coverage
open coverage/index.html # or browse coverage report
```

---

**Plan Status**: Ready for execution
**Created**: 2026-02-09
**Last Updated**: 2026-02-09
**Estimated Duration**: 2-3 days (16-24 hours)
**Prerequisites**: Phase 0 testing gap assessment must be completed first
