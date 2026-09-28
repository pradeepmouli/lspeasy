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

    const request = (id: number) => {
      const body = Buffer.from(JSON.stringify({ jsonrpc: '2.0', id, method: 'test' }));
      return Buffer.concat([Buffer.from(`Content-Length: ${body.length}\r\n\r\n`), body]);
    };
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
});
