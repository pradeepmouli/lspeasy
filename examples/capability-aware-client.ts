/**
 * Example demonstrating capability-aware client with dynamic methods
 *
 * This example shows how:
 * 1. Client connects to server and receives capabilities
 * 2. Client methods are dynamically available based on server capabilities
 * 3. Type guards provide compile-time type safety
 */

import {
  LSPClient,
  WebSocketTransport,
  hasHoverCapability,
  hasCompletionCapability,
  hasDefinitionCapability
} from '@lspy/client';

const transport = new WebSocketTransport('ws://localhost:8080');

const client = new LSPClient({
  name: 'capability-aware-client',
  version: '1.0.0',
  logLevel: 'info'
});

// Connect to server and initialize
await client.connect(transport);

// After initialization, client receives server capabilities
console.log('Server capabilities:', client.serverCapabilities);

// ✅ Use type guards for compile-time type safety
if (hasHoverCapability(client)) {
  // TypeScript now knows hover method exists with proper types
  const hoverResult = await client.textDocument.hover({
    textDocument: { uri: 'file:///example.ts' },
    position: { line: 10, character: 5 }
  });
  console.log('Hover result:', hoverResult);
} else {
  console.log('Server does not support hover');
}

// ✅ Type guards narrow the type for completion
if (hasCompletionCapability(client)) {
  const completionResult = await client.textDocument.completion({
    textDocument: { uri: 'file:///example.ts' },
    position: { line: 10, character: 5 }
  });
  console.log('Completion result:', completionResult);
} else {
  console.log('Server does not support completion');
}

// ❌ If server does NOT declare definitionProvider, type guard returns false
if (hasDefinitionCapability(client)) {
  const definitionResult = await client.textDocument.definition({
    textDocument: { uri: 'file:///example.ts' },
    position: { line: 10, character: 5 }
  });
  console.log('Definition result:', definitionResult);
} else {
  console.log('Server does not support goto definition');
}

// Alternative: Check with 'in' operator (less type-safe)
if ('references' in client.textDocument) {
  console.log('Server supports references');
}

// List available methods based on current capabilities
const availableMethods = Object.keys(client.textDocument).filter(
  (key) => typeof client.textDocument[key] === 'function'
);
console.log('Available textDocument methods:', availableMethods);

// Cleanup
await client.shutdown();
await client.disconnect();
