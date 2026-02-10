/**
 * Unit tests for DisposableEventEmitter
 */

import { describe, it, expect, vi } from 'vitest';
import { DisposableEventEmitter } from '../../src/utils/disposable-event-emitter.js';

describe('DisposableEventEmitter', () => {
  it('emits events in registration order', () => {
    const emitter = new DisposableEventEmitter<{ data: [number] }>();
    const calls: number[] = [];

    emitter.on('data', (value) => calls.push(value));
    emitter.on('data', (value) => calls.push(value + 10));

    emitter.emit('data', 1);

    expect(calls).toEqual([1, 11]);
  });

  it('allows listener disposal', () => {
    const emitter = new DisposableEventEmitter<{ data: [string] }>();
    const first = vi.fn();
    const second = vi.fn();

    const disposable = emitter.on('data', first);
    emitter.on('data', second);

    disposable.dispose();
    emitter.emit('data', 'value');

    expect(first).not.toHaveBeenCalled();
    expect(second).toHaveBeenCalledTimes(1);
  });

  it('disposes all listeners', () => {
    const emitter = new DisposableEventEmitter<{ tick: [] }>();
    const handler = vi.fn();

    emitter.on('tick', handler);
    emitter.dispose();
    emitter.emit('tick');

    expect(handler).not.toHaveBeenCalled();
  });
});
