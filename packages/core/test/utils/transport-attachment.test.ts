/**
 * Unit tests for TransportAttachment
 */

import { describe, it, expect, vi } from 'vitest';
import type { Transport } from '../../src/transport/transport.js';
import { TransportAttachment } from '../../src/utils/transport-attachment.js';

describe('TransportAttachment', () => {
  const createTransport = () => {
    const onMessage = vi.fn().mockReturnValue({ dispose: vi.fn() });
    const onError = vi.fn().mockReturnValue({ dispose: vi.fn() });
    const onClose = vi.fn((handler: () => void) => {
      return { dispose: vi.fn(), handler };
    });
    const transport = {
      onMessage,
      onError,
      onClose,
      send: vi.fn(async () => undefined),
      close: vi.fn(async () => undefined),
      isConnected: vi.fn(() => true)
    } satisfies Transport;

    return { transport, onMessage, onError, onClose };
  };

  it('attaches handlers and exposes attachment state', () => {
    const { transport, onMessage, onError, onClose } = createTransport();
    const attachment = new TransportAttachment();
    const handlers = {
      onMessage: vi.fn(),
      onError: vi.fn(),
      onClose: vi.fn()
    };

    attachment.attach(transport, handlers);

    expect(attachment.isAttached()).toBe(true);
    expect(onMessage).toHaveBeenCalledWith(handlers.onMessage);
    expect(onError).toHaveBeenCalledWith(handlers.onError);
    expect(onClose).toHaveBeenCalledTimes(1);
  });

  it('detaches and disposes handlers', () => {
    const { transport, onMessage, onError, onClose } = createTransport();
    const attachment = new TransportAttachment();
    const handlers = {
      onMessage: vi.fn(),
      onError: vi.fn(),
      onClose: vi.fn()
    };

    const disposable = attachment.attach(transport, handlers);
    const disposables = [
      onMessage.mock.results[0]?.value,
      onError.mock.results[0]?.value,
      onClose.mock.results[0]?.value
    ];

    disposable.dispose();

    expect(attachment.isAttached()).toBe(false);
    for (const item of disposables) {
      expect(item?.dispose).toHaveBeenCalledTimes(1);
    }
  });

  it('detaches when transport closes and forwards close handler', () => {
    const { transport, onClose } = createTransport();
    const attachment = new TransportAttachment();
    const handlers = {
      onMessage: vi.fn(),
      onError: vi.fn(),
      onClose: vi.fn()
    };

    attachment.attach(transport, handlers);
    const closeEntry = onClose.mock.results[0]?.value as { handler?: () => void } | undefined;
    closeEntry?.handler?.();

    expect(handlers.onClose).toHaveBeenCalledTimes(1);
    expect(attachment.isAttached()).toBe(false);
  });

  it('is safe to detach without an attachment', () => {
    const attachment = new TransportAttachment();

    attachment.detach();

    expect(attachment.isAttached()).toBe(false);
  });
});
