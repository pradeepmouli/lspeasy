# Implementation Plan: Strongly-Typed LSP SDK with MCP-Like Ergonomics

**Branch**: `001-typed-lsp-sdk` | **Date**: 2026-01-29 | **Spec**: [spec.md](spec.md)
**Input**: Feature specification from `/specs/001-typed-lsp-sdk/spec.md`

**Note**: This template is filled in by the `/speckit.plan` command. See `.specify/templates/commands/plan.md` for the execution workflow.

## Summary

Build a strongly-typed TypeScript SDK for LSP (Language Server Protocol) clients and servers with ergonomics inspired by the Model Context Protocol (MCP) TypeScript SDK. The SDK will provide three packages (@lspy/core, @lspy/server, @lspy/client) enabling developers to build language servers in under 30 lines of code with automatic JSON-RPC handling, runtime validation via Zod, and support for stdio/WebSocket transports. Technical approach: monorepo architecture with pnpm workspaces, strict TypeScript typing, and comprehensive logging following MCP SDK patterns.

## Technical Context

**Language/Version**: TypeScript 5.x with Node.js >= 20.0.0 (matches existing project configuration)
**Primary Dependencies**:
- Zod v3.25+ (peer dependency, import from zod/v4 internally for MCP SDK compatibility)
- vscode-languageserver-protocol v3.17.x (devDependency, type definitions only - authoritative LSP types from Microsoft)

**Storage**: N/A (SDK library, no persistent storage)
**Testing**: Vitest (existing project standard), integration tests against real language servers, benchmark suite for performance
**Target Platform**: Node.js 20+ runtime; browser support deferred to v1.1+ (design portable APIs)
**Project Type**: Monorepo library (pnpm workspaces already configured)
**Architecture**: Custom JSON-RPC 2.0 implementation following MCP SDK patterns (no vscode-jsonrpc runtime dependency)
**Performance Goals**:
- Message parse <1ms p95 (JSON + Zod validation)
- Handler dispatch <0.1ms p95
- Initialize handshake <50ms p95
- Cancellation propagation <100ms max (SC-009)
- Memory per connection <50MB baseline

**Constraints**:
- Must maintain 100% LSP 3.17 spec compliance
- Zero `any` types in public APIs
- Minimum 80% test coverage for core packages
- Bundle size: @lspy/core <100KB, @lspy/server <50KB, @lspy/client <50KB (all gzipped)
- CI-enforced via size-limit package

**Scale/Scope**:
- Support all LSP 3.17 core capabilities (10+ request types minimum)
- Target: 95%+ API similarity to MCP SDK patterns
- Production-ready for 3+ real-world language servers (typescript-language-server, rust-analyzer, pyright)

**Research Complete**: All clarifications resolved in [research.md](research.md)

## Constitution Check

*GATE: Must pass before Phase 0 research. Re-check after Phase 1 design.*

Verify compliance with lspy constitution (`.specify/memory/constitution.md`):

- [x] **LSP Protocol Compliance**: ✅ Feature explicitly requires 100% LSP 3.17 spec adherence (FR-013, FR-015)
- [x] **Type Safety**: ✅ Zero `any` types mandated in requirements (FR-004, FR-005), strict TypeScript configuration required
- [x] **Modularity**: ✅ Three-package structure (@lspy/core, @lspy/server, @lspy/client) matches modular architecture principle; clarified in spec session 2026-01-29
- [x] **Test-First**: ✅ Integration tests defined in user stories; SC-004 requires 100% malformed request detection; minimum 80% coverage
- [x] **Async-First**: ✅ All I/O operations async (FR-010 cancellation tokens); performance requirement <100ms cancellation response (SC-009)
- [x] **Performance**: ✅ Benchmarks identified: 1000+ concurrent requests (SC-005), cancellation <100ms (SC-009)

**Violations Requiring Justification**: N/A - All constitution principles satisfied by requirements

## Project Structure

### Documentation (this feature)

```text
specs/[###-feature]/
├── plan.md              # This file (/speckit.plan command output)
├── research.md          # Phase 0 output (/speckit.plan command)
├── data-model.md        # Phase 1 output (/speckit.plan command)
├── quickstart.md        # Phase 1 output (/speckit.plan command)
├── contracts/           # Phase 1 output (/speckit.plan command)
└── tasks.md             # Phase 2 output (/speckit.tasks command - NOT created by /speckit.plan)
```

### Source Code (repository root)

