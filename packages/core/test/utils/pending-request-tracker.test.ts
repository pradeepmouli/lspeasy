/**
 * Unit tests for PendingRequestTracker
 */

import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { PendingRequestTracker } from '../../src/utils/pending-request-tracker.js';

describe('PendingRequestTracker', () => {
  beforeEach(() => {
    vi.useFakeTimers();
  });

  afterEach(() => {
    vi.useRealTimers();
  });

  it('resolves pending requests', async () => {
    const tracker = new PendingRequestTracker<string>();
    const { id, promise } = tracker.create();

    tracker.resolve(id, 'ok');

    await expect(promise).resolves.toBe('ok');
  });

  it('rejects pending requests', async () => {
    const tracker = new PendingRequestTracker<string>();
    const { id, promise } = tracker.create();
    const error = new Error('failed');

    tracker.reject(id, error);

    await expect(promise).rejects.toBe(error);
  });

  it('rejects on timeout', async () => {
    const tracker = new PendingRequestTracker<string>();
    const { promise } = tracker.create(50);

    vi.advanceTimersByTime(60);

    await expect(promise).rejects.toThrow('Request timed out');
  });

  it('uses default timeout when provided', async () => {
    const tracker = new PendingRequestTracker<string>(25);
    const { promise } = tracker.create();

    vi.advanceTimersByTime(30);

    await expect(promise).rejects.toThrow('Request timed out');
  });

  it('returns metadata for pending requests', () => {
    const tracker = new PendingRequestTracker<string, { method: string }>();
    const { id } = tracker.create(undefined, { method: 'initialize' });

    expect(tracker.getMetadata(id)).toEqual({ method: 'initialize' });
  });

  it('ignores resolve/reject for unknown ids', () => {
    const tracker = new PendingRequestTracker<string>();

    expect(() => tracker.resolve('missing', 'ok')).not.toThrow();
    expect(() => tracker.reject('missing', new Error('fail'))).not.toThrow();
  });

  it('clears pending requests with a custom error', async () => {
    const tracker = new PendingRequestTracker<string>();
    const { promise } = tracker.create();
    const error = new Error('cleared');

    tracker.clear(error);

    await expect(promise).rejects.toBe(error);
  });
});
