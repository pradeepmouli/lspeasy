# @lsproxy/proxy

## 1.3.3

### Patch Changes

- 027e839: **Breaking (`@lspeasy/core`): runtime validation moved to `@lspeasy/core/schemas`.**
  
  The main barrel now exports **types and transports only** — it no longer pulls
  in zod. Anything that validates at runtime (`LSPSchemas`, `getSchemaForMethod`,
  `getResultSchemaForMethod`, every `*ParamsSchema`, the `jsonrpc` message
  schemas, `exampleFromZod`, `unwrapZodType`) moved to the `./schemas` subpath.
  
  ```diff
  - import { getSchemaForMethod, LSPSchemas } from '@lspeasy/core';
  + import { getSchemaForMethod, LSPSchemas } from '@lspeasy/core/schemas';
  ```
  
  Types are unchanged:
  
  ```ts
  import type { WorkspaceEdit, Transport } from '@lspeasy/core';
  ```
  
  **Also breaking: the browser transport implementations left the main barrel.**
  `SharedWorkerTransport` pulls zod (it validates envelopes arriving over a port
  anything can post to), so keeping any of them on the barrel kept zod on it.
  Five values moved:
  
  ```diff
  - import { WebSocketTransport, createWebSocketClient } from '@lspeasy/core';
  + import { WebSocketTransport, createWebSocketClient } from '@lspeasy/core/transport/websocket';
  
  - import { DedicatedWorkerTransport } from '@lspeasy/core';
  + import { DedicatedWorkerTransport } from '@lspeasy/core/transport/dedicated-worker';
  
  - import { SharedWorkerTransport } from '@lspeasy/core';
  + import { SharedWorkerTransport } from '@lspeasy/core/transport/shared-worker';
  
  - import { TransportEventEmitter } from '@lspeasy/core';
  + import { TransportEventEmitter } from '@lspeasy/core/transport/events';
  ```
  
  Their option types (`WebSocketTransportOptions`, …), the `Transport` interface,
  `isMessage` and `isWorkerTransportEnvelope` all stay on the barrel. Node
  transports were already only on `@lspeasy/core/node` and are unaffected.
  
  Every transport now also has a per-transport subpath (`@lspeasy/core/transport/stdio`,
  `/tcp`, `/socket`, `/ipc`, …). Prefer them over both aggregates when you need
  only one: `@lspeasy/core/node` re-exports every Node transport and
  `@lspeasy/core/transport` every portable one, and `Tcp`/`Socket`/`SharedWorker`
  import zod to validate frames read off a channel anything can write to — so
  importing an aggregate for `StdioTransport` alone costs you zod.
  `packages/core/src/transport/index.ts` documents which transports pull what.
  
  Two composed schemas are newly exported from `@lspeasy/core/schemas`:
  `TextEditArraySchema` and `NonEmptyWorkspaceEditSchema`.
  
  **`lsproxy` cold start is ~40% faster.** `lsproxy --version` drops from a 0.08s
  median to 0.05s, and its startup module graph from 194 modules to 104 with zero
  zod modules (previously 79). The CLI's Commander tree, help text, JSON Schemas
  and examples are now precomputed at build time instead of walked from zod
  schemas on every invocation; the schemas that validate a language server's
  *response* load on demand, after a request has already completed.
  `apps/cli/src/startup-purity.test.ts` and
  `packages/core/src/barrel-purity.test.ts` keep it that way.
  
  `@lspeasy/client` makes its two dynamic-capability guards load on demand, so
  importing the client no longer pulls zod onto a consumer's startup path. No API
  change.
  
  `@lsproxy/proxy` imports `StdioTransport` from the narrow
  `@lspeasy/core/transport/stdio` subpath instead of the `@lspeasy/core/node`
  aggregate, so spawning a backend no longer loads zod. No API change.
- Updated dependencies [027e839]
  - @lspeasy/core@3.0.0
  - @lspeasy/client@3.1.9
  - @lsproxy/polyfill@0.4.2
  - @lspeasy/server@4.2.3

