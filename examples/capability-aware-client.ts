/**
 * Example demonstrating capability-aware client with dynamic methods
 *
 * This example shows how:
 * 1. Client connects to server and receives capabilities
 * 2. Client methods are dynamically available based on server capabilities
 * 3. Runtime capability checking provides type safety
 */

import { LSPClient } from '../packages/client/src/client.js';
import { WebSocketTransport } from '../packages/core/src/transport/websocket.js';
import { LogLevel } from '../packages/core/src/index.js';

const transport = new WebSocketTransport({ url: 'ws://localhost:8080' });

const client = new LSPClient({
  name: 'capability-aware-client',
  version: '1.0.0',
  logLevel: LogLevel.Info
});

// Connect to server and initialize
await client.connect(transport);

// After initialization, client receives server capabilities
const serverCaps = client.getServerCapabilities();
console.log('Server capabilities:', serverCaps);

// ✅ Check server capabilities before calling methods
if (serverCaps?.hoverProvider) {
  // TypeScript now knows hover method exists with proper types
  const hoverResult = await client.textDocument.hover({
    textDocument: { uri: 'file:///example.ts' },
    position: { line: 10, character: 5 }
  });
  console.log('Hover result:', hoverResult);
} else {
  console.log('Server does not support hover');
}

// ✅ Check for completion capability
if (serverCaps?.completionProvider) {
  const completionResult = await client.textDocument.completion({
    textDocument: { uri: 'file:///example.ts' },
    position: { line: 10, character: 5 }
  });
  console.log('Completion result:', completionResult);
} else {
  console.log('Server does not support completion');
}

// ✅ Check for definition capability
if (serverCaps?.definitionProvider) {
  const definitionResult = await client.textDocument.definition({
    textDocument: { uri: 'file:///example.ts' },
    position: { line: 10, character: 5 }
  });
  console.log('Definition result:', definitionResult);
} else {
  console.log('Server does not support goto definition');
}

// Alternative: Check capabilities inline
if (serverCaps?.referencesProvider) {
  console.log('Server supports references');
  const refs = await client.textDocument.references({
    textDocument: { uri: 'file:///example.ts' },
    position: { line: 10, character: 5 },
    context: { includeDeclaration: true }
  });
  console.log('References:', refs);
}

// Cleanup
await client.sendRequest('shutdown', undefined);
await client.disconnect();
