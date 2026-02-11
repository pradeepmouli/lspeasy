# API Reference

Complete API documentation for all `lspeasy` packages.

## @lspeasy/core

### Transport Interface

```typescript
interface Transport {
  send(message: Message): Promise<void>;
  onMessage(handler: (message: Message) => void): Disposable;
  onError(handler: (error: Error) => void): Disposable;
  onClose(handler: () => void): Disposable;
  close(): Promise<void>;
  isConnected(): boolean;
}
```

#### Transport.send()

Send a message through the transport.

**Parameters:**
- `message: Message` - The JSON-RPC message to send

**Returns:** `Promise<void>`

**Throws:**
- Error if transport is not connected
- Error if message serialization fails

**Example:**
```typescript
await transport.send({
  jsonrpc: '2.0',
  id: 1,
  method: 'initialize',
  params: { /* ... */ }
});
```

#### Transport.onMessage()

Register a handler for incoming messages.

**Parameters:**
- `handler: (message: Message) => void` - Callback for each message

**Returns:** `Disposable` - Call `dispose()` to unregister

**Example:**
```typescript
const disposable = transport.onMessage((message) => {
  console.log('Received:', message);
});

// Later: cleanup
disposable.dispose();
```

#### Transport.onError()

Register a handler for transport errors.

**Parameters:**
- `handler: (error: Error) => void` - Callback for errors

**Returns:** `Disposable`

#### Transport.onClose()

Register a handler for transport closure.

**Parameters:**
- `handler: () => void` - Callback when transport closes

**Returns:** `Disposable`

#### Transport.close()

Close the transport and release resources.

**Returns:** `Promise<void>`

#### Transport.isConnected()

Check if transport is currently connected.

**Returns:** `boolean`

---

### StdioTransport

Transport implementation using stdin/stdout.

```typescript
class StdioTransport implements Transport {
  constructor(options?: StdioTransportOptions);
}

interface StdioTransportOptions {
  input?: NodeJS.ReadableStream;   // Default: process.stdin
  output?: NodeJS.WritableStream;  // Default: process.stdout
}
```

**Example:**
```typescript
import { StdioTransport } from '@lspeasy/core';

// Use default stdin/stdout
const transport = new StdioTransport();

// Or use custom streams
import { spawn } from 'node:child_process';

const proc = spawn('language-server', ['--stdio']);
const transport = new StdioTransport({
  input: proc.stdout,
  output: proc.stdin
});
```

---

### Message Types

```typescript
type Message = RequestMessage | ResponseMessage | NotificationMessage;

interface RequestMessage {
  jsonrpc: '2.0';
  id: number | string;
  method: string;
  params?: any;
}

interface ResponseMessage {
  jsonrpc: '2.0';
  id: number | string;
  result?: any;
  error?: ResponseError;
}

interface NotificationMessage {
  jsonrpc: '2.0';
  method: string;
  params?: any;
}

interface ResponseError {
  code: number;
  message: string;
  data?: any;
}
```

---

### Utilities

#### CancellationToken

```typescript
interface CancellationToken {
  readonly isCancellationRequested: boolean;
  onCancellationRequested(handler: () => void): Disposable;
}

class CancellationTokenSource {
  readonly token: CancellationToken;
  cancel(): void;
  dispose(): void;
}
```

**Example:**
```typescript
const tokenSource = new CancellationTokenSource();

// Pass token to cancellable operation
someAsyncOperation(params, tokenSource.token);

// Cancel if needed
tokenSource.cancel();

// Cleanup
tokenSource.dispose();
```

#### Logger

```typescript
interface Logger {
  trace(message: string, data?: any): void;
  debug(message: string, data?: any): void;
  info(message: string, data?: any): void;
  warn(message: string, data?: any): void;
  error(message: string, data?: any): void;
}

enum LogLevel {
  Trace = 0,
  Debug = 1,
  Info = 2,
  Warn = 3,
  Error = 4
}

class ConsoleLogger implements Logger {
  constructor(level?: LogLevel);
}

class NullLogger implements Logger {
  // No-op logger for testing
}
```

#### Disposable

```typescript
interface Disposable {
  dispose(): void;
}

class DisposableStore {
  add(disposable: Disposable): void;
  dispose(): void;
}
```

---

## @lspeasy/server

### LSPServer

Main server class for handling LSP requests.

