// apps/cli/src/connect.ts
import { spawn } from 'node:child_process';
import { existsSync, mkdirSync, openSync, readFileSync } from 'node:fs';
import { basename, dirname, join } from 'node:path';
import { createConnection } from 'node:net';
import { SocketTransport } from '@lspeasy/core/node';
import type { Message } from '@lspeasy/core';
import { socketPath } from '@lsproxy/proxy';
import type { StatusReport } from '@lsproxy/proxy';
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

async function pollForSocket(sockPath: string, timeoutMs: number, logPath: string): Promise<void> {
  const deadline = Date.now() + timeoutMs;
  while (Date.now() < deadline) {
    if (existsSync(sockPath) && (await tryConnect(sockPath))) return;
    await new Promise<void>((r) => setTimeout(r, POLL_INTERVAL_MS));
  }
  // The daemon is detached; if it crashed on startup its only trace is the log
  // file. Surface a tail of it so a fatal error (e.g. a missing dependency)
  // isn't masked by this generic timeout.
  let tail = '';
  try {
    const lines = readFileSync(logPath, 'utf8').trimEnd().split('\n');
    if (lines[0]) tail = `\nDaemon log (${logPath}):\n  ${lines.slice(-8).join('\n  ')}`;
  } catch {
    tail = `\nDaemon log: ${logPath} (empty — daemon may not have started)`;
  }
  throw new Error(`Proxy daemon did not start within ${timeoutMs}ms (socket: ${sockPath})${tail}`);
}

function spawnDaemon(root: string, sockPath: string): string {
  const dir = dirname(sockPath);
  mkdirSync(dir, { recursive: true });
  // Capture daemon stdout/stderr to a log instead of discarding it, so a
  // startup crash is diagnosable rather than surfacing only as a poll timeout.
  const logPath = join(dir, `daemon-${basename(sockPath, '.sock')}.log`);
  const log = openSync(logPath, 'a');
  const child = spawn(process.execPath, [PROXY_BIN, '--root', root, '--socket', sockPath], {
    detached: true,
    stdio: ['ignore', log, log]
  });
  child.unref();
  return logPath;
}

const STATUS_TIMEOUT_MS = 2000;

/**
 * Ask a running proxy daemon for its status. Returns null when no daemon is
 * listening on the project's socket — callers fall back to a config-only view.
 *
 * NEVER rejects. Resolves to `null` for any failure: no socket, connect error,
 * transport hang (waitForConnect included), request timeout, or any thrown
 * exception. `transport.close()` is always called in a finally block.
 */
export async function fetchDaemonStatus(root: string): Promise<StatusReport | null> {
  const sockPath = socketPath(root);
  if (!existsSync(sockPath) || !(await tryConnect(sockPath))) return null;

  const transport = new SocketTransport({ path: sockPath });
  try {
    // A deadline that resolves (not rejects) to null bounds the whole operation
    // including waitForConnect(), so a wedged daemon cannot hang bare `lsproxy`.
    const deadline = new Promise<null>((resolve) =>
      setTimeout(() => resolve(null), STATUS_TIMEOUT_MS)
    );

    const request = new Promise<StatusReport | null>((resolve) => {
      void (async () => {
        try {
          await transport.waitForConnect();
          const sub = transport.onMessage((m: Message) => {
            const msg = m as { id?: unknown; result?: StatusReport };
            if (msg.id === 1) {
              sub.dispose();
              resolve(msg.result as StatusReport);
            }
          });
          void transport.send({
            jsonrpc: '2.0',
            id: 1,
            method: '$/lsproxy.status',
            params: {}
          } as Message);
        } catch {
          resolve(null);
        }
      })();
    });

    return await Promise.race([request, deadline]);
  } catch {
    return null;
  } finally {
    await transport.close();
  }
}

/**
 * Ensure a proxy daemon is running for `root`. Returns whether it was newly
 * started (vs already up) and the daemon pid. Reuses the same spawn+poll path
 * as `connectViaProxy`.
 */
export async function startDaemon(
  root: string,
  verbose = false
): Promise<{ started: boolean; pid: number | null }> {
  const sockPath = socketPath(root);
  if (existsSync(sockPath) && (await tryConnect(sockPath))) {
    const status = await fetchDaemonStatus(root);
    return { started: false, pid: status?.daemon?.pid ?? null };
  }
  if (verbose) process.stderr.write('[lsproxy] spawning proxy daemon\n');
  const logPath = spawnDaemon(root, sockPath);
  await pollForSocket(sockPath, POLL_TIMEOUT_MS, logPath);
  const status = await fetchDaemonStatus(root);
  return { started: true, pid: status?.daemon?.pid ?? null };
}

const STOP_TIMEOUT_MS = 3000;

/**
 * Stop the proxy daemon for `root` (SIGTERM its pid) and wait until it's
 * actually gone. The daemon handles SIGTERM asynchronously and only then
 * unlinks its socket, so we poll until the socket is unreachable — otherwise a
 * `stop` → `status`/`start` chain could still see the old daemon.
 *
 * `pending: true` means the signal was sent but the daemon hadn't shut down
 * within the timeout. A `null` pid means none was running.
 */
export async function stopDaemon(
  root: string
): Promise<{ stopped: boolean; pid: number | null; pending: boolean }> {
  const status = await fetchDaemonStatus(root);
  const pid = status?.daemon?.pid ?? null;
  if (pid === null) return { stopped: false, pid: null, pending: false };
  try {
    process.kill(pid, 'SIGTERM');
  } catch (err) {
    // ESRCH: the daemon exited between the status fetch and the signal — gone.
    if ((err as NodeJS.ErrnoException).code === 'ESRCH') {
      return { stopped: true, pid, pending: false };
    }
    return { stopped: false, pid, pending: false };
  }
  const sockPath = socketPath(root);
  const deadline = Date.now() + STOP_TIMEOUT_MS;
  while (Date.now() < deadline) {
    if (!existsSync(sockPath) || !(await tryConnect(sockPath))) {
      return { stopped: true, pid, pending: false };
    }
    await new Promise<void>((r) => setTimeout(r, POLL_INTERVAL_MS));
  }
  return { stopped: false, pid, pending: true };
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
    const logPath = spawnDaemon(opts.root, sockPath);
    await pollForSocket(sockPath, POLL_TIMEOUT_MS, logPath);
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
