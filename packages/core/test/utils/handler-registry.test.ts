/**
 * Unit tests for HandlerRegistry
 */

import { describe, it, expect, vi } from 'vitest';
import { HandlerRegistry } from '../../src/utils/handler-registry.js';

describe('HandlerRegistry', () => {
  it('registers and retrieves handlers', () => {
    const registry = new HandlerRegistry<string, number>();
    const handler = vi.fn().mockReturnValue(42);

    registry.register('textDocument/hover', handler);

    const stored = registry.get('textDocument/hover');

    expect(stored).toBe(handler);
    expect(stored?.('params')).toBe(42);
  });

  it('unregisters handlers', () => {
    const registry = new HandlerRegistry<string, number>();
    const handler = vi.fn();

    registry.register('workspace/symbol', handler);
    registry.unregister('workspace/symbol');

    expect(registry.get('workspace/symbol')).toBeUndefined();
  });

  it('ignores unregistering unknown handlers', () => {
    const registry = new HandlerRegistry<string, number>();

    registry.unregister('workspace/unknown');

    expect(registry.get('workspace/unknown')).toBeUndefined();
  });

  it('returns a disposable for registration', () => {
    const registry = new HandlerRegistry<string, number>();
    const handler = vi.fn();

    const disposable = registry.register('textDocument/definition', handler);
    disposable.dispose();

    expect(registry.get('textDocument/definition')).toBeUndefined();
  });

  it('clears all handlers', () => {
    const registry = new HandlerRegistry<string, number>();
    registry.register('textDocument/hover', vi.fn());
    registry.register('workspace/symbol', vi.fn());

    registry.clear();

    expect(registry.get('textDocument/hover')).toBeUndefined();
    expect(registry.get('workspace/symbol')).toBeUndefined();
  });

  it('keeps other handlers when unregistering shared prefixes', () => {
    const registry = new HandlerRegistry<string, number>();
    const first = vi.fn().mockReturnValue(1);
    const second = vi.fn().mockReturnValue(2);

    registry.register('workspace/symbol', first);
    registry.register('workspace/executeCommand', second);

    registry.unregister('workspace/symbol');

    expect(registry.get('workspace/symbol')).toBeUndefined();
    expect(registry.get('workspace/executeCommand')?.('params')).toBe(2);
  });

  it('supports methods without a namespace separator', () => {
    const registry = new HandlerRegistry<string, number>();
    const handler = vi.fn().mockReturnValue(7);

    registry.register('initialize', handler);

    expect(registry.get('initialize')?.('params')).toBe(7);
    registry.unregister('initialize');
    expect(registry.get('initialize')).toBeUndefined();
  });
});
