/** Binary session frames on stdin/stdout for the experimental native bridge. */
import { Duplex, type Readable, type Writable } from 'node:stream';
import { duplexToTransport } from '@lspeasy/core/transport/socket';
import type { Transport } from '@lspeasy/core/transport';

const DATA = 1;
const OPEN = 2;
const CLOSE = 3;
const INPUT_CLOSED = 4;
const HEADER_SIZE = 9;
const MAX_FRAME_SIZE = 16 * 1024 * 1024;

export class StdioMuxBridge {
  private buffer = Buffer.alloc(0);
  private readonly sessions = new Map<number, Duplex>();
  private inputEnded = false;

  constructor(
    input: Readable,
    private readonly output: Writable,
    private readonly onSession: (transport: Transport) => void,
    private readonly onEnd: () => void = () => {}
  ) {
    input.on('data', (chunk: Buffer) => this.accept(chunk));
    input.on('end', () => {
      this.inputEnded = true;
      for (const stream of this.sessions.values()) stream.destroy();
      this.sessions.clear();
      this.onEnd();
    });
  }

  private writeFrame(
    kind: number,
    session: number,
    payload: Buffer,
    done?: (error?: Error | null) => void
  ): void {
    if (payload.length > MAX_FRAME_SIZE) {
      done?.(new Error('bridge frame too large'));
      return;
    }
    const frame = Buffer.allocUnsafe(HEADER_SIZE + payload.length);
    frame.writeUInt8(kind, 0);
    frame.writeUInt32BE(session, 1);
    frame.writeUInt32BE(payload.length, 5);
    payload.copy(frame, HEADER_SIZE);
    this.output.write(frame, done);
  }

  private accept(chunk: Buffer): void {
    this.buffer = Buffer.concat([this.buffer, chunk]);
    while (this.buffer.length >= HEADER_SIZE) {
      const kind = this.buffer.readUInt8(0);
      const session = this.buffer.readUInt32BE(1);
      const length = this.buffer.readUInt32BE(5);
      if (session === 0 || length > MAX_FRAME_SIZE || (kind !== DATA && length !== 0)) {
        throw new Error('invalid bridge frame');
      }
      const total = HEADER_SIZE + length;
      if (this.buffer.length < total) return;
      const payload = this.buffer.subarray(HEADER_SIZE, total);
      this.buffer = this.buffer.subarray(total);
      this.dispatch(kind, session, payload);
    }
  }

  private dispatch(kind: number, session: number, payload: Buffer): void {
    if (kind === OPEN) {
      if (this.sessions.has(session)) throw new Error('duplicate bridge session');
      const stream = new Duplex({
        read() {},
        write: (chunk: Buffer, _encoding, callback) => {
          const bytes = Buffer.from(chunk);
          const writeChunks = (offset: number): void => {
            if (offset === bytes.length) {
              callback();
              return;
            }
            const part = bytes.subarray(offset, offset + MAX_FRAME_SIZE);
            this.writeFrame(DATA, session, part, (error) => {
              if (error) callback(error);
              else writeChunks(offset + part.length);
            });
          };
          writeChunks(0);
        }
      });
      stream.on('close', () => {
        if (this.sessions.delete(session) && !this.inputEnded) {
          this.writeFrame(CLOSE, session, Buffer.alloc(0));
        }
      });
      this.sessions.set(session, stream);
      this.onSession(duplexToTransport(stream));
      return;
    }
    const stream = this.sessions.get(session);
    if (!stream) throw new Error('unknown bridge session');
    if (kind === DATA) stream.push(payload);
    else if (kind === INPUT_CLOSED) stream.push(null);
    else if (kind === CLOSE) {
      this.sessions.delete(session);
      stream.destroy();
    } else throw new Error('unknown bridge frame kind');
  }
}
