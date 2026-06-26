# @lspeasy/cli

## 0.4.5

### Patch Changes

- 348cbb9: fix(cli): `--params` now binds on namespace commands, and `workspace` file-operation methods (`willRenameFiles`/`willCreateFiles`/`willDeleteFiles`) derive a `didOpen` anchor from `--params files[].oldUri`. Previously the action mistook commander's `Command` for the options object (so every namespace command dropped `--params`), and no anchor was opened for workspace file-ops (empty TS program → `getEditsForFileRename` returned no edits). LSP-driven file renames now load the program and emit the import-rewrite edits.

## 0.4.4

### Patch Changes

- d211221: fix(cli): capture proxy daemon output to a log and surface it on startup timeout

  `spawnDaemon` previously ran the detached proxy daemon with `stdio: 'ignore'`, so a
  fatal startup error (e.g. an unresolved runtime dependency) was discarded and surfaced
  only as a generic "Proxy daemon did not start within 5000ms" timeout — undiagnosable
  from the CLI. The daemon now logs stdout/stderr to `~/.lsproxy/daemon-<socket>.log`,
  and `pollForSocket` includes a tail of that log in the timeout error, so daemon
  startup crashes are diagnosable instead of silent.

## 0.4.3

### Patch Changes

- Postinstall script now copies skills to `~/.claude/skills/` after rewriting invocations. Global installs will have skills available to Claude Code immediately after install.

## 0.4.2

### Patch Changes

- 31f31c0: Bundle generated skill files with the package and enrich README with Features, Troubleshooting, and Quick Start sections. Adds `buildProgram()` export as a static introspection surface for tools and shell completion.

## 0.4.1

### Patch Changes

- Updated dependencies [0d93464]
  - @lspeasy/client@3.1.2
  - @lsproxy/proxy@1.0.1

## 0.4.0

### Minor Changes

- 5243294: - Rename CLI binary from `lspeasy` to `lsproxy` to align with the `@lsproxy/*` package scope

### Patch Changes

- Updated dependencies [5243294]
  - @lsproxy/proxy@1.0.0

## 0.3.0

### Minor Changes

- 0eb1694: - fix(cli): unexport findLspJsonPath (internal helper)
  - fix(cli): inject required LSP defaults for references/codeAction/formatting methods
  - test(cli): afterEach cleanup, strengthen rename position/URI assertions
  - fix(cli): simplify help guard, extname() file detection, overwrite comment
  - test(cli): integration tests for capability → command → LSP dispatch
- 03fd44c: feat(cli): language-agnostic and capability-agnostic CLI

  - `lsp.json` discovery: walks `<root>/lsp.json`, `<root>/.claude/lsp.json`, `<root>/.github/lsp.json`, `~/.claude/lsp.json`; `--server` overrides
  - Runtime Zod → Commander translation: builds namespace/subcommand tree from `LSPSchemas × ServerCapabilities` so only what the connected server advertises is exposed
  - Two-pass parse: `util.parseArgs` extracts globals, then Commander dispatches after capability detection
  - Generic `lspeasy call <method> --params <json>` fallback always available
  - Write operations (rename, formatting) now apply `WorkspaceEdit` results to disk; `--dry-run` shows planned changes without writing
  - `workspace/symbol` gets a `<query>` positional via new `'query'` arg pattern

  `@lspeasy/core`: expanded `LSPSchemas` to cover all standard text-document and workspace capabilities

### Patch Changes

- Updated dependencies [0eb1694]
- Updated dependencies [03fd44c]
  - @lspeasy/core@2.3.0
  - @lsproxy/proxy@0.2.0
  - @lspeasy/client@3.1.1

## 0.2.0

### Minor Changes

- [#111](https://github.com/pradeepmouli/lspeasy/pull/111) [`c1d8792`](https://github.com/pradeepmouli/lspeasy/commit/c1d8792b653440cfe0f7611c1460b5e4c726fc42) Thanks [@pradeepmouli](https://github.com/pradeepmouli)! - - feat: bundle lsp-refactor Claude Code plugin + skill
  - feat(cli): add @lspeasy/cli — LSP-driven refactor CLI
  - fix(client): support rootUri/workspaceFolders + normalize numeric textDocumentSync

### Patch Changes

- Updated dependencies [[`c1d8792`](https://github.com/pradeepmouli/lspeasy/commit/c1d8792b653440cfe0f7611c1460b5e4c726fc42)]:
  - @lspeasy/client@3.1.0
  - @lspeasy/core@2.2.0
