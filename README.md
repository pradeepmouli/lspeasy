# lspeasy

[![CI](https://github.com/pradeepmouli/lspeasy/actions/workflows/ci.yml/badge.svg)](https://github.com/pradeepmouli/lspeasy/actions/workflows/ci.yml)
[![License](https://img.shields.io/badge/license-MIT-blue.svg)](LICENSE)
[![Node Version](https://img.shields.io/badge/node-%3E%3D20.0.0-brightgreen)](package.json)
[![pnpm](https://img.shields.io/badge/pnpm-10.27.0-yellow)](package.json)

A modern **TypeScript SDK for building Language Server Protocol (LSP) clients and servers** with strong typing, comprehensive tooling, and an ergonomic API inspired by the Model Context Protocol (MCP) SDK.

## Features

- 🔷 **Strongly-typed**: Full TypeScript support with LSP 3.17 types
- 🚀 **Modern API**: Clean, promise-based API with async/await
- 🔌 **Transport-agnostic**: Support for stdio, WebSocket, and custom transports
- 🧩 **Composable middleware**: Global, scoped, and method-typed middleware pipeline
- 🌐 **Native WebSocket client**: Uses `globalThis.WebSocket` on Node.js >= 22.4 and browsers
- ⏱️ **Notification waiting**: Promise-based `waitForNotification` with timeout and filtering
- ❤️ **Connection health**: State transitions, message timestamps, and optional heartbeat
- 📝 **Document sync helpers**: Version-tracked didChange helper utilities
- 📦 **Modular**: Three focused packages (`@lspeasy/core`, `@lspeasy/server`, `@lspeasy/client`)
- ✅ **Well-tested**: Comprehensive unit and integration tests
- 📚 **Documented**: Complete API reference and architecture guide
- 🎯 **Production-ready**: Memory-safe, error-resilient, performance-optimized

## Quick Start

### Installation

```bash
npm install @lspeasy/core @lspeasy/server @lspeasy/client
# or
pnpm add @lspeasy/core @lspeasy/server @lspeasy/client
```

### Building an LSP Server

```typescript
import { LSPServer } from '@lspeasy/server';
import { StdioTransport } from '@lspeasy/core';

// Create server
const server = new LSPServer({
  name: 'my-language-server',
  version: '1.0.0',
  capabilities: {
    textDocumentSync: 1,
    hoverProvider: true,
    completionProvider: {
      triggerCharacters: ['.']
    }
  }
});

// Register hover handler
server.onRequest('textDocument/hover', async (params) => {
  return {
    contents: {
      kind: 'markdown',
      value: `Hover info for ${params.textDocument.uri}`
    }
  };
});

// Register completion handler
server.onRequest('textDocument/completion', async (params) => {
  return {
    isIncomplete: false,
    items: [
      { label: 'example', kind: 1 },
      { label: 'test', kind: 1 }
    ]
  };
});

// Listen on stdio
const transport = new StdioTransport();
await server.listen(transport);
```

### Building an LSP Client

```typescript
import { LSPClient } from '@lspeasy/client';
import { StdioTransport } from '@lspeasy/core';
import { spawn } from 'node:child_process';

// Spawn language server
const serverProcess = spawn('typescript-language-server', ['--stdio']);

// Create transport
const transport = new StdioTransport({
  input: serverProcess.stdout,
  output: serverProcess.stdin
});

// Create and connect client
const client = new LSPClient({
  name: 'my-editor',
  version: '1.0.0'
});

const initResult = await client.connect(transport);
console.log('Connected to:', initResult.serverInfo);

// Open document
await client.textDocument.didOpen({
  textDocument: {
    uri: 'file:///example.ts',
    languageId: 'typescript',
    version: 1,
    text: 'const x = 1;'
  }
});

// Get hover information
const hover = await client.textDocument.hover({
  textDocument: { uri: 'file:///example.ts' },
  position: { line: 0, character: 6 }
});

console.log('Hover:', hover?.contents);

// Disconnect gracefully
await client.disconnect();
```

## Packages

### @lspeasy/core

Core functionality and transport layer:

- JSON-RPC 2.0 message handling
- `Transport` interface and `StdioTransport` implementation
- LSP 3.17 protocol types
- Utilities (cancellation tokens, logging, disposables)
- Middleware pipeline and composition helpers (`@lspeasy/core/middleware`)
- Document change helper utilities (`@lspeasy/core/utils`)

```typescript
import { StdioTransport, CancellationTokenSource } from '@lspeasy/core';
```

### @lspeasy/server

LSP server implementation:

- `LSPServer` class with handler registration
- Initialize/shutdown lifecycle management
- Server capability declaration
- Type-safe request/notification handlers

```typescript
import { LSPServer } from '@lspeasy/server';
```

### @lspeasy/client

LSP client implementation:

- `LSPClient` class with connection management
- High-level `textDocument.*` and `workspace.*` APIs
- Cancellable requests
- Server-to-client request handling
- `waitForNotification()` API for one-shot notification listeners
- Connection health monitoring APIs

### @lspeasy/middleware-pino

Optional package providing pino-compatible middleware logging.

```typescript
import { createPinoMiddleware } from '@lspeasy/middleware-pino';
```

```typescript
import { LSPClient } from '@lspeasy/client';
```

## Examples

See the [examples](./examples) directory for complete working examples:

- **Server Examples**:
  - [basic-server.ts](./examples/server/basic-server.ts) - Simple LSP server with hover
  - [test-server.ts](./examples/server/test-server.ts) - Reusable test server harness

- **Client Examples**:
  - [basic-client.ts](./examples/client/basic-client.ts) - Connect to typescript-language-server
  - [test-client.ts](./examples/client/test-client.ts) - Reusable test client harness

## Documentation

- [Capability-Aware Features](./docs/CAPABILITY-AWARE.md) - Runtime capability validation and dynamic methods
- [Architecture Guide](./docs/ARCHITECTURE.md) - System design and implementation details
- [API Reference](./docs/API.md) - Complete API documentation
- [Package READMEs](./packages) - Package-specific guides
- [Core README](./packages/core/README.md) - Middleware, transport, and document helper APIs
- [Client README](./packages/client/README.md) - Notification waiting and connection health APIs
- [Middleware Pino README](./packages/middleware/pino/README.md) - Structured logging middleware

## Development

### Setup

```bash
# Install dependencies
pnpm install

# Build all packages
pnpm run build

# Run tests
pnpm test

# Run linter
pnpm run lint

# Format code
pnpm run format
```

### Project Structure

```
lspeasy/
├── packages/
│   ├── core/           # Transport and protocol foundation
│   ├── server/         # LSP server implementation
│   └── client/         # LSP client implementation
├── examples/           # Usage examples
├── docs/              # Documentation
└── specs/             # Feature specifications
```

### Testing

```bash
# Run all tests
pnpm test

# Run specific package tests
pnpm test packages/core
pnpm test packages/server
pnpm test packages/client

# Run with coverage
pnpm test --coverage
```

## Key Concepts

### Capability-Aware Design

Both client and server support **capability-aware** operations:

#### Server-Side Capability Validation

Servers validate handler registration against declared capabilities:

```typescript
const server = new LSPServer({
  strictCapabilities: true  // Enforce capability checking
});

server.setCapabilities({
  hoverProvider: true,
  // definitionProvider not declared
});

// ✅ Works - hover capability declared
server.onRequest('textDocument/hover', async (params) => {
  return { contents: 'Hover text' };
});

// ❌ Throws error in strict mode - capability not declared
server.onRequest('textDocument/definition', async (params) => {
  return { uri: params.textDocument.uri, range: ... };
});
```

#### Client-Side Dynamic Methods

Clients dynamically expose methods based on server capabilities:

```typescript
await client.connect(transport);

// Methods only exist if server declares capability
if ('hover' in client.textDocument) {
  const result = await client.textDocument.hover({
    textDocument: { uri: 'file:///example.ts' },
    position: { line: 10, character: 5 }
  });
}

// Check available methods
const methods = Object.keys(client.textDocument)
  .filter(k => typeof client.textDocument[k] === 'function');
console.log('Available methods:', methods);
```

### Transport Layer

Transports handle message transmission:

```typescript
interface Transport {
  send(message: Message): Promise<void>;
  onMessage(handler: (message: Message) => void): Disposable;
  onError(handler: (error: Error) => void): Disposable;
  onClose(handler: () => void): Disposable;
  close(): Promise<void>;
  isConnected(): boolean;
}
```

### Handler Registration

Type-safe handlers with auto-completion:

```typescript
// Server side
server.onRequest('textDocument/definition', async (params) => {
  // params is typed as DefinitionParams
  return { uri: '...', range: { ... } };
});

// Client side
const result = await client.textDocument.definition({
  textDocument: { uri: '...' },
  position: { line: 0, character: 5 }
});
```

### Cancellation

Cancel in-flight requests:

```typescript
const tokenSource = new CancellationTokenSource();

const promise = client.sendRequest(
  'textDocument/completion',
  params,
  tokenSource.token
);

// Cancel if needed
tokenSource.cancel();
```

### Resource Management

Dispose handlers when done:

```typescript
const disposable = server.onRequest('method', handler);

// Later: cleanup
disposable.dispose();
```

## Performance

- **Message parsing**: <1ms p95
- **Handler dispatch**: <0.1ms p95
- **Memory efficient**: Automatic resource cleanup
- **No memory leaks**: Disposable pattern throughout

## Roadmap

- [x] Core JSON-RPC and transport layer
- [x] LSP server implementation
- [x] LSP client implementation
- [x] Unit tests and documentation
- [x] WebSocket transport
- [ ] Progress reporting
- [ ] Partial results
- [ ] Multi-root workspace support

## Contributing

1. Follow the coding standards in [AGENTS.md](AGENTS.md)
2. Write tests for new features
3. Use conventional commits
4. Ensure all tests pass before submitting PR

## License

MIT

---

**Author**: Pradeep Mouli
**Repository**: [github.com/pradeepmouli/lspeasy](https://github.com/pradeepmouli/lspeasy)
