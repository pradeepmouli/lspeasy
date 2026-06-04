// apps/proxy/src/document-state.test.ts
import { describe, it, expect, vi, afterEach } from 'vitest';
import { DocumentStateManager, type DidOpenAction } from './document-state.js';

describe('DocumentStateManager', () => {
  afterEach(() => vi.useRealTimers());

  it('returns "open" for a new URI', () => {
    const m = new DocumentStateManager();
    expect(m.onDidOpen('session-1', 'file:///a.ts', 'hello', 'typescript')).toBe('open');
  });

  it('returns "skip" when a second session opens the same URI with same content', () => {
    const m = new DocumentStateManager();
    m.onDidOpen('session-1', 'file:///a.ts', 'hello', 'typescript');
    expect(m.onDidOpen('session-2', 'file:///a.ts', 'hello', 'typescript')).toBe('skip');
  });

  it('returns "change" when a second session opens URI with different content', () => {
    const m = new DocumentStateManager();
    m.onDidOpen('session-1', 'file:///a.ts', 'hello', 'typescript');
    expect(m.onDidOpen('session-2', 'file:///a.ts', 'world', 'typescript')).toBe('change');
  });

  it('onSessionEnd returns URIs that had last session closed', () => {
    const m = new DocumentStateManager();
    m.onDidOpen('s1', 'file:///a.ts', 'code', 'typescript');
    m.onDidOpen('s1', 'file:///b.ts', 'code', 'typescript');
    m.onDidOpen('s2', 'file:///a.ts', 'code', 'typescript');
    const uris = m.onSessionEnd('s1');
    // b.ts lost its only session, a.ts still has s2
    expect(uris).toEqual(['file:///b.ts']);
  });

  it('cancels lazy-close timer when URI is reopened', () => {
    vi.useFakeTimers();
    const closeCallback = vi.fn();
    const m = new DocumentStateManager({ lazyCloseMs: 1000, onClose: closeCallback });
    m.onDidOpen('s1', 'file:///a.ts', 'x', 'typescript');
    m.onSessionEnd('s1'); // schedules lazy close
    m.onDidOpen('s2', 'file:///a.ts', 'x', 'typescript'); // should cancel timer
    vi.advanceTimersByTime(2000);
    expect(closeCallback).not.toHaveBeenCalled();
  });

  it('fires onClose callback after lazyCloseMs when no sessions remain', () => {
    vi.useFakeTimers();
    const closeCallback = vi.fn();
    const m = new DocumentStateManager({ lazyCloseMs: 500, onClose: closeCallback });
    m.onDidOpen('s1', 'file:///a.ts', 'x', 'typescript');
    m.onSessionEnd('s1');
    vi.advanceTimersByTime(600);
    expect(closeCallback).toHaveBeenCalledWith('file:///a.ts');
  });
});
