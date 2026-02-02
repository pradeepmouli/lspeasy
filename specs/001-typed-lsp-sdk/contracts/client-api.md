# API Contract: @lspeasy/client

**Package**: @lspeasy/client
**Version**: 1.0.0
**Purpose**: Public API for connecting to LSP servers

---

## Main Exports

### LSPClient Class

Primary class for creating and managing LSP client connections.

**Generic Type Parameter** (optional): Type-check requests against server capabilities if known at compile time.

```typescript
class LSPClient<ServerCapabilities extends Partial<ServerCapabilities> = ServerCapabilities>
```

**Example**: Client that knows server only supports hover and completion:
```typescript
const client = new LSPClient<{ hoverProvider: true; completionProvider: true }>();
// await client.textDocument.hover(...) - ✅ type-checked
// await client.textDocument.definition(...) - ⚠️ falls back to generic, no capability enforcement
// await client.sendRequest('textDocument/definition', ...) - ✅ still works via generic overload
```

#### Constructor

```typescript
constructor(options?: ClientOptions)

interface ClientOptions {
  // Client identification (sent in initialize request)
  name?: string;
  version?: string;

  // Client capabilities to advertise
  capabilities?: ClientCapabilities;

  // Logging configuration (MCP SDK style)
  logger?: Logger;
  logLevel?: 'trace' | 'debug' | 'info' | 'warn' | 'error';

  // Response validation error handling
  onValidationError?: (error: ZodError, response: ResponseMessage) => void;
}
```

#### Connection Methods

```typescript
// Connect to server and complete initialization handshake
connect(transport: Transport): Promise<InitializeResult>

// Disconnect from server (sends shutdown + exit)
disconnect(): Promise<void>

// Check connection status
isConnected(): boolean
```

#### High-Level Request Methods

Organized by LSP capability for discoverability. **Capability-aware**: If `ServerCapabilities` generic is specified, only methods corresponding to declared capabilities are fully type-checked.

```typescript
// Text Document Synchronization (always available)
textDocument.didOpen(params: DidOpenTextDocumentParams): Promise<void>
textDocument.didChange(params: DidChangeTextDocumentParams): Promise<void>
textDocument.didClose(params: DidCloseTextDocumentParams): Promise<void>

// Language Features (capability-gated if ServerCapabilities specified)
textDocument.hover(params: HoverParams): Promise<Hover | null>
  // Available when: ServerCapabilities['hoverProvider'] = true

textDocument.completion(params: CompletionParams): Promise<CompletionList | CompletionItem[]>
  // Available when: ServerCapabilities['completionProvider'] != false

textDocument.definition(params: DefinitionParams): Promise<Definition | null>
  // Available when: ServerCapabilities['definitionProvider'] = true

textDocument.references(params: ReferenceParams): Promise<Location[] | null>
  // Available when: ServerCapabilities['referencesProvider'] = true

textDocument.documentSymbol(params: DocumentSymbolParams): Promise<DocumentSymbol[] | SymbolInformation[] | null>
  // Available when: ServerCapabilities['documentSymbolProvider'] = true

// Workspace Operations
workspace.didChangeWorkspaceFolders(params: DidChangeWorkspaceFoldersParams): Promise<void>
workspace.symbol(params: WorkspaceSymbolParams): Promise<SymbolInformation[] | null>
  // Available when: ServerCapabilities['workspaceSymbolProvider'] = true

// ... more LSP 3.17 methods

// Note: Low-level sendRequest() always available for all methods (generic fallback)
```

#### Low-Level Request Methods

```typescript
// Strongly-typed request (with method-to-type inference)
sendRequest<M extends LSPRequestMethod>(
  method: M,
  params: InferRequestParams<M>
): Promise<InferRequestResult<M>>

// Generic request (for custom or experimental methods)
sendRequest<Params = any, Result = any>(
  method: string,
  params: Params,
  token?: CancellationToken
): Promise<Result>

// Strongly-typed notification (with method-to-type inference)
sendNotification<M extends LSPNotificationMethod>(
  method: M,
  params: InferNotificationParams<M>
): Promise<void>

// Generic notification (for custom or experimental methods)
sendNotification<Params = any>(
  method: string,
  params: Params
): Promise<void>

// Examples with strict typing:
await client.sendRequest('textDocument/hover', {
  textDocument: { uri: 'file:///test.ts' },
  position: { line: 0, character: 5 }
}); // Returns: Promise<Hover | null> (inferred from LSPRequest.TextDocument.Hover)

await client.sendRequest('textDocument/documentSymbol', {
  textDocument: { uri: 'file:///test.ts' }
}); // Returns: Promise<DocumentSymbol[] | SymbolInformation[] | null>

await client.sendNotification('textDocument/didOpen', {
  textDocument: {
    uri: 'file:///test.ts',
    languageId: 'typescript',
    version: 1,
    text: 'const x = 1;'
  }
}); // Params strictly typed as DidOpenTextDocumentParams (inferred)

// Request with cancellation
sendCancellableRequest<M extends LSPRequestMethod>(
  method: M,
  params: InferRequestParams<M>
): {
  promise: Promise<InferRequestResult<M>>;
  cancel: () => void;
}
```

