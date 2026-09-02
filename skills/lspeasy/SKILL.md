---
name: lspeasy
description: "Use when working with lspeasy (client, core, server)."
---
# lspeasy

**Use this skill for ANY work with lspeasy.** It routes to the correct package.

## When to Use

Use this router when:
- LSP client package for connecting to language servers.
- Core types, transports, and utilities shared by all lspeasy packages.
- LSP server package for hosting Language Server Protocol (LSP) servers.

## Decision Tree

1. LSP client package for connecting to language servers.? → `lspeasy-client`
2. Core types, transports, and utilities shared by all lspeasy packages.? → `lspeasy-core`
3. LSP server package for hosting Language Server Protocol (LSP) servers.? → `lspeasy-server`

## Routing Logic

### client → `lspeasy-client`

Use `@lspeasy/client` when you need to build the **consumer** side of the
Language Server Protocol — an editor extension, a CLI analysis tool, a test
harness, or any process that speaks to a language server process.

- You are implementing a custom client layer and need the same validation behaviour that `LSPClient` uses. Otherwise this is an internal detail.
- You need to monitor connection liveness — for example, to show a status indicator, trigger reconnection logic, or surface transport errors to users.
- You need to detect silent transport failures — for example, when the server process dies without closing the socket, leaving the client hanging indefinitely on pending requests.

Key APIs: `CapabilityGuard`, `ClientCapabilityGuard`, `ConnectionHealthTracker`

### core → `lspeasy-core`

`@lspeasy/core` is the shared foundation for the lspeasy SDK. It contains
everything needed to build custom LSP integrations, and re-exports the
most-used pieces from `@lspeasy/client` and `@lspeasy/server`.

- You register multiple handlers (hover, completion, definition) that share the same lifetime — collect them all into one store and dispose the store on shutdown or feature toggle.
- A request handler needs to reject with a machine-readable error code that the client can act on (e.g. respond with `MethodNotFound` when a capability was not declared, or `InvalidParams` when schema validation fails).
- You are building an LSP client that sends `textDocument/didChange` notifications and need to track per-document version counters.

Key APIs: `DisposableStore`, `DisposableEventEmitter`, `CancellationTokenSource`, `getCapabilityForRequestMethod`, `getClientCapabilityForRequestMethod`

### server → `lspeasy-server`

Use `@lspeasy/server` when you need to build the **provider** side of the
Language Server Protocol — a daemon that editors and language-client tooling
connect to in order to get diagnostics, completions, hover, go-to-definition,
and other language intelligence features.

- The client sets `partialResultToken` in the request params and you want to stream intermediate results (e.g. symbols found so far) rather than waiting for the complete set.
- A request handler needs to reject with a machine-readable error code that the client can act on (e.g. respond with `MethodNotFound` when a capability was not declared, or `InvalidParams` when schema validation fails).

Key APIs: `MessageDispatcher`, `PartialResultSender`, `ResponseError`

## Critical Patterns

Top pitfall per package:
- NEVER construct `CapabilityGuard` before the `initialize` handshake completes. Server capabilities are only known after the `InitializeResult` is received; instantiating the guard too early will treat all methods as unsupported. (client)
- Returns `null` silently when no `lsp.json` is found anywhere in   the search path (including the global `~/.claude/lsp.json` fallback).   Callers that skip the null check will silently fail to resolve a server   command — for the CLI this means `lsproxy` exits before the proxy daemon   is ever spawned.  Create an `lsp.json` at the workspace root or at   `~/.claude/lsp.json` for a per-user fallback. (core)
- NEVER register the same method in both the request and notification handler registries — the dispatcher uses separate lookup tables and the method will only match one path, silently ignoring the other. (server)

## Anti-Rationalization

| Thought | Reality |
|---------|---------|
| "I'll just use client for everything" | client is for lsp client package for connecting to language servers.. The transport already provides its own keep-alive mechanism (e.g. WebSocket ping frames) — adding a heartbeat on top creates redundant round-trips and may interfere with the transport's own timeout logic. |
| "I'll just use core for everything" | core is for core types, transports, and utilities shared by all lspeasy packages.. You want to log a server-side error without sending an error to the client — throw a plain `Error` and handle it via `server.onError()` instead. |
| "I'll just use server for everything" | server is for lsp server package for hosting language server protocol (lsp) servers.. You want to log a server-side error without sending an error to the client — throw a plain `Error` and handle it via `server.onError()` instead. |

## Example Invocations

User: "I need to lsp client package for connecting to language servers."  
→ Load `lspeasy-client`

User: "I need to core types, transports, and utilities shared by all lspeasy packages."  
→ Load `lspeasy-core`

User: "I need to lsp server package for hosting language server protocol (lsp) servers."  
→ Load `lspeasy-server`

## NEVER

- NEVER load all package skills simultaneously — pick the one matching your task
- If your task spans multiple packages, load the foundational one first (typically core/shared), then the specific one
