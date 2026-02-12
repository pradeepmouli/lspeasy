# Implementation Plan: Middleware System & Client/Server DX Improvements

**Branch**: `002-middleware-dx-improvements` | **Date**: 2026-02-11 | **Spec**: [spec.md](spec.md)
**Input**: Feature specification from `/specs/002-middleware-dx-improvements/spec.md`

**Note**: This template is filled in by the `/speckit.plan` command. See `.specify/templates/commands/plan.md` for the execution workflow.

## Summary

Implement a composable middleware system for JSON-RPC message interception with method-scoped and strongly-typed middleware support, replace `ws` dependency with native WebSocket for clients, add promise-based notification waiting, connection health monitoring, improved server-to-client request handling, and document change helpers. Primary technical approach: middleware as function composition wrapping message handlers with optional method filtering and TypeScript type inference, platform-native WebSocket with `ws` as optional peer dependency for servers, event-based state tracking with timestamps, and stateful document version tracker utility.

## Technical Context

**Language/Version**: TypeScript 5.x (ESM), Node.js >= 22.4 (for native WebSocket)
**Primary Dependencies**: vscode-languageserver-protocol 3.17.x, type-fest, native WebSocket (globalThis.WebSocket), ws (optional peer dependency for server-side WebSocket)
**Storage**: N/A
**Testing**: Vitest (unit, integration, e2e), contract tests for LSP compliance
**Target Platform**: Node.js >= 22.4, modern browsers (native WebSocket support)
**Project Type**: pnpm monorepo with 3 packages (@lspeasy/core, @lspeasy/client, @lspeasy/server)
**Performance Goals**: Zero middleware overhead when none registered, <5ms per middleware execution, support unlimited middleware chaining
**Constraints**: LSP protocol compliance (non-negotiable), type-safe APIs (no `any`), async-first design, independent package testability
**Scale/Scope**: 3 existing packages modified, 1 new package (@lspeasy/middleware-pino), ~15-20 new public APIs, 6 user stories with P1-P6 priority

## Constitution Check

*GATE: Must pass before Phase 0 research. Re-check after Phase 1 design.*

### I. LSP Protocol Compliance
- ✅ **PASS**: Middleware system wraps message handling but preserves JSON-RPC semantics
- ✅ **PASS**: Native WebSocket is transparent transport replacement (LSP message format unchanged)
- ✅ **PASS**: `waitForNotification` and health monitoring are client-side utilities (do not modify protocol)
- ✅ **PASS**: Document change helpers construct valid `DidChangeTextDocumentParams` per LSP spec
- 🔒 **ENFORCED**: FR-008a prohibits middleware from modifying message `id` field (preserves request/response correlation)

### II. Type Safety First
- ✅ **PASS**: All new APIs will have explicit types (Middleware interface, ConnectionState enum, DocumentVersionTracker)
- ✅ **PASS**: MiddlewareContext will be fully typed with method name and message type discrimination
- ✅ **PASS**: Generic type constraints for `waitForNotification<M extends LSPNotificationMethod>`
- ✅ **PASS**: No `any` types planned; using `unknown` for middleware message inspection if needed

### III. Modular Package Architecture
- ✅ **PASS**: `@lspeasy/middleware-pino` is separate optional package (no pino in core)
- ✅ **PASS**: Middleware interface defined in `@lspeasy/core`, implementations external
- ✅ **PASS**: Client and server packages independently import middleware support
- ✅ **PASS**: No circular dependencies introduced (core → types only, client/server → core)

### IV. Test-First Development
- ✅ **PASS**: Spec contains 22 acceptance scenarios across 6 user stories
- ✅ **PASS**: Each user story includes "Independent Test" section with verification criteria
- ✅ **PASS**: Contract tests will verify middleware execution order, zero-overhead baseline, protocol compliance
- ⚠️ **ACTION REQUIRED**: Write failing tests for each acceptance scenario before implementation

