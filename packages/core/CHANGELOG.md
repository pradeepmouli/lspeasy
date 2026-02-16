# @lspeasy/core

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
