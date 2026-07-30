# @lsproxy/polyfill

## 0.4.1

### Patch Changes

- fc6e0e3: - chore: upgrade to TypeScript 7, pin docs app to TS6 for typedoc compat
  - chore: bump typedoc-plugin-skillit to 2.0.3, remove unused @to-skills/vitepress
  - chore: pnpm update --latest across the workspace
- Updated dependencies [fc6e0e3]
  - @lspeasy/client@3.1.8
  - @lspeasy/core@2.7.1

## 0.4.0

### Minor Changes

- 093b1e6: Add an `organizeImports` polyfill that synthesizes a composite `source.organizeImports` code action from per-diagnostic import-related quickfixes, for LSP backends that support pull-diagnostics and quickfixes but never implement the dedicated batch action themselves. Uses a title-based heuristic (matching "import" in the backend's own quickfix titles) since there's no portable diagnostic code for "unused/missing import" across language servers.

### Patch Changes

- Updated dependencies [8df99f3]
- Updated dependencies [681ce70]
- Updated dependencies [944d94d]
  - @lspeasy/core@2.7.0
  - @lspeasy/client@3.1.7

## 0.3.0

### Minor Changes

- 8ae297a: Add an `organizeImports` polyfill that synthesizes a composite `source.organizeImports` code action from per-diagnostic import-related quickfixes, for LSP backends that support pull-diagnostics and quickfixes but never implement the dedicated batch action themselves. Uses a title-based heuristic (matching "import" in the backend's own quickfix titles) since there's no portable diagnostic code for "unused/missing import" across language servers.

## 0.2.1

### Patch Changes

- 194ce36: Republish with correctly resolved dependency versions. The 0.2.0 release was
  published with `npm publish` instead of `pnpm publish`, so its `workspace:*`
  dependencies on `@lspeasy/client` and `@lspeasy/core` were never rewritten to
  real semver versions — installing the package outside this monorepo failed
  with `EUNSUPPORTEDPROTOCOL`. No source changes; this is a packaging-only fix.

## 0.2.0

### Minor Changes

- e5a35f9: Add a `@lsproxy/polyfill` package that backfills `codeAction/resolve` and
  synthesizes a composite `source.fixAll` code action for backend LSP servers
  that don't natively support them, and wire it into `@lsproxy/proxy` via a new
  `ProxySession` (replacing the previous hand-rolled `ClientSession`).

  `@lspeasy/server`'s `ServerOptions` gained two extension points to support
  this: `resolveCapabilities` for computing per-connection server capabilities
  at `initialize` time, and `preInitializeMethods` for exempting specific
  methods (e.g. status queries) from the pre-`initialize` rejection gate.
