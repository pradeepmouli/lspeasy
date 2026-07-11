// apps/proxy/src/backend-pool.spawn-error.test.ts
//
// Regression coverage for a real bug: BackendPool.startBackend() spawned the
// backend process with no `.on('error', ...)` handler, so a misconfigured
// lsp.json entry (wrong binary name, not on PATH, etc.) threw an *unhandled*
// 'error' event that crashed the entire daemon process — taking down every
// other language's live backend with it, not just the one that failed.
//
// Unlike backend-pool.test.ts (which mocks node:child_process/@lspeasy/client
// to unit-test BackendPool's bookkeeping), this file uses a real spawned
// process for both the broken command and a real fake LSP server for the
// healthy one, matching this repo's preference for real fixtures over mocks
// for behavior that only manifests with a real OS-level spawn failure.
import { afterEach, describe, expect, it } from 'vitest';
import { mkdtempSync, writeFileSync } from 'node:fs';
import { tmpdir } from 'node:os';
import { join } from 'node:path';
import { BackendPool } from './backend-pool.js';

// Minimal real LSP server (same Content-Length framing pattern used by
// apps/cli/src/cli.test.ts's FAKE_LSP_SERVER_SRC) so the "healthy language"
// half of these tests exercises a real spawn + real initialize handshake,
// not a mock.
const FAKE_LSP_SERVER_SRC = `
let buf = Buffer.alloc(0);
process.stdin.on('data', (chunk) => {
  buf = Buffer.concat([buf, chunk]);
  for (;;) {
    const headerEnd = buf.indexOf('\\r\\n\\r\\n');
    if (headerEnd === -1) return;
    const header = buf.subarray(0, headerEnd).toString('utf8');
    const match = /Content-Length: (\\d+)/i.exec(header);
    if (!match) return;
    const length = Number(match[1]);
    const bodyStart = headerEnd + 4;
    if (buf.length < bodyStart + length) return;
    const body = buf.subarray(bodyStart, bodyStart + length).toString('utf8');
    buf = buf.subarray(bodyStart + length);
    try { handle(JSON.parse(body)); } catch { /* ignore */ }
  }
});
function send(msg) {
  const body = JSON.stringify(msg);
  process.stdout.write('Content-Length: ' + Buffer.byteLength(body, 'utf8') + '\\r\\n\\r\\n' + body);
}
function handle(msg) {
  if (msg.method === 'initialize') {
    send({ jsonrpc: '2.0', id: msg.id, result: { capabilities: { hoverProvider: true, textDocumentSync: 1 } } });
  } else if (msg.method === 'shutdown') {
    send({ jsonrpc: '2.0', id: msg.id, result: null });
  } else if (msg.method === 'exit') {
    process.exit(0);
  } else if (msg.id !== undefined) {
    send({ jsonrpc: '2.0', id: msg.id, result: null });
  }
}
`;

function tmpRootWithConfig(): string {
  const dir = mkdtempSync(join(tmpdir(), 'lspeasy-backend-pool-spawn-error-'));
  const serverPath = join(dir, 'fake-lsp-server.mjs');
  writeFileSync(serverPath, FAKE_LSP_SERVER_SRC, 'utf8');
  writeFileSync(
    join(dir, 'lsp.json'),
    JSON.stringify({
      lspServers: {
        broken: {
          command: 'this-binary-does-not-exist-lspeasy-test-fixture',
          fileExtensions: { '.broken': 'brokenlang' }
        },
        good: {
          command: process.execPath,
          args: [serverPath],
          fileExtensions: { '.good': 'goodlang' }
        }
      }
    }),
    'utf8'
  );
  return dir;
}

describe('BackendPool spawn-error handling (real spawn, no mocks)', () => {
  let pools: BackendPool[] = [];

  afterEach(async () => {
    await Promise.all(pools.map((p) => p.stopAll()));
    pools = [];
  });

  function makePool(root: string): BackendPool {
    const pool = new BackendPool(root);
    pools.push(pool);
    return pool;
  }

  it('rejects ensureBackend with a clear error instead of hanging or crashing the process, for a nonexistent binary', async () => {
    const root = tmpRootWithConfig();
    const pool = makePool(root);

    await expect(pool.ensureBackend('brokenlang')).rejects.toThrow(
      /Failed to spawn backend for languageId "brokenlang".*this-binary-does-not-exist-lspeasy-test-fixture/
    );
  }, 10_000);

  it('does not register a backend entry for the failed languageId', async () => {
    const root = tmpRootWithConfig();
    const pool = makePool(root);

    await expect(pool.ensureBackend('brokenlang')).rejects.toThrow();

    expect(pool.getBackend('brokenlang')).toBeUndefined();
    expect(pool.listBackends()).toEqual([]);
  }, 10_000);

  it('leaves the pool usable for a different, valid languageId after a spawn failure', async () => {
    const root = tmpRootWithConfig();
    const pool = makePool(root);

    // The broken language's backend fails first...
    await expect(pool.ensureBackend('brokenlang')).rejects.toThrow();

    // ...but a completely unrelated, correctly configured language must
    // still start normally — one backend's spawn failure must not corrupt
    // the pool's ability to serve any other language.
    const client = await pool.ensureBackend('goodlang');
    expect(client).toBeDefined();
    expect(pool.getBackend('goodlang')).toBe(client);

    const list = pool.listBackends();
    expect(list).toHaveLength(1);
    expect(list[0]?.languageId).toBe('goodlang');
    expect(list[0]?.healthy).toBe(true);
  }, 10_000);

  it('rejects again (not stuck) on a second attempt for the same broken languageId', async () => {
    const root = tmpRootWithConfig();
    const pool = makePool(root);

    await expect(pool.ensureBackend('brokenlang')).rejects.toThrow();
    // A second attempt must be a fresh attempt (not a cached in-flight
    // promise from the first failure) and must also reject cleanly.
    await expect(pool.ensureBackend('brokenlang')).rejects.toThrow(
      /Failed to spawn backend for languageId "brokenlang"/
    );
  }, 10_000);
});
