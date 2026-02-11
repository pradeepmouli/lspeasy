# Dynamic Typing in LSPeasy

## Overview

LSPeasy provides **dynamic, capability-aware typing** for both LSP clients and servers. This means that the TypeScript compiler can enforce which LSP methods are available based on the declared capabilities, providing compile-time safety and better IDE autocomplete.

## How It Works

### Type-Level Magic

LSPeasy uses TypeScript's advanced type system features including:
- **Conditional types** - Methods are only included if the required capability is present
- **Mapped types** - Transform LSP protocol definitions into method signatures
- **Declaration merging** - Extend classes with dynamic interface definitions

### Runtime Method Injection

When capabilities are declared:
- **Client**: After `connect()`, methods are injected based on server capabilities received
- **Server**: After `setCapabilities()`, handler methods are injected based on declared capabilities

## Usage Examples

### Client with Dynamic Typing

```typescript
import { LSPClient } from '@lspeasy/client';
import type { ClientCapabilities, ServerCapabilities } from '@lspeasy/core';

// Define the server capabilities you expect
type MyServerCapabilities = {
  hoverProvider: true;
  completionProvider: {
    triggerCharacters: ['.', ':'];
  };
  // Note: definitionProvider is NOT included
};

// Create client with typed capabilities
const client = new LSPClient<ClientCapabilities, MyServerCapabilities>();

// After connect():
await client.connect(transport);

// ✅ These methods ARE available (hover & completion in capabilities):
const hoverResult = await client.textDocument.hover({
  textDocument: { uri: 'file:///example.ts' },
  position: { line: 10, character: 5 }
});

const completions = await client.textDocument.completion({
  textDocument: { uri: 'file:///example.ts' },
  position: { line: 10, character: 5 }
});

// ❌ This would be a TYPE ERROR (definition not in capabilities):
// const definition = await client.textDocument.definition(...);
//                                              ^^^^^^^^^^ - Property does not exist
```

### Server with Dynamic Typing

```typescript
import { LSPServer } from '@lspeasy/server';

// Define capabilities you want to implement
type MyServerCapabilities = {
  hoverProvider: true;
  completionProvider: {
    triggerCharacters: ['.'];
  };
};

const server = new LSPServer<MyServerCapabilities>();

// Declare capabilities (this initializes dynamic methods)
server.setCapabilities({
  hoverProvider: true,
  completionProvider: {
    triggerCharacters: ['.']
  }
});

// ✅ These handler methods ARE available:
server.textDocument.onHover(async (params) => {
  // params is automatically typed as HoverParams
  return {
    contents: `Hover at ${params.position.line}:${params.position.character}`
  };
});

server.textDocument.onCompletion(async (params) => {
  // params is automatically typed as CompletionParams
  return {
    isIncomplete: false,
    items: []
  };
});

// ❌ This would be a TYPE ERROR (definition not in capabilities):
// server.textDocument.onDefinition(...);
//                    ^^^^^^^^^^^^ - Property does not exist

// Traditional method (always available):
server.onRequest('textDocument/hover', async (params) => {
  // params is auto-typed even with traditional approach
  return { contents: 'Hover text' };
});
```

## Benefits

### 1. **Compile-Time Safety**

The TypeScript compiler prevents you from:
- Calling methods for capabilities you haven't declared
- Registering handlers for features your server doesn't support
- Using incorrect parameter types

### 2. **Better IDE Experience**

Your IDE will:
- Only suggest methods that are actually available
- Provide accurate type information for parameters and return values
- Catch errors before you run your code

### 3. **Self-Documenting Code**

The type signatures clearly show:
- What capabilities your client expects from a server
- What features your server implements
- The exact shape of request/response data

### 4. **Runtime Validation**

The library also provides runtime checks:
- Server warns when handlers are registered for unsupported capabilities
- Client rejects requests when server doesn't support the feature

## Advanced Usage

### Partial Capabilities

You can use partial capability types for flexibility:

```typescript
type MyPartialCaps = Partial<ServerCapabilities> & {
  hoverProvider: true; // This one is required
};

const client = new LSPClient<ClientCapabilities, MyPartialCaps>();
```

### Full Capabilities

For maximum flexibility, use full capability types:

```typescript
// Client accepts any server capability configuration
const client = new LSPClient<ClientCapabilities, ServerCapabilities>();

// Server can implement any capability
const server = new LSPServer<ServerCapabilities>();
```

### Type Narrowing

After initialization, you can narrow types based on runtime capabilities:

```typescript
const client = new LSPClient();
await client.connect(transport);

const serverCaps = client.getServerCapabilities();
if (serverCaps?.hoverProvider) {
  // TypeScript knows hover is available here
  await client.textDocument.hover(params);
}
```

## Implementation Details

### Type Definitions

The dynamic types are defined in `@lspeasy/core`:

- **`Client<ClientCaps, ServerCaps>`** - Intersection of client handlers and send methods
- **`Server<ClientCaps, ServerCaps>`** - Intersection of server handlers and send methods
- **`ClientSendMethods<ServerCaps>`** - Client methods for sending to server
- **`ServerHandlers<ServerCaps>`** - Server handler registration methods

### Declaration Merging

Both `LSPClient` and `LSPServer` use declaration merging to extend their classes:

```typescript
// Client
export interface LSPClient<ClientCaps, ServerCaps>
  extends Client<ClientCaps, ServerCaps> {}

export class LSPClient<ClientCaps, ServerCaps> {
  // ... implementation
}

// Server
export interface LSPServer<Capabilities>
  extends Partial<Server<ClientCapabilities, Capabilities>> {}

export class LSPServer<Capabilities> {
  // ... implementation
}
```

### Capability Checking

At runtime, the library checks capabilities before injecting methods:

```typescript
// Checks if server capability exists and is enabled
if (hasCapability(serverCapabilities, 'hoverProvider')) {
  client.textDocument.hover = (params) => client.sendRequest('textDocument/hover', params);
}
```

## Migration from Non-Typed Code

If you have existing code without dynamic typing:

### Before
```typescript
const client = new LSPClient();
// Any method call is allowed, errors only at runtime
await client.sendRequest('textDocument/hover', params);
```

### After
```typescript
type MyCaps = { hoverProvider: true };
const client = new LSPClient<ClientCapabilities, MyCaps>();
// Type-safe method call
await client.textDocument.hover(params);
// Or use traditional approach (still type-safe)
await client.sendRequest('textDocument/hover', params);
```

Both approaches work, but dynamic typing provides better developer experience!
