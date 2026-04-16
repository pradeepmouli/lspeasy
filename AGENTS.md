# Agent Guide

This repository is designed for multi-agent collaboration (Copilot, Claude, Gemini, Codex). Use this guide to stay consistent when automating tasks.

## Project Metadata
- Name: lspeasy
- Description: TypeScript SDK for building Language Server Protocol clients and servers
- Language: TypeScript (pnpm workspaces)
- Tooling: pnpm, oxlint, oxfmt, Vitest, simple-git-hooks, lint-staged

## Ground Rules
- If running terminal commands in an interactive session, use the integrated terminal so the user can see the output and verify success.
- Always check the latest version of dependencies before adding new ones.
- Prefer non-destructive changes; never reset user work.
- Follow conventional commits.
- Always run formating, linting, type-checking, and tests before reporting completion or committing. Run formatting last.
- Always keep docs current when changing scripts or workflows.
- When adding dependencies, make sure to use the latest stable versions.
- Abide by the rules in ./specify/memory/constitution.md
- If you are copilot, also see .github/agents/copilot-instructions.md

## Workflow Checklist
1) Install deps: `pnpm install`
2) Lint: `pnpm run lint`
3) Test: `pnpm test`
4) Format: `pnpm run format`
5) Type-check (if added): `pnpm run type-check`

## Coding Standards
- Use TypeScript strict mode.
- Write JSDoc for all exported functions/types.
- Avoid dynamic or inline imports.
- Keep public API docs concise; avoid documenting internals.
- Use vitest for tests; add coverage for public APIs.

## Agent-Specific Notes
- Coordinate with other agents by updating workflow docs (specs/**.md).
- If adding hooks, prefer simple-git-hooks and lint-staged already in package.json.

## Deliverables Expectation
- Summaries should include what changed, where, and how to verify.
- For automation runs, report commands executed and their results.