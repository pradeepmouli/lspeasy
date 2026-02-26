---
"@lspeasy/server": major
"@lspeasy/client": major
---

BREAKING CHANGE: Unified, fluent capability registration API

**Server** — `setCapabilities` → `registerCapabilities` (now fluent, returns narrowed type):
```ts
// Before
server.setCapabilities({ hoverProvider: true });
server.onRequest('textDocument/hover', handler);

// After
const server = new LSPServer()
  .registerCapabilities({ hoverProvider: true });
server.textDocument.onHover(handler);
```

**Client** — `setCapabilities` → `registerCapabilities` (now fluent, returns narrowed type):
```ts
// Before
client.setCapabilities({ textDocument: { hover: {} } });

// After
const client = new LSPClient()
  .registerCapabilities({ textDocument: { hover: {} } });
```

**Removed** — `registerCapability(key, value)` (singular) on both server and client.
Use `registerCapabilities({ [key]: value })` instead.