```typescript
class LSPServer {
  constructor(options?: ServerOptions);

  // Lifecycle
  listen(transport: Transport): Promise<void>;
  shutdown(): Promise<void>;
  isRunning(): boolean;

  // Handler registration
  onRequest<M extends LSPRequestMethod>(
    method: M,
    handler: (params: InferRequestParams<M>, context: RequestContext) =>
      Promise<InferRequestResult<M>> | InferRequestResult<M>
  ): Disposable;

  onNotification<M extends LSPNotificationMethod>(
    method: M,
    handler: (params: InferNotificationParams<M>, context: NotificationContext) => void
  ): Disposable;

  // Server capabilities
  getCapabilities(): ServerCapabilities;

  // Send to client
  sendRequest<Params, Result>(
    method: string,
    params: Params
  ): Promise<Result>;

  sendNotification<Params>(
    method: string,
    params: Params
  ): Promise<void>;
}
```

### ServerOptions

```typescript
interface ServerOptions {
  // Server identification
  name?: string;
  version?: string;

  // Server capabilities
  capabilities?: ServerCapabilities;

  // Logging
  logger?: Logger;
  logLevel?: LogLevel;
}
```

### Handler Contexts

```typescript
interface RequestContext {
  transport: Transport;
  requestId: number | string;
  method: string;
}

interface NotificationContext {
  transport: Transport;
  method: string;
}
```

### Usage Examples

#### Basic Server

```typescript
import { LSPServer } from '@lspeasy/server';
import { StdioTransport } from '@lspeasy/core';

const server = new LSPServer({
  name: 'my-language-server',
  version: '1.0.0',
  capabilities: {
    textDocumentSync: 1,
    hoverProvider: true
  }
});

// Register hover handler
server.onRequest('textDocument/hover', async (params) => {
  return {
    contents: `Hover for ${params.textDocument.uri}`
  };
});

// Listen on stdio
const transport = new StdioTransport();
await server.listen(transport);
```

#### Advanced Handler

```typescript
// With context and error handling
server.onRequest('textDocument/definition', async (params, context) => {
  try {
    const definition = await findDefinition(
      params.textDocument.uri,
      params.position
    );

    if (!definition) {
      return null;  // No definition found
    }

    return {
      uri: definition.uri,
      range: definition.range
    };
  } catch (error) {
    context.logger.error('Definition lookup failed', error);
    throw error;  // Becomes JSON-RPC error
  }
});
```

#### Notification Handler

```typescript
server.onNotification('textDocument/didOpen', (params) => {
  console.log('Document opened:', params.textDocument.uri);
  // Index document, run diagnostics, etc.
});
```

---

## @lspeasy/client

### LSPClient

Main client class for connecting to LSP servers.

```typescript
class LSPClient<ServerCapabilities = any> {
  constructor(options?: ClientOptions);

  // Connection lifecycle
  connect(transport: Transport): Promise<InitializeResult>;
  disconnect(): Promise<void>;
  isConnected(): boolean;

  // Low-level requests
  sendRequest<Params, Result>(
    method: string,
    params: Params,
    token?: CancellationToken
  ): Promise<Result>;

  sendNotification<Params>(
    method: string,
    params: Params
  ): Promise<void>;

  sendCancellableRequest<Params, Result>(
    method: string,
    params: Params
  ): CancellableRequest<Result>;

  // Server-to-client handlers
  onRequest<Params, Result>(
    method: string,
    handler: (params: Params) => Promise<Result> | Result
  ): Disposable;

  onNotification<Params>(
    method: string,
    handler: (params: Params) => void
  ): Disposable;

  // Events
  onConnected(handler: () => void): Disposable;
  onDisconnected(handler: () => void): Disposable;
  onError(handler: (error: Error) => void): Disposable;

  // Server info
  getServerCapabilities(): ServerCapabilities | undefined;
  getServerInfo(): { name: string; version?: string } | undefined;

  // High-level APIs
  readonly textDocument: TextDocumentRequests;
  readonly workspace: WorkspaceRequests;
}
```

### ClientOptions

```typescript
interface ClientOptions {
  // Client identification
  name?: string;
  version?: string;

  // Client capabilities
  capabilities?: ClientCapabilities;

  // Logging
  logger?: Logger;
  logLevel?: LogLevel;

  // Error handling
  onValidationError?: (error: ZodError, response: ResponseMessage) => void;
}
```

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

### CancellableRequest

