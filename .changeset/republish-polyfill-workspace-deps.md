---
"@lsproxy/polyfill": patch
---

Republish with correctly resolved dependency versions. The 0.2.0 release was
published with `npm publish` instead of `pnpm publish`, so its `workspace:*`
dependencies on `@lspeasy/client` and `@lspeasy/core` were never rewritten to
real semver versions — installing the package outside this monorepo failed
with `EUNSUPPORTEDPROTOCOL`. No source changes; this is a packaging-only fix.
