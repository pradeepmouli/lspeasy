# Capability-Aware Runtime Behavior

## Overview

The lspy SDK now supports **capability-aware runtime behavior** for both clients and servers:

- **Client**: Methods are dynamically exposed based on server-declared capabilities
- **Server**: Handler registration is validated against declared capabilities

This ensures type-level guarantees are enforced at runtime, preventing invalid operations.

## Server-Side Capability Validation

### Strict vs Non-Strict Mode

The server can operate in two modes:

#### Non-Strict Mode (Default)

In non-strict mode, the server logs warnings but allows handler registration even when capabilities are not declared:

```typescript
const server = new LSPServer({
  strictCapabilities: false // default
});

server.setCapabilities({
  hoverProvider: true
  // definitionProvider NOT declared
});

// ✅ Allowed - capability declared
server.onRequest('textDocument/hover', async (params) => {
  return { contents: 'Hover text' };
});

// ⚠️  Warning logged, but handler is registered
server.onRequest('textDocument/definition', async (params) => {
  return { uri: params.textDocument.uri, range: ... };
});
```

#### Strict Mode

In strict mode, the server throws an error if you try to register a handler for an undeclared capability:

```typescript
const server = new LSPServer({
  strictCapabilities: true
});

server.setCapabilities({
  hoverProvider: true
  // definitionProvider NOT declared
});

// ✅ Allowed - capability declared
server.onRequest('textDocument/hover', async (params) => {
  return { contents: 'Hover text' };
});

// ❌ Throws error: "Cannot register handler for textDocument/definition"
server.onRequest('textDocument/definition', async (params) => {
  return { uri: params.textDocument.uri, range: ... };
});
```

### Lifecycle Methods Always Allowed

The following lifecycle and notification methods are always allowed regardless of capabilities:

- `initialize` /`initialized`
- `shutdown` / `exit`
- `$/cancelRequest`
- Text document synchronization: `didOpen`, `didChange`, `didClose`, `didSave`

### Capability Mapping

The server maps LSP methods to their corresponding capability keys:

| Method | Capability Key |
|--------|----------------|
| `textDocument/hover` | `hoverProvider` |
| `textDocument/completion` | `completionProvider` |
| `textDocument/definition` | `definitionProvider` |
| `textDocument/references` | `referencesProvider` |
| `textDocument/documentHighlight` | `documentHighlightProvider` |
| ...and 40+ more mappings |

See [packages/server/src/capability-guard.ts](../packages/server/src/capability-guard.ts) for the complete mapping.

## Client-Side Dynamic Methods

### How It Works

After connecting to a server, the client dynamically exposes methods based on the server's declared capabilities:

```typescript
const client = new LSPClient({ name: 'my-client' });
await client.connect(transport);

// Check server capabilities
console.log('Server capabilities:', client.serverCapabilities);

// Methods only exist if server declares capability
if ('hover' in client.textDocument) {
  const result = await client.textDocument.hover({
    textDocument: { uri: 'file:///example.ts' },
    position: { line: 10, character: 5 }
  });
}
```

### Listing Available Methods

You can introspect which methods are available:

```typescript
const methods = Object.keys(client.textDocument).filter(
  key => typeof client.textDocument[key] === 'function'
);
console.log('Available textDocument methods:', methods);
// Output might be: ['hover', 'completion', 'definition']
```

### Runtime Proxy Behavior

The client uses JavaScript Proxy objects to dynamically control method visibility:

- **`has` operator**: Returns `true` only if method is supported
- **Property access**: Returns function only if capability enabled
- **`Object.keys()`**: Lists only enabled methods
- **Missing capabilities**: Returns `undefined` for unsupported methods

### Implementation Details

The proxies check `serverCapabilities` on every access:

