/**
 * Example: LSP Client over WebSocket
 *
 * Demonstrates connecting to an LSP server over WebSocket transport.
 * Requires websocket-server.ts to be running.
 *
 * Usage:
 *   # Terminal 1: Start the server
 *   npx tsx examples/server/websocket-server.ts
 *
 *   # Terminal 2: Run this client
 *   npx tsx examples/client/websocket-client.ts
 */

import { LSPClient, WebSocketTransport } from '@lspy/client';

async function main() {
  console.log('Connecting to WebSocket LSP server at ws://localhost:3000...');

  // Create WebSocket transport with reconnection
  const transport = new WebSocketTransport({
    url: 'ws://localhost:3000',
    enableReconnect: true,
    maxReconnectAttempts: 3,
    reconnectDelay: 1000,
    reconnectBackoffMultiplier: 2
  });

  // Create LSP client
  const client = new LSPClient({
    name: 'websocket-example-client',
    version: '1.0.0',
    transport,
    capabilities: {
      textDocument: {
        hover: {
          dynamicRegistration: false,
          contentFormat: ['markdown', 'plaintext']
        },
        completion: {
          dynamicRegistration: false,
          completionItem: {
            snippetSupport: false
          }
        }
      }
    }
  });

  // Subscribe to connection events
  client.onConnected(() => {
    console.log('✓ Connected to WebSocket server');
    console.log(`  Server: ${client.serverInfo?.name} ${client.serverInfo?.version}`);
  });

  client.onDisconnected(() => {
    console.log('✗ Disconnected from server');
  });

  client.onError((error) => {
    console.error('Client error:', error.message);
  });

  try {
    // Connect and initialize
    const initResult = await client.connect();
    console.log('\nServer capabilities:', JSON.stringify(initResult.capabilities, null, 2));

    // Send didOpen notification
    console.log('\nOpening document...');
    await client.textDocument.didOpen({
      textDocument: {
        uri: 'file:///example.txt',
        languageId: 'plaintext',
        version: 1,
        text: 'Hello WebSocket LSP!'
      }
    });

    // Request hover information
    console.log('\nRequesting hover information...');
    const hover = await client.textDocument.hover({
      textDocument: { uri: 'file:///example.txt' },
      position: { line: 0, character: 6 }
    });
    
    if (hover) {
      console.log('Hover response:');
      if (typeof hover.contents === 'string') {
        console.log(`  ${hover.contents}`);
      } else if ('kind' in hover.contents) {
        console.log(`  [${hover.contents.kind}] ${hover.contents.value}`);
      }
    }

    // Request completion
    console.log('\nRequesting completions...');
    const completion = await client.textDocument.completion({
      textDocument: { uri: 'file:///example.txt' },
      position: { line: 0, character: 10 }
    });
    
    if (completion && Array.isArray(completion)) {
      console.log('Completion items:');
      completion.forEach((item) => {
        console.log(`  - ${item.label}: ${item.detail || '(no detail)'}`);
      });
    }

    // Test reconnection by simulating a delay
    console.log('\nWaiting 2 seconds before disconnect...');
    await new Promise((resolve) => setTimeout(resolve, 2000));

    // Graceful shutdown
    console.log('\nDisconnecting...');
    await client.disconnect();
    console.log('✓ Client disconnected successfully');

  } catch (error) {
    console.error('Error:', error);
    process.exit(1);
  }
}

main();
