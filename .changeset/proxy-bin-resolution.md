---
"@lsproxy/cli": patch
"@lsproxy/proxy": patch
---

Fix a critical regression (#205) where `lsproxy` was completely non-functional after a real-world `npm install -g @lsproxy/cli`: the CLI located `@lsproxy/proxy`'s daemon entry point (`dist/main.js`) via a hardcoded relative path assuming it always lives as a sibling directory of `@lsproxy/cli`. That's true in this monorepo's dev layout and when a package manager hoists `@lsproxy/proxy` to the top-level scope, but npm sometimes nests it under `@lsproxy/cli`'s own `node_modules` instead — a normal, valid hoisting outcome. In that (real, reported) layout the hardcoded path resolved to a location that was never created, so every daemon spawn failed with `MODULE_NOT_FOUND` and the CLI could not run any command that needs the proxy daemon.

- `@lsproxy/cli`: `connect.ts` now resolves the daemon entry point via `import.meta.resolve('@lsproxy/proxy/dist/main.js')` (real Node module resolution, which walks `node_modules` from the calling module's own location) instead of a hardcoded `'../../proxy/dist/main.js'` relative path, so it finds `@lsproxy/proxy` wherever npm or pnpm actually placed it.
- `@lsproxy/proxy`: added a `"./dist/main.js"` subpath export to `package.json`'s `exports` map. Node's ESM resolver strictly enforces `exports` when present, so without this, `import.meta.resolve('@lsproxy/proxy/dist/main.js')` would fail with `ERR_PACKAGE_PATH_NOT_EXPORTED` even after the CLI-side fix. Purely additive — no existing export changed.