```typescript
// Proxy checks if hoverProvider capability exists
client.textDocument.hover // Returns function or undefined

// After server declares hoverProvider: true
client.serverCapabilities.hoverProvider; // true
typeof client.textDocument.hover; // 'function'

// If hoverProvider not declared
client.serverCapabilities.hoverProvider; // undefined
typeof client.textDocument.hover; // 'undefined'
```

## Migration Guide

### Updating Tests

Tests that mock server responses now need to include capabilities:

**Before:**
```typescript
transport.simulateMessage({
  jsonrpc: '2.0',
  id: 1,
  result: {
    capabilities: {} // Empty capabilities
  }
});
```

**After:**
```typescript
transport.simulateMessage({
  jsonrpc: '2.0',
  id: 1,
  result: {
    capabilities: {
      hoverProvider: true,
      completionProvider: { triggerCharacters: ['.'] },
      // Declare all capabilities your test needs
    }
  }
});
```

### Handling Optional Methods

**Recommended: Use Type Guards**

The SDK provides type guards that enable TypeScript to narrow types:

```typescript
import { hasHoverCapability, hasCompletionCapability } from '@lspy/client';

// Type guard narrows the type - TypeScript knows hover exists!
if (hasHoverCapability(client)) {
  const result = await client.textDocument.hover(params);
  // No TypeScript errors, full autocomplete support
}

// Check server capabilities directly
import { hasServerCapability } from '@lspy/client';

if (hasServerCapability(client, 'hoverProvider')) {
  // TypeScript knows server has hoverProvider capability
  console.log(client.serverCapabilities.hoverProvider); // Type-safe
}
```

**Alternative: Runtime Checks**

```typescript
// Option 1: Check with 'in' operator
if ('hover' in client.textDocument) {
  const result = await client.textDocument.hover(params);
}

// Option 2: Optional chaining (TypeScript)
const result = await client.textDocument.hover?.(params);

// Option 3: Fallback to sendRequest
const result = client.textDocument.hover
  ? await client.textDocument.hover(params)
  : await client.sendRequest('textDocument/hover', params);
```

### Available Type Guards

The SDK exports these type guards from `@lspy/client`:

- `hasServerCapability(client, 'capabilityName')` - Check any server capability
- `hasHoverCapability(client)` - Check hover support
- `hasCompletionCapability(client)` - Check completion support
- `hasDefinitionCapability(client)` - Check definition support
- `hasReferencesCapability(client)` - Check references support
- `hasDocumentHighlightCapability(client)` - Check highlight support
- `hasDocumentSymbolCapability(client)` - Check document symbol support
- `hasCodeActionCapability(client)` - Check code action support
- `hasWorkspaceSymbolCapability(client)` - Check workspace symbol support
- `hasMethod(obj, 'methodName')` - Generic method availability check

Each type guard returns a narrowed type that includes the properly-typed methods from the `ClientSendMethods` type transformation, ensuring both runtime safety and compile-time type checking.

## Benefits

1. **Type Safety**: Compile-time types match runtime behavior
2. **Early Error Detection**: Catch capability mismatches immediately
3. **Self-Documenting**: Available methods clearly indicate server capabilities
4. **Flexible**: Choose strict or permissive validation
5. **Introspectable**: Easily discover what methods are available

## Implementation Files

- [packages/core/src/protocol/capability-methods.ts](../packages/core/src/protocol/capability-methods.ts) - Type transformations
- [packages/client/src/capability-proxy.ts](../packages/client/src/capability-proxy.ts) - Client proxy implementation
- [packages/server/src/capability-guard.ts](../packages/server/src/capability-guard.ts) - Server validation
- [packages/server/test/integration/capability-aware.test.ts](../packages/server/test/integration/capability-aware.test.ts) - Integration tests

## Examples

Complete working examples:

- [examples/capability-aware-server.ts](../examples/capability-aware-server.ts) - Server with strict validation
- [examples/capability-aware-client.ts](../examples/capability-aware-client.ts) - Client with dynamic methods
