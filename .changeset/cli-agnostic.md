---
"@lspeasy/cli": minor
"@lspeasy/core": minor
---

feat(cli): language-agnostic and capability-agnostic CLI

- `lsp.json` discovery: walks `<root>/lsp.json`, `<root>/.claude/lsp.json`, `<root>/.github/lsp.json`, `~/.claude/lsp.json`; `--server` overrides
- Runtime Zod → Commander translation: builds namespace/subcommand tree from `LSPSchemas × ServerCapabilities` so only what the connected server advertises is exposed
- Two-pass parse: `util.parseArgs` extracts globals, then Commander dispatches after capability detection
- Generic `lspeasy call <method> --params <json>` fallback always available
- Write operations (rename, formatting) now apply `WorkspaceEdit` results to disk; `--dry-run` shows planned changes without writing
- `workspace/symbol` gets a `<query>` positional via new `'query'` arg pattern

`@lspeasy/core`: expanded `LSPSchemas` to cover all standard text-document and workspace capabilities
