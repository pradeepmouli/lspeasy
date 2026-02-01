# Agent Guide

This repository is designed for multi-agent collaboration (Copilot, Claude, Gemini, Codex). Use this guide to stay consistent when automating tasks.

## Project Metadata
- Name: lspeasy
- Description: TypeScript SDK for building Language Server Protocol clients and servers
- Language: TypeScript (pnpm workspaces)
- Tooling: pnpm, oxlint, oxfmt, Vitest, simple-git-hooks, lint-staged

## Ground Rules
- Prefer non-destructive changes; never reset user work.
- Follow conventional commits.
- Keep formatting consistent with .editorconfig and .oxfmtrc.json.
- Run `pnpm run lint` and `pnpm test` after code changes when practical.
- Keep docs current when changing scripts or workflows.

## Workflow Checklist
1) Install deps: `pnpm install`
2) Lint: `pnpm run lint`
3) Test: `pnpm test`
4) Format: `pnpm run format` (or `pnpm run format:check`)
5) Type-check (if added): `pnpm run type-check`

## Coding Standards
- 2-space indentation; spaces (no tabs).
- Semicolons required; single quotes; no trailing commas.
- Keep public API docs concise; avoid documenting internals.
- Use vitest for tests; add coverage for public APIs.

## Agent-Specific Notes
- Coordinate with other agents by updating docs (README, TEMPLATE_INITIALIZATION.md) when workflows change.
- When modifying scripts, explain any new prompts or defaults in TEMPLATE_INITIALIZATION.md.
- If adding hooks, prefer simple-git-hooks and lint-staged already in package.json.

## Deliverables Expectation
- Summaries should include what changed, where, and how to verify.
- For automation runs, report commands executed and their results.
