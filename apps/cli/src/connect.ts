// apps/cli/src/connect.ts
import { spawn } from 'node:child_process';
import { existsSync, mkdirSync } from 'node:fs';
import { dirname } from 'node:path';
import { createConnection } from 'node:net';
import { SocketTransport } from '@lspeasy/core/node';
import { socketPath } from '@lsproxy/proxy';
import { RefactorSession, type SessionOptions } from './session.js';

const PROXY_BIN = new URL('../../proxy/dist/main.js', import.meta.url).pathname;
const POLL_INTERVAL_MS = 100;
const POLL_TIMEOUT_MS = 5000;

async function tryConnect(sockPath: string): Promise<boolean> {
  return new Promise((resolve) => {
    const socket = createConnection({ path: sockPath });
    socket.once('connect', () => {
      socket.destroy();
      resolve(true);
    });
    socket.once('error', () => resolve(false));
  });
}

async function pollForSocket(sockPath: string, timeoutMs: number): Promise<void> {
  const deadline = Date.now() + timeoutMs;
  while (Date.now() < deadline) {
    if (existsSync(sockPath) && (await tryConnect(sockPath))) return;
    await new Promise<void>((r) => setTimeout(r, POLL_INTERVAL_MS));
  }
  throw new Error(`Proxy daemon did not start within ${timeoutMs}ms (socket: ${sockPath})`);
}

function spawnDaemon(root: string, sockPath: string): void {
  mkdirSync(dirname(sockPath), { recursive: true });
  const child = spawn(process.execPath, [PROXY_BIN, '--root', root, '--socket', sockPath], {
    detached: true,
    stdio: 'ignore'
  });
  child.unref();
}

export interface ConnectOptions {
  root: string;
  languageId: string;
  serverCommand?: string;
  indexWaitMs: number;
  verbose: boolean;
}

export async function connectViaProxy(opts: ConnectOptions): Promise<RefactorSession> {
  const sockPath = socketPath(opts.root);
  const alreadyUp = existsSync(sockPath) && (await tryConnect(sockPath));

  if (!alreadyUp) {
    if (opts.verbose) process.stderr.write(`[lsproxy] spawning proxy daemon\n`);
    spawnDaemon(opts.root, sockPath);
    await pollForSocket(sockPath, POLL_TIMEOUT_MS);
  }

  if (opts.verbose) process.stderr.write(`[lsproxy] connecting via proxy ${sockPath}\n`);

  const transport = new SocketTransport({ path: sockPath });
  await transport.waitForConnect();

  const sessionOpts: SessionOptions = {
    root: opts.root,
    languageId: opts.languageId,
    indexWaitMs: opts.indexWaitMs,
    verbose: opts.verbose,
    transport
  };

  const session = new RefactorSession(sessionOpts);
  await session.start();
  return session;
}
