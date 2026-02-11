/**
 * Unit tests for CancellationToken
 */

import { describe, it, expect, beforeEach, vi } from 'vitest';
import { CancellationTokenSource, CancellationToken } from '../../src/utils/cancellation.js';

describe('CancellationToken', () => {
  describe('CancellationTokenSource', () => {
    let source: CancellationTokenSource;

    beforeEach(() => {
      source = new CancellationTokenSource();
    });

    it('should create a token source', () => {
      expect(source).toBeDefined();
      expect(source.token).toBeDefined();
    });

    it('should provide token that is not cancelled initially', () => {
      const token = source.token;

      expect(token.isCancellationRequested).toBe(false);
    });

    it('should set isCancellationRequested to true when cancelled', () => {
      const token = source.token;

      source.cancel();

      expect(token.isCancellationRequested).toBe(true);
    });

    it('should notify registered callbacks when cancelled', () => {
      const token = source.token;
      const callback = vi.fn();

      token.onCancellationRequested(callback);
      source.cancel();

      expect(callback).toHaveBeenCalledTimes(1);
    });

    it('should notify multiple registered callbacks', () => {
      const token = source.token;
      const callback1 = vi.fn();
      const callback2 = vi.fn();
      const callback3 = vi.fn();

      token.onCancellationRequested(callback1);
      token.onCancellationRequested(callback2);
      token.onCancellationRequested(callback3);

      source.cancel();

      expect(callback1).toHaveBeenCalledTimes(1);
      expect(callback2).toHaveBeenCalledTimes(1);
      expect(callback3).toHaveBeenCalledTimes(1);
    });

    it('should call callback immediately if already cancelled', () => {
      const token = source.token;

      source.cancel();

      const callback = vi.fn();
      token.onCancellationRequested(callback);

      expect(callback).toHaveBeenCalledTimes(1);
    });

    it('should be idempotent when calling cancel multiple times', () => {
      const token = source.token;
      const callback = vi.fn();

      token.onCancellationRequested(callback);

      source.cancel();
      source.cancel();
      source.cancel();

      expect(callback).toHaveBeenCalledTimes(1);
      expect(token.isCancellationRequested).toBe(true);
    });

    it('should return disposable from onCancellationRequested', () => {
      const token = source.token;
      const callback = vi.fn();

      const disposable = token.onCancellationRequested(callback);

      expect(disposable).toBeDefined();
      expect(disposable.dispose).toBeDefined();
      expect(typeof disposable.dispose).toBe('function');
    });

    it('should unregister callback when disposable is disposed', () => {
      const token = source.token;
      const callback = vi.fn();

      const disposable = token.onCancellationRequested(callback);
      disposable.dispose();

      source.cancel();

      expect(callback).not.toHaveBeenCalled();
    });

    it('should allow disposing callback multiple times', () => {
      const token = source.token;
      const callback = vi.fn();

      const disposable = token.onCancellationRequested(callback);

      expect(() => {
        disposable.dispose();
        disposable.dispose();
        disposable.dispose();
      }).not.toThrow();
    });

    it('should support disposing source', () => {
      expect(() => {
        source.dispose();
      }).not.toThrow();
    });

    it('should not throw when disposing already disposed source', () => {
      source.dispose();

      expect(() => {
        source.dispose();
      }).not.toThrow();
    });

    it('should maintain separate state for different sources', () => {
      const source1 = new CancellationTokenSource();
      const source2 = new CancellationTokenSource();

      const token1 = source1.token;
      const token2 = source2.token;

      source1.cancel();

      expect(token1.isCancellationRequested).toBe(true);
      expect(token2.isCancellationRequested).toBe(false);
    });

    it('should handle callback registration after dispose', () => {
      const token = source.token;

      source.dispose();

      const callback = vi.fn();
      const disposable = token.onCancellationRequested(callback);

      source.cancel();

      // Callback may or may not be called after dispose, but should not throw
      expect(disposable).toBeDefined();
    });

    it('should work in async context', async () => {
      const token = source.token;

      const promise = new Promise<void>((resolve) => {
        token.onCancellationRequested(() => {
          resolve();
        });
      });

      setTimeout(() => source.cancel(), 50);

      await promise;

      expect(token.isCancellationRequested).toBe(true);
    });

    it('should support cancellation check in long-running operation', async () => {
      const token = source.token;
      let iterations = 0;

      const operation = async () => {
        for (let i = 0; i < 1000; i++) {
          if (token.isCancellationRequested) {
            break;
          }
          iterations++;
          await new Promise((resolve) => setTimeout(resolve, 1));
        }
      };

      const operationPromise = operation();

      setTimeout(() => source.cancel(), 50);

      await operationPromise;

      expect(iterations).toBeLessThan(1000);
      expect(token.isCancellationRequested).toBe(true);
    });
  });

  describe('CancellationToken.None', () => {
    it('should provide a singleton token that is never cancelled', () => {
      expect(CancellationToken.None).toBeDefined();
      expect(CancellationToken.None.isCancellationRequested).toBe(false);
    });

    it('should remain uncancelled', () => {
      const token = CancellationToken.None;

      // Wait to ensure it stays uncancelled
      expect(token.isCancellationRequested).toBe(false);
    });

    it('should provide onCancellationRequested that never fires', () => {
      const token = CancellationToken.None;
      const callback = vi.fn();

      const disposable = token.onCancellationRequested(callback);

      expect(callback).not.toHaveBeenCalled();
      expect(disposable).toBeDefined();
    });

    it('should allow safe disposal of None token callback', () => {
      const token = CancellationToken.None;
      const callback = vi.fn();

      const disposable = token.onCancellationRequested(callback);

      expect(() => disposable.dispose()).not.toThrow();
    });

    it('should be usable as default parameter', async () => {
      async function operation(token = CancellationToken.None) {
        return !token.isCancellationRequested;
      }

      const result = await operation();
      expect(result).toBe(true);
    });
  });

  describe('Multiple tokens from same source', () => {
    it('should provide the same token instance', () => {
      const source = new CancellationTokenSource();
      const token1 = source.token;
      const token2 = source.token;

      expect(token1).toBe(token2);
    });

    it('should share cancellation state', () => {
      const source = new CancellationTokenSource();
      const token1 = source.token;
      const token2 = source.token;

      source.cancel();

      expect(token1.isCancellationRequested).toBe(true);
      expect(token2.isCancellationRequested).toBe(true);
    });

    it('should notify all callbacks registered via different token references', () => {
      const source = new CancellationTokenSource();
      const token1 = source.token;
      const token2 = source.token;

      const callback1 = vi.fn();
      const callback2 = vi.fn();

      token1.onCancellationRequested(callback1);
      token2.onCancellationRequested(callback2);

      source.cancel();

      expect(callback1).toHaveBeenCalledTimes(1);
      expect(callback2).toHaveBeenCalledTimes(1);
    });
  });

  describe('Edge cases', () => {
    it('should handle callback that throws error', () => {
      const source = new CancellationTokenSource();
      const token = source.token;

      const errorCallback = vi.fn(() => {
        throw new Error('Callback error');
      });
      const successCallback = vi.fn();

      token.onCancellationRequested(errorCallback);
      token.onCancellationRequested(successCallback);

      // Cancel will throw if callback throws (error propagates)
      expect(() => source.cancel()).toThrow('Callback error');

      // Error callback was called
      expect(errorCallback).toHaveBeenCalled();
      // Success callback may or may not be called depending on EventEmitter behavior
    });

    it('should handle rapid cancel and register cycles', () => {
      const source = new CancellationTokenSource();
      const token = source.token;

      for (let i = 0; i < 100; i++) {
        const callback = vi.fn();
        token.onCancellationRequested(callback);
      }

      source.cancel();

      expect(token.isCancellationRequested).toBe(true);
    });

    it('should handle callback registration during cancellation', () => {
      const source = new CancellationTokenSource();
      const token = source.token;
      const callbacks: any[] = [];

      // Register first callback that registers another callback
      token.onCancellationRequested(() => {
        const nestedCallback = vi.fn();
        callbacks.push(nestedCallback);
        token.onCancellationRequested(nestedCallback);
      });

      source.cancel();

      // Nested callback should be called immediately since already cancelled
      expect(callbacks[0]).toHaveBeenCalled();
    });
  });
});
