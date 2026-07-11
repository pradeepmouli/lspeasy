# @lspeasy/core

## 2.7.0

### Minor Changes

- 681ce70: Wire `lsp.json`'s `initializationOptions` field through to the real LSP `initialize` request, across both the CLI's direct-connect path and the proxy daemon's connect path. Previously this field was parsed and preserved on round-trip but silently ignored at runtime. Now a user can declare `"typescript": {"command": "...", "initializationOptions": {"supportsMoveToFileCodeAction": true}}` in their `lsp.json` and have it actually reach the server — for example, unlocking `typescript-language-server`'s deterministic, target-file-aware "Move to file" refactor code action instead of only the interactive "Move to a new file" variant. This is purely additive and backward-compatible: omitting the field changes nothing.
- 944d94d: Fix `lsp.json` entries whose `command` field embeds the whole launch command (binary + flags, e.g. `"typescript-language-server --stdio"`) with no separate `args` array. `buildServerCommand` previously quoted that entire string as one token, so `spawn()` failed with `ENOENT` because no binary has a name containing a space. `entry.command` is now tokenized (via the existing `tokenizeCommand` utility) before being combined with `args` and re-quoted, so embedded flags correctly split into separate argv tokens.

  - `@lspeasy/core`: `buildServerCommand` is now exported from `discover.ts` and re-exported from the package's public barrel, since `apps/cli` needed it to eliminate a duplicated copy of the same (buggy) logic.
  - `@lsproxy/cli`: `apps/cli/src/resolve.ts`'s local `buildCommand` (a private mirror of core's function, kept in sync by hand) is removed; `platformServers()` now calls the shared, fixed `buildServerCommand` from `@lspeasy/core` directly. This closes the same bug for platform-adapter-sourced servers (Claude Code/Codex/Copilot-CLI configs), not just `lsp.json`-sourced ones.

### Patch Changes

- 8df99f3: Fix backend spawn failures crashing the proxy daemon and fix `MessageReader`/`MessageWriter` wiping out other listeners on a shared stream, so a misconfigured `lsp.json` entry (e.g. a binary that isn't on PATH) now surfaces as a clear error to the CLI instead of crashing the entire daemon (taking down every other language's live backend) or leaving the request hanging/silently failing.

  - `BackendPool.startBackend` now attaches an `error` handler to the spawned backend process and rejects `ensureBackend`'s promise with a clear message instead of letting Node's default "unhandled 'error' event" behavior crash the daemon process.
  - `MessageReader.close()` / `MessageWriter.close()` now remove only their own listeners instead of calling `stream.removeAllListeners()`, which previously deleted other consumers' listeners on a shared socket (e.g. `SocketTransport`'s own `'close'` handler) before the stream's `'close'` event ever fired — silently preventing `LSPClient.handleClose()` from ever running when a peer connection died abruptly.

## 2.6.1

### Patch Changes

