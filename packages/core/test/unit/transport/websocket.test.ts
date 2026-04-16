import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';

const originalWebSocket = globalThis.WebSocket;

beforeEach(() => {
  vi.resetModules();
  vi.restoreAllMocks();
});

afterEach(() => {
  if (originalWebSocket) {
    globalThis.WebSocket = originalWebSocket;
  } else {
    Reflect.deleteProperty(globalThis, 'WebSocket');
  }
});

describe('createWebSocketClient', () => {
  it('prefers native globalThis.WebSocket when available', async () => {
    class FakeWebSocket {
      constructor(public readonly url: string) {}
    }

    globalThis.WebSocket = FakeWebSocket as unknown as typeof WebSocket;

    const { createWebSocketClient } = await import('../../../src/transport/websocket.js');
    const socket = createWebSocketClient('ws://localhost:1234') as unknown as FakeWebSocket;
    expect(socket.url).toBe('ws://localhost:1234');
  });

  it('falls back to ws package when native WebSocket is unavailable', async () => {
    Reflect.deleteProperty(globalThis, 'WebSocket');

    class FakeWs {
      constructor(public readonly url: string) {}
    }

    vi.doMock('node:module', () => ({
      createRequire: () =>
        ((specifier: string) => {
          if (specifier === 'ws') {
            return FakeWs;
          }
          throw new Error(`Unexpected import: ${specifier}`);
        }) as unknown as ReturnType<typeof import('node:module').createRequire>
    }));

    const { createWebSocketClient } = await import('../../../src/transport/websocket.js');
    const socket = createWebSocketClient('ws://localhost:4321') as unknown as FakeWs;
    expect(socket.url).toBe('ws://localhost:4321');
  });

  it('throws a clear error when neither native nor ws WebSocket is available', async () => {
    Reflect.deleteProperty(globalThis, 'WebSocket');

    vi.doMock('node:module', () => ({
      createRequire: () =>
        ((specifier: string) => {
          throw new Error(`Cannot find module '${specifier}'`);
        }) as unknown as ReturnType<typeof import('node:module').createRequire>
    }));

    const { createWebSocketClient } = await import('../../../src/transport/websocket.js');

    expect(() => createWebSocketClient('ws://localhost:1')).toThrowError(
      /Node\.js >= 22\.4|optional peer dependency/i
    );
  });

  it('mentions Node.js and ws guidance in unavailable WebSocket errors', async () => {
    Reflect.deleteProperty(globalThis, 'WebSocket');

    vi.doMock('node:module', () => ({
      createRequire: () =>
        ((specifier: string) => {
          throw new Error(`Cannot find module '${specifier}'`);
        }) as unknown as ReturnType<typeof import('node:module').createRequire>
    }));

    const { createWebSocketClient } = await import('../../../src/transport/websocket.js');

    expect(() => createWebSocketClient('ws://localhost:2')).toThrowError(
      /native globalThis\.WebSocket.*install "ws"/i
    );
  });
});
