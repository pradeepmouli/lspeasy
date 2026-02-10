/**
 * Unit tests for TransportAttachment
 */

import { describe, it, expect, vi } from 'vitest';
import type { Transport } from '../../src/transport/transport.js';
import { TransportAttachment } from '../../src/utils/transport-attachment.js';

describe('TransportAttachment', () => {
  const createTransport = () => {
    return {
      onMessage: vi.fn().mockReturnValue({ dispose: vi.fn() }),
      onError: vi.fn().mockReturnValue({ dispose: vi.fn() }),
      onClose: vi.fn().mockReturnValue({ dispose: vi.fn() }),
      send: vi.fn(async () => undefined),
      close: vi.fn(async () => undefined),
      isConnected: vi.fn(() => true)
    } satisfies Transport;
  };

  it('attaches handlers and exposes attachment state', () => {
    const transport = createTransport();
    const attachment = new TransportAttachment();
    const handlers = {
      onMessage: vi.fn(),
      onError: vi.fn(),
      onClose: vi.fn()
    };

    attachment.attach(transport, handlers);

    expect(attachment.isAttached()).toBe(true);
    expect(transport.onMessage).toHaveBeenCalledWith(handlers.onMessage);
    expect(transport.onError).toHaveBeenCalledWith(handlers.onError);
    expect(transport.onClose).toHaveBeenCalledTimes(1);
  });

  it('detaches and disposes handlers', () => {
    const transport = createTransport();
    const attachment = new TransportAttachment();
    const handlers = {
      onMessage: vi.fn(),
      onError: vi.fn(),
      onClose: vi.fn()
    };

    const disposable = attachment.attach(transport, handlers);
    const disposables = [
      transport.onMessage.mock.results[0]?.value,
      transport.onError.mock.results[0]?.value,
      transport.onClose.mock.results[0]?.value
    ];

    disposable.dispose();

    expect(attachment.isAttached()).toBe(false);
    for (const item of disposables) {
      expect(item?.dispose).toHaveBeenCalledTimes(1);
    }
  });
});
