/**
 * Mock utilities for testing
 * @packageDocumentation
 */

import { vi } from 'vitest';

/**
 * Creates a mock function
 * @example
 * ```ts
 * const mockFn = createMockFn()
 *   .mockResolvedValue('test');
 * ```
 */
export function createMockFn(): ReturnType<typeof vi.fn> {
  return vi.fn();
}

/**
 * Creates a spy on a method
 * @param obj - Object to spy on
 * @param method - Method name
 * @example
 * ```ts
 * const consoleSpy = spyOn(console, 'log');
 * console.log('test');
 * expect(consoleSpy).toHaveBeenCalledWith('test');
 * ```
 */
export function spyOn<T extends object, K extends keyof T>(
  obj: T,
  method: K
): ReturnType<typeof vi.spyOn> {
  return vi.spyOn(obj, method as any);
}

/**
 * Creates a mock timer
 * @example
 * ```ts
 * const timer = createMockTimer();
 * timer.runAll();
 * ```
 */
export function createMockTimer() {
  vi.useFakeTimers();
  return {
    runAll: () => vi.runAllTimers(),
    runOnlyPendingTimers: () => vi.runOnlyPendingTimers(),
    advanceTimersByTime: (ms: number) => vi.advanceTimersByTime(ms),
    restore: () => vi.useRealTimers()
  };
}

/**
 * Mocks a fetch request
 * @param url - URL to mock
 * @param response - Response data
 * @example
 * ```ts
 * mockFetch('/api/users', { success: true });
 * const res = await fetch('/api/users');
 * expect(res.json()).resolves.toEqual({ success: true });
 * ```
 */
export function mockFetch(url: string, response: any) {
  global.fetch = vi.fn((fetchUrl) => {
    if (fetchUrl === url) {
      return Promise.resolve(
        new Response(JSON.stringify(response), {
          status: 200,
          headers: { 'Content-Type': 'application/json' }
        })
      );
    }
    return Promise.reject(new Error('Not mocked'));
  });
}
