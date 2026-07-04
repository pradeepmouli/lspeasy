/**
 * End-to-end coverage for both @lsproxy/polyfill CodeAction polyfills,
 * exercised through the REAL proxy path: a real `ProxyServer` listening on a
 * real Unix domain socket, backed by a real fixture LSP server child process
 * (e2e/fixtures/codeaction-fixture-server.mjs), driven by a real `LSPClient`
 * sending real JSON-RPC requests over the real socket.
 *
 * This is intentionally NOT a repeat of the mocked-backend unit coverage in
 * apps/proxy/src/proxy-session.test.ts (Task 8) or packages/polyfill/src/*.test.ts
 * (Tasks 6-7) — it proves the whole pipeline (BackendPool spawning a real
 * process from `lsp.json` discovery, ProxySession wiring, and the polyfills
 * themselves) actually connects end-to-end, not each polyfill's edge cases.
 */
import { afterEach, describe, expect, it } from 'vitest';
import { mkdtempSync, rmSync, writeFileSync } from 'node:fs';
import { tmpdir } from 'node:os';
import { fileURLToPath } from 'node:url';
import { join } from 'node:path';
import { LSPClient } from '@lspeasy/client';
import { SocketTransport } from '@lspeasy/core/node';
import type { CodeAction } from '@lspeasy/core';
// ProxyServer is not part of @lsproxy/proxy's public exports (only
// socketPath/pidPath/status are) — apps/cli/src/connect.test.ts already
// establishes the convention of importing it directly from source across the
// app boundary within this monorepo's single vitest run; mirrored here.
import { ProxyServer } from '../apps/proxy/src/proxy-server.js';

const FIXTURE_SERVER = fileURLToPath(
  new URL('./fixtures/codeaction-fixture-server.mjs', import.meta.url)
);
const FIXTURE_URI = 'file:///workspace/unused.fx';
// Mirrors UNUSED_VAR_DIAGNOSTIC.range in fixtures/codeaction-fixture-server.mjs.
const UNUSED_VAR_RANGE = { start: { line: 0, character: 0 }, end: { line: 0, character: 13 } };

const roots: string[] = [];
const servers: ProxyServer[] = [];
const clients: LSPClient[] = [];

function tmpRoot(): string {
  const dir = mkdtempSync(join(tmpdir(), 'lspeasy-e2e-codeaction-'));
  roots.push(dir);
  // Point the "fx" languageId at the fixture backend script, spawned by
  // BackendPool as `node <fixture-script>` — a real child process, not a mock.
  writeFileSync(
    join(dir, 'lsp.json'),
    JSON.stringify({
      lspServers: {
        fixture: {
          command: process.execPath,
          args: [FIXTURE_SERVER],
          fileExtensions: { '.fx': 'fx' }
        }
      }
    }),
    'utf8'
  );
  return dir;
}

async function startProxy(root: string): Promise<ProxyServer> {
  const server = new ProxyServer({ root, socketOverride: join(root, 'test.sock') });
  await server.start();
  servers.push(server);
  return server;
}

async function connectClient(sockPath: string): Promise<{
  client: LSPClient;
  initResult: Awaited<ReturnType<LSPClient['connect']>>;
}> {
  const transport = new SocketTransport({ path: sockPath });
  await transport.waitForConnect();
  const client = new LSPClient({
    name: 'codeaction-polyfill-e2e-client',
    version: '1.0.0',
    initializationOptions: { languageId: 'fx' }
  });
  clients.push(client);
  const initResult = await client.connect(transport);
  return { client, initResult };
}

afterEach(async () => {
  while (clients.length) {
    try {
      await clients.pop()!.disconnect();
    } catch {
      // ignore
    }
  }
  while (servers.length) {
    try {
      await servers.pop()!.stop();
    } catch {
      // ignore
    }
  }
  while (roots.length) {
    rmSync(roots.pop()!, { recursive: true, force: true });
  }
});

describe('codeAction polyfills (e2e, real proxy + real backend process)', () => {
  it('backfills resolveProvider, synthesizes source.fixAll, and echoes resolve for an already-resolved action', async () => {
    const root = tmpRoot();
    const server = await startProxy(root);
    const { client, initResult } = await connectClient(join(root, 'test.sock'));

    // 1 & 2. initialize: the fixture backend advertises `codeActionProvider:
    // true` with no `resolveProvider` — resolve-backfill's capability patch
    // must make lsproxy advertise resolveProvider: true anyway.
    const codeActionProvider = initResult.capabilities.codeActionProvider;
    expect(typeof codeActionProvider).toBe('object');
    expect((codeActionProvider as { resolveProvider?: boolean }).resolveProvider).toBe(true);

    // 3. textDocument/codeAction with context.only: ['source.fixAll']. The
    // fixture backend has no native fixAll — fix-all's augmentCodeActions
    // must pull diagnostics + per-diagnostic quickfixes from the (real)
    // backend and synthesize the composite action.
    const actions = (await client.sendRequest('textDocument/codeAction', {
      textDocument: { uri: FIXTURE_URI },
      range: {
        start: { line: 0, character: 0 },
        end: { line: 0, character: 0 }
      },
      context: { diagnostics: [], only: ['source.fixAll'] }
    })) as CodeAction[];

    const fixAllAction = actions.find((a) => a.kind === 'source.fixAll');
    expect(fixAllAction).toBeDefined();
    expect(fixAllAction?.edit?.changes).toBeDefined();
    const edits = fixAllAction!.edit!.changes![FIXTURE_URI];
    expect(edits).toBeDefined();
    expect(edits!.length).toBeGreaterThan(0);

    // 4. codeAction/resolve for an already-resolved action: since the
    // backend has no native resolve, resolve-backfill must answer locally by
    // echoing the action back unchanged (per LSP spec: a server without
    // resolveProvider must already return fully-resolved actions).
    const alreadyResolved: CodeAction = {
      title: 'Remove unused variable',
      kind: 'quickfix',
      isPreferred: true,
      edit: { changes: { [FIXTURE_URI]: [{ range: UNUSED_VAR_RANGE, newText: '' }] } }
    };
    const resolved = await client.sendRequest('codeAction/resolve', alreadyResolved);
    expect(resolved).toEqual(alreadyResolved);

    // Sanity: the fixture backend really did start as a live child process.
    const status = server.getStatus();
    expect(status.languages.find((l) => l.languageId === 'fx')?.status).toBe('running');
  });

  it("synthesizes source.organizeImports from the fixture backend's import-related quickfix only", async () => {
    const root = tmpRoot();
    await startProxy(root);
    const { client } = await connectClient(join(root, 'test.sock'));

    const actions = (await client.sendRequest('textDocument/codeAction', {
      textDocument: { uri: FIXTURE_URI },
      range: { start: { line: 0, character: 0 }, end: { line: 0, character: 0 } },
      context: { diagnostics: [], only: ['source.organizeImports'] }
    })) as CodeAction[];

    const organizeImportsAction = actions.find((a) => a.kind === 'source.organizeImports');
    expect(organizeImportsAction).toBeDefined();
    const edits = organizeImportsAction!.edit!.changes![FIXTURE_URI];
    expect(edits).toBeDefined();
    // Only the import quickfix's edit is present — the fixture's separate
    // "Remove unused variable" quickfix (for a diagnostic whose title has no
    // "import" in it) must not have been picked up.
    expect(edits).toHaveLength(1);
    expect(edits![0]!.newText).toContain('import foo');
  });
});
