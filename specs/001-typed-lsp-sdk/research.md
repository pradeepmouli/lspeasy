# Research: Strongly-Typed LSP SDK Technical Decisions

**Date**: 2026-01-29
**Phase**: Phase 0 - Research
**Purpose**: Resolve all NEEDS CLARIFICATION items from Technical Context

## Research Tasks

### 1. JSON-RPC 2.0 Implementation Strategy

**Question**: Should we use vscode-jsonrpc or implement custom JSON-RPC following MCP SDK patterns?

**Research Findings**:
- **vscode-jsonrpc v8.x**: Microsoft's JSON-RPC 2.0 implementation (used by vscode-languageserver)
  - Provides: MessageReader, MessageWriter, connection management, cancellation tokens
  - Pros: Battle-tested, maintained by VS Code team, handles edge cases
  - Cons: Runtime dependency, couples to VS Code ecosystem, harder to adapt for browser
- **MCP SDK approach**: Custom JSON-RPC 2.0 implementation
  - Implements JSON-RPC spec directly with framing, error handling, cancellation
  - Pros: Full control, no external runtime dependencies, browser-friendly, familiar to MCP SDK users
  - Cons: Must implement JSON-RPC primitives ourselves
- **JSON-RPC 2.0 spec**: Simple spec, well-defined message format, straightforward to implement

**Decision**:
- **Implement custom JSON-RPC 2.0 following MCP SDK architecture**
- **Rationale**:
  - Aligns with project goal of "MCP SDK-like ergonomics"
  - Eliminates all runtime dependencies on vscode-* packages
  - Gives full control over transport layer for future browser support
  - JSON-RPC 2.0 spec is simple enough to implement reliably
  - MCP SDK provides proven reference implementation
- **Scope**: Implement Message types, framing, cancellation, error codes in `@lspeasy/core`

**Alternatives Considered**:
- vscode-jsonrpc v8.x → Rejected: Runtime dependency, couples to VS Code ecosystem, less MCP SDK alignment
- json-rpc2 npm package → Rejected: Unmaintained, lacks modern features

---

### 2. LSP Type Definitions Source

**Question**: Should we use vscode-languageserver-protocol types as-is or generate our own from LSP spec?

**Research Findings**:
- **vscode-languageserver-protocol** provides complete TypeScript definitions for LSP 3.17
- Updated regularly with spec changes, includes all request/notification types
- Can be used as **type-only dependency** (devDependency, no runtime code imported)
- **Pros**: Accurate, maintained, includes JSDoc comments, handles spec evolution
- **Cons**: External dependency, potential version mismatch with spec

**Generating from spec**:
- LSP spec published as markdown/JSON
- Would require code generator (TypeScript AST manipulation)
- **Pros**: Full control, exact spec alignment
- **Cons**: Maintenance burden, need to update generator for each spec version

**Decision**:
- **Use vscode-languageserver-protocol v3.17.x as type-only dependency** (devDependency in `@lspeasy/core`)
- **Re-export types** through our hierarchical namespace structure (LSPRequest.*, LSPNotification.*)
- **No runtime imports** from vscode-languageserver-protocol - types only at compile time
- **Rationale**:
  - Microsoft's types are authoritative and well-tested
  - Type-only dependency has zero runtime cost
  - Our value-add is ergonomics (namespace structure, type inference) and runtime validation (Zod schemas)
  - Re-exporting through namespaces allows augmentation without breaking consumers
- **Implementation**: Use TypeScript `import type { ... }` to ensure no runtime code bundled

**Alternatives Considered**:
- Generate types from spec → Rejected: High maintenance, duplicates existing quality work
- Copy types directly → Rejected: Loses updates, legal/licensing concerns
- Use vscode-languageserver-protocol as runtime dependency → Rejected: Unnecessary runtime bloat

---

### 3. Browser Support Priority

**Question**: Should initial release target browser environments (via bundling/polyfills)?

**Research Findings**:
- LSP servers typically run in Node.js (spawned as child processes)
- Browser use cases: Web-based IDEs (VS Code for Web, CodeSandbox), language playgrounds
- Challenges: No native stdio, need WebSocket/HTTP transport only, different module system

