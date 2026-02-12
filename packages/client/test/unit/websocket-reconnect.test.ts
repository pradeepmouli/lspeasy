import { afterEach, describe, expect, it } from 'vitest';
import { WebSocketTransport } from '@lspeasy/core';

class FakeNativeWebSocket {
  static instances: FakeNativeWebSocket[] = [];

  readonly readyState = 1;
  private listeners: Record<string, Array<(event?: any) => void>> = {
    open: [],
    message: [],
    error: [],
    close: []
  };

  constructor(public readonly url: string) {
    FakeNativeWebSocket.instances.push(this);
    queueMicrotask(() => {
      this.emit('open');
    });
  }

  addEventListener(event: 'open' | 'message' | 'error' | 'close', handler: (event?: any) => void) {
    this.listeners[event].push(handler);
  }

  send(): void {}

  close(): void {
    this.emit('close', { type: 'close' });
  }

  private emit(event: 'open' | 'message' | 'error' | 'close', payload?: any): void {
    for (const handler of this.listeners[event]) {
      handler(payload);
    }
  }
}

const originalWebSocket = globalThis.WebSocket;

afterEach(() => {
  FakeNativeWebSocket.instances = [];
  if (originalWebSocket) {
    globalThis.WebSocket = originalWebSocket;
  } else {
    Reflect.deleteProperty(globalThis, 'WebSocket');
  }
});

describe('WebSocket reconnection (native WebSocket)', () => {
  it('recreates socket after close when reconnect is enabled', async () => {
    globalThis.WebSocket = FakeNativeWebSocket as unknown as typeof WebSocket;

    const transport = new WebSocketTransport({
      url: 'ws://localhost:7777',
      enableReconnect: true,
      reconnectDelay: 1,
      maxReconnectDelay: 1,
      reconnectBackoffMultiplier: 1,
      maxReconnectAttempts: 1
    });

    await new Promise((resolve) => setTimeout(resolve, 5));
    expect(FakeNativeWebSocket.instances.length).toBe(1);

    FakeNativeWebSocket.instances[0].close();

    await new Promise((resolve) => setTimeout(resolve, 20));
    expect(FakeNativeWebSocket.instances.length).toBe(2);

    await transport.close();
  });
});