## 1.3.2

### Patch Changes

- Updated dependencies [fc6e0e3]
  - @lspeasy/client@3.1.8
  - @lspeasy/core@2.7.1
  - @lsproxy/polyfill@0.4.1
  - @lspeasy/server@4.2.2

## 1.3.1

### Patch Changes

- b7f5894: Fix a critical regression (#205) where `lsproxy` was completely non-functional after a real-world `npm install -g @lsproxy/cli`: the CLI located `@lsproxy/proxy`'s daemon entry point (`dist/main.js`) via a hardcoded relative path assuming it always lives as a sibling directory of `@lsproxy/cli`. That's true in this monorepo's dev layout and when a package manager hoists `@lsproxy/proxy` to the top-level scope, but npm sometimes nests it under `@lsproxy/cli`'s own `node_modules` instead — a normal, valid hoisting outcome. In that (real, reported) layout the hardcoded path resolved to a location that was never created, so every daemon spawn failed with `MODULE_NOT_FOUND` and the CLI could not run any command that needs the proxy daemon.

  - `@lsproxy/cli`: `connect.ts` now resolves the daemon entry point via `import.meta.resolve('@lsproxy/proxy/dist/main.js')` (real Node module resolution, which walks `node_modules` from the calling module's own location) instead of a hardcoded `'../../proxy/dist/main.js'` relative path, so it finds `@lsproxy/proxy` wherever npm or pnpm actually placed it.
  - `@lsproxy/proxy`: added a `"./dist/main.js"` subpath export to `package.json`'s `exports` map. Node's ESM resolver strictly enforces `exports` when present, so without this, `import.meta.resolve('@lsproxy/proxy/dist/main.js')` would fail with `ERR_PACKAGE_PATH_NOT_EXPORTED` even after the CLI-side fix. Purely additive — no existing export changed.

## 1.3.0

### Minor Changes

- 681ce70: Wire `lsp.json`'s `initializationOptions` field through to the real LSP `initialize` request, across both the CLI's direct-connect path and the proxy daemon's connect path. Previously this field was parsed and preserved on round-trip but silently ignored at runtime. Now a user can declare `"typescript": {"command": "...", "initializationOptions": {"supportsMoveToFileCodeAction": true}}` in their `lsp.json` and have it actually reach the server — for example, unlocking `typescript-language-server`'s deterministic, target-file-aware "Move to file" refactor code action instead of only the interactive "Move to a new file" variant. This is purely additive and backward-compatible: omitting the field changes nothing.

### Patch Changes

- 8df99f3: Fix backend spawn failures crashing the proxy daemon and fix `MessageReader`/`MessageWriter` wiping out other listeners on a shared stream, so a misconfigured `lsp.json` entry (e.g. a binary that isn't on PATH) now surfaces as a clear error to the CLI instead of crashing the entire daemon (taking down every other language's live backend) or leaving the request hanging/silently failing.

  - `BackendPool.startBackend` now attaches an `error` handler to the spawned backend process and rejects `ensureBackend`'s promise with a clear message instead of letting Node's default "unhandled 'error' event" behavior crash the daemon process.
  - `MessageReader.close()` / `MessageWriter.close()` now remove only their own listeners instead of calling `stream.removeAllListeners()`, which previously deleted other consumers' listeners on a shared socket (e.g. `SocketTransport`'s own `'close'` handler) before the stream's `'close'` event ever fired — silently preventing `LSPClient.handleClose()` from ever running when a peer connection died abruptly.

- Updated dependencies [8df99f3]
- Updated dependencies [681ce70]
- Updated dependencies [944d94d]
- Updated dependencies [093b1e6]
  - @lspeasy/core@2.7.0
  - @lsproxy/polyfill@0.4.0
  - @lspeasy/client@3.1.7
  - @lspeasy/server@4.2.1

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