**Decision**:
- **Phase 1 (MVP): Node.js only** - stdio and WebSocket transports
- **Phase 2 (Future): Browser support** via separate entry points
- **Rationale**:
  - P1/P2 user stories focus on Node.js language servers
  - Browser support adds complexity (polyfills, transport restrictions)
  - Can be added incrementally without breaking changes
- **Design for browser**: Use portable APIs where possible, keep platform-specific code isolated

**Target Timeline**:
- v1.0: Node.js 20+
- v1.1+: Browser support with WebSocket-only transport

**Alternatives Considered**:
- Full browser support v1.0 → Rejected: Delays MVP, limited immediate use cases
- Never support browser → Rejected: Web-based IDEs are growing market

---

### 4. Performance Benchmarks Specification

**Question**: What specific benchmarks should we target for message parsing/dispatch?

**Research Findings**:
- Typical LSP message size: 500B - 10KB (most requests)
- Large responses: 100KB - 1MB (workspace symbols, large completions)
- LSP message frequency: 10-100 msg/sec during active coding

**Benchmark Targets**:

| Operation | Target | Rationale |
|-----------|--------|-----------|
| Message parse (JSON.parse + Zod validation) | <1ms (p95) | Avoid editor lag on every keystroke |
| Handler dispatch (routing to registered handler) | <0.1ms (p95) | Negligible overhead vs business logic |
| Initialize handshake (full round-trip) | <50ms (p95) | One-time cost, under human perception threshold |
| Cancellation propagation | <100ms (max) | Per SC-009 requirement |
| Memory per connection | <50MB baseline | Server should not bloat editor process |

**Decision**:
- **Implement these benchmarks** in `packages/core/benchmarks/` using Vitest benchmark mode
- **CI Integration**: Run benchmarks on every PR, flag regressions >10%
- **Rationale**: These targets ensure the SDK doesn't become a bottleneck in editor responsiveness

**Measurement Approach**:
- Use `vitest.benchmark.config.ts` (already configured in project)
- Test with realistic LSP message corpus (from typescript-language-server traces)
- Profile with Node.js --prof for hotspot identification

---

### 5. Bundle Size Constraints

**Question**: What acceptable bundle size per package (minified+gzipped)?

**Research Findings**:
- MCP TypeScript SDK sizes:
  - @modelcontextprotocol/sdk-core: ~15KB gzipped
  - @modelcontextprotocol/sdk-server: ~25KB gzipped
- LSP SDK likely larger due to:
  - More protocol types (LSP 3.17 is comprehensive)
  - vscode-languageserver-protocol dependency
  - Zod schemas for validation

**Decision**:

| Package | Target (gzipped) | Hard Limit (gzipped) |
|---------|------------------|----------------------|
| @lspeasy/core | <100KB | <150KB |
| @lspeasy/server | <50KB | <75KB |
| @lspeasy/client | <50KB | <75KB |

**Rationale**:
- Core contains most types/validation → larger acceptable
- Server/client are thin wrappers → should stay small
- Total bundle (all 3) under 200KB acceptable for SDK

**Monitoring**:
- Use `size-limit` package in CI
- Fail PR if hard limits exceeded
- Warn if target exceeded but under hard limit

**Alternatives Considered**:
- <50KB per package → Rejected: Unrealistic given vscode-* dependencies
- No limit → Rejected: Could bloat over time without awareness

---

## Summary of Decisions

| Topic | Decision | Impact |
|-------|----------|--------|
| JSON-RPC Implementation | Custom JSON-RPC 2.0 (MCP SDK pattern) | Zero runtime deps, full control, matches MCP ergonomics |
| LSP Type Definitions | Use vscode-languageserver-protocol v3.17.x (type-only) | DevDependency only, authoritative types, zero runtime cost |
| Browser Support | Node.js only for v1.0, browser in v1.1+ | Focus MVP, design portable |
| Performance Benchmarks | <1ms parse, <0.1ms dispatch, <100ms cancellation | CI-monitored, realistic targets |
| Bundle Size Limits | Core <100KB, Server/Client <50KB (gzipped) | size-limit enforcement in CI |

**All NEEDS CLARIFICATION items resolved.** Technical context is now complete and ready for Phase 1 design.

**Next Steps**:
1. Update plan.md Technical Context with resolved decisions
2. Proceed to Phase 1: Data Model and Contracts
