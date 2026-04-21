---
name: lspeasy
description: "Use when working with lspeasy (client, core, server). Covers: lsp, language-server-protocol, lsp-client, language-client, jsonrpc, transport, lsp-server, language-server."
license: MIT
---
# lspeasy

**Use this skill for ANY work with lspeasy.** It routes to the correct package.

## When to Use

- You are implementing a custom client layer and need the same validation behaviour that `LSPClient` uses. Otherwise this is an internal detail. → `lspeasy-client`
- You need to monitor connection liveness — for example, to show a status indicator, trigger reconnection logic, or surface transport errors to users. → `lspeasy-client`
- You are building a browser-based LSP client, a WebSocket-backed language server, or any LSP integration that must run over HTTP/HTTPS infrastructure. → `lspeasy-core`
- You register multiple handlers (hover, completion, definition) that share the same lifetime — collect them all into one store and dispose the store on shutdown or feature toggle. → `lspeasy-core`
- The client sets `partialResultToken` in the request params and you want to stream intermediate results (e.g. symbols found so far) rather than waiting for the complete set. → `lspeasy-server`
- A request handler needs to reject with a machine-readable error code that the client can act on (e.g. respond with `MethodNotFound` when a capability was not declared, or `InvalidParams` when schema validation fails). → `lspeasy-server`

## Decision Tree

1. Connect to LSP servers with typed client API? → `lspeasy-client`
2. Core types, transports, and utilities for LSP SDK? → `lspeasy-core`
3. Build LSP language servers with a simple, fully-typed API? → `lspeasy-server`

## Routing Logic

### client

Connect to LSP servers with typed client API → Load `lspeasy-client`

- You are implementing a custom client layer and need the same validation behaviour that `LSPClient` uses. Otherwise this is an internal detail.
- You need to monitor connection liveness — for example, to show a status indicator, trigger reconnection logic, or surface transport errors to users.
- You need to detect silent transport failures — for example, when the server process dies without closing the socket, leaving the client hanging indefinitely on pending requests.

### core

Core types, transports, and utilities for LSP SDK → Load `lspeasy-core`

- You are building a browser-based LSP client, a WebSocket-backed language server, or any LSP integration that must run over HTTP/HTTPS infrastructure.
- You register multiple handlers (hover, completion, definition) that share the same lifetime — collect them all into one store and dispose the store on shutdown or feature toggle.
- A request handler needs to reject with a machine-readable error code that the client can act on (e.g. respond with `MethodNotFound` when a capability was not declared, or `InvalidParams` when schema validation fails).

### server

Build LSP language servers with a simple, fully-typed API → Load `lspeasy-server`

- The client sets `partialResultToken` in the request params and you want to stream intermediate results (e.g. symbols found so far) rather than waiting for the complete set.
- A request handler needs to reject with a machine-readable error code that the client can act on (e.g. respond with `MethodNotFound` when a capability was not declared, or `InvalidParams` when schema validation fails).

## Anti-Rationalization

| Thought | Reality |
|---------|---------|
| "I'll just use client for everything" | client is for connect to lsp servers with typed client api. The transport already provides its own keep-alive mechanism (e.g. WebSocket ping frames) — adding a heartbeat on top creates redundant round-trips and may interfere with the transport's own timeout logic. |
| "I'll just use core for everything" | core is for core types, transports, and utilities for lsp sdk. You are building a CLI language server — `StdioTransport` (from `@lspeasy/core/node`) is the conventional choice and avoids the overhead of a network stack. For same-process workers prefer `DedicatedWorkerTransport` or `SharedWorkerTransport`. |
| "I'll just use server for everything" | server is for build lsp language servers with a simple, fully-typed api. You want to log a server-side error without sending an error to the client — throw a plain `Error` and handle it via `server.onError()` instead. |

## Example Invocations

User: "You are implementing a custom client layer and need the..."  
→ Load `lspeasy-client`

User: "You are building a browser-based LSP client, a..."  
→ Load `lspeasy-core`

User: "The client sets `partialResultToken` in the request..."  
→ Load `lspeasy-server`

## NEVER

- NEVER load all package skills simultaneously — pick the one matching your task
- If your task spans multiple packages, load the foundational one first (typically core/shared), then the specific one
