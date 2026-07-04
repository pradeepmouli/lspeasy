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
 *   - `diagnosticProvider`, so fix-all's and organize-imports' `appliesTo`
 *     both match. It implements pull-diagnostics (`textDocument/diagnostic`)
 *     reporting two diagnostics — an unused-variable finding and a
 *     missing-import finding — and per-diagnostic `quickfix` code actions
 *     for each, but never synthesizes a composite `source.fixAll` or
 *     `source.organizeImports` action itself.
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

// A second, distinct diagnostic exercising organize-imports: a "missing
// import" finding whose quickfix title contains the word "import" (the
// signal organize-imports' polyfill filters on), on a different line than
// UNUSED_VAR_DIAGNOSTIC so both can be reported for the same document.
const MISSING_IMPORT_DIAGNOSTIC = {
  range: { start: { line: 1, character: 0 }, end: { line: 1, character: 3 } },
  message: 'Cannot find name "foo"',
  severity: 2,
  code: 'missing-import',
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

// Pull-diagnostics model (LSP 3.17): always reports the two known fixable
// diagnostics, regardless of which document was asked about — this fixture
// only ever serves one document.
server.onRequest('textDocument/diagnostic', async () => ({
  kind: 'full',
  items: [UNUSED_VAR_DIAGNOSTIC, MISSING_IMPORT_DIAGNOSTIC]
}));

// Deliberately no composite `source.fixAll` or `source.organizeImports`: a
// direct request for them (only contains these kinds) returns no actions.
// A scoped 'quickfix' request — exactly what fix-all's and organize-imports'
// augmentCodeActions issue internally while synthesizing their composite
// actions — returns the real per-diagnostic fixes so the polyfills have
// something genuine to merge.
server.onRequest('textDocument/codeAction', async (params) => {
  const only = params?.context?.only ?? [];
  if (!only.includes('quickfix')) return [];

  const diagnostic = params.context.diagnostics?.[0];
  if (!diagnostic) return [];

  if (diagnostic.code === 'no-unused-vars') {
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
  }

  if (diagnostic.code === 'missing-import') {
    return [
      {
        title: 'Add missing import for "foo"',
        kind: 'quickfix',
        diagnostics: [diagnostic],
        edit: {
          changes: {
            [params.textDocument.uri]: [
              { range: { start: { line: 0, character: 0 }, end: { line: 0, character: 0 } }, newText: 'import foo;\n' }
            ]
          }
        }
      }
    ];
  }

  return [];
});

await server.listen(new StdioTransport());