```text
packages/
├── core/                 # @lspy/core
│   ├── src/
│   │   ├── protocol/    # LSP 3.17 type definitions
│   │   ├── jsonrpc/     # JSON-RPC 2.0 primitives
│   │   ├── transport/   # Transport interface + stdio/WebSocket implementations
│   │   ├── logging/     # MCP-style logging infrastructure
│   │   └── index.ts
│   ├── tests/
│   │   ├── unit/
│   │   └── integration/
│   ├── package.json
│   └── tsconfig.json
│
├── server/               # @lspy/server
│   ├── src/
│   │   ├── server.ts    # LSPServer class
│   │   ├── handlers/    # Request/notification handler infrastructure
│   │   ├── capabilities.ts  # ServerCapabilities types
│   │   └── index.ts
│   ├── tests/
│   │   ├── unit/
│   │   └── integration/
│   ├── package.json
│   └── tsconfig.json
│
├── client/               # @lspy/client
│   ├── src/
│   │   ├── client.ts    # LSPClient class
│   │   ├── requests/    # Typed request method builders
│   │   ├── capabilities.ts  # ClientCapabilities types
│   │   └── index.ts
│   ├── tests/
│   │   ├── unit/
│   │   └── integration/ # Tests against real language servers
│   ├── package.json
│   └── tsconfig.json
│
examples/
├── server/
│   ├── minimal-server.ts     # <30 lines server example
│   ├── hover-server.ts       # P1 user story example
│   └── advanced-server.ts    # P4 features example
├── client/
│   ├── basic-client.ts
│   └── test-client.ts        # Testing harness
│
e2e/
├── lsp-compliance.spec.ts    # LSP 3.17 conformance tests
└── real-servers.spec.ts      # Tests with typescript-language-server, rust-analyzer, pyright

docs/
├── ARCHITECTURE.md           # Package design decisions
└── API.md                    # Public API reference
```

**Structure Decision**: Monorepo with three independent packages following MCP SDK architecture. Each package is independently buildable/testable. `@lspy/server` and `@lspy/client` depend on `@lspy/core` via `workspace:*` protocol. Examples demonstrate usage patterns. E2E tests validate LSP compliance and real-world compatibility.

## Complexity Tracking

> **Fill ONLY if Constitution Check has violations that must be justified**

N/A - No constitution violations. All principles satisfied by feature requirements.

---

## Phase 1: Design Complete ✅

**Date**: 2026-01-29

### Deliverables

All Phase 1 artifacts completed:

1. **[data-model.md](data-model.md)** - Entity definitions for 10 core types + 50+ LSP protocol types
   - Core entities: Transport, Message types, LSPServer/LSPClient classes
   - Protocol types: Request/Response/Notification types for LSP 3.17
   - State machine diagrams for initialization and cancellation flows
   - Validation strategies: Zod schemas with runtime checking

2. **[contracts/server-api.md](contracts/server-api.md)** - @lspy/server public API contract
   - LSPServer class with handler registration (supports both chaining and non-chaining)
   - ServerCapabilities declaration interface
   - Error handling contracts and validation strategies
   - Performance guarantees (<0.1ms handler dispatch)

3. **[contracts/client-api.md](contracts/client-api.md)** - @lspy/client public API contract
   - LSPClient class with high-level request methods
   - Capability-organized request APIs (textDocument.*, workspace.*, etc.)
   - Server-to-client request handling (window/showMessage, etc.)
   - Compatibility guarantees (LSP 3.17 compliance)

4. **[contracts/core-api.md](contracts/core-api.md)** - @lspy/core public API contract
   - Transport interface with StdioTransport and WebSocketTransport implementations
   - Protocol type exports (50+ LSP types from vscode-languageserver-protocol)
   - JSON-RPC 2.0 primitives (Message, Request, Response, Notification)
   - Utility types (Logger, CancellationToken, Disposable)
   - **Hierarchical namespace structure with comprehensive metadata**:
     - LSPRequest.* and LSPNotification.* namespaces mirroring LSP spec
     - Each method namespace includes: Method (type & const), Params, Result, ClientCapability, ServerCapability, Options, RegistrationOptions
     - Type inference utilities (InferRequestParams, InferRequestResult, InferNotificationParams)
     - Enables automatic type inference for handler registration
   - Custom transport creation examples

5. **[quickstart.md](quickstart.md)** - Getting started guide
   - <30 line server example demonstrating minimal setup (SC-001)
   - Client connection and request examples
   - Common patterns (cancellation, error handling, WebSocket transport)
   - Testing strategies (unit tests with Vitest, integration tests)
   - Troubleshooting guide

### Constitution Re-Check Post-Design

All principles remain satisfied:
- ✅ LSP Protocol Compliance: All contract APIs maintain 100% LSP 3.17 adherence
- ✅ Type Safety: Zero `any` types in documented APIs; strict typing enforced
- ✅ Modularity: Three-package separation maintained; clear boundaries in contracts
- ✅ Test-First: Testing strategies documented in quickstart.md
- ✅ Async-First: All documented APIs use async/await patterns
- ✅ Performance: Performance contracts specified in each API document

### Agent Context Update

✅ GitHub Copilot context updated with LSP SDK technology stack:
- Language: TypeScript 5.x with Node.js >= 20.0.0
- Database: N/A (SDK library)
- Context file: `.github/agents/copilot-instructions.md`

### Next Steps

**Phase 2**: Generate `tasks.md` using `/speckit.tasks` command to break down implementation into actionable work items organized by user story priority (P1→P2→P3→P4).
