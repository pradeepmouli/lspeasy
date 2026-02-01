/**
 * Minimal LSP Server Example (<30 lines)
 * Demonstrates a basic hover server with automatic type inference
 */

import { LSPServer, StdioTransport } from '@lspeasy/server';

// Create server
const server = new LSPServer({
  name: 'minimal-hover-server',
  version: '1.0.0'
});

// Set capabilities
server.setCapabilities({
  hoverProvider: true
});

// Register hover handler - types are automatically inferred!
server.onRequest('textDocument/hover', async (params) => {
  // params is automatically typed as HoverParams
  // return type is automatically Hover | null
  return {
    contents: {
      kind: 'markdown',
      value: `# Hover Information\n\nPosition: Line ${params.position.line}, Character ${params.position.character}`
    }
  };
});

// Start server on stdio
const transport = new StdioTransport();
await server.listen(transport);
