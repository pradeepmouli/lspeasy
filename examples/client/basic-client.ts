/**
 * Basic LSP Client Example
 *
 * This example demonstrates connecting to a language server (like typescript-language-server)
 * and sending basic requests.
 *
 * Usage:
 *   # Start typescript-language-server in stdio mode
 *   npx typescript-language-server --stdio
 *
 *   # Then run this client
 *   node examples/client/basic-client.js
 */

import { LSPClient } from '@lspy/client';
import { StdioTransport } from '@lspy/core';
import { spawn } from 'node:child_process';

async function main() {
  console.log('Starting LSP client example...\n');

  // Spawn a language server process (typescript-language-server)
  const serverProcess = spawn('npx', ['typescript-language-server', '--stdio'], {
    stdio: ['pipe', 'pipe', 'inherit']
  });

  // Create transport using the server's stdin/stdout
  const transport = new StdioTransport({
    input: serverProcess.stdout,
    output: serverProcess.stdin
  });

  // Create LSP client
  const client = new LSPClient({
    name: 'example-client',
    version: '1.0.0',
    capabilities: {
      textDocument: {
        hover: {
          contentFormat: ['markdown', 'plaintext']
        },
        completion: {
          completionItem: {
            snippetSupport: false
          }
        }
      }
    }
  });

  try {
    // Connect to server
    console.log('Connecting to server...');
    const initializeResult = await client.connect(transport);

    console.log('Connected successfully!');
    console.log('Server info:', initializeResult.serverInfo);
    console.log('Server capabilities:', JSON.stringify(initializeResult.capabilities, null, 2));
    console.log();

    // Open a document
    console.log('Opening document...');
    await client.textDocument.didOpen({
      textDocument: {
        uri: 'file:///tmp/example.ts',
        languageId: 'typescript',
        version: 1,
        text: 'const greeting: string = "Hello, LSP!";\nconsole.log(greeting);'
      }
    });
    console.log('Document opened.\n');

    // Request hover information
    console.log('Requesting hover information...');
    const hover = await client.textDocument.hover({
      textDocument: { uri: 'file:///tmp/example.ts' },
      position: { line: 0, character: 6 } // Position at "greeting"
    });

    if (hover) {
      console.log('Hover result:', JSON.stringify(hover, null, 2));
    } else {
      console.log('No hover information available.');
    }
    console.log();

    // Request completion
    console.log('Requesting completion...');
    const completion = await client.textDocument.completion({
      textDocument: { uri: 'file:///tmp/example.ts' },
      position: { line: 1, character: 8 } // Position after "console."
    });

    if (completion) {
      const items = 'items' in completion ? completion.items : completion;
      console.log(`Found ${items.length} completion items.`);
      if (items.length > 0) {
        console.log(
          'First 5 items:',
          items.slice(0, 5).map((item: any) => item.label)
        );
      }
    } else {
      console.log('No completion items available.');
    }
    console.log();

    // Close document
    console.log('Closing document...');
    await client.textDocument.didClose({
      textDocument: { uri: 'file:///tmp/example.ts' }
    });
    console.log('Document closed.\n');

    // Disconnect from server
    console.log('Disconnecting...');
    await client.disconnect();
    console.log('Disconnected successfully!');
  } catch (error) {
    console.error('Error:', error);
    process.exit(1);
  } finally {
    // Kill server process
    serverProcess.kill();
  }
}

main().catch(console.error);
