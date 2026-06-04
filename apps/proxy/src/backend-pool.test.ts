// apps/proxy/src/backend-pool.test.ts
import { describe, it, expect, vi, afterEach, beforeEach } from 'vitest';
import { BackendPool } from './backend-pool.js';
import { discoverServerByLanguageId } from '@lspeasy/core';

vi.mock('@lspeasy/core', async (importActual) => {
  const actual = await importActual<typeof import('@lspeasy/core')>();
  return {
    ...actual,
    discoverServerByLanguageId: vi.fn(),
    discoverExtensionMap: vi.fn(() => ({ '.ts': 'typescript' }))
  };
});

vi.mock('@lspeasy/client', () => ({
  LSPClient: vi.fn().mockImplementation(function () {
    return {
      connect: vi.fn().mockResolvedValue(undefined),
      disconnect: vi.fn().mockResolvedValue(undefined),
      getServerCapabilities: vi.fn().mockReturnValue({ hoverProvider: true }),
      sendRequest: vi.fn().mockResolvedValue(null),
      sendNotification: vi.fn().mockResolvedValue(undefined)
    };
  })
}));

vi.mock('node:child_process', () => ({
  spawn: vi.fn().mockReturnValue({
    stdout: { on: vi.fn() },
    stdin: { on: vi.fn() },
    on: vi.fn(),
    kill: vi.fn()
  })
}));

describe('BackendPool', () => {
  beforeEach(() => {
    (discoverServerByLanguageId as ReturnType<typeof vi.fn>).mockReturnValue({
      serverCommand: '"typescript-language-server" "--stdio"',
      languageId: 'typescript'
    });
  });

  afterEach(() => {
    vi.restoreAllMocks();
    vi.useRealTimers();
  });

  it('creates a backend on first ensureBackend call', async () => {
    const pool = new BackendPool('/project');
    const client = await pool.ensureBackend('typescript');
    expect(client).toBeDefined();
  });

  it('returns the same client on subsequent calls', async () => {
    const pool = new BackendPool('/project');
    const c1 = await pool.ensureBackend('typescript');
    const c2 = await pool.ensureBackend('typescript');
    expect(c1).toBe(c2);
  });

  it('throws when no server is configured for languageId', async () => {
    (discoverServerByLanguageId as ReturnType<typeof vi.fn>).mockReturnValue(null);
    const pool = new BackendPool('/project');
    await expect(pool.ensureBackend('python')).rejects.toThrow('python');
  });

  it('getLanguageIdForExtension returns the languageId for a known extension', () => {
    const pool = new BackendPool('/project');
    expect(pool.getLanguageIdForExtension('.ts')).toBe('typescript');
  });

  it('stopAll disconnects live backends', async () => {
    const pool = new BackendPool('/project');
    const client = (await pool.ensureBackend('typescript')) as any;
    await pool.stopAll();
    expect(client.disconnect).toHaveBeenCalled();
  });

  it('fires stopBackend after backendIdleMs', async () => {
    vi.useFakeTimers();
    const pool = new BackendPool('/project', { backendIdleMs: 1000 });
    const client = (await pool.ensureBackend('typescript')) as any;
    vi.advanceTimersByTime(1000);
    await vi.runAllTimersAsync();
    expect(client.disconnect).toHaveBeenCalled();
  });

  it('resets idle timer on repeated ensureBackend calls', async () => {
    vi.useFakeTimers();
    const pool = new BackendPool('/project', { backendIdleMs: 1000 });
    await pool.ensureBackend('typescript');
    vi.advanceTimersByTime(500);
    const client = (await pool.ensureBackend('typescript')) as any;
    vi.advanceTimersByTime(600); // only 600ms since last call — should not fire yet
    expect(client.disconnect).not.toHaveBeenCalled();
    vi.advanceTimersByTime(400); // now 1000ms after last call — fires
    await vi.runAllTimersAsync();
    expect(client.disconnect).toHaveBeenCalled();
  });
});
