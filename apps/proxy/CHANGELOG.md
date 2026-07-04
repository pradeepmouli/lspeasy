# @lsproxy/proxy

## 1.2.2

### Patch Changes

- Updated dependencies [8ae297a]
  - @lsproxy/polyfill@0.3.0

## 1.2.1

### Patch Changes

- Updated dependencies [194ce36]
  - @lsproxy/polyfill@0.2.1

## 1.2.0

### Minor Changes

- e5a35f9: Add a `@lsproxy/polyfill` package that backfills `codeAction/resolve` and
  synthesizes a composite `source.fixAll` code action for backend LSP servers
  that don't natively support them, and wire it into `@lsproxy/proxy` via a new
  `ProxySession` (replacing the previous hand-rolled `ClientSession`).

  `@lspeasy/server`'s `ServerOptions` gained two extension points to support
  this: `resolveCapabilities` for computing per-connection server capabilities
  at `initialize` time, and `preInitializeMethods` for exempting specific
  methods (e.g. status queries) from the pre-`initialize` rejection gate.

### Patch Changes

- Updated dependencies [e5a35f9]
  - @lsproxy/polyfill@0.2.0
  - @lspeasy/server@4.2.0

## 1.1.3

### Patch Changes

- Updated dependencies [c44550e]
  - @lspeasy/core@2.6.1
  - @lspeasy/client@3.1.6

## 1.1.2

### Patch Changes

- Updated dependencies [bf94e80]
  - @lspeasy/core@2.6.0
  - @lspeasy/client@3.1.5

## 1.1.1

### Patch Changes

- Updated dependencies [6d973ba]
  - @lspeasy/core@2.5.0
  - @lspeasy/client@3.1.4

## 1.1.0

### Minor Changes

- 36f42f6: Dynamic, capability-aware command discovery for `lsproxy`. Bare `lsproxy` lists
  configured languages with live health/stats from a new `$/lsproxy.status` proxy
  control message; `lsproxy --help <language> <namespace> <request>` drills down
  through capability-filtered namespaces to parameter schemas. `--json` emits a
  stable, ANSI-free status/command contract for agent invocation.

### Patch Changes

- Updated dependencies [36f42f6]
  - @lspeasy/core@2.4.0
  - @lspeasy/client@3.1.3

## 1.0.1

### Patch Changes

- Updated dependencies [0d93464]
  - @lspeasy/client@3.1.2

## 1.0.0

### Major Changes

- 5243294: - Rename daemon binary from `lsproxy` to `lsps` to reflect that it multiplexes multiple LSP servers

## 0.2.0

### Minor Changes

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
  - @lspeasy/client@3.1.1
