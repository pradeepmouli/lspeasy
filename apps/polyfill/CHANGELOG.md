# @lsproxy/polyfill

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
