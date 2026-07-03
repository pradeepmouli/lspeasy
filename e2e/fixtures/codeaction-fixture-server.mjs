#!/usr/bin/env node
/**
 * Fixture LSP backend for e2e/codeaction-polyfill.spec.ts.
 *
 * Spawned as a REAL child process by BackendPool (apps/proxy/src/backend-pool.ts),
 * driven over real stdio, via an `lsp.json` the test writes into its tmp
 * workspace root. This is not a mock — it's a tiny, deliberately incomplete
 * LSP server built with @lspeasy/server.
 *
 * It advertises exactly the capability gap the two @lsproxy/polyfill
 * polyfills exist to fill:
 *   - `codeActionProvider: true` (boolean form — no `resolveProvider`), so
 *     resolve-backfill's `appliesTo` matches and its capability patch /
 *     `codeAction/resolve` echo kicks in. No `codeAction/resolve` handler is
 *     registered here at all — the backend genuinely can't answer it.
 *   - `diagnosticProvider`, so fix-all's `appliesTo` matches. It implements
 *     pull-diagnostics (`textDocument/diagnostic`) and per-diagnostic
 *     `quickfix` code actions, but never synthesizes a composite
 *     `source.fixAll` action itself — a direct `source.fixAll` request
 *     returns nothing, exactly as a real backend without that feature would.
 */
import { LSPServer } from '@lspeasy/server';
import { StdioTransport } from '@lspeasy/core/node';
import { NullLogger } from '@lspeasy/core';

// The one diagnostic this fixture ever reports — a synthetic "unused
// variable" finding with a real, mechanically-applicable quickfix.
const UNUSED_VAR_DIAGNOSTIC = {
  range: { start: { line: 0, character: 0 }, end: { line: 0, character: 13 } },
  message: 'unused variable "x"',
  severity: 2,
  code: 'no-unused-vars',
  source: 'fixture'
};

// NullLogger is required, not cosmetic: this server is spawned as a child
// process over StdioTransport, so stdout IS the JSON-RPC wire — the default
// ConsoleLogger's `console.log` calls would corrupt every frame.
const server = new LSPServer({
  name: 'codeaction-fixture',
  version: '1.0.0',
  logger: new NullLogger()
});

server.registerCapabilities({
  codeActionProvider: true,
  diagnosticProvider: { interFileDependencies: false, workspaceDiagnostics: false }
});

// Pull-diagnostics model (LSP 3.17): always reports the one known fixable
// diagnostic, regardless of which document was asked about — this fixture
// only ever serves one document.
server.onRequest('textDocument/diagnostic', async () => ({
  kind: 'full',
  items: [UNUSED_VAR_DIAGNOSTIC]
}));

// Deliberately no composite `source.fixAll`: a direct request for it (only
// contains 'source.fixAll') returns no actions. A scoped 'quickfix' request
// — exactly what fix-all's augmentCodeActions issues internally while
// synthesizing its composite action — returns the one real per-diagnostic
// fix so the polyfill has something genuine to merge.
server.onRequest('textDocument/codeAction', async (params) => {
  const only = params?.context?.only ?? [];
  if (!only.includes('quickfix')) return [];

  const diagnostic = params.context.diagnostics?.[0];
  if (!diagnostic || diagnostic.code !== 'no-unused-vars') return [];

  return [
    {
      title: 'Remove unused variable',
      kind: 'quickfix',
      isPreferred: true,
      diagnostics: [diagnostic],
      edit: {
        changes: {
          [params.textDocument.uri]: [{ range: diagnostic.range, newText: '' }]
        }
      }
    }
  ];
});

await server.listen(new StdioTransport());
