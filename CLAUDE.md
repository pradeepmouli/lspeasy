# lspeasy Development Guidelines

## Project Overview

TypeScript SDK for building Language Server Protocol clients and servers that run anywhere JavaScript runs — Node, browsers, web workers, or VS Code extensions — with a capability-aware, strongly-typed API.

## Tech Stack

- TypeScript 5, Node.js ≥20, Zod (JSON-RPC validation)
- Vitest (test runner), oxlint (linter), oxfmt (formatter)
- pnpm workspaces (monorepo), changesets (releases)

## Project Structure

```text
packages/core/       # JSON-RPC 2.0, transports, base types
packages/server/     # LSP server builder with capability registry
packages/client/     # Typed LSP client API
packages/middleware/ # Logging, tracing, request-rewriting middleware
apps/               # Demo LSP servers/clients
specs/              # Specification documents
e2e/                # End-to-end tests
```

## Commands

```bash
pnpm install        # Install dependencies
pnpm test           # Run tests
pnpm run type-check # TypeScript strict mode
pnpm run build      # Build
pnpm run lint       # oxlint
pnpm run format     # oxfmt
```

## Code Style

- TypeScript strict mode, no `any`
- oxlint for linting, oxfmt for formatting
- Conventional commits

## Key Patterns

- **Capability-aware handler registry** — `server.textDocument.onHover(...)` enforced at compile time and runtime
- **Swappable transports** — `StdioTransport`, `WebSocketTransport`, `DedicatedWorkerTransport`, etc. behind a `Transport` interface
- **Zod-validated JSON-RPC** — all messages validated against Zod schemas derived from LSP spec
- **Middleware pipeline** — logging/tracing/rewriting via composable middleware without monkey-patching

<!-- MANUAL ADDITIONS START -->
<!-- MANUAL ADDITIONS END -->
