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
const OUTPUT_CHUNK_SIZE = 16 * 1024;
const ABANDON_TIMEOUT_MS = 60_000;

interface SessionState {
  stream: Duplex;
  pending: Set<string>;
  inputClosed: boolean;
  abandonTimer?: ReturnType<typeof setTimeout>;
}

function messageId(message: object): string | null {
  if (!('id' in message)) return null;
  const id = message.id;
  return typeof id === 'string' || typeof id === 'number' ? `${typeof id}:${id}` : null;
}

export class StdioMuxBridge {
  private buffer = Buffer.alloc(0);
  private readonly sessions = new Map<number, SessionState>();
  private inputEnded = false;
  private readonly onInputData = (chunk: Buffer) => this.accept(chunk);
  private readonly onInputEnd = () => {
    this.close();
    this.onEnd();
  };

  constructor(
    private readonly input: Readable,
    private readonly output: Writable,
    private readonly onSession: (transport: Transport) => void,
    private readonly onEnd: () => void = () => {},
    private readonly abandonTimeoutMs = ABANDON_TIMEOUT_MS
  ) {
    input.on('data', this.onInputData);
    input.on('end', this.onInputEnd);
  }

  close(): void {
    if (this.inputEnded) return;
    this.inputEnded = true;
    this.input.off('data', this.onInputData);
    this.input.off('end', this.onInputEnd);
    this.input.destroy();
    for (const state of this.sessions.values()) {
      if (state.abandonTimer) clearTimeout(state.abandonTimer);
      state.stream.destroy();
    }
    this.sessions.clear();
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
            const part = bytes.subarray(offset, offset + OUTPUT_CHUNK_SIZE);
            this.writeFrame(DATA, session, part, (error) => {
              if (error) callback(error);
              else writeChunks(offset + part.length);
            });
          };
          writeChunks(0);
        }
      });
      const state: SessionState = { stream, pending: new Set(), inputClosed: false };
      stream.on('close', () => {
        if (state.abandonTimer) clearTimeout(state.abandonTimer);
        const owned = this.sessions.get(session) === state;
        if (owned) this.sessions.delete(session);
        if (owned && !this.inputEnded) {
          this.writeFrame(CLOSE, session, Buffer.alloc(0));
        }
      });
      this.sessions.set(session, state);
      const transport = duplexToTransport(stream);
      transport.onMessage((message) => {
        if ('method' in message) {
          const id = messageId(message);
          if (id !== null) state.pending.add(id);
        }
      });
      this.onSession({
        send: async (message) => {
          await transport.send(message);
          if (!('method' in message)) {
            const id = messageId(message);
            if (id !== null) state.pending.delete(id);
            if (state.inputClosed && state.pending.size === 0) stream.destroy();
          }
        },
        onMessage: (handler) => transport.onMessage(handler),
        onError: (handler) => transport.onError(handler),
        onClose: (handler) => transport.onClose(handler),
        close: () => transport.close(),
        isConnected: () => transport.isConnected()
      });
      return;
    }
    const state = this.sessions.get(session);
    if (!state) {
      if (kind === CLOSE || kind === INPUT_CLOSED) return;
      throw new Error('unknown bridge session');
    }
    if (kind === DATA) {
      if (state.inputClosed) throw new Error('data after input closed');
      state.stream.push(payload);
    } else if (kind === INPUT_CLOSED) {
      if (state.inputClosed) return;
      state.inputClosed = true;
      // push() delivers data to MessageReader on a later turn. Let it record any
      // request in the final DATA frame before deciding whether the session is idle.
      setImmediate(() => {
        if (this.sessions.get(session) !== state || state.stream.destroyed) return;
        if (state.pending.size === 0) state.stream.destroy();
        else state.abandonTimer = setTimeout(() => state.stream.destroy(), this.abandonTimeoutMs);
      });
    } else if (kind === CLOSE) {
      this.sessions.delete(session);
      state.stream.destroy();
    } else throw new Error('unknown bridge frame kind');
  }
}
