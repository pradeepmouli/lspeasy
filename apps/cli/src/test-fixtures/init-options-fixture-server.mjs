#!/usr/bin/env node
/**
 * Fixture LSP backend for session.test.ts's `initializationOptions` merge
 * coverage.
 *
 * Spawned as a REAL child process by RefactorSession.start() (apps/cli/src/session.ts),
 * driven over real stdio via a real `LSPClient`/`initialize` handshake — not a
 * mock. It captures whatever `initializationOptions` object the real
 * `initialize` request actually carried and exposes it back to the test via a
 * custom `$/test.getInitOptions` request, so the test can assert on the real
 * wire payload instead of on RefactorSession's internal state.
 */
import { LSPServer } from '@lspeasy/server';
import { StdioTransport } from '@lspeasy/core/node';
import { NullLogger } from '@lspeasy/core';

let capturedInitializationOptions;

// NullLogger is required, not cosmetic: this server is spawned as a child
// process over StdioTransport, so stdout IS the JSON-RPC wire.
const server = new LSPServer({
  name: 'init-options-fixture',
  version: '1.0.0',
  logger: new NullLogger(),
  resolveCapabilities: (params) => {
    capturedInitializationOptions = params.initializationOptions;
    return {};
  }
});

server.onRequest('$/test.getInitOptions', async () => capturedInitializationOptions ?? null);

await server.listen(new StdioTransport());
