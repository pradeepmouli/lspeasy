# lspeasy

> A TypeScript SDK for building [Language Server Protocol](https://microsoft.github.io/language-server-protocol/) clients and servers that run anywhere JavaScript runs — Node, browsers, web workers, or VS Code extensions — with a capability-aware, strongly-typed API.

> **⚠️ Pre-1.0 software** — APIs are subject to change between minor versions. Pin to exact versions in production. See the [CHANGELOG](./CHANGELOG.md) for breaking changes between releases.

<p align="center">
  <a href="https://www.npmjs.com/package/@lspeasy/core"><img src="https://img.shields.io/npm/v/@lspeasy/core?style=flat-square&label=%40lspeasy%2Fcore" alt="npm version" /></a>
  <a href="https://github.com/pradeepmouli/lspeasy/actions/workflows/ci.yml"><img src="https://img.shields.io/github/actions/workflow/status/pradeepmouli/lspeasy/ci.yml?style=flat-square" alt="ci" /></a>
  <img src="https://img.shields.io/badge/license-MIT-blue?style=flat-square" alt="license" />
  <img src="https://img.shields.io/badge/node-%3E%3D20-brightgreen?style=flat-square" alt="node" />
</p>

📚 **Documentation:** <https://pradeepmouli.github.io/lspeasy/>

## Overview

The [Language Server Protocol](https://microsoft.github.io/language-server-protocol/) standardizes how editors and IDEs talk to language tooling — hover, completion, diagnostics, symbol navigation, and dozens of other features all flow over a single JSON-RPC connection. Implementing a server or client against LSP directly is deceptively involved: you need JSON-RPC framing, message validation, cancellation tokens, progress reporting, capability negotiation, the full lifecycle handshake, and correct handling of roughly a hundred request and notification types.

`lspeasy` is a set of small, focused TypeScript packages that wrap all of that in a modern, ESM-first API. Handlers are registered against a typed, capability-aware namespace — `server.textDocument.onHover(...)` — so the editor-facing surface mirrors the spec and advertised capabilities are enforced at both compile time and runtime. Transports are swappable: run the same server over stdio for a classic editor plugin, over a web worker for a browser playground, over WebSockets for a remote tooling backend, or over TCP for diagnostics.

Compared to `vscode-languageserver` (which is tightly coupled to Node and the VS Code extension model), `lspeasy` is runtime-agnostic, tree-shakeable, browser-friendly, and exposes a middleware pipeline for logging, tracing, and request rewriting without monkey-patching the dispatcher.

## Features

- **Capability-aware handler registration** — `server.textDocument.onHover(...)` is only callable after `registerCapabilities({ hoverProvider: true })`; mismatches are caught at both compile time and at the dispatcher.
- **Full JSON-RPC 2.0 core** — schemas, framing, request/notification/response types, and typed error codes, all validated with Zod.
- **Swappable transports** — `StdioTransport`, `TcpTransport`, `IpcTransport`, `WebSocketTransport`, `DedicatedWorkerTransport`, `SharedWorkerTransport`; write your own against the `Transport` interface.
- **Runs anywhere** — Node.js-specific transports live under `@lspeasy/core/node`; the root export is browser-safe so the same code ships to a VS Code extension and a web playground.
- **Typed client API** — `client.textDocument.hover(...)`, `client.workspace.symbol(...)`, and the full request surface with request/response types pulled from the LSP spec.
- **Composable middleware** — `composeMiddleware(...)` plus `createScopedMiddleware({ methods, direction })` for logging, tracing, metrics, or request mutation without touching the core dispatcher.
- **Lifecycle + progress + cancellation** — initialize/initialized/shutdown/exit are handled for you, with built-in partial-result and work-done progress senders and `CancellationToken` support.
- **Zod-validated messages** — every inbound message is parsed against a schema, so malformed peers surface as typed errors instead of runtime crashes.
- **Tree-shakeable, ESM-only** — pay for what you import; no CommonJS compatibility shims dragging extra code into browser bundles.

## Install

```bash
# Build a server
pnpm add @lspeasy/server @lspeasy/core

# Build a client
pnpm add @lspeasy/client @lspeasy/core
```

Requires **Node.js ≥ 20**. For WebSocket **server** mode or Node < 22.4, also install `ws` (optional peer): `pnpm add ws`.

## Quick Start

A minimal LSP server over stdio that responds to `textDocument/hover`:

```typescript
import { LSPServer } from '@lspeasy/server';
import { StdioTransport } from '@lspeasy/core/node';

const server = new LSPServer({ name: 'hello-lsp', version: '0.1.0' });

server.registerCapabilities({ hoverProvider: true });

server.textDocument.onHover(async (params) => ({
  contents: {
    kind: 'markdown',
    value: `**Hovered** line ${params.position.line}, character ${params.position.character}`
  }
}));

await server.listen(new StdioTransport());
```

Wire it into VS Code, Neovim, Helix, or any LSP-aware editor by spawning the script with `--stdio`.

## Usage

### Writing a client

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

### Transports

`@lspeasy/core` ships several built-in transports. Import Node-only transports from the `/node` subpath so browser bundles stay clean.

| Transport | Import | Notes |
|-----------|--------|-------|
| `StdioTransport` | `@lspeasy/core/node` | stdin/stdout, child processes |
| `TcpTransport` | `@lspeasy/core/node` | TCP client/server with optional reconnect |
| `IpcTransport` | `@lspeasy/core/node` | Node parent/child IPC |
| `WebSocketTransport` | `@lspeasy/core` | Native `globalThis.WebSocket` (Node ≥22.4 or browsers) |
| `DedicatedWorkerTransport` | `@lspeasy/core` | Browser dedicated worker |
| `SharedWorkerTransport` | `@lspeasy/core` | Browser shared worker |

### Middleware

`@lspeasy/core/middleware` provides a composable pipeline for logging, tracing, or mutating requests on the fly:

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

## How it works

At the lowest layer, `@lspeasy/core` models JSON-RPC 2.0 messages (request / notification / response / error) as Zod-validated types and handles LSP's Content-Length framing. A `Transport` is just a bidirectional message pipe — everything from stdio to a `SharedWorker` implements the same interface, so the server and client layers are entirely transport-agnostic.

`@lspeasy/server` layers on lifecycle management (initialize / initialized / shutdown / exit), a capability proxy that gates handler registration on advertised capabilities, a message dispatcher that routes to typed handlers, and helpers for work-done progress and partial results. `@lspeasy/client` is the symmetric counterpart: a typed request surface that mirrors the spec and handles correlation, cancellation, and response validation.

## Packages

| Package | Description |
|---|---|
| [`@lspeasy/core`](packages/core) | JSON-RPC 2.0, framing, transports, LSP protocol types, middleware pipeline |
| [`@lspeasy/server`](packages/server) | Server class with lifecycle, capability-aware handler registration, progress/cancellation |
| [`@lspeasy/client`](packages/client) | Client with typed `textDocument.*` / `workspace.*` request API |
| [`@lspeasy/middleware`](packages/middleware) | Shared middleware building blocks |

## Related Projects

| Library | Relationship | npm |
|---|---|---|
| [rune-langium](https://github.com/pradeepmouli/rune-langium) | DSL toolchain powered by lspeasy's LSP server | [![npm](https://img.shields.io/npm/v/@rune-langium/core?style=flat-square)](https://www.npmjs.com/package/@rune-langium/core) |

## Contributing

```bash
pnpm install
pnpm build
pnpm test
pnpm lint
```

See [CONTRIBUTING.md](./CONTRIBUTING.md) for details.

## License

MIT — see [LICENSE](./LICENSE).
