<!--
SYNC IMPACT REPORT
==================
Version: 0.0.0 → 1.0.0
Rationale: Initial constitution ratification for lspy project

Modified Principles: N/A (initial creation)
Added Sections:
- Core Principles (5 principles established)
- Quality Standards
- Monorepo Management
- Governance

Templates Status:
✅ plan-template.md - aligned with LSP SDK principles
✅ spec-template.md - aligned with user story prioritization
✅ tasks-template.md - aligned with test-first and modularity principles

Follow-up TODOs: None
-->

# lspy Constitution

TypeScript SDK for building Language Server Protocol (LSP) clients and servers

## Core Principles

### I. LSP Protocol Compliance (NON-NEGOTIABLE)

All client and server implementations MUST strictly adhere to the Language Server Protocol specification. LSP message types, request/response patterns, and notification flows are sacred contracts that ensure interoperability with any LSP-compliant editor or language tool.

**Rules:**
- All message handlers MUST validate against LSP JSON-RPC schemas
- Protocol version compatibility MUST be explicitly declared and tested
- Breaking changes to protocol interfaces require MAJOR version bump
- Type definitions MUST match the official LSP specification exactly

**Rationale:** LSP is a standardized protocol used by IDEs and editors worldwide. Non-compliance breaks the fundamental value proposition of the SDK and renders it unusable with standard tooling. Type safety ensures compile-time verification of protocol adherence.

### II. Type Safety First

TypeScript's type system is our primary defense against runtime errors. All public APIs, internal modules, and protocol messages MUST be fully typed with no escape hatches except where absolutely necessary for interop.

**Rules:**
- ZERO usage of `any` type in public APIs (use `unknown` if needed)
- All function parameters and return types MUST have explicit type annotations
- Generic types MUST be properly constrained
- Type assertions (`as`) require justification in code comments
- Strict mode enabled (`strict: true` in tsconfig.json)
- Enable `noUncheckedIndexedAccess`, `exactOptionalPropertyTypes`

**Rationale:** LSP implementations are complex protocol-driven systems. TypeScript's type system catches entire classes of bugs at compile time, ensures IDE autocomplete works perfectly, and serves as living documentation. Type safety is especially critical for protocol message handling where malformed messages can crash language servers.

### III. Modular Package Architecture

The SDK MUST be composed of focused, independently usable packages within the pnpm monorepo. Each package represents a coherent domain (protocol types, client, server, transports) and can be consumed separately.

**Rules:**
- Packages MUST have clear, single responsibilities (e.g., `@lspy/protocol`, `@lspy/client`, `@lspy/server`)
- Package dependencies MUST form a Directed Acyclic Graph (no circular dependencies)
- Each package MUST be independently buildable and testable
- Shared code goes into explicit utility packages, not copied
- Use `workspace:*` protocol for internal dependencies

**Rationale:** Developers may only need client OR server functionality. Forcing them to bundle the entire SDK increases bundle size unnecessarily. Modular packages enable tree-shaking, independent versioning, and allow the ecosystem to extend the SDK with custom transports or middleware without forking.

### IV. Test-First Development

Tests are written BEFORE implementation code and serve as executable specifications. This is mandatory for all protocol handlers, public APIs, and integration scenarios.

**Rules:**
- Contract tests written first → user approval → tests fail → implement
- Protocol conformance MUST be verified by integration tests against real LSP clients/servers
- Unit tests for all exported functions/classes
- Integration tests for end-to-end flows (initialize → request → response → shutdown)
- Minimum 80% code coverage for core packages
- Tests run on pre-commit (simple-git-hooks + lint-staged)

**Rationale:** LSP is a complex stateful protocol with subtle edge cases (initialization handshake, concurrent requests, cancellation, partial results). Test-first development ensures we build exactly what's specified, catches protocol violations early, and provides regression safety as the SDK evolves.

### V. Performance and Async-First Design

LSP clients and servers handle high-frequency events (keystrokes, file changes) and must be non-blocking. All I/O operations MUST be asynchronous, and the SDK MUST support efficient batching and cancellation.

**Rules:**
- All public APIs MUST return Promises or async iterables for streaming
- Support LSP cancellation tokens (`$/cancelRequest`)
- Avoid synchronous file I/O or blocking operations in hot paths
- Provide benchmarks for critical paths (message parsing, dispatch)
- Document performance characteristics of key operations

**Rationale:** Language servers run in editor processes and compete for resources. Blocking the main thread causes editor UI freezes. Async-first design ensures smooth editor experience even with large codebases. Cancellation support prevents resource leaks when users rapidly type or switch files.

## Quality Standards

### Code Style and Tooling

- **Linter**: oxlint (configured in `oxlintrc.json`)
- **Formatter**: oxfmt (configured in `.oxfmtrc.json`)
- **Indentation**: 2 spaces (no tabs)
- **Quotes**: Single quotes
- **Semicolons**: Required
- **Line length**: Soft limit 100 characters
- **Imports**: Organized: external → internal → types

### Documentation Requirements

- All exported functions/classes MUST have TSDoc comments
- README for each package with usage examples
- Protocol flow diagrams for complex interactions
- Migration guides for breaking changes
- Architecture Decision Records (ADR) for major design choices (see `docs/adr/`)

### Commit Standards

- Follow conventional commits (`feat:`, `fix:`, `docs:`, etc.)
- Use changesets for version management (`pnpm run changeset`)
- Breaking changes MUST be documented in changeset and CHANGELOG

## Monorepo Management

### Workspace Structure

```
packages/
  protocol/     # LSP protocol type definitions
  client/       # LSP client implementation
  server/       # LSP server implementation
  transport/    # Transport layers (stdio, websocket, etc.)
  utils/        # Shared utilities
```

### Dependency Management

- Use pnpm workspaces (see ADR-001)
- Lock file (`pnpm-lock.yaml`) MUST be committed
- Run `pnpm audit` before releases
- Dependencies updated via Renovate bot (configured in `renovate.json`)

### Build and Release

- All packages MUST build successfully (`pnpm run build`)
- Type-check MUST pass (`pnpm run type-check`)
- Tests MUST pass (`pnpm test`)
- Use changesets for coordinated releases (`pnpm run changeset:publish`)

## Governance

This constitution is the authoritative source for all development practices in the lspy project. It supersedes any conflicting guidance in other documentation.

**Amendment Process:**
1. Propose change with rationale (GitHub issue or discussion)
2. Document impact on existing code and architecture
3. Require approval from maintainers
4. Increment constitution version (semantic versioning applies)
5. Update affected templates, ADRs, and documentation
6. Provide migration timeline for breaking changes (minimum 1 minor version deprecation period)

**Constitution Versioning:**
- **MAJOR**: Removal or redefinition of core principles (e.g., dropping type safety requirement)
- **MINOR**: New principle added or existing principle materially expanded
- **PATCH**: Clarifications, typo fixes, wording improvements

**Compliance:**
- All pull requests MUST verify compliance with constitution principles
- CI pipeline enforces type-checking, linting, testing gates
- Breaking principle violations require explicit justification and approval
- For additional development guidance, see [AGENTS.md](../../AGENTS.md)

**Version**: 1.0.0 | **Ratified**: 2026-01-29 | **Last Amended**: 2026-01-29