```typescript
interface CancellableRequest<T> {
  promise: Promise<T>;
  cancel: () => void;
}
```

### High-Level APIs

#### TextDocument Methods

```typescript
interface TextDocumentRequests {
  // Language features
  hover(params: HoverParams): Promise<Hover | null>;
  completion(params: CompletionParams): Promise<CompletionList | CompletionItem[] | null>;
  definition(params: DefinitionParams): Promise<Definition | null>;
  references(params: ReferenceParams): Promise<Location[] | null>;
  documentSymbol(params: DocumentSymbolParams): Promise<DocumentSymbol[] | SymbolInformation[] | null>;

  // Document synchronization
  didOpen(params: DidOpenTextDocumentParams): Promise<void>;
  didChange(params: DidChangeTextDocumentParams): Promise<void>;
  didClose(params: DidCloseTextDocumentParams): Promise<void>;
  didSave(params: DidSaveTextDocumentParams): Promise<void>;
}
```

#### Workspace Methods

```typescript
interface WorkspaceRequests {
  symbol(params: WorkspaceSymbolParams): Promise<SymbolInformation[] | null>;
  didChangeWorkspaceFolders(params: DidChangeWorkspaceFoldersParams): Promise<void>;
  didChangeConfiguration(params: DidChangeConfigurationParams): Promise<void>;
  didChangeWatchedFiles(params: DidChangeWatchedFilesParams): Promise<void>;
}
```

### Usage Examples

#### Basic Client

```typescript
import { LSPClient } from '@lspeasy/client';
import { StdioTransport } from '@lspeasy/core';
import { spawn } from 'node:child_process';

// Spawn language server
const serverProcess = spawn('typescript-language-server', ['--stdio']);

// Create transport
const transport = new StdioTransport({
  input: serverProcess.stdout,
  output: serverProcess.stdin
});

// Create and connect client
const client = new LSPClient({
  name: 'my-editor',
  version: '1.0.0',
  capabilities: {
    textDocument: {
      hover: {
        contentFormat: ['markdown']
      }
    }
  }
});

const initResult = await client.connect(transport);
console.log('Connected to:', initResult.serverInfo);
```

#### Using High-Level API

```typescript
// Open document
await client.textDocument.didOpen({
  textDocument: {
    uri: 'file:///path/to/file.ts',
    languageId: 'typescript',
    version: 1,
    text: 'const x = 1;'
  }
});

// Get hover information
const hover = await client.textDocument.hover({
  textDocument: { uri: 'file:///path/to/file.ts' },
  position: { line: 0, character: 6 }
});

if (hover) {
  console.log('Hover:', hover.contents);
}

// Get completions
const completions = await client.textDocument.completion({
  textDocument: { uri: 'file:///path/to/file.ts' },
  position: { line: 0, character: 10 }
});

if (completions) {
  const items = 'items' in completions ? completions.items : completions;
  console.log('Completions:', items.map(i => i.label));
}
```

#### Cancellable Request

```typescript
const { promise, cancel } = client.sendCancellableRequest(
  'textDocument/completion',
  {
    textDocument: { uri: 'file:///file.ts' },
    position: { line: 0, character: 5 }
  }
);

// Cancel after 1 second
setTimeout(() => cancel(), 1000);

try {
  const result = await promise;
  console.log('Result:', result);
} catch (error) {
  if (error.message === 'Request was cancelled') {
    console.log('Request was cancelled');
  }
}
```

#### Handle Server Notifications

```typescript
client.onNotification('textDocument/publishDiagnostics', (params) => {
  console.log(`Diagnostics for ${params.uri}:`);
  params.diagnostics.forEach(d => {
    console.log(`  Line ${d.range.start.line}: ${d.message}`);
  });
});
```

#### Handle Server Requests

```typescript
client.onRequest('workspace/configuration', async (params) => {
  // Server asking for configuration
  return {
    settings: {
      typescript: {
        suggest: { enabled: true }
      }
    }
  };
});
```

#### Event Handlers

```typescript
client.onConnected(() => {
  console.log('Connected to server');
});

client.onDisconnected(() => {
  console.log('Disconnected from server');
});

client.onError((error) => {
  console.error('Transport error:', error);
});
```

#### Graceful Shutdown

```typescript
try {
  // Send shutdown request
  await client.disconnect();
  console.log('Client disconnected gracefully');
} catch (error) {
  console.error('Error during disconnect:', error);
}
```

---

