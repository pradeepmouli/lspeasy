# lspeasy Development Guidelines

Auto-generated from all feature plans. Last updated: 2026-01-29

## Active Technologies
- TypeScript 5.9 (Node.js >=20, pnpm >=10) + s-morph, tsx, vitest, oxlint, oxfm (refactor/001-migrate-lsp-protocol)
- Local files + cached metaModel.json under `.cache/` (refactor/001-migrate-lsp-protocol)
- TypeScript 5.9 (Node.js >=20, pnpm >=10) + vitest, ts-morph, oxlint, oxfmt, tsx (refactor/002-implement-capability-negotiation)
- N/A (in-memory structures, Map-backed registries) (refactor/002-implement-capability-negotiation)

- TypeScript 5.x with Node.js >= 20.0.0 (matches existing project configuration) (001-typed-lsp-sdk)

## Project Structure

```text
src/
tests/
```

## Commands

npm test && npm run lint

## Code Style

TypeScript 5.x with Node.js >= 20.0.0 (matches existing project configuration): Follow standard conventions

## Recent Changes
- refactor/002-implement-capability-negotiation: Added TypeScript 5.9 (Node.js >=20, pnpm >=10) + vitest, ts-morph, oxlint, oxfmt, tsx
- refactor/001-migrate-lsp-protocol: Added TypeScript 5.9 (Node.js >=20, pnpm >=10) + s-morph, tsx, vitest, oxlint, oxfm

- 001-typed-lsp-sdk: Added TypeScript 5.x with Node.js >= 20.0.0 (matches existing project configuration)

<!-- MANUAL ADDITIONS START -->
<!-- MANUAL ADDITIONS END -->
