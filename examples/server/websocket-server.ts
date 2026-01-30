/**
 * Example: LSP Server over WebSocket
 *
 * Demonstrates running an LSP server over WebSocket transport.
 * Clients can connect via ws://localhost:3000
 *
 * Usage:
 *   npx tsx examples/server/websocket-server.ts
 */

import { WebSocketServer } from 'ws';
import { LSPServer } from '@lspy/server';
import { WebSocketTransport } from '@lspy/core';
import type { CompletionItem, Hover } from 'vscode-languageserver-protocol';

const PORT = 3000;

// Create WebSocket server
const wss = new WebSocketServer({ port: PORT });

console.log(`WebSocket LSP server listening on ws://localhost:${PORT}`);

wss.on('connection', (socket, request) => {
  console.log(`New connection from ${request.socket.remoteAddress}`);

  // Create WebSocket transport for this connection
  const transport = new WebSocketTransport({ socket });

  // Create LSP server instance
  const server = new LSPServer({
    name: 'websocket-example-server',
    version: '1.0.0',
    transport,
    capabilities: {
      completionProvider: {
        triggerCharacters: ['.', ':']
      },
      hoverProvider: true,
      textDocumentSync: 1 // Full sync
    }
  });

  // Register hover handler
  server.onRequest('textDocument/hover', (params) => {
    console.log('Hover request:', params.position);
    
    const hover: Hover = {
      contents: {
        kind: 'markdown',
        value: '**Hello from WebSocket LSP!**\n\nThis hover is served over WebSocket.'
      },
      range: {
        start: params.position,
        end: { line: params.position.line, character: params.position.character + 1 }
      }
    };
    
    return hover;
  });

  // Register completion handler
  server.onRequest('textDocument/completion', (params) => {
    console.log('Completion request:', params.position);
    
    const items: CompletionItem[] = [
      {
        label: 'websocket',
        kind: 14, // Keyword
        detail: 'WebSocket protocol',
        documentation: 'Real-time bidirectional communication'
      },
      {
        label: 'transport',
        kind: 9, // Module
        detail: 'Transport layer',
        documentation: 'Abstraction for communication channels'
      }
    ];
    
    return items;
  });

  // Handle document open notifications
  server.onNotification('textDocument/didOpen', (params) => {
    console.log('Document opened:', params.textDocument.uri);
  });

  // Start the server
  server.start().catch((error) => {
    console.error('Server start error:', error);
  });

  // Handle socket close
  socket.on('close', () => {
    console.log('Client disconnected');
    server.shutdown().catch((error) => {
      console.error('Server shutdown error:', error);
    });
  });
});

// Handle server errors
wss.on('error', (error) => {
  console.error('WebSocket server error:', error);
});

// Graceful shutdown
process.on('SIGINT', () => {
  console.log('\nShutting down WebSocket server...');
  wss.close(() => {
    console.log('Server closed');
    process.exit(0);
  });
});