## Type Inference

The SDK provides type inference for LSP methods:

```typescript
import type {
  LSPRequestMethod,
  LSPNotificationMethod,
  InferRequestParams,
  InferRequestResult,
  InferNotificationParams
} from '@lspeasy/core';

// Method name → Param types
type HoverParams = InferRequestParams<'textDocument/hover'>;

// Method name → Result types
type HoverResult = InferRequestResult<'textDocument/hover'>;

// Method name → Notification params
type DidOpenParams = InferNotificationParams<'textDocument/didOpen'>;
```

---

## Error Codes

Standard JSON-RPC error codes:

```typescript
enum JSONRPCErrorCode {
  ParseError = -32700,
  InvalidRequest = -32600,
  MethodNotFound = -32601,
  InvalidParams = -32602,
  InternalError = -32603,
  ServerNotInitialized = -32002,
  UnknownErrorCode = -32001,
  RequestCancelled = -32800,
  ContentModified = -32801,
  ServerCancelled = -32802,
}
```

---

## Best Practices

### Resource Management

Always dispose resources when done:

```typescript
const disposables: Disposable[] = [];

// Register handlers
disposables.push(server.onRequest('method1', handler1));
disposables.push(server.onRequest('method2', handler2));

// Cleanup
disposables.forEach(d => d.dispose());
```

### Error Handling

Handle errors at appropriate levels:

```typescript
// Transport level
transport.onError((error) => {
  console.error('Transport error, attempting reconnect:', error);
  reconnect();
});

// Request level
try {
  const result = await client.sendRequest('method', params);
} catch (error) {
  console.error('Request failed:', error);
}

// Handler level
server.onRequest('method', async (params) => {
  try {
    return await processRequest(params);
  } catch (error) {
    logger.error('Handler error:', error);
    throw error;  // Propagate as JSON-RPC error
  }
});
```

### Memory Leaks

Prevent memory leaks:

1. Dispose handlers when done
2. Cancel pending requests on disconnect
3. Close transports to release resources
4. Use DisposableStore for bulk cleanup

```typescript
const store = new DisposableStore();

store.add(server.onRequest('method1', handler1));
store.add(server.onRequest('method2', handler2));
store.add(transport.onError(errorHandler));

// Cleanup all at once
store.dispose();
```

### Testing

Mock transports for testing:

```typescript
import { PassThrough } from 'node:stream';

const inputStream = new PassThrough();
const outputStream = new PassThrough();

const transport = new StdioTransport({
  input: inputStream,
  output: outputStream
});

// Simulate server responses
inputStream.write(Buffer.from('Content-Length: 50\r\n\r\n{"jsonrpc":"2.0","id":1,"result":{}}'));
```

---

## Migration Guide

### From vscode-languageserver

```typescript
// Before (vscode-languageserver)
import { createConnection, TextDocuments } from 'vscode-languageserver/node';

const connection = createConnection();
const documents = new TextDocuments();

connection.onHover((params) => {
  return { contents: 'hover' };
});

connection.listen();

// After (lspeasy)
import { LSPServer } from '@lspeasy/server';
import { StdioTransport } from '@lspeasy/core';

const server = new LSPServer();
const transport = new StdioTransport();

server.onRequest('textDocument/hover', async (params) => {
  return { contents: 'hover' };
});

await server.listen(transport);
```

### From Custom Implementation

```typescript
// If you have custom JSON-RPC implementation:
// 1. Replace with @lspeasy/core Transport
// 2. Use LSPServer/LSPClient for protocol handling
// 3. Keep your business logic unchanged

// Your existing logic
function processHover(uri: string, position: Position) {
  // ...
}

// Wrap in LSP handler
server.onRequest('textDocument/hover', async (params) => {
  return processHover(params.textDocument.uri, params.position);
});
```

---

## Performance Tips

1. **Reuse transports**: Don't create new transport for each request
2. **Batch notifications**: Group related notifications when possible
3. **Cancel unused requests**: Always cancel requests you no longer need
4. **Dispose handlers**: Remove handlers for unused methods
5. **Use streaming**: Process large results incrementally (future feature)

---

## Debugging

Enable debug logging:

```typescript
import { LogLevel } from '@lspeasy/core';

const server = new LSPServer({
  logLevel: LogLevel.Debug
});

const client = new LSPClient({
  logLevel: LogLevel.Debug
});
```

This will log all requests, responses, and internal operations.
