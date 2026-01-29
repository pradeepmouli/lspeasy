# Quickstart Guide: LSP SDK

Get started building LSP servers and clients in minutes.

---

## Installation

```bash
# Install packages (choose what you need)
npm install @lspy/server @lspy/client @lspy/core zod

# Or with pnpm
pnpm add @lspy/server @lspy/client @lspy/core zod
```

**Note**: `zod` is a peer dependency (v3.25+) required for runtime validation.

---

## Build Your First LSP Server (< 30 lines)

Create a minimal language server that provides hover information.

```typescript
// server.ts
import { LSPServer } from '@lspy/server';
import { StdioTransport } from '@lspy/core';
import type { HoverParams, Hover } from '@lspy/core/protocol';

// Create server
const server = new LSPServer({
  name: 'my-language-server',
  version: '1.0.0'
});

// Declare capabilities
server.setCapabilities({
  textDocumentSync: 1,  // Full sync
  hoverProvider: true
});

// Register hover handler
server.onRequest<HoverParams, Hover | null>(
  'textDocument/hover',
  async (params, token) => {
    // Return hover information
    return {
      contents: {
        kind: 'markdown',
        value: `**Hover at ${params.position.line}:${params.position.character}**`
      }
    };
  }
);

// Start server on stdio
const transport = new StdioTransport();
await server.listen(transport);
```

**Run it**:
```bash
ts-node server.ts
# Or compile and run
tsc server.ts && node server.js
```

**Test with VS Code**: Configure in `.vscode/settings.json`:
```json
{
  "languageServerExample.trace.server": "verbose",
  "[mylang]": {
    "editor.languageServer": "my-language-server"
  }
}
```

---

## Build an LSP Client

Connect to a language server programmatically.

```typescript
// client.ts
import { LSPClient } from '@lspy/client';
import { StdioTransport } from '@lspy/core';

// Create client
const client = new LSPClient({
  name: 'my-client',
  capabilities: {
    textDocument: {
      hover: {
        contentFormat: ['markdown']
      }
    }
  }
});

// Connect to typescript-language-server
const transport = new StdioTransport({
  command: 'typescript-language-server',
  args: ['--stdio']
});

const initResult = await client.connect(transport);
console.log('Connected to:', initResult.serverInfo);

// Open a document
await client.textDocument.didOpen({
  textDocument: {
    uri: 'file:///path/to/file.ts',
    languageId: 'typescript',
    version: 1,
    text: 'const x: number = 42;'
  }
});

// Request hover information
const hover = await client.textDocument.hover({
  textDocument: { uri: 'file:///path/to/file.ts' },
  position: { line: 0, character: 6 }  // At 'number'
});

console.log('Hover:', hover?.contents);

// Cleanup
await client.disconnect();
```

---

## Common Patterns

### Handle Multiple Capabilities

```typescript
server
  .onRequest('textDocument/hover', hoverHandler)
  .onRequest('textDocument/completion', completionHandler)
  .onRequest('textDocument/definition', definitionHandler)
  .onNotification('textDocument/didOpen', didOpenHandler)
  .onNotification('textDocument/didChange', didChangeHandler);
```

### Use Cancellation Tokens

```typescript
server.onRequest('textDocument/completion', async (params, token) => {
  const results = [];

  for (const item of largeDataset) {
    // Check cancellation
    if (token.isCancellationRequested) {
      return null;  // User cancelled request
    }

    results.push(await processItem(item));
  }

  return { isIncomplete: false, items: results };
});
```

### Custom Error Handling

```typescript
import { ResponseError, ErrorCodes } from '@lspy/server';

server.onRequest('custom/method', async (params) => {
  if (!isValid(params)) {
    throw new ResponseError(
      ErrorCodes.RequestFailed,
      'Invalid request parameters',
      { field: 'name', reason: 'missing' }
    );
  }

  // Process request...
});
```

### WebSocket Transport

```typescript
// Server side (with 'ws' package)
import { WebSocketTransport } from '@lspy/core';
import { WebSocketServer } from 'ws';

const wss = new WebSocketServer({ port: 8080 });

wss.on('connection', (socket) => {
  const transport = new WebSocketTransport({ socket });
  server.listen(transport);
});

// Client side
const transport = new WebSocketTransport({
  url: 'ws://localhost:8080'
});

await client.connect(transport);
```

---

## Testing Your Server

### Unit Tests (Vitest)

```typescript
import { describe, it, expect } from 'vitest';
import { LSPServer } from '@lspy/server';
import type { HoverParams } from '@lspy/core/protocol';

describe('Hover Handler', () => {
  it('returns hover information', async () => {
    const server = new LSPServer();

    server.onRequest('textDocument/hover', async (params: HoverParams) => {
      return {
        contents: { kind: 'plaintext', value: 'test' }
      };
    });

    // Test handler directly (via internal API)
    const result = await server.callHandler('textDocument/hover', {
      textDocument: { uri: 'file:///test.ts' },
      position: { line: 0, character: 0 }
    });

    expect(result).toHaveProperty('contents');
  });
});
```

### Integration Tests

```typescript
import { LSPClient } from '@lspy/client';
import { StdioTransport } from '@lspy/core';

it('connects to real language server', async () => {
  const client = new LSPClient({ name: 'test-client' });

  const transport = new StdioTransport({
    command: 'typescript-language-server',
    args: ['--stdio']
  });

  const initResult = await client.connect(transport);

  expect(initResult.capabilities).toBeDefined();
  expect(initResult.capabilities.hoverProvider).toBe(true);

  await client.disconnect();
});
```

---

## Next Steps

- **API Reference**: See [`contracts/`](contracts/) for complete API documentation
- **Examples**: Explore `examples/server/` and `examples/client/` for more patterns
- **Data Model**: Review [`data-model.md`](data-model.md) for architecture details
- **LSP Specification**: Read [LSP spec](https://microsoft.github.io/language-server-protocol/) for protocol details

---

## Troubleshooting

### "Server not initialized" error
- Ensure client sends `initialize` request before other requests
- SDK handles initialization automatically via `client.connect()`

### Validation errors
- Check parameters match LSP types exactly
- Use TypeScript strict mode to catch type errors at compile time
- Inspect Zod error details for specific field issues

### Performance issues
- Enable logging: `new LSPServer({ logLevel: 'debug' })`
- Check for blocking operations in handlers (use async/await)
- Profile with `node --prof` to find hotspots

### Transport disconnects
- Subscribe to `onError` events to diagnose connection issues
- Check stderr output from language server process
- Verify command/args are correct for StdioTransport

---

## Support

- **GitHub Issues**: Report bugs and feature requests
- **Documentation**: Full API docs in `contracts/` directory
- **Examples**: Working samples in `examples/` directory