- c44550e: Fix `WebSocketTransport` never marking a connection as established when the
  underlying socket is already open at construction time (the case for every
  server-accepted socket, e.g. from `ws`'s `WebSocketServer`). Previously this
  caused `send()` to throw `"WebSocket is not connected"` on the first message
  from a server-side transport.

## 2.6.0

### Minor Changes

- bf94e80: `lsproxy` help now surfaces param + result JSON Schema (`--json`) and illustrative
  example input/output payloads (text) per request, derived from the LSP Zod schemas
  (new `getResultSchemaForMethod` + `exampleFromZod`). `zodToCommander` generates
  deeper flags (enums, scalar arrays, nested scalars) so common methods like
  `textDocument/codeAction` are invokable without raw `--params`. Drill-down help and
  `lsproxy config` output are now colored (TTY only; `--json` stays ANSI-free).

## 2.5.0

### Minor Changes

- 6d973ba: Multi-platform LSP config interop. `lsproxy config import|export|diff|list`
  bridges lsproxy's lsp.json with Copilot CLI, Claude Code, and Codex
  (read-only); VS Code is detected-but-unsupported. A local plugin resolver in
  @lspeasy/core reads installed `.lsp.json` definitions to translate plugin
  toggles to/from canonical servers. Richer `.lsp.json` fields are preserved
  end-to-end. `--json` emits a stable contract at every command.

## 2.4.0

### Minor Changes

- 36f42f6: Dynamic, capability-aware command discovery for `lsproxy`. Bare `lsproxy` lists
  configured languages with live health/stats from a new `$/lsproxy.status` proxy
  control message; `lsproxy --help <language> <namespace> <request>` drills down
  through capability-filtered namespaces to parameter schemas. `--json` emits a
  stable, ANSI-free status/command contract for agent invocation.

## 2.3.0

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

## 2.2.0

### Minor Changes

- [#111](https://github.com/pradeepmouli/lspeasy/pull/111) [`c1d8792`](https://github.com/pradeepmouli/lspeasy/commit/c1d8792b653440cfe0f7611c1460b5e4c726fc42) Thanks [@pradeepmouli](https://github.com/pradeepmouli)! - - feat: bundle lsp-refactor Claude Code plugin + skill
  - feat(cli): add @lspeasy/cli — LSP-driven refactor CLI
  - fix(client): support rootUri/workspaceFolders + normalize numeric textDocumentSync

## 2.1.3

### Patch Changes

- [`496936a`](https://github.com/pradeepmouli/lspeasy/commit/496936aa66bb1b7b5ddd1f336a7ef2ae4d6a59d4) Thanks [@pradeepmouli](https://github.com/pradeepmouli)! - Fix trailing comma in core package.json that caused ERR_PNPM_JSON_PARSE on install; remove duplicate zod devDependency entry that shadowed the optionalDependency range.

## 2.1.2

### Patch Changes

- [#63](https://github.com/pradeepmouli/lspeasy/pull/63) [`55b8573`](https://github.com/pradeepmouli/lspeasy/commit/55b857348a19535edc37d94b97bc3afe20934ddb) Thanks [@pradeepmouli](https://github.com/pradeepmouli)! - - refactor: extract shared capability guard logic into @lspeasy/core
  - fix: improve CI workflow quality and consistency

## 2.1.1

### Patch Changes

- [#61](https://github.com/pradeepmouli/lspeasy/pull/61) [`b6ccbcc`](https://github.com/pradeepmouli/lspeasy/commit/b6ccbcc6bb97253d27586ccc43960af910935394) Thanks [@pradeepmouli](https://github.com/pradeepmouli)! - - test: trigger CI pipeline

## 2.1.0

### Minor Changes

- [#54](https://github.com/pradeepmouli/lspeasy/pull/54) [`fb73940`](https://github.com/pradeepmouli/lspeasy/commit/fb73940174cc4fa77d0909957c68177fc708b796) Thanks [@github-actions](https://github.com/apps/github-actions)! - ### Features\n\n• add find-skills documentation to assist users in discovering and installing agent skills
  • enhance project constitution with workflow-specific quality gates and templates
  • implement partial result sender for progress notifications
  • add requirements for SharedWorkerTransport error handling and client isolation
  • add feature spec for LSP protocol compliance gaps\n\n### Bug Fixes\n\n• disable git hooks before Create Pull Request step in changeset workflow
  • remove pnpm cache from report job that doesn't run pnpm install
  • update @typescript/native-preview version to 7.0.0-dev.20260219.1 in package.json and pnpm-lock.yaml
  • use pnpm publish to resolve workspace dependencies
  • remove NODE_AUTH_TOKEN to enable OIDC publishing
  • support NPM_TOKEN authentication fallback for publishing
  • retain manual publish step, only remove registry-url for OIDC
  • remove registry-url from setup-node and use changesets action for OIDC publishing
  • update release workflow to support OIDC and improve npm publishing process
  • configure OIDC properly for npm trusted publishing in release workflow
  • remove StdioTransport re-export from server to maintain browser compatibility
  • correct worker-types export path and add error path test coverage
  • clean up TCP socket listeners and remove redundant partialCollectors Map
  • update coverage threshold for branches to 64
  • remove trailing spaces in date fields for consistency\n\n### Code Refactoring\n\n• move Zod to optional dependencies with v4
  • separate Node-dependent modules into @lspeasy/core/node export
  • remove Node dependencies from CancellationTokenSource, TransportEventEmitter, and PendingRequestTracker
  • use DisposableEventEmitter in ConnectionHealthTracker for browser compatibility\n\n### Documentation\n\n• clarify coverage thresholds in vitest.coverage-all.config.ts
  • add clarifications and enhance user scenarios for LSP protocol compliance\n\n### Other Changes\n\nInitial plan
  chore(deps)(deps-dev): bump @types/node in the typescript group
  Initial plan
  chore(deps)(deps-dev): bump @typescript/native-preview
  chore: configure @changesets/changelog-github for PR-linked changelogs
  chore(deps)(deps-dev): bump the code-quality group with 2 updates
  chore: standardize git hooks and pnpm config
  chore: update simple-git-hooks configuration for pre-commit and pre-push
  chore: version packages
  chore: add changeset to fix workspace dependency resolution
  chore: version packages
  chore: add changeset for Zod dependency migration
  ci: align CI/CD with template-ts standard
  chore: version packages
  chore: add auto-generated changeset for minor release
  Add comments explaining npm version configuration
  Fix npm OIDC authentication by updating npm to v11+
  Initial plan
  chore: version packages
  chore: add auto-generated changeset for patch release
  Initial plan
  chore: version packages
  chore: add auto-generated changeset for patch release
  Initial plan
  chore: version packages
  chore: add changeset for lspeasy rename publication
  chore(deps)(deps-dev): bump the code-quality group with 2 updates
  chore: add check for changesets before versioning and publishing
  chore: enhance release workflow to check package status before versioning
  chore: version packages
  chore: add auto-generated changeset for patch release
  chore(deps)(deps-dev): bump type-fest from 5.4.3 to 5.4.4
  Update documentation to reflect removal of bundle size limits
  Remove bundle size limit configuration
  Initial plan
  Update publish command in release workflow
  Update pnpm and changesets action versions
  Initial plan
  Add once method to DisposableEventEmitter with API parity to Node EventEmitter
  Initial plan
  Update cancellation.ts
  Initial plan
  Update index.ts
  Initial plan
  Update index.ts
  Update client.ts
  chore(spec): close remaining middleware DX tasks
  chore: update package versions to 1.0.2 and enhance changelogs for all packages
  chore(release): set scoped package publish access to public
  Fix root cause: defer promise rejections to allow handler attachment
  Update requests.test.ts
  Update requests.test.ts
  Update client.test.ts
  Fix unhandled promise rejections in client tests
  Initial plan\n\n

## 2.0.0

### Major Changes

- 93ebf66: BREAKING CHANGE: Move Zod from peer dependency to optional dependency

  - Upgraded Zod from v3 to v4
  - Changed from `peerDependencies` to `optionalDependencies`
  - Zod is now completely optional - install it only if you need schema validation

## 1.1.0

### Minor Changes

- 452626c: ### Features\n\n• add find-skills documentation to assist users in discovering and installing agent skills
  • enhance project constitution with workflow-specific quality gates and templates
  • implement partial result sender for progress notifications
  • add requirements for SharedWorkerTransport error handling and client isolation
  • add feature spec for LSP protocol compliance gaps\n\n### Bug Fixes\n\n• remove NODE_AUTH_TOKEN to enable OIDC publishing
  • support NPM_TOKEN authentication fallback for publishing
  • retain manual publish step, only remove registry-url for OIDC
  • remove registry-url from setup-node and use changesets action for OIDC publishing
  • update release workflow to support OIDC and improve npm publishing process
  • configure OIDC properly for npm trusted publishing in release workflow
  • remove StdioTransport re-export from server to maintain browser compatibility
  • correct worker-types export path and add error path test coverage
  • clean up TCP socket listeners and remove redundant partialCollectors Map
  • update coverage threshold for branches to 64
  • remove trailing spaces in date fields for consistency\n\n### Code Refactoring\n\n• separate Node-dependent modules into @lspeasy/core/node export
  • remove Node dependencies from CancellationTokenSource, TransportEventEmitter, and PendingRequestTracker
  • use DisposableEventEmitter in ConnectionHealthTracker for browser compatibility\n\n### Documentation\n\n• clarify coverage thresholds in vitest.coverage-all.config.ts
  • add clarifications and enhance user scenarios for LSP protocol compliance\n\n### Other Changes\n\nAdd comments explaining npm version configuration
  Fix npm OIDC authentication by updating npm to v11+
  Initial plan
  chore: version packages
  chore: add auto-generated changeset for patch release
  Initial plan
  chore: version packages
  chore: add auto-generated changeset for patch release
  Initial plan
  chore: version packages
  chore: add changeset for lspeasy rename publication
  chore: add check for changesets before versioning and publishing
  chore: enhance release workflow to check package status before versioning
  chore: version packages
  chore: add auto-generated changeset for patch release
  Update documentation to reflect removal of bundle size limits
  Remove bundle size limit configuration
  Initial plan
  Update publish command in release workflow
  Update pnpm and changesets action versions
  Initial plan
  Add once method to DisposableEventEmitter with API parity to Node EventEmitter
  Initial plan
  Update cancellation.ts
  Initial plan
  Update index.ts
  Initial plan
  Update index.ts
  Update client.ts
  chore(spec): close remaining middleware DX tasks
  chore: update package versions to 1.0.2 and enhance changelogs for all packages
  chore(release): set scoped package publish access to public
  Fix root cause: defer promise rejections to allow handler attachment
  Update requests.test.ts
  Update requests.test.ts
  Update client.test.ts
  Fix unhandled promise rejections in client tests
  Initial plan\n\n

## 1.0.6

### Patch Changes

- d4e427b: ### Features\n\n• add find-skills documentation to assist users in discovering and installing agent skills
  • enhance project constitution with workflow-specific quality gates and templates
  • implement partial result sender for progress notifications
  • add requirements for SharedWorkerTransport error handling and client isolation
  • add feature spec for LSP protocol compliance gaps\n\n### Bug Fixes\n\n• remove NODE_AUTH_TOKEN to enable OIDC publishing
  • support NPM_TOKEN authentication fallback for publishing
  • retain manual publish step, only remove registry-url for OIDC
  • remove registry-url from setup-node and use changesets action for OIDC publishing
  • update release workflow to support OIDC and improve npm publishing process
  • configure OIDC properly for npm trusted publishing in release workflow
  • remove StdioTransport re-export from server to maintain browser compatibility
  • correct worker-types export path and add error path test coverage
  • clean up TCP socket listeners and remove redundant partialCollectors Map
  • update coverage threshold for branches to 64
  • remove trailing spaces in date fields for consistency\n\n### Code Refactoring\n\n• separate Node-dependent modules into @lspeasy/core/node export
  • remove Node dependencies from CancellationTokenSource, TransportEventEmitter, and PendingRequestTracker
  • use DisposableEventEmitter in ConnectionHealthTracker for browser compatibility\n\n### Documentation\n\n• clarify coverage thresholds in vitest.coverage-all.config.ts
  • add clarifications and enhance user scenarios for LSP protocol compliance\n\n### Other Changes\n\nInitial plan
  chore: version packages
  chore: add auto-generated changeset for patch release
  Initial plan
  chore: version packages
  chore: add changeset for lspeasy rename publication
  chore: add check for changesets before versioning and publishing
  chore: enhance release workflow to check package status before versioning
  chore: version packages
  chore: add auto-generated changeset for patch release
  Update documentation to reflect removal of bundle size limits
  Remove bundle size limit configuration
  Initial plan
  Update publish command in release workflow
  Update pnpm and changesets action versions
  Initial plan
  Add once method to DisposableEventEmitter with API parity to Node EventEmitter
  Initial plan
  Update cancellation.ts
  Initial plan
  Update index.ts
  Initial plan
  Update index.ts
  Update client.ts
  chore(spec): close remaining middleware DX tasks
  chore: update package versions to 1.0.2 and enhance changelogs for all packages
  chore(release): set scoped package publish access to public
  Fix root cause: defer promise rejections to allow handler attachment
  Update requests.test.ts
  Update requests.test.ts
  Update client.test.ts
  Fix unhandled promise rejections in client tests
  Initial plan\n\n

## 1.0.5

### Patch Changes

- 08daca7: ### Features\n\n• add find-skills documentation to assist users in discovering and installing agent skills
  • enhance project constitution with workflow-specific quality gates and templates
  • implement partial result sender for progress notifications
  • add requirements for SharedWorkerTransport error handling and client isolation
  • add feature spec for LSP protocol compliance gaps\n\n### Bug Fixes\n\n• support NPM_TOKEN authentication fallback for publishing
  • retain manual publish step, only remove registry-url for OIDC
  • remove registry-url from setup-node and use changesets action for OIDC publishing
  • update release workflow to support OIDC and improve npm publishing process
  • configure OIDC properly for npm trusted publishing in release workflow
  • remove StdioTransport re-export from server to maintain browser compatibility
  • correct worker-types export path and add error path test coverage
  • clean up TCP socket listeners and remove redundant partialCollectors Map
  • update coverage threshold for branches to 64
  • remove trailing spaces in date fields for consistency\n\n### Code Refactoring\n\n• separate Node-dependent modules into @lspeasy/core/node export
  • remove Node dependencies from CancellationTokenSource, TransportEventEmitter, and PendingRequestTracker
  • use DisposableEventEmitter in ConnectionHealthTracker for browser compatibility\n\n### Documentation\n\n• clarify coverage thresholds in vitest.coverage-all.config.ts
  • add clarifications and enhance user scenarios for LSP protocol compliance\n\n### Other Changes\n\nInitial plan
  chore: version packages
  chore: add changeset for lspeasy rename publication
  chore: add check for changesets before versioning and publishing
  chore: enhance release workflow to check package status before versioning
  chore: version packages
  chore: add auto-generated changeset for patch release
  Update documentation to reflect removal of bundle size limits
  Remove bundle size limit configuration
  Initial plan
  Update publish command in release workflow
  Update pnpm and changesets action versions
  Initial plan
  Add once method to DisposableEventEmitter with API parity to Node EventEmitter
  Initial plan
  Update cancellation.ts
  Initial plan
  Update index.ts
  Initial plan
  Update index.ts
  Update client.ts
  chore(spec): close remaining middleware DX tasks
  chore: update package versions to 1.0.2 and enhance changelogs for all packages
  chore(release): set scoped package publish access to public
  Fix root cause: defer promise rejections to allow handler attachment
  Update requests.test.ts
  Update requests.test.ts
  Update client.test.ts
  Fix unhandled promise rejections in client tests
  Initial plan\n\n

## 1.0.4

### Patch Changes

- 2666498: Publish renamed lspeasy packages to npm

## 1.0.3

### Patch Changes

- cc02538: ### Features\n\n• add find-skills documentation to assist users in discovering and installing agent skills
  • enhance project constitution with workflow-specific quality gates and templates
  • implement partial result sender for progress notifications
  • add requirements for SharedWorkerTransport error handling and client isolation
  • add feature spec for LSP protocol compliance gaps\n\n### Bug Fixes\n\n• update release workflow to support OIDC and improve npm publishing process
  • configure OIDC properly for npm trusted publishing in release workflow
  • remove StdioTransport re-export from server to maintain browser compatibility
  • correct worker-types export path and add error path test coverage
  • clean up TCP socket listeners and remove redundant partialCollectors Map
  • update coverage threshold for branches to 64
  • remove trailing spaces in date fields for consistency\n\n### Code Refactoring\n\n• separate Node-dependent modules into @lspeasy/core/node export
  • remove Node dependencies from CancellationTokenSource, TransportEventEmitter, and PendingRequestTracker
  • use DisposableEventEmitter in ConnectionHealthTracker for browser compatibility\n\n### Documentation\n\n• clarify coverage thresholds in vitest.coverage-all.config.ts
  • add clarifications and enhance user scenarios for LSP protocol compliance\n\n### Other Changes\n\nUpdate documentation to reflect removal of bundle size limits
  Remove bundle size limit configuration
  Initial plan
  Update publish command in release workflow
  Update pnpm and changesets action versions
  Initial plan
  Add once method to DisposableEventEmitter with API parity to Node EventEmitter
  Initial plan
  Update cancellation.ts
  Initial plan
  Update index.ts
  Initial plan
  Update index.ts
  Update client.ts
  chore(spec): close remaining middleware DX tasks
  chore: update package versions to 1.0.2 and enhance changelogs for all packages
  chore(release): set scoped package publish access to public
  Fix root cause: defer promise rejections to allow handler attachment
  Update requests.test.ts
  Update requests.test.ts
  Update client.test.ts
  Fix unhandled promise rejections in client tests
  Initial plan\n\n

## 1.0.2

### Patch Changes

- Bump patch versions to validate release automation and publishing workflow after OIDC trusted publisher setup.

## 1.0.1

### Patch Changes

- Fix request lifecycle handling to avoid unhandled promise rejections in cancellation and error-response paths.

  Relocate the pino middleware workspace package from `packages/middleware-pino` to `packages/middleware/pino` and update monorepo workspace/config documentation paths.

  Adjust release and changeset automation defaults for this repository's `master` default branch.
