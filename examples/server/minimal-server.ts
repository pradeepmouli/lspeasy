/**
 * Minimal LSP Server Example (<30 lines)
 * Demonstrates a basic hover server
 */

import { LSPServer, StdioTransport } from '@lspy/server';
import type { HoverParams, Hover } from '@lspy/server';

// Create server
const server = new LSPServer({
  name: 'minimal-hover-server',
  version: '1.0.0'
});

// Set capabilities
server.setCapabilities({
  hoverProvider: true
});

// Register hover handler
server.onRequest<'textDocument/hover', HoverParams, Hover | null>(
  'textDocument/hover',
  async (params) => {
    return {
      contents: {
        kind: 'markdown',
        value: `# Hover Information\n\nPosition: Line ${params.position.line}, Character ${params.position.character}`
      }
    };
  }
);

// Start server on stdio
const transport = new StdioTransport();
await server.listen(transport);
