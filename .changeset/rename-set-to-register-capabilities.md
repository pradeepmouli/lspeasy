---
"@lspeasy/server": major
---

BREAKING CHANGE: Rename `setCapabilities` to `registerCapabilities` on `LSPServer`

**Before:**
```ts
server.setCapabilities({ hoverProvider: true });
```

**After:**
```ts
server.registerCapabilities({ hoverProvider: true });
```
