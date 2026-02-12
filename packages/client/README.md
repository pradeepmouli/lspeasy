# @lspeasy/client

Connect to Language Server Protocol servers with a simple, type-safe client API.

## Overview

`@lspeasy/client` provides a high-level LSP client with:

- **LSPClient**: Complete LSP client implementation with lifecycle management
- **High-Level API**: Strongly-typed `textDocument.*` and `workspace.*` methods
- **Request/Notification**: Low-level access to send any LSP request or notification
- **Cancellation**: Built-in cancellation support for long-running requests
- **Event Subscriptions**: Subscribe to server notifications and events
- **Server Requests**: Handle requests from server to client
- **Notification Waiting**: Promise-based one-shot waiting with timeout and filters
- **Connection Health**: State transition and message activity monitoring
- **Type Safety**: Full TypeScript types from LSP protocol definitions

## Installation

```bash
npm install @lspeasy/client @lspeasy/core vscode-languageserver-protocol
# or
pnpm add @lspeasy/client @lspeasy/core vscode-languageserver-protocol
# or
yarn add @lspeasy/client @lspeasy/core vscode-languageserver-protocol
```

## Quick Start

### Basic Client

```typescript
import { LSPClient } from '@lspeasy/client';
import { StdioTransport } from '@lspeasy/core';
import { spawn } from 'child_process';

// Spawn language server
const serverProcess = spawn('typescript-language-server', ['--stdio']);

// Create transport
const transport = new StdioTransport({
  input: serverProcess.stdout,
  output: serverProcess.stdin
});

// Create client
const client = new LSPClient({
  name: 'My Client',
  version: '1.0.0',
  transport
});

// Connect to server (sends initialize + initialized)
await client.connect(transport);

// Use high-level API
const hover = await client.textDocument.hover({
  textDocument: { uri: 'file:///path/to/file.ts' },
  position: { line: 10, character: 5 }
});

console.log('Hover:', hover?.contents);

// Disconnect
await client.disconnect();
```

### With Capabilities

Declare client capabilities:

```typescript
const client = new LSPClient({
  name: 'Advanced Client',
  version: '1.0.0',
  transport,
  capabilities: {
    textDocument: {
      hover: {
        contentFormat: ['markdown', 'plaintext']
      },
      completion: {
        completionItem: {
          snippetSupport: true,
          commitCharactersSupport: true
        }
      }
    },
    workspace: {
      applyEdit: true,
      workspaceEdit: {
        documentChanges: true
      }
    }
  }
});
```

## High-Level API

### Text Document Methods

```typescript
// Hover
const hover = await client.textDocument.hover({
  textDocument: { uri: 'file:///test.ts' },
  position: { line: 0, character: 0 }
});

// Completion
const completion = await client.textDocument.completion({
  textDocument: { uri: 'file:///test.ts' },
  position: { line: 5, character: 10 }
});

// Go to Definition
const definition = await client.textDocument.definition({
  textDocument: { uri: 'file:///test.ts' },
  position: { line: 10, character: 15 }
});

// Find References
const references = await client.textDocument.references({
  textDocument: { uri: 'file:///test.ts' },
  position: { line: 20, character: 5 },
  context: { includeDeclaration: false }
});

// Document Symbols
const symbols = await client.textDocument.documentSymbol({
  textDocument: { uri: 'file:///test.ts' }
});
```

### Document Synchronization

```typescript
// Open document
await client.textDocument.didOpen({
  textDocument: {
    uri: 'file:///test.ts',
    languageId: 'typescript',
    version: 1,
    text: 'console.log("Hello");'
  }
});

// Change document
await client.textDocument.didChange({
  textDocument: {
    uri: 'file:///test.ts',
    version: 2
  },
  contentChanges: [
    {
      text: 'console.log("Hello, World!");'
    }
  ]
});

// Save document
await client.textDocument.didSave({
  textDocument: { uri: 'file:///test.ts' },
  text: 'console.log("Hello, World!");'
});

// Close document
await client.textDocument.didClose({
  textDocument: { uri: 'file:///test.ts' }
});
```

### Workspace Methods

