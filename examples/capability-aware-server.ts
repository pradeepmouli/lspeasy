/**
 * Example demonstrating capability-aware server with runtime validation
 *
 * This example shows how:
 * 1. Server declares capabilities
 * 2. Handlers are validated against declared capabilities
 * 3. Strict mode prevents invalid handler registration
 */

import { LSPServer, StdioTransport } from '@lspeasy/server';
import type { ServerCapabilities } from '@lspeasy/core';

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
  logLevel: 'info',
  strictCapabilities: true // Throws error if handler doesn't match capability
});

// Set capabilities before registering handlers
server.setCapabilities(capabilities);

// ✅ This works - hover capability is declared
server.onRequest('textDocument/hover', async (params) => {
  return {
    contents: {
      kind: 'markdown',
      value: `Hover text for ${params.position.line}:${params.position.character}`
    }
  };
});

// ✅ This works - completion capability is declared
server.onRequest('textDocument/completion', async (params) => {
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
server.onNotification('textDocument/didOpen', async (params) => {
  console.log(`Opened: ${params.textDocument.uri}`);
});

server.onNotification('textDocument/didChange', async (params) => {
  console.log(`Changed: ${params.textDocument.uri}`);
});

// Start server
server.listen(transport).catch((error) => {
  console.error('Server error:', error);
  process.exit(1);
});