#### Server-to-Client Requests

Handle requests initiated by server:

```typescript
// Strongly-typed handler for server requests
onRequest<M extends LSPRequestMethod>(
  method: M,
  handler: (params: InferRequestParams<M>) => Promise<InferRequestResult<M>> | InferRequestResult<M>
): Disposable

// Generic handler for custom server requests
onRequest<Params = any, Result = any>(
  method: string,
  handler: (params: Params) => Promise<Result> | Result
): Disposable

// Example: Handle workspace/applyEdit from server
client.onRequest('workspace/applyEdit', async (params) => {
  // params: ApplyWorkspaceEditParams (inferred from LSPRequest.Workspace.ApplyEdit)
  // return type enforced: ApplyWorkspaceEditResult
  return { applied: true };
});
```

#### Event Subscriptions

```typescript
// Connection lifecycle
onConnected(handler: () => void): Disposable
onDisconnected(handler: () => void): Disposable
onError(handler: (error: Error) => void): Disposable

// Server notifications
onNotification<Params>(
  method: string,
  handler: (params: Params) => void
): Disposable

// Example: Listen for diagnostics
client.onNotification('textDocument/publishDiagnostics', (params: PublishDiagnosticsParams) => {
  console.log(`Diagnostics for ${params.uri}:`, params.diagnostics);
});
```

---

## Type Definitions

### InitializeResult

```typescript
interface InitializeResult {
  capabilities: ServerCapabilities;
  serverInfo?: {
    name: string;
    version?: string;
  };
}
```

### ServerCapabilities

```typescript
// Re-exported from @lspeasy/core/protocol
interface ServerCapabilities {
  textDocumentSync?: TextDocumentSyncOptions | TextDocumentSyncKind;
  hoverProvider?: boolean | HoverOptions;
  completionProvider?: CompletionOptions;
  definitionProvider?: boolean | DefinitionOptions;
  // ... 30+ capability fields
}
```

---

## Usage Example

```typescript
import { LSPClient } from '@lspeasy/client';
import { StdioTransport } from '@lspeasy/core';

// Create client
const client = new LSPClient({
  name: 'my-editor',
  version: '1.0.0',
  capabilities: {
    textDocument: {
      hover: {
        contentFormat: ['markdown', 'plaintext']
      }
    }
  }
});

// Connect to language server
const transport = new StdioTransport({
  command: 'typescript-language-server',
  args: ['--stdio']
});

const initResult = await client.connect(transport);
console.log('Server capabilities:', initResult.capabilities);

// Send textDocument/didOpen notification
await client.textDocument.didOpen({
  textDocument: {
    uri: 'file:///path/to/file.ts',
    languageId: 'typescript',
    version: 1,
    text: 'const x = 42;'
  }
});

// Request hover information
const hover = await client.textDocument.hover({
  textDocument: { uri: 'file:///path/to/file.ts' },
  position: { line: 0, character: 6 }
});

if (hover) {
  console.log('Hover:', hover.contents);
}

// Disconnect
await client.disconnect();
```

---

## Error Handling Contract

### Automatic Behaviors

| Condition | Behavior |
|-----------|----------|
| Request before connect() | Throws `ClientNotConnectedError` |
| Response validation failure | Throws `ValidationError` with Zod details (or calls onValidationError) |
| Server returns error response | Throws `ResponseError` with code/message/data |
| Transport disconnects | Emits onDisconnected event, rejects pending requests |
| Timeout (if configured) | Throws `TimeoutError`, sends cancellation |

### Error Types

```typescript
class ClientNotConnectedError extends Error {
  constructor(message = 'Client not connected to server');
}

class ResponseError extends Error {
  constructor(code: number, message: string, data?: any);
  code: number;
  data?: any;
}

class ValidationError extends Error {
  constructor(message: string, zodError: ZodError);
  zodError: ZodError;
}
```

---

## Validation Contract

### Response Validation

- All server responses validated against Zod schemas before returning to caller
- Invalid responses trigger `ValidationError` (or `onValidationError` callback)
- Validation errors include full Zod error details for debugging

### Type Safety

- All request methods return properly typed responses
- Compile-time checks ensure params match LSP specification
- Capability-based method availability (future: check serverCapabilities before request)

---

## Performance Contract

- Request round-trip overhead: <2ms (excludes network/server processing)
- Response validation: <1ms (p95) for typical responses
- Memory: <30MB baseline per client instance
- Supports 1000+ concurrent pending requests

---

## Compatibility Contract

### LSP Version Support

- Primary: LSP 3.17 (full support)
- Backward compatible: LSP 3.16 (most features)
- Forward compatible: Unknown capabilities/methods gracefully ignored

### Server Compatibility

Tested against:
- typescript-language-server
- rust-analyzer
- pyright
- Any compliant LSP 3.17 server

---

## Breaking Change Policy

- Method signature changes: MAJOR version bump
- New optional parameters: MINOR version bump
- Removed deprecated methods: MAJOR version (with 1 minor version deprecation period)
- Response type changes: MAJOR version bump
