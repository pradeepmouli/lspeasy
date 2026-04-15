---
title: Usage
---

# Usage

## Server

```ts
import { createServer } from '@lspeasy/server';

const server = createServer({
  capabilities: {
    textDocumentSync: 1
  }
});

server.onInitialize(() => ({ capabilities: server.capabilities }));
server.listen();
```

## Client

```ts
import { createClient } from '@lspeasy/client';

const client = createClient({ /* transport */ });
await client.initialize();
const result = await client.textDocument.completion({ textDocument: { uri }, position });
```

See the [API Reference](/api/) for the full typed surface.
