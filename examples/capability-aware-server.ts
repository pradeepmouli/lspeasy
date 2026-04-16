/**
 * Example demonstrating capability-aware server with runtime validation
 *
 * This example shows how:
 * 1. Server declares capabilities
 * 2. Handlers are validated against declared capabilities
 * 3. Strict mode prevents invalid handler registration
 */

import { LSPServer } from '../packages/server/src/server.js';
import { StdioTransport, LogLevel } from '../packages/core/src/index.js';
import type { ServerCapabilities } from '../packages/core/src/index.js';

const transport = new StdioTransport();

// Define server with specific capabilities
const capabilities: ServerCapabilities = {
  textDocumentSync: {
    openClose: true,
    change: 1,
    save: { includeText: false }
  },
  hoverProvider: true,
  completionProvider: {
    triggerCharacters: ['.', '@']
  }
  // Note: definitionProvider is NOT declared
  // definitionProvider: true,
};

// Create server with strict capability checking
const server = new LSPServer({
  name: 'capability-aware-server',
  version: '1.0.0',
  logLevel: LogLevel.Info,
  capabilities: { definitionProvider: true },
  strictCapabilities: true // Throws error if handler doesn't match capability
});

// Set capabilities before registering handlers
server.registerCapabilities(capabilities);

// ✅ This works - hover capability is declared
server.onRequest('textDocument/hover', async (params: any) => {
  return {
    contents: {
      kind: 'markdown',
      value: `Hover text for ${params.position.line}:${params.position.character}`
    }
  };
});

// ✅ This works - completion capability is declared
server.onRequest('textDocument/completion', async (_params: any) => {
  return {
    isIncomplete: false,
    items: [
      {
        label: 'example',
        kind: 1,
        detail: 'Example completion'
      }
    ]
  };
});

// ❌ Uncommenting this will throw an error in strict mode
// because definitionProvider capability is not declared
// server.onRequest('textDocument/definition', async (params) => {
//   return { uri: params.textDocument.uri, range: { start: params.position, end: params.position } };
// });

// Lifecycle handlers are always allowed regardless of capabilities
server.onNotification('textDocument/didOpen', async (params: any) => {
  console.log(`Opened: ${params.textDocument.uri}`);
});

server.onNotification('textDocument/didChange', async (params: any) => {
  console.log(`Changed: ${params.textDocument.uri}`);
});

// Start server
server.listen(transport).catch((error: any) => {
  console.error('Server error:', error);
  process.exit(1);
});
