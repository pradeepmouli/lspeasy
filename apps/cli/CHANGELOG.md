# @lspeasy/cli

## 1.0.3

### Patch Changes

- 1d9b972: - chore(deps): update dependencies (pnpm update -r --latest)
  - fix(cli): wire up npx invocation mode in generated skill
  - test(e2e): add coverage for TypeScript's native tsc --lsp server

## 1.0.2

### Patch Changes

- Updated dependencies [fc6e0e3]
  - @lspeasy/client@3.1.8
  - @lspeasy/core@2.7.1
  - @lsproxy/proxy@1.3.2

## 1.0.1

### Patch Changes

- b7f5894: Fix a critical regression (#205) where `lsproxy` was completely non-functional after a real-world `npm install -g @lsproxy/cli`: the CLI located `@lsproxy/proxy`'s daemon entry point (`dist/main.js`) via a hardcoded relative path assuming it always lives as a sibling directory of `@lsproxy/cli`. That's true in this monorepo's dev layout and when a package manager hoists `@lsproxy/proxy` to the top-level scope, but npm sometimes nests it under `@lsproxy/cli`'s own `node_modules` instead — a normal, valid hoisting outcome. In that (real, reported) layout the hardcoded path resolved to a location that was never created, so every daemon spawn failed with `MODULE_NOT_FOUND` and the CLI could not run any command that needs the proxy daemon.

  - `@lsproxy/cli`: `connect.ts` now resolves the daemon entry point via `import.meta.resolve('@lsproxy/proxy/dist/main.js')` (real Node module resolution, which walks `node_modules` from the calling module's own location) instead of a hardcoded `'../../proxy/dist/main.js'` relative path, so it finds `@lsproxy/proxy` wherever npm or pnpm actually placed it.
  - `@lsproxy/proxy`: added a `"./dist/main.js"` subpath export to `package.json`'s `exports` map. Node's ESM resolver strictly enforces `exports` when present, so without this, `import.meta.resolve('@lsproxy/proxy/dist/main.js')` would fail with `ERR_PACKAGE_PATH_NOT_EXPORTED` even after the CLI-side fix. Purely additive — no existing export changed.

- Updated dependencies [b7f5894]
  - @lsproxy/proxy@1.3.1

## 1.0.0

### Major Changes

- 99a83b1: Breaking: unified argument parsing onto Commander and changed the CLI grammar. The first positional argument is now either a language id or a filename (which anchors the request, replacing the old requirement to repeat the file later in the args):

  - Old: `lsproxy <namespace> <command> <file> [args] [flags]` (e.g. `lsproxy textDocument hover src/foo.ts 12:7`)
  - New: `lsproxy <language-or-file> <namespace> <request> [args] [flags]` (e.g. `lsproxy src/foo.ts textDocument hover 12:7`, or `lsproxy typescript textDocument hover src/foo.ts 12:7`)

  `config` and `daemon` are now real Commander subcommands with consistent `--help` output. Added a new `lsproxy status` command showing configured language servers grouped by process, with resolved binary location, config source, live connection status, and served languages.

### Minor Changes

- 681ce70: Wire `lsp.json`'s `initializationOptions` field through to the real LSP `initialize` request, across both the CLI's direct-connect path and the proxy daemon's connect path. Previously this field was parsed and preserved on round-trip but silently ignored at runtime. Now a user can declare `"typescript": {"command": "...", "initializationOptions": {"supportsMoveToFileCodeAction": true}}` in their `lsp.json` and have it actually reach the server — for example, unlocking `typescript-language-server`'s deterministic, target-file-aware "Move to file" refactor code action instead of only the interactive "Move to a new file" variant. This is purely additive and backward-compatible: omitting the field changes nothing.

### Patch Changes

- e1c31ef: Fix the "Capability options:" and "Discovering commands:" help footers (for capability-gated commands and `workspace executeCommand`, respectively) never actually appearing for users. Both were built with Commander's `addHelpText('after', ...)`, which only surfaces text through `outputHelp()`'s `afterHelp` event — but this CLI renders help by calling `helpInformation()` directly, bypassing that event entirely, so the footers were silently dropped. They now use the same `appendHelpFooter` helper already used for the global-options footer, which wraps `helpInformation()` directly and composes correctly across multiple calls.
- 944d94d: Fix `lsp.json` entries whose `command` field embeds the whole launch command (binary + flags, e.g. `"typescript-language-server --stdio"`) with no separate `args` array. `buildServerCommand` previously quoted that entire string as one token, so `spawn()` failed with `ENOENT` because no binary has a name containing a space. `entry.command` is now tokenized (via the existing `tokenizeCommand` utility) before being combined with `args` and re-quoted, so embedded flags correctly split into separate argv tokens.

  - `@lspeasy/core`: `buildServerCommand` is now exported from `discover.ts` and re-exported from the package's public barrel, since `apps/cli` needed it to eliminate a duplicated copy of the same (buggy) logic.
  - `@lsproxy/cli`: `apps/cli/src/resolve.ts`'s local `buildCommand` (a private mirror of core's function, kept in sync by hand) is removed; `platformServers()` now calls the shared, fixed `buildServerCommand` from `@lspeasy/core` directly. This closes the same bug for platform-adapter-sourced servers (Claude Code/Codex/Copilot-CLI configs), not just `lsp.json`-sourced ones.

- Updated dependencies [8df99f3]
- Updated dependencies [681ce70]
- Updated dependencies [944d94d]
  - @lsproxy/proxy@1.3.0
  - @lspeasy/core@2.7.0
  - @lspeasy/client@3.1.7

## 0.11.4

### Patch Changes

- @lsproxy/proxy@1.2.2

## 0.11.3

### Patch Changes

- @lsproxy/proxy@1.2.1

## 0.11.2

### Patch Changes

- Updated dependencies [e5a35f9]
  - @lsproxy/proxy@1.2.0

## 0.11.1

### Patch Changes

- Updated dependencies [c44550e]
  - @lspeasy/core@2.6.1
  - @lsproxy/proxy@1.1.3
  - @lspeasy/client@3.1.6

## 0.11.0

### Minor Changes

- ccf9ba2: Apply the role-color scheme consistently across every help surface, not just
  the drill-down. Namespaces are cyan, methods/requests blue, positional args
  teal, and options/flags magenta — and now the same role reads the same color
  everywhere. The bare `lsproxy` view colorizes its **Usage**, **Commands**, and
  **Drill-down** terms by role (so the Usage line doubles as a legend), matching
  the colors Commander emits in the per-request drill-down help. TTY-gated and
  ANSI-free under `--json`/pipes.

## 0.10.0

### Minor Changes

- ed3f55f: Polish the help surfaces: the bare `lsproxy` view now shows a **Usage** line and a **Commands** section listing the non-namespace commands (`config`, `daemon`, `call`, `--version`) with descriptions — not just the per-language drill-down hints. The drill-down (`--help <lang> <ns> <request>`) now **colorizes Commander's own help** (usage, section titles, option/argument/subcommand terms) to match the rest of the output (TTY-gated, ANSI-free under `--json`/pipes). `workspace/executeCommand` help gains a note that command names come from capabilities and argument shapes from codeAction/codeLens results.

## 0.9.0

### Minor Changes

- 7336b38: Add `lsproxy daemon <start|stop|status>` to manage the per-root proxy daemon explicitly (it otherwise starts lazily on first request). `start` spawns it (no-op if already running), `stop` SIGTERMs it, `status` prints the daemon line ("up · pid … · N backend(s) · M session(s)" or "not started"). All support `--json` (ANSI-free).
- 52e3b85: Runtime server discovery now falls back to detected config platforms (Claude Code plugins, Codex, …) when `lsp.json` has no matching entry. A language configured only in a platform's config — e.g. Rust via a Claude Code plugin — is now served directly by `lsproxy <lang> <cmd>` and `lsproxy --help <lang>`, and listed in the bare `lsproxy` discovery view, without first running `config import`. `lsp.json` still wins on overlap.

### Patch Changes

- c223909: Drill-down help (`lsproxy --help <lang> <ns> <request>`) now shows an example of only the `--params` **residual** — the fields not already exposed as positional args or flags — instead of dumping the whole LSP message. For methods fully covered by args/flags (e.g. `hover`) it prints "no --params needed". The deepened codeAction flags (`--code-action-only`, `--code-action-trigger-kind`) already appear in the options list, so the example now reflects only what you actually pass as JSON (e.g. `context.diagnostics`). `--json` drill-down gains a matching `paramsExample` field.

## 0.8.1

### Patch Changes

- deaf9e8: Polish the colorized surfaces (bare `lsproxy` discovery view and `lsproxy config list`): relabel the inactive daemon state from "down" (reads like a crash) to "not started — starts on first request", use emoji status glyphs (🟢 running/detected · ⚪ cold/absent · 🟡 degraded · ✅/❌ health), and colorize with a 24-bit truecolor Nord palette (cyan names/ids/commands, green/yellow status, bold title + section headers, dim metadata). Color stays TTY-gated and ANSI-free under `--json`/pipes.

## 0.8.0

### Minor Changes

- 1db87b7: Add a version command: `lsproxy --version` / `-V` / `lsproxy version` print the CLI version and exit (previously these printed the tagline). Sourced from `package.json`.

## 0.7.3

### Patch Changes

- d2d5baf: Retry `textDocument/references` while the result is still incomplete (empty or declaration-only) until the language server finishes loading the workspace project, within the existing `indexWait` budget. Turns a cold under-report into a correct result instead of just a warning; on timeout the best-effort result is returned (and still warned). Works in both proxy and `--no-proxy` modes since it gates at the result layer.

## 0.7.2

### Patch Changes

- 7008f53: Detect empty / declaration-only `textDocument/references` results (which tsserver returns when its workspace project isn't fully loaded) and surface `partial:true` + a `warning` instead of a bare `ok:true`, so a false-empty no longer silently reads as "no callers". Respects `includeDeclaration:false` (an empty result there is a legitimate answer). Adds a references troubleshooting entry to the README/skill.

## 0.7.1

### Patch Changes

- 4a208d5: Name the generated skill `<namespace>-<package>` (`lsproxy-cli`) instead of the generic `cli`, so the postinstall-copied skill dir in `~/.claude/skills` is self-namespacing and cannot clobber an unrelated `cli` skill from another package.

## 0.7.0

### Minor Changes

- bf94e80: `lsproxy` help now surfaces param + result JSON Schema (`--json`) and illustrative
  example input/output payloads (text) per request, derived from the LSP Zod schemas
  (new `getResultSchemaForMethod` + `exampleFromZod`). `zodToCommander` generates
  deeper flags (enums, scalar arrays, nested scalars) so common methods like
  `textDocument/codeAction` are invokable without raw `--params`. Drill-down help and
  `lsproxy config` output are now colored (TTY only; `--json` stays ANSI-free).

### Patch Changes

- Updated dependencies [bf94e80]
  - @lspeasy/core@2.6.0
  - @lsproxy/proxy@1.1.2
  - @lspeasy/client@3.1.5

## 0.6.0

### Minor Changes

- 6d973ba: Multi-platform LSP config interop. `lsproxy config import|export|diff|list`
  bridges lsproxy's lsp.json with Copilot CLI, Claude Code, and Codex
  (read-only); VS Code is detected-but-unsupported. A local plugin resolver in
  @lspeasy/core reads installed `.lsp.json` definitions to translate plugin
  toggles to/from canonical servers. Richer `.lsp.json` fields are preserved
  end-to-end. `--json` emits a stable contract at every command.

### Patch Changes

- Updated dependencies [6d973ba]
  - @lspeasy/core@2.5.0
  - @lsproxy/proxy@1.1.1
  - @lspeasy/client@3.1.4

## 0.5.0

### Minor Changes

- 36f42f6: Dynamic, capability-aware command discovery for `lsproxy`. Bare `lsproxy` lists
  configured languages with live health/stats from a new `$/lsproxy.status` proxy
  control message; `lsproxy --help <language> <namespace> <request>` drills down
  through capability-filtered namespaces to parameter schemas. `--json` emits a
  stable, ANSI-free status/command contract for agent invocation.

### Patch Changes

- Updated dependencies [36f42f6]
  - @lsproxy/proxy@1.1.0
  - @lspeasy/core@2.4.0
  - @lspeasy/client@3.1.3

## 0.4.6

### Patch Changes

- 379468a: fix(cli): anchor `workspace/executeCommand` on the refactor's source file. Refactor commands (e.g. `_typescript.applyRefactoring` "Move to file") carry their file as a plain path in `arguments[0].file`, not a positional or `textDocument.uri` — so the session never opened a document and the TS server threw "No Project". Mine `arguments[0].file` for the anchor too, so LSP refactors (move-symbol-to-file) work headlessly.

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
