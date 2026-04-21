---
name: lspeasy
description: "Router for lspeasy monorepo (client, core, server). Use when working with lspeasy. Also: lsp, language-server-protocol, lsp-client, language-client, jsonrpc, transport, lsp-server, language-server."
license: MIT
---
# lspeasy

## Which package?

### client

Connect to LSP servers with typed client API

**Use when:**
  - You are implementing a custom client layer and need the same validation behaviour that `LSPClient` uses. Otherwise this is an internal detail.
  - You need to monitor connection liveness — for example, to show a status indicator, trigger reconnection logic, or surface transport errors to users.

→ Load the `lspeasy-client` skill.

### core

Core types, transports, and utilities for LSP SDK

**Use when:**
  - You are building a browser-based LSP client, a WebSocket-backed language server, or any LSP integration that must run over HTTP/HTTPS infrastructure.
  - You register multiple handlers (hover, completion, definition) that share the same lifetime — collect them all into one store and dispose the store on shutdown or feature toggle.

→ Load the `lspeasy-core` skill.

### server

Build LSP language servers with a simple, fully-typed API

**Use when:**
  - The client sets `partialResultToken` in the request params and you want to stream intermediate results (e.g. symbols found so far) rather than waiting for the complete set.
  - A request handler needs to reject with a machine-readable error code that the client can act on (e.g. respond with `MethodNotFound` when a capability was not declared, or `InvalidParams` when schema validation fails).

→ Load the `lspeasy-server` skill.

## NEVER

- NEVER load all package skills simultaneously — pick the one matching your task
- If your task spans multiple packages, load the foundational one first (typically core/shared), then the specific one
