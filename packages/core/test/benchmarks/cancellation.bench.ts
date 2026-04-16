/**
 * Benchmark suite for cancellation propagation
 * Target: <100ms latency for cancellation to propagate
 */

import { bench, describe } from 'vitest';
import { CancellationTokenSource } from '../../src/utils/cancellation.js';

describe('Cancellation Benchmarks', () => {
  describe('Token creation', () => {
    bench('create cancellation token', () => {
      const source = new CancellationTokenSource();
      source.dispose();
    });

    bench('create 100 cancellation tokens', () => {
      const sources = Array.from({ length: 100 }, () => new CancellationTokenSource());
      sources.forEach((source) => source.dispose());
    });
  });

  describe('Cancellation registration', () => {
    bench('register single listener', () => {
      const source = new CancellationTokenSource();
      const token = source.token;
      token.onCancellationRequested(() => {});
      source.dispose();
    });

    bench('register 10 listeners', () => {
      const source = new CancellationTokenSource();
      const token = source.token;
      for (let i = 0; i < 10; i++) {
        token.onCancellationRequested(() => {});
      }
      source.dispose();
    });

    bench('register 100 listeners', () => {
      const source = new CancellationTokenSource();
      const token = source.token;
      for (let i = 0; i < 100; i++) {
        token.onCancellationRequested(() => {});
      }
      source.dispose();
    });
  });

  describe('Cancellation propagation', () => {
    bench('cancel with 1 listener', () => {
      const source = new CancellationTokenSource();
      let _called = false;
      source.token.onCancellationRequested(() => {
        _called = true;
      });
      source.cancel();
      source.dispose();
    });

    bench('cancel with 10 listeners', () => {
      const source = new CancellationTokenSource();
      const calls: number[] = [];
      for (let i = 0; i < 10; i++) {
        const index = i;
        source.token.onCancellationRequested(() => {
          calls.push(index);
        });
      }
      source.cancel();
      source.dispose();
    });

    bench('cancel with 100 listeners', () => {
      const source = new CancellationTokenSource();
      const calls: number[] = [];
      for (let i = 0; i < 100; i++) {
        const index = i;
        source.token.onCancellationRequested(() => {
          calls.push(index);
        });
      }
      source.cancel();
      source.dispose();
    });
  });

  describe('Async cancellation', () => {
    bench('cancel async operation', async () => {
      const source = new CancellationTokenSource();
      const promise = new Promise<void>((resolve, reject) => {
        source.token.onCancellationRequested(() => {
          reject(new Error('Cancelled'));
        });
        setTimeout(resolve, 100);
      });

      source.cancel();

      try {
        await promise;
      } catch {
        // Expected cancellation
      } finally {
        source.dispose();
      }
    });

    bench('check isCancellationRequested', () => {
      const source = new CancellationTokenSource();
      const token = source.token;

      for (let i = 0; i < 1000; i++) {
        if (token.isCancellationRequested) {
          break;
        }
      }

      source.dispose();
    });
  });

  describe('Cancellation with cleanup', () => {
    bench('cancel with disposable cleanup', () => {
      const source = new CancellationTokenSource();
      const disposables: Array<{ dispose: () => void }> = [];

      for (let i = 0; i < 10; i++) {
        const disposable = source.token.onCancellationRequested(() => {
          // Handler
        });
        disposables.push(disposable);
      }

      source.cancel();

      // Cleanup
      disposables.forEach((disposable) => disposable.dispose());
      source.dispose();
    });
  });

  describe('Nested cancellation', () => {
    bench('nested cancellation tokens', () => {
      const parent = new CancellationTokenSource();
      const children = Array.from({ length: 10 }, () => {
        const child = new CancellationTokenSource();
        parent.token.onCancellationRequested(() => {
          child.cancel();
        });
        return child;
      });

      parent.cancel();

      // Verify all children cancelled
      children.forEach((child) => {
        if (!child.token.isCancellationRequested) {
          throw new Error('Child not cancelled');
        }
        child.dispose();
      });

      parent.dispose();
    });
  });

  describe('Cancellation with work', () => {
    bench('cancellable loop', () => {
      const source = new CancellationTokenSource();
      const token = source.token;
      let _iterations = 0;

      // Simulate work that checks for cancellation
      for (let i = 0; i < 10000; i++) {
        if (token.isCancellationRequested) {
          break;
        }
        _iterations++;
      }

      source.dispose();
    });

    bench('cancellable loop with early cancellation', () => {
      const source = new CancellationTokenSource();
      const token = source.token;
      let _iterations = 0;

      // Cancel after 100 iterations
      setTimeout(() => source.cancel(), 0);

      for (let i = 0; i < 10000; i++) {
        if (token.isCancellationRequested) {
          break;
        }
        _iterations++;

        if (i === 100) {
          source.cancel();
        }
      }

      source.dispose();
    });
  });
});
