/**
 * Regression coverage for a real bug: MessageReader.close() and
 * MessageWriter.close() called `stream.removeAllListeners()` with no event
 * filter. SocketTransport/TcpTransport (and socketToTransport, used
 * server-side by the proxy daemon) share a single socket between a
 * MessageReader, a MessageWriter, and their own directly-attached
 * 'connect'/'close'/'error' listeners.
 *
 * A stream's 'end' event fires before its 'close' event. MessageReader's
 * 'end' handler calls `this.close()`, which used to wipe out *every*
 * listener on the shared socket — including the transport's own 'close'
 * handler — before the socket's 'close' event was ever emitted. The
 * transport's handler (the one responsible for calling
 * LSPClient.handleClose(), which rejects pending requests) would then never
 * run: a peer dying abruptly (e.g. the daemon crashing mid-handshake) left
 * the client's `connect()`/`sendRequest()` promise pending forever instead of
 * rejecting — manifesting as either a silent hang, or (if nothing else kept
 * the process's event loop alive) the process exiting with code 0 and no
 * error at all.
 *
 * These tests use a real EventEmitter standing in for a stream — precise and
 * dependency-free — to pin down the exact removeAllListeners() behavior.
 * packages/core/test/unit/socket-transport.test.ts covers the same fix
 * end-to-end over a real Unix domain socket.
 */
import { describe, expect, it, vi } from 'vitest';
import { EventEmitter } from 'node:events';
import type { Readable, Writable } from 'node:stream';
import { MessageReader } from '../../src/jsonrpc/reader.js';
import { MessageWriter } from '../../src/jsonrpc/writer.js';

/** Minimal stand-in for a duplex stream: just enough EventEmitter surface
 *  for MessageReader/MessageWriter to attach to, plus a no-op `write` so
 *  MessageWriter's constructor type-checks. */
function fakeDuplexStream(): Readable & Writable & EventEmitter {
  const stream = new EventEmitter() as unknown as Readable & Writable & EventEmitter;
  (stream as unknown as { write: (chunk: unknown, cb?: (err?: Error) => void) => boolean }).write =
    (_chunk, cb) => {
      cb?.();
      return true;
    };
  return stream;
}

describe('MessageReader.close() / MessageWriter.close() listener cleanup', () => {
  it("does not remove other consumers' listeners from the shared stream", () => {
    const stream = fakeDuplexStream();

    const otherCloseListener = vi.fn();
    const otherErrorListener = vi.fn();
    // Simulate another consumer (e.g. SocketTransport itself) attaching its
    // own listeners directly to the same stream, the way SocketTransport,
    // TcpTransport, and socketToTransport all do alongside their reader/writer.
    stream.on('close', otherCloseListener);
    stream.on('error', otherErrorListener);

    const reader = new MessageReader(stream);
    const writer = new MessageWriter(stream);

    reader.close();
    writer.close();

    // The other consumer's listeners must survive both reader.close() and
    // writer.close() — only *this* reader/writer's own listeners should be
    // removed.
    stream.emit('close');
    expect(otherCloseListener).toHaveBeenCalledTimes(1);

    stream.emit('error', new Error('boom'));
    expect(otherErrorListener).toHaveBeenCalledTimes(1);
  });

  it('reader.close() triggered by "end" (which fires before "close") still leaves the shared close listener intact for the later "close" emit', () => {
    const stream = fakeDuplexStream();

    const outerCloseListener = vi.fn();
    // Registered AFTER the reader/writer, exactly like SocketTransport's own
    // socket.on('close', ...) in attachSocket().
    const reader = new MessageReader(stream);
    const writer = new MessageWriter(stream);
    stream.on('close', outerCloseListener);

    // A real socket fires 'end' strictly before 'close'. MessageReader's
    // onEnd() calls close() synchronously in response to 'end' — this used
    // to call stream.removeAllListeners(), deleting `outerCloseListener`
    // before the subsequent 'close' emit ever ran.
    stream.emit('end');
    // Sanity: reader really did close itself in response to 'end'.
    expect(reader.isClosed()).toBe(true);
    expect(writer.isClosed()).toBe(false); // writer only closes on its own 'close'/'error'

    stream.emit('close');

    expect(outerCloseListener).toHaveBeenCalledTimes(1);
  });

  it('removes exactly the listeners this reader attached, no more and no less', () => {
    const stream = fakeDuplexStream();
    const before = {
      data: stream.listenerCount('data'),
      error: stream.listenerCount('error'),
      end: stream.listenerCount('end'),
      close: stream.listenerCount('close')
    };

    const reader = new MessageReader(stream);
    expect(stream.listenerCount('data')).toBe(before.data + 1);
    expect(stream.listenerCount('error')).toBe(before.error + 1);
    expect(stream.listenerCount('end')).toBe(before.end + 1);
    expect(stream.listenerCount('close')).toBe(before.close + 1);

    reader.close();
    expect(stream.listenerCount('data')).toBe(before.data);
    expect(stream.listenerCount('error')).toBe(before.error);
    expect(stream.listenerCount('end')).toBe(before.end);
    expect(stream.listenerCount('close')).toBe(before.close);
  });

  it('is idempotent: calling close() twice does not throw or double-remove', () => {
    const stream = fakeDuplexStream();
    const reader = new MessageReader(stream);
    const writer = new MessageWriter(stream);

    expect(() => {
      reader.close();
      reader.close();
      writer.close();
      writer.close();
    }).not.toThrow();
  });
});
