# Implementation Plan: Eliminate Duplicate Event/Handler Management Code

**Branch**: `refactor/002-implement-capability-negotiation` | **Date**: 2026-02-09 | **Spec**: [specs/refactor/002-implement-capability-negotiation/spec.md](specs/refactor/002-implement-capability-negotiation/spec.md)
**Input**: Feature specification from `/specs/refactor/002-implement-capability-negotiation/spec.md`

**Note**: This template is filled in by the `/speckit.plan` command. See `.specify/templates/commands/plan.md` for the execution workflow.

## Summary

Extract shared utilities for event emitters, handler registries, transport attachment, and pending request tracking to eliminate duplication in client and server implementations, while preserving behavior and improving maintainability.

## Technical Context

<!--
  ACTION REQUIRED: Replace the content in this section with the technical details
  for the project. The structure here is presented in advisory capacity to guide
  the iteration process.
-->

**Language/Version**: TypeScript 5.9 (Node.js >=20, pnpm >=10)
**Primary Dependencies**: vitest, ts-morph, oxlint, oxfmt, tsx
**Storage**: N/A (in-memory structures, Map-backed registries)
**Testing**: Vitest (unit + e2e), TypeScript type-check
**Target Platform**: Node.js CLI/SDK (macOS/Linux/CI)
**Project Type**: Monorepo (pnpm workspaces; packages + scripts)
**Performance Goals**: No regressions in request dispatch or handler lookup; <=5% baseline variance
**Constraints**: LSP compliance, strict validation default, configurable timeouts, backward compatibility not required for request IDs
**Scale/Scope**: Core client/server utilities, shared handler/event/transport logic

## Constitution Check

*GATE: Must pass before Phase 0 research. Re-check after Phase 1 design.*

- I. LSP Protocol Compliance: PASS. Utilities preserve protocol message handling and validation.
- II. Type Safety First: PASS. Utilities are fully typed, no `any` in public APIs.
- III. Modular Package Architecture: PASS. Utilities live in core package utils without new package coupling.
- IV. Test-First Development: PASS with constraint. Tests must be written before implementation and cover utilities + integration.
- V. Performance and Async-First Design: PASS. Async flow preserved; utilities avoid blocking and preserve cancellation.

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
├── core/src/
│   ├── utils/
│   │   ├── disposable-event-emitter.ts
│   │   ├── handler-registry.ts
│   │   ├── transport-attachment.ts
│   │   └── pending-request-tracker.ts
│   ├── client.ts
│   ├── server.ts
│   └── dispatcher.ts
└── core/tests/
    └── utils/

packages/client/
packages/server/
e2e/
docs/
```

**Structure Decision**: Monorepo with shared core utilities and client/server implementations consuming them.

## Complexity Tracking

> **Fill ONLY if Constitution Check has violations that must be justified**

| Violation | Why Needed | Simpler Alternative Rejected Because |
|-----------|------------|-------------------------------------|
| [e.g., 4th project] | [current need] | [why 3 projects insufficient] |
| [e.g., Repository pattern] | [specific problem] | [why direct DB access insufficient] |
