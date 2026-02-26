# lspeasy

[![CI](https://github.com/pradeepmouli/lspeasy/actions/workflows/ci.yml/badge.svg)](https://github.com/pradeepmouli/lspeasy/actions/workflows/ci.yml)
[![npm](https://img.shields.io/npm/v/@lspeasy/core)](https://www.npmjs.com/package/@lspeasy/core)
[![License: MIT](https://img.shields.io/badge/license-MIT-blue.svg)](LICENSE)

TypeScript SDK for building [Language Server Protocol](https://microsoft.github.io/language-server-protocol/) clients and servers.

## Packages

| Package | Description |
|---------|-------------|
| [`@lspeasy/core`](./packages/core) | JSON-RPC transport, LSP protocol types, middleware |
| [`@lspeasy/server`](./packages/server) | LSP server with lifecycle and handler registration |
| [`@lspeasy/client`](./packages/client) | LSP client with typed `textDocument.*` / `workspace.*` API |

## Installation

```bash
# Server
npm install @lspeasy/server @lspeasy/core

# Client
npm install @lspeasy/client @lspeasy/core

# Both
npm install @lspeasy/core @lspeasy/server @lspeasy/client
```

## Server

```typescript
import { LSPServer } from '@lspeasy/server';
import { StdioTransport } from '@lspeasy/core/node';

const server = new LSPServer({ name: 'my-server', version: '1.0.0' });

server.setCapabilities({ hoverProvider: true });

server.onRequest('textDocument/hover', async (params) => {
  return {
    contents: { kind: 'markdown', value: `Line ${params.position.line}` }
  };
});

await server.listen(new StdioTransport());
```

## Client

```typescript
import { LSPClient } from '@lspeasy/client';
import { StdioTransport } from '@lspeasy/core/node';
import { spawn } from 'node:child_process';

const proc = spawn('my-language-server', ['--stdio']);
const transport = new StdioTransport({ input: proc.stdout, output: proc.stdin });

const client = new LSPClient({ name: 'my-client', version: '1.0.0' });
await client.connect(transport);

const hover = await client.textDocument.hover({
  textDocument: { uri: 'file:///example.ts' },
  position: { line: 0, character: 6 }
});

await client.disconnect();
```

## Transports

`@lspeasy/core` ships several built-in transports:

| Transport | Import | Notes |
|-----------|--------|-------|
| `StdioTransport` | `@lspeasy/core/node` | stdin/stdout, child process |
| `WebSocketTransport` | `@lspeasy/core` | Native `globalThis.WebSocket` (Node ≥22.4, browsers) |
| `TcpTransport` | `@lspeasy/core` | TCP client/server with optional reconnect |
| `IpcTransport` | `@lspeasy/core` | Node.js parent/child IPC |
| `DedicatedWorkerTransport` | `@lspeasy/core` | Browser dedicated worker |
| `SharedWorkerTransport` | `@lspeasy/core` | Browser shared worker |

`ws` is an optional dependency — install it for WebSocket **server** mode or Node <22.4:

```bash
npm install ws
```

## Middleware

`@lspeasy/core/middleware` provides a composable middleware pipeline for logging, tracing, and request mutation:

```typescript
import { composeMiddleware, createScopedMiddleware } from '@lspeasy/core/middleware';
import type { Middleware } from '@lspeasy/core/middleware';

const logging: Middleware = async (ctx, next) => {
  console.log(`${ctx.direction} ${ctx.method}`);
  await next();
};

const textDocOnly = createScopedMiddleware(
  { methods: /^textDocument\//, direction: 'clientToServer' },
  async (ctx, next) => {
    ctx.metadata.startedAt = Date.now();
    await next();
  }
);

const middleware = composeMiddleware(logging, textDocOnly);
```

## Development

```bash
pnpm install      # install dependencies
pnpm build        # build all packages
pnpm test         # run tests
pnpm lint         # lint
pnpm format       # format
```

See [CONTRIBUTING.md](./CONTRIBUTING.md) and [docs/](./docs) for architecture notes, ADRs, and the full API reference.

## License

MIT — [Pradeep Mouli](https://github.com/pradeepmouli)
