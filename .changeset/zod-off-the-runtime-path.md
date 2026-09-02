---
'@lspeasy/core': major
'@lsproxy/cli': minor
'@lspeasy/client': patch
'@lsproxy/proxy': patch
---

**Breaking (`@lspeasy/core`): runtime validation moved to `@lspeasy/core/schemas`.**

The main barrel now exports **types and transports only** — it no longer pulls
in zod. Anything that validates at runtime (`LSPSchemas`, `getSchemaForMethod`,
`getResultSchemaForMethod`, every `*ParamsSchema`, the `jsonrpc` message
schemas, `exampleFromZod`, `unwrapZodType`) moved to the `./schemas` subpath.

```diff
- import { getSchemaForMethod, LSPSchemas } from '@lspeasy/core';
+ import { getSchemaForMethod, LSPSchemas } from '@lspeasy/core/schemas';
```

Types and transports are unchanged:

```ts
import type { WorkspaceEdit } from '@lspeasy/core';
```

Transports also gained per-transport subpaths (`@lspeasy/core/transport/stdio`,
`/tcp`, `/socket`, `/ipc`, …). Prefer them over the `@lspeasy/core/node`
aggregate when you need only one: `node` re-exports every Node transport, and
`Tcp`/`Socket` import zod to validate frames read off a socket anything can
write to, so importing the aggregate for `StdioTransport` alone costs you zod.

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
