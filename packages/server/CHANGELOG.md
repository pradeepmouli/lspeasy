# @lspeasy/server

## 4.0.0

### Major Changes

- [`c30becc`](https://github.com/pradeepmouli/lspeasy/commit/c30becc8835b03d96ed6e75202fba1ee0aed2a70) Thanks [@pradeepmouli](https://github.com/pradeepmouli)! - BREAKING CHANGE: Unified, fluent capability registration API

  **Server** — `setCapabilities` → `registerCapabilities` (now fluent, returns narrowed type):

  ```ts
  // Before
  server.setCapabilities({ hoverProvider: true });
  server.onRequest("textDocument/hover", handler);

  // After
  const server = new LSPServer().registerCapabilities({ hoverProvider: true });
  server.textDocument.onHover(handler);
  ```

  **Client** — `setCapabilities` → `registerCapabilities` (now fluent, returns narrowed type):

  ```ts
  // Before
  client.setCapabilities({ textDocument: { hover: {} } });

  // After
  const client = new LSPClient().registerCapabilities({
    textDocument: { hover: {} },
  });
  ```

  **Removed** — `registerCapability(key, value)` (singular) on both server and client.
  Use `registerCapabilities({ [key]: value })` instead.

## 3.0.0

### Major Changes

- [`b52ae63`](https://github.com/pradeepmouli/lspeasy/commit/b52ae631350a5a35ca38cfc18f2c79fedf955b8a) Thanks [@pradeepmouli](https://github.com/pradeepmouli)! - BREAKING CHANGE: Rename `setCapabilities` to `registerCapabilities` on `LSPServer`

  **Before:**

  ```ts
  server.setCapabilities({ hoverProvider: true });
  ```

  **After:**

  ```ts
  server.registerCapabilities({ hoverProvider: true });
  ```

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

### Patch Changes

- Updated dependencies [[`fb73940`](https://github.com/pradeepmouli/lspeasy/commit/fb73940174cc4fa77d0909957c68177fc708b796)]:
  - @lspeasy/core@2.1.0

## 2.0.1

### Patch Changes

- 32b3113: Fix workspace dependency resolution in published packages

## 2.0.0

### Major Changes

- 93ebf66: BREAKING CHANGE: Move Zod from peer dependency to optional dependency

  - Upgraded Zod from v3 to v4
  - Changed from `peerDependencies` to `optionalDependencies`
  - Zod is now completely optional - install it only if you need schema validation

### Patch Changes

- Updated dependencies [93ebf66]
  - @lspeasy/core@2.0.0

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

### Patch Changes

- Updated dependencies [452626c]
  - @lspeasy/core@1.1.0

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
- Updated dependencies [d4e427b]
  - @lspeasy/core@1.0.6

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
- Updated dependencies [08daca7]
  - @lspeasy/core@1.0.5

## 1.0.4

### Patch Changes

- 2666498: Publish renamed lspeasy packages to npm
- Updated dependencies [2666498]
  - @lspeasy/core@1.0.4

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
- Updated dependencies [cc02538]
  - @lspeasy/core@1.0.3

## 1.0.2

### Patch Changes

- Bump patch versions to validate release automation and publishing workflow after OIDC trusted publisher setup.
- Updated dependencies
  - @lspeasy/core@1.0.2

## 1.0.1

### Patch Changes

- Updated dependencies
  - @lspeasy/core@1.0.1
