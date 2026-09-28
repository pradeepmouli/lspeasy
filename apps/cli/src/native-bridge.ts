/** Opt-in CLI transport through the short-lived Rust Unix-socket relay. */
import { spawn } from 'node:child_process';
import type { Transport } from '@lspeasy/core/transport';

const READY = 'LSPROXY_BRIDGE_READY\n';
const READY_TIMEOUT_MS = 2000;

export function nativeBridgeBinary(): string | null {
  return process.env['LSPROXY_BRIDGE_BIN']?.trim() || null;
}

export async function probeNativeBridge(binary: string, socketPath: string): Promise<boolean> {
  return new Promise((resolve) => {
    const child = spawn(binary, ['probe', socketPath], { stdio: 'ignore' });
    child.once('error', () => resolve(false));
    child.once('exit', (code) => resolve(code === 0));
  });
}

export async function connectNativeBridge(binary: string, socketPath: string): Promise<Transport> {
  const child = spawn(binary, ['client', socketPath, '--ready'], {
    stdio: ['pipe', 'pipe', 'pipe']
  });
  if (!child.stdin || !child.stdout || !child.stderr) {
    child.kill();
    throw new Error('Native bridge pipes unavailable');
  }

  try {
    await new Promise<void>((resolve, reject) => {
      let diagnostics = '';
      const cleanup = () => {
        clearTimeout(timer);
        child.off('error', onError);
        child.off('exit', onExit);
        child.stderr.off('data', onData);
      };
      const fail = (message: string) => {
        cleanup();
        reject(new Error(`Native bridge failed: ${message}`));
      };
      const onError = (error: Error) => fail(error.message);
      const onExit = (code: number | null) => fail(`exit ${code}: ${diagnostics.trim()}`);
      const onData = (chunk: Buffer) => {
        diagnostics += chunk.toString();
        if (diagnostics.includes(READY)) {
          cleanup();
          resolve();
        } else if (diagnostics.length > 4096) {
          fail('diagnostics exceeded 4096 bytes before readiness');
        }
      };
      const timer = setTimeout(() => fail('connection timed out'), READY_TIMEOUT_MS);
      child.once('error', onError);
      child.once('exit', onExit);
      child.stderr.on('data', onData);
    });
  } catch (error) {
    child.kill();
    throw error;
  }

  let StdioTransport: typeof import('@lspeasy/core/transport/stdio').StdioTransport;
  try {
    ({ StdioTransport } = await import('@lspeasy/core/transport/stdio'));
  } catch (error) {
    child.kill();
    throw error;
  }
  const transport = new StdioTransport({ input: child.stdout, output: child.stdin });
  const stopChild = () => child.kill();
  process.once('exit', stopChild);
  child.once('exit', () => {
    process.off('exit', stopChild);
    void transport.close();
  });
  child.stderr.on('data', (chunk: Buffer) => process.stderr.write(chunk));
  return {
    send: (message) => transport.send(message),
    onMessage: (handler) => transport.onMessage(handler),
    onError: (handler) => transport.onError(handler),
    onClose: (handler) => transport.onClose(handler),
    isConnected: () => transport.isConnected(),
    async close(): Promise<void> {
      await transport.close();
      child.stdin.end();
      child.kill();
    }
  };
}
