import { describe, expect, it, vi } from 'vitest';
import type { Message } from '@lspeasy/core';
import { ClientSession } from './client-session.js';
import type { StatusReport } from './status.js';

interface Captured {
  sent: Message[];
  emit: (m: Message) => void;
}

function fakeTransport(): { transport: any; cap: Captured } {
  const cap: Captured = { sent: [], emit: () => {} };
  const transport = {
    send: vi.fn(async (m: Message) => {
      cap.sent.push(m);
    }),
    onMessage: (h: (m: Message) => void) => {
      cap.emit = h;
      return { dispose: vi.fn() };
    },
    onClose: () => ({ dispose: vi.fn() }),
    onError: () => ({ dispose: vi.fn() })
  };
  return { transport, cap };
}

const STATUS: StatusReport = { daemon: null, languages: [] };

function makeSession(poolOverrides: Record<string, unknown> = {}) {
  const recordRequest = vi.fn();
  const backend = { sendRequest: vi.fn().mockResolvedValue({ ok: 1 }) };
  const pool = {
    getBackend: vi.fn().mockReturnValue(backend),
    getLanguageIdForExtension: vi.fn().mockReturnValue('typescript'),
    ensureBackend: vi.fn().mockResolvedValue(backend),
    recordRequest,
    ...poolOverrides
  };
  const { transport, cap } = fakeTransport();
  new ClientSession({
    sessionId: 's1',
    transport: transport as never,
    pool: pool as never,
    docState: { onSessionEnd: vi.fn() } as never,
    root: '/proj',
    onEnd: vi.fn(),
    onStatus: () => STATUS
  });
  return { cap, recordRequest, backend };
}

describe('ClientSession status routing', () => {
  it('answers $/lsproxy.status from onStatus without touching a backend', async () => {
    const { cap, backend } = makeSession();
    cap.emit({ jsonrpc: '2.0', id: 1, method: '$/lsproxy.status', params: {} } as Message);
    await vi.waitFor(() => expect(cap.sent).toHaveLength(1));
    expect(cap.sent[0]).toMatchObject({ id: 1, result: STATUS });
    expect(backend.sendRequest).not.toHaveBeenCalled();
  });

  it('records a forwarded request', async () => {
    const { cap, recordRequest } = makeSession();
    cap.emit({
      jsonrpc: '2.0',
      id: 2,
      method: 'textDocument/hover',
      params: { textDocument: { uri: 'file:///x.ts' } }
    } as Message);
    await vi.waitFor(() => expect(recordRequest).toHaveBeenCalledWith('typescript'));
  });
});