```typescript
// Workspace symbols
const symbols = await client.workspace.symbol({
  query: 'MyClass'
});

// Configuration (if server requests it)
// Server will call this via client.onRequest('workspace/configuration')

// Workspace folders
await client.workspace.didChangeWorkspaceFolders({
  event: {
    added: [{ uri: 'file:///new/folder', name: 'New Folder' }],
    removed: []
  }
});

// File watching
await client.workspace.didChangeWatchedFiles({
  changes: [
    {
      uri: 'file:///test.ts',
      type: 2 // Changed
    }
  ]
});
```

## Low-Level API

### Send Requests

```typescript
// Send any request
const result = await client.sendRequest<ParamsType, ResultType>(
  'custom/method',
  { /* params */ }
);
```

### Send Notifications

```typescript
// Send any notification
await client.sendNotification<ParamsType>(
  'custom/notification',
  { /* params */ }
);
```

### Cancellable Requests

```typescript
import { CancellationTokenSource } from '@lspeasy/core';

const source = new CancellationTokenSource();

// Send cancellable request
const { promise, cancel } = client.sendRequestCancellable(
  'textDocument/hover',
  params,
  source.token
);

// Cancel after 5 seconds
setTimeout(() => {
  source.cancel();
  // or use the returned cancel function
  // cancel();
}, 5000);

try {
  const result = await promise;
} catch (error) {
  if (error.message.includes('cancelled')) {
    console.log('Request was cancelled');
  }
}
```

## Event Subscriptions

### Connection Events

```typescript
// Connected to server
client.onConnected(() => {
  console.log('Connected to language server');
});

// Disconnected from server
client.onDisconnected(() => {
  console.log('Disconnected from language server');
});

// Connection errors
client.onError((error) => {
  console.error('Client error:', error);
});
```

## waitForNotification

Use `waitForNotification` when you need the next matching server notification as a Promise.

```typescript
const diagnostics = await client.waitForNotification('textDocument/publishDiagnostics', {
  timeout: 5000,
  filter: (params) => params.uri === 'file:///example.ts'
});

console.log(diagnostics.diagnostics);
```

Notes:
- `timeout` is required.
- Waiters are cleaned up automatically on resolve, timeout, or disconnect.
- Multiple concurrent waiters for the same method are supported.

## Connection Health Monitoring

```typescript
const client = new LSPClient({
  name: 'health-aware-client',
  version: '1.0.0',
  heartbeat: {
    enabled: true,
    interval: 30000,
    timeout: 10000
  }
});

const stateSubscription = client.onConnectionStateChange((event) => {
  console.log('state', event.previous, '->', event.current, event.reason);
});

const healthSubscription = client.onConnectionHealthChange((health) => {
  console.log('last sent', health.lastMessageSent);
  console.log('last received', health.lastMessageReceived);
});

const health = client.getConnectionHealth();
console.log(health.state);

stateSubscription.dispose();
healthSubscription.dispose();
```

### Server Notifications

```typescript
// Diagnostics from server
client.onNotification('textDocument/publishDiagnostics', (params) => {
  console.log(`Diagnostics for ${params.uri}:`, params.diagnostics);
});

// Show message from server
client.onNotification('window/showMessage', (params) => {
  console.log(`Server message (${params.type}): ${params.message}`);
});

// Log message from server
client.onNotification('window/logMessage', (params) => {
  console.log(`Server log (${params.type}): ${params.message}`);
});
```

### Server Requests

Handle requests from server to client:

```typescript
// Configuration request
client.onRequest('workspace/configuration', async (params) => {
  return [
    { enable: true },
    { maxProblems: 100 }
  ];
});

// Apply workspace edit
client.onRequest('workspace/applyEdit', async (params) => {
  // Apply the edit
  applyWorkspaceEdit(params.edit);
  return { applied: true };
});

// Show message request (with actions)
client.onRequest('window/showMessageRequest', async (params) => {
  // Show dialog to user
  const choice = await showDialog(params.message, params.actions);
  return choice;
});
```

When handling server-to-client requests:
- The handler parameter and return value are inferred from the method.
- If no handler exists, client replies with JSON-RPC `-32601` (method not found).
- If handler throws, client replies with JSON-RPC `-32603` (internal error).

## WebSocket Client

