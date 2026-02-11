# Research

## Decision: Extract shared utilities into core utils
- Rationale: Consolidates duplicate logic and makes behavior easier to test and maintain.
- Alternatives considered: Keep duplication; partial refactor per file.

## Decision: Export only selected utilities
- Rationale: Limit public API surface while still enabling internal reuse.
- Alternatives considered: Export everything; export nothing.

## Decision: UUID/string request IDs with configurable timeouts
- Rationale: Simpler tracker utility with flexible ID format and timeout configuration.
- Alternatives considered: Keep numeric IDs; hardcoded timeout defaults.

## Decision: Method category derivation via prefix
- Rationale: Simple, deterministic grouping aligned with LSP method naming.
- Alternatives considered: Manual map or hybrid overrides.

## Decision: Strict validation by default
- Rationale: Aligns with constitution and catches issues early; opt-out for legacy uses.
- Alternatives considered: Lenient default; require explicit selection.
