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
});