### V. Performance and Async-First Design
- ✅ **PASS**: FR-005 mandates zero overhead when no middleware registered
- ✅ **PASS**: All new APIs return Promises (`waitForNotification`, health monitoring)
- ✅ **PASS**: Middleware uses `async/await` with `call_next()` pattern (non-blocking)
- ✅ **PASS**: Native WebSocket is fully event-driven (no sync I/O)
- 📊 **ACTION REQUIRED**: Benchmark message throughput before/after middleware implementation

### Additional Quality Standards
- ✅ **PASS**: TSDoc required for all exported functions (per constitution)
- ✅ **PASS**: Conventional commits + changesets for version management
- ✅ **PASS**: oxlint + oxfmt configured (inherited from monorepo)

### Gate Decision
**🟢 APPROVED TO PROCEED** - No constitution violations. All principles satisfied. Proceed to Phase 0 research.

## Project Structure

### Documentation (this feature)

```text
specs/002-middleware-dx-improvements/
├── spec.md              # Feature specification (input)
├── plan.md              # This file (/speckit.plan command output)
├── research.md          # Phase 0 output (generated below)
├── data-model.md        # Phase 1 output (generated below)
├── quickstart.md        # Phase 1 output (generated below)
└── contracts/           # Phase 1 output (generated below)
    ├── middleware.ts    # Middleware interface contract
    ├── connection-health.ts  # ConnectionState and health types
    └── document-helpers.ts   # DocumentVersionTracker contract
```

### Source Code (monorepo packages)

```text
packages/
├── core/
│   ├── src/
│   │   ├── middleware/           # NEW: Middleware system
│   │   │   ├── types.ts          # Middleware, MiddlewareContext interfaces
│   │   │   ├── pipeline.ts       # Middleware composition and execution
│   │   │   └── index.ts
│   │   ├── transport/
│   │   │   ├── websocket.ts      # MODIFIED: Native WebSocket client support
│   │   │   └── index.ts
│   │   └── utils/
│   │       └── document.ts       # NEW: DocumentVersionTracker utility
│   └── test/
│       └── unit/
│           ├── middleware/       # NEW: Middleware tests
│           └── utils/            # NEW: Document helper tests
│
├── client/
│   ├── src/
│   │   ├── connection/
│   │   │   ├── health.ts         # NEW: ConnectionState, health monitoring
│   │   │   └── index.ts
│   │   ├── notifications/
│   │   │   ├── wait.ts           # NEW: waitForNotification implementation
│   │   │   └── index.ts
│   │   ├── client.ts             # MODIFIED: Middleware registration
│   │   └── index.ts
│   └── test/
│       └── unit/
│           ├── connection/       # NEW: Health monitoring tests
│           └── notifications/    # NEW: waitForNotification tests
│
├── server/
│   ├── src/
│   │   ├── server.ts             # MODIFIED: Middleware registration
│   │   └── index.ts
│   └── test/
│       └── unit/
│           └── middleware/       # NEW: Server middleware tests
│
└── middleware/
    └── pino/                     # NEW PACKAGE
    ├── src/
    │   ├── logger.ts             # Pino-based logging middleware
    │   └── index.ts
    ├── test/
    │   └── unit/
    │       └── logger.test.ts
    ├── package.json              # Peer deps: @lspeasy/core, pino
    └── README.md

e2e/
├── middleware-integration.spec.ts    # NEW: Middleware pipeline e2e tests
├── websocket-native.spec.ts          # NEW: Native WebSocket client tests
├── notification-wait.spec.ts         # NEW: waitForNotification e2e tests
└── connection-health.spec.ts         # NEW: Health monitoring e2e tests
```

**Structure Decision**: Monorepo with pnpm workspaces. Middleware core in `@lspeasy/core` for shared use by client and server. Middleware implementations as separate optional packages (`@lspeasy/middleware-pino`). Client-specific features (notification waiting, health monitoring) in `@lspeasy/client`. Server features (server-to-client request handling improvements) in `@lspeasy/server`. E2E tests at repo root verify cross-package integration.

---

## Phase 0: Research & Decision Log

See [research.md](research.md) for detailed findings.

## Phase 1: Design Artifacts

- [data-model.md](data-model.md) - Entity and type definitions
- [contracts/](contracts/) - API contracts and interfaces
- [quickstart.md](quickstart.md) - Usage examples and patterns
