import { describe, expect, it } from 'vitest';
import { PassThrough } from 'node:stream';
import { StdioMuxBridge } from './stdio-mux-bridge.js';

function frame(kind: number, session: number, payload = Buffer.alloc(0)): Buffer {
  const bytes = Buffer.alloc(9 + payload.length);
  bytes[0] = kind;
  bytes.writeUInt32BE(session, 1);
  bytes.writeUInt32BE(payload.length, 5);
  payload.copy(bytes, 9);
  return bytes;
}

describe('StdioMuxBridge', () => {
  const request = (id: number) => {
    const body = Buffer.from(JSON.stringify({ jsonrpc: '2.0', id, method: 'test' }));
    return Buffer.concat([Buffer.from(`Content-Length: ${body.length}\r\n\r\n`), body]);
  };

  it('routes interleaved JSON-RPC sessions to their own framed responses', async () => {
    const input = new PassThrough();
    const output = new PassThrough();
    const received: Buffer[] = [];
    output.on('data', (chunk: Buffer) => received.push(chunk));
    const sessionIds = [11, 22];
    new StdioMuxBridge(input, output, (transport) => {
      const session = sessionIds.shift();
      transport.onMessage((message) => {
        void transport.send({ jsonrpc: '2.0', id: message.id, result: { session } });
      });
    });

    const bytes = Buffer.concat([
      frame(2, 11),
      frame(2, 22),
      frame(1, 22, request(2)),
      frame(1, 11, request(1))
    ]);
    input.write(bytes.subarray(0, 7));
    input.write(bytes.subarray(7));
    await new Promise((resolve) => setTimeout(resolve, 20));

    const frames = Buffer.concat(received);
    let offset = 0;
    const results = new Map<number, string>();
    while (offset < frames.length) {
      const kind = frames.readUInt8(offset);
      const session = frames.readUInt32BE(offset + 1);
      const length = frames.readUInt32BE(offset + 5);
      results.set(session, frames.subarray(offset + 9, offset + 9 + length).toString());
      expect(kind).toBe(1);
      offset += 9 + length;
    }
    expect(results.get(11)).toContain('"session":11');
    expect(results.get(22)).toContain('"session":22');
    input.end();
  });

  it('rejects an oversized frame before buffering its payload', () => {
    const input = new PassThrough();
    new StdioMuxBridge(input, new PassThrough(), () => {});
    const header = Buffer.alloc(9);
    header[0] = 1;
    header.writeUInt32BE(1, 1);
    header.writeUInt32BE(16 * 1024 * 1024 + 1, 5);
    expect(() => input.write(header)).toThrow('invalid bridge frame');
  });

  it('ignores late terminal frames but rejects data for a closed session', () => {
    const input = new PassThrough();
    const bridge = new StdioMuxBridge(input, new PassThrough(), () => {});
    input.write(frame(2, 1));
    input.write(frame(3, 1));
    expect(() => input.write(frame(4, 1))).not.toThrow();
    expect(() => input.write(frame(3, 1))).not.toThrow();
    expect(() => input.write(frame(1, 1, Buffer.from('late')))).toThrow('unknown bridge session');
    bridge.close();
  });

  it('drains an outstanding response after input EOF, then closes the session', async () => {
    const input = new PassThrough();
    const output = new PassThrough();
    const received: Buffer[] = [];
    output.on('data', (chunk: Buffer) => received.push(chunk));
    let reply: (() => Promise<void>) | undefined;
    const bridge = new StdioMuxBridge(input, output, (transport) => {
      reply = () => transport.send({ jsonrpc: '2.0', id: 1, result: { ok: true } });
    });
    input.write(Buffer.concat([frame(2, 1), frame(1, 1, request(1)), frame(4, 1)]));
    expect(received).toHaveLength(0);
    await reply?.();
    await new Promise((resolve) => setImmediate(resolve));
    expect(received.map((chunk) => chunk[0])).toEqual([1, 3]);
    bridge.close();
  });

  it('reaps a half-closed session whose request never receives a response', async () => {
    const input = new PassThrough();
    const output = new PassThrough();
    const received: Buffer[] = [];
    output.on('data', (chunk: Buffer) => received.push(chunk));
    const bridge = new StdioMuxBridge(
      input,
      output,
      () => {},
      () => {},
      10
    );
    input.write(Buffer.concat([frame(2, 1), frame(1, 1, request(1)), frame(4, 1)]));
    await new Promise((resolve) => setTimeout(resolve, 30));
    expect(received.map((chunk) => chunk[0])).toContain(3);
    bridge.close();
  });
});
