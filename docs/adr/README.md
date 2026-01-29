# Architecture Decision Records

This directory contains Architecture Decision Records (ADRs) documenting significant decisions made in this project.

## Index

- [ADR-001: pnpm Workspaces](001-pnpm-workspaces.md)
- [ADR-002: oxlint and oxfmt](002-oxlint-oxfmt.md)
- [ADR-003: ES Modules](003-esm-modules.md)
- [ADR-004: Vitest over Jest](004-vitest-over-jest.md)
- [ADR-005: Changesets for Versioning](005-changesets.md)

## What is an ADR?

An Architecture Decision Record (ADR) is a lightweight design document capturing an important architectural decision along with its context, decision rationale, and consequences.

### Format

Each ADR follows this structure:
- **Title**: Brief description of the decision
- **Date**: When the decision was made
- **Status**: Proposed, Accepted, Deprecated, Superseded
- **Context**: Problem or situation requiring the decision
- **Decision**: What was decided
- **Rationale**: Why this decision was made
- **Consequences**: Positive and negative impacts
- **Alternatives Considered**: Other options evaluated

### Status Values

- **Proposed**: Under discussion
- **Accepted**: Decision agreed upon and implemented
- **Deprecated**: No longer recommended
- **Superseded**: Replaced by another decision

## Reading ADRs

Start with the index above and read ADRs in order. Each ADR builds upon previous decisions.
