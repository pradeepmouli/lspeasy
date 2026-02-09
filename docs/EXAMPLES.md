# Examples

This document provides examples demonstrating how to use the lspeasy LSP SDK.

## Table of Contents

- [Basic Server](#basic-server)
- [Basic Client](#basic-client)
- [Capability-Aware Server](#capability-aware-server)
- [Capability-Aware Client](#capability-aware-client)
- [Custom Transport](#custom-transport)

## Basic Server

```typescript
import { LSPServer, StdioTransport } from '@lspeasy/server';

const server = new LSPServer({
  name: 'my-language-server',
  version: '1.0.0'
});

// Set server capabilities
server.setCapabilities({
  textDocumentSync: { openClose: true, change: 1 },
  hoverProvider: true,
  completionProvider: { triggerCharacters: ['.'] }
});

// Register request handler
server.onRequest('textDocument/hover', async (params) => {
  return {
    contents: { kind: 'markdown', value: 'Hover text' }
  };
});

// Start listening
const transport = new StdioTransport();
await server.listen(transport);
```

## Basic Client

```typescript
import { LSPClient } from '@lspeasy/client';
import { WebSocketTransport } from '@lspeasy/core';

const client = new LSPClient({
  name: 'my-client',
  version: '1.0.0'
});

const transport = new WebSocketTransport({ url: 'ws://localhost:8080' });
await client.connect(transport);

// Send requests
const hoverResult = await client.sendRequest('textDocument/hover', {
  textDocument: { uri: 'file:///example.ts' },
  position: { line: 10, character: 5 }
});

await client.disconnect();
```

## Capability-Aware Server

The server validates that handlers are only registered for capabilities that have been declared. In strict mode, attempting to register a handler for an undeclared capability will throw an error.

```typescript
import { LSPServer, StdioTransport } from '@lspeasy/server';
import type { ServerCapabilities } from '@lspeasy/core';

// Define server capabilities
const capabilities: ServerCapabilities = {
  textDocumentSync: { openClose: true, change: 1 },
  hoverProvider: true,
  completionProvider: { triggerCharacters: ['.'] },
  // Note: definitionProvider is NOT declared
};

// Create server with strict capability checking
const server = new LSPServer({
  name: 'capability-aware-server',
  version: '1.0.0',
  strictCapabilities: true  // Throws error if handler doesn't match capability
});

server.setCapabilities(capabilities);

// ✅ This works - hover capability is declared
server.onRequest('textDocument/hover', async (params) => {
  return { contents: 'Hover text' };
});

// ❌ This throws error in strict mode - definitionProvider not declared
// server.onRequest('textDocument/definition', async (params) => {
//   return { uri: params.textDocument.uri, range: ... };
// });

const transport = new StdioTransport();
await server.listen(transport);
```

## Capability-Aware Client

After connecting, the client dynamically exposes methods based on the server's declared capabilities. Methods for unsupported capabilities are not available.

```typescript
import { LSPClient } from '@lspeasy/client';
import { WebSocketTransport } from '@lspeasy/core';

const client = new LSPClient({
  name: 'capability-aware-client',
  version: '1.0.0'
});

const transport = new WebSocketTransport({ url: 'ws://localhost:8080' });
await client.connect(transport);

// After initialization, methods are dynamically available
console.log('Server capabilities:', client.serverCapabilities);

// ✅ Check if method is available before calling
if ('hover' in client.textDocument) {
  const hover = await client.textDocument.hover({
    textDocument: { uri: 'file:///example.ts' },
    position: { line: 10, character: 5 }
  });
  console.log('Hover:', hover);
} else {
  console.log('Server does not support hover');
}

// List available methods
const methods = Object.keys(client.textDocument).filter(
  key => typeof client.textDocument[key] === 'function'
);
console.log('Available methods:', methods);

await client.disconnect();
```

## Custom Transport

You can implement custom transports by implementing the `Transport` interface:

```typescript
import type { Transport } from '@lspeasy/core';
import { EventEmitter } from 'node:events';

class CustomTransport extends EventEmitter implements Transport {
  async connect(): Promise<void> {
    // Implement connection logic
    this.emit('connect');
  }

  async disconnect(): Promise<void> {
    // Implement disconnection logic
    this.emit('disconnect');
  }

  async send(message: string): Promise<void> {
    // Implement message sending logic
  }

  isConnected(): boolean {
    // Return connection state
    return true;
  }
}

// Use the custom transport
const transport = new CustomTransport();
await server.listen(transport);
```