```typescript
import { LSPClient } from '@lspeasy/client';
import { WebSocketTransport } from '@lspeasy/core';

// Connect over WebSocket with automatic reconnection
const transport = new WebSocketTransport({
  url: 'ws://localhost:3000',
  enableReconnect: true,
  maxReconnectAttempts: 5,
  reconnectDelay: 1000,
  maxReconnectDelay: 30000,
  reconnectBackoffMultiplier: 2
});

const client = new LSPClient({
  name: 'WebSocket Client',
  version: '1.0.0',
  transport
});

// Handle reconnection
transport.onClose(() => {
  console.log('Connection lost, attempting to reconnect...');
});

// Connect
await client.connect();
```

## Document Tracking

Implement a simple document tracker:

```typescript
class DocumentTracker {
  private documents = new Map<string, { version: number; content: string }>();

  async open(client: LSPClient, uri: string, languageId: string, content: string): Promise<void> {
    this.documents.set(uri, { version: 1, content });

    await client.textDocument.didOpen({
      textDocument: {
        uri,
        languageId,
        version: 1,
        text: content
      }
    });
  }

  async change(client: LSPClient, uri: string, newContent: string): Promise<void> {
    const doc = this.documents.get(uri);
    if (!doc) return;

    const newVersion = doc.version + 1;
    this.documents.set(uri, { version: newVersion, content: newContent });

    await client.textDocument.didChange({
      textDocument: { uri, version: newVersion },
      contentChanges: [{ text: newContent }]
    });
  }

  async close(client: LSPClient, uri: string): Promise<void> {
    this.documents.delete(uri);

    await client.textDocument.didClose({
      textDocument: { uri }
    });
  }

  get(uri: string): string | undefined {
    return this.documents.get(uri)?.content;
  }
}

// Usage
const tracker = new DocumentTracker();
await tracker.open(client, 'file:///test.ts', 'typescript', 'console.log();');
await tracker.change(client, 'file:///test.ts', 'console.log("Hello");');
await tracker.close(client, 'file:///test.ts');
```

## Diagnostic Handling

```typescript
const diagnostics = new Map<string, Diagnostic[]>();

client.onNotification('textDocument/publishDiagnostics', (params) => {
  diagnostics.set(params.uri, params.diagnostics);

  // Display diagnostics
  for (const diagnostic of params.diagnostics) {
    console.log(`${params.uri}:${diagnostic.range.start.line + 1}: ${diagnostic.message}`);
  }
});

// Get diagnostics for a file
function getDiagnostics(uri: string): Diagnostic[] {
  return diagnostics.get(uri) || [];
}
```

## Testing

```typescript
import { LSPClient } from '@lspeasy/client';
import { MockTransport } from '@lspeasy/core/test/utils';

describe('LSP Client', () => {
  it('should send hover request', async () => {
    const transport = new MockTransport();
    const client = new LSPClient({
      name: 'Test Client',
      version: '1.0.0',
      transport
    });

    await client.connect();

    // Send hover request
    const hoverPromise = client.textDocument.hover({
      textDocument: { uri: 'file:///test.ts' },
      position: { line: 0, character: 0 }
    });

    // Simulate server response
    const request = transport.sentMessages.find(m => m.method === 'textDocument/hover');
    transport.simulateMessage({
      jsonrpc: '2.0',
      id: request.id,
      result: {
        contents: 'Test hover'
      }
    });

    const hover = await hoverPromise;
    expect(hover?.contents).toBe('Test hover');
  });
});
```

## Best Practices

### Always Call connect()

Ensure the client is initialized before sending requests:

```typescript
await client.connect();
// Now safe to send requests
```

### Handle Disconnections

Subscribe to disconnection events and handle gracefully:

```typescript
client.onDisconnected(() => {
  console.log('Server disconnected');
  // Attempt to reconnect or notify user
});
```

### Use High-Level API

Prefer high-level methods over low-level sendRequest:

```typescript
// Good
const hover = await client.textDocument.hover(params);

// Less type-safe
const hover = await client.sendRequest('textDocument/hover', params);
```

### Clean Up Resources

Always disconnect when done:

```typescript
try {
  await client.connect();
  // Use client
} finally {
  await client.disconnect();
}
```

### Handle Cancellation

Use cancellation tokens for long-running operations:

```typescript
const source = new CancellationTokenSource();
const { promise } = client.sendRequestCancellable(method, params, source.token);

// Cancel if needed
setTimeout(() => source.cancel(), 5000);
```

## API Reference

See [API.md](../../docs/API.md) for complete API documentation.

## Architecture

See [ARCHITECTURE.md](../../docs/ARCHITECTURE.md) for system architecture details.

## License

MIT
