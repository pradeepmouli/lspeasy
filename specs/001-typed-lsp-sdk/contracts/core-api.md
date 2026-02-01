# API Contract: @lspeasy/core

**Package**: @lspeasy/core
**Version**: 1.0.0
**Purpose**: Shared types, transports, and utilities for LSP SDK

---

## Main Exports

### LSP Method Type Mappings

Hierarchical namespace structure mirroring LSP method organization with extensible metadata.

```typescript
// Request method namespaces (hierarchically organized)
namespace LSPRequest {
  // Text Document methods
  export namespace TextDocument {
    export type Path = 'textDocument';

    export namespace Hover {
      export type Method = 'textDocument/hover';
      export const Method = 'textDocument/hover';  // Runtime constant
      export type Params = HoverParams;  // Re-exported from vscode-languageserver-protocol (type-only)
      export type Result = Hover | null;  // Re-exported from vscode-languageserver-protocol (type-only)
      export type ClientCapability = HoverClientCapabilities;  // Client capability type
      export type ServerCapability = 'hoverProvider';  // Key in ServerCapabilities
      export type Options = HoverOptions;  // Server options for this capability
      export type RegistrationOptions = HoverRegistrationOptions;  // Dynamic registration options
    }

    export namespace Completion {
      export type Method = 'textDocument/completion';
      export const Method = 'textDocument/completion';
      export type Params = CompletionParams;
      export type Result = CompletionList | CompletionItem[] | null;
      export type ClientCapability = CompletionClientCapabilities;
      export type ServerCapability = 'completionProvider';
      export type Options = CompletionOptions;
      export type RegistrationOptions = CompletionRegistrationOptions;
    }

    export namespace DocumentSymbol {
      export type Method = 'textDocument/documentSymbol';
      export const Method = 'textDocument/documentSymbol';
      export type Params = DocumentSymbolParams;
      export type Result = DocumentSymbol[] | SymbolInformation[] | null;
      export type ClientCapability = DocumentSymbolClientCapabilities;
      export type ServerCapability = 'documentSymbolProvider';
      export type Options = DocumentSymbolOptions;
      export type RegistrationOptions = DocumentSymbolRegistrationOptions;
    }

    export namespace Definition {
      export type Method = 'textDocument/definition';
      export const Method = 'textDocument/definition';
      export type Params = DefinitionParams;
      export type Result = Definition | null;
      export type ClientCapability = DefinitionClientCapabilities;
      export type ServerCapability = 'definitionProvider';
      export type Options = DefinitionOptions;
      export type RegistrationOptions = DefinitionRegistrationOptions;
    }

    export namespace References {
      export type Method = 'textDocument/references';
      export const Method = 'textDocument/references';
      export type Params = ReferenceParams;
      export type Result = Location[] | null;
      export type ClientCapability = ReferenceClientCapabilities;
      export type ServerCapability = 'referencesProvider';
      export type Options = ReferenceOptions;
      export type RegistrationOptions = ReferenceRegistrationOptions;
    }

    export namespace Formatting {
      export type Method = 'textDocument/formatting';
      export const Method = 'textDocument/formatting';
      export type Params = DocumentFormattingParams;
      export type Result = TextEdit[] | null;
      export type ClientCapability = DocumentFormattingClientCapabilities;
      export type ServerCapability = 'documentFormattingProvider';
      export type Options = DocumentFormattingOptions;
      export type RegistrationOptions = DocumentFormattingRegistrationOptions;
    }

    export namespace CodeAction {
      export type Method = 'textDocument/codeAction';
      export const Method = 'textDocument/codeAction';
      export type Params = CodeActionParams;
      export type Result = (Command | CodeAction)[] | null;
      export type ClientCapability = CodeActionClientCapabilities;
      export type ServerCapability = 'codeActionProvider';
      export type Options = CodeActionOptions;
      export type RegistrationOptions = CodeActionRegistrationOptions;
    }

    export namespace Rename {
      export type Method = 'textDocument/rename';
      export const Method = 'textDocument/rename';
      export type Params = RenameParams;
      export type Result = WorkspaceEdit | null;
      export type ClientCapability = RenameClientCapabilities;
      export type ServerCapability = 'renameProvider';
      export type Options = RenameOptions;
      export type RegistrationOptions = RenameRegistrationOptions;
    }

    // ... (all textDocument/* methods)
  }

  // Workspace methods
  export namespace Workspace {
    export type Path = 'workspace';

    export namespace Symbol {
      export type Method = 'workspace/symbol';
      export const Method = 'workspace/symbol';
      export type Params = WorkspaceSymbolParams;
      export type Result = SymbolInformation[] | WorkspaceSymbol[] | null;
      export type ClientCapability = WorkspaceSymbolClientCapabilities;
      export type ServerCapability = 'workspaceSymbolProvider';
      export type Options = WorkspaceSymbolOptions;
      export type RegistrationOptions = WorkspaceSymbolRegistrationOptions;
    }

    export namespace ExecuteCommand {
      export type Method = 'workspace/executeCommand';
      export const Method = 'workspace/executeCommand';
      export type Params = ExecuteCommandParams;
      export type Result = any | null;
      export type ClientCapability = ExecuteCommandClientCapabilities;
      export type ServerCapability = 'executeCommandProvider';
      export type Options = ExecuteCommandOptions;
      export type RegistrationOptions = ExecuteCommandRegistrationOptions;
    }

    // ... (all workspace/* methods)
  }

  // Lifecycle methods (top-level, no namespace grouping)
  export namespace Initialize {
    export type Method = 'initialize';
    export type Params = InitializeParams;
    export type Result = InitializeResult;
    export type Capability = never; // Always available
  }

  export namespace Shutdown {
    export type Method = 'shutdown';
    export type Params = void;
    export type Result = null;
    export type Capability = never; // Always available
  }

  // ... (all LSP 3.17 request methods)
}

// Notification method namespaces (hierarchically organized)
namespace LSPNotification {
  // Text Document notifications
  export namespace TextDocument {
    export type Path = 'textDocument';

    export namespace DidOpen {
      export type Method = 'textDocument/didOpen';
      export type Params = DidOpenTextDocumentParams;
    }

    export namespace DidChange {
      export type Method = 'textDocument/didChange';
      export type Params = DidChangeTextDocumentParams;
    }

    export namespace DidClose {
      export type Method = 'textDocument/didClose';
      export type Params = DidCloseTextDocumentParams;
    }

    export namespace DidSave {
      export type Method = 'textDocument/didSave';
      export type Params = DidSaveTextDocumentParams;
    }

    // ... (all textDocument/* notifications)
  }

  // Workspace notifications
  export namespace Workspace {
    export type Path = 'workspace';

    export namespace DidChangeConfiguration {
      export type Method = 'workspace/didChangeConfiguration';
      export type Params = DidChangeConfigurationParams;
    }

    export namespace DidChangeWatchedFiles {
      export type Method = 'workspace/didChangeWatchedFiles';
      export type Params = DidChangeWatchedFilesParams;
    }

    export namespace DidChangeWorkspaceFolders {
      export type Method = 'workspace/didChangeWorkspaceFolders';
      export type Params = DidChangeWorkspaceFoldersParams;
    }

    // ... (all workspace/* notifications)
  }

  // Lifecycle notifications
  export namespace Initialized {
    export type Method = 'initialized';
    export type Params = InitializedParams;
  }

  export namespace Exit {
    export type Method = 'exit';
    export type Params = void;
  }

  // ... (all LSP 3.17 notification methods)
}

// Type utilities to extract params/result from method name
// No manual maps needed - TypeScript infers from namespace structure

type InferRequestParams<M extends string> =
  M extends LSPRequest.TextDocument.Hover.Method ? LSPRequest.TextDocument.Hover.Params :
  M extends LSPRequest.TextDocument.Completion.Method ? LSPRequest.TextDocument.Completion.Params :
  M extends LSPRequest.TextDocument.DocumentSymbol.Method ? LSPRequest.TextDocument.DocumentSymbol.Params :
  M extends LSPRequest.TextDocument.Definition.Method ? LSPRequest.TextDocument.Definition.Params :
  M extends LSPRequest.TextDocument.References.Method ? LSPRequest.TextDocument.References.Params :
  M extends LSPRequest.TextDocument.Formatting.Method ? LSPRequest.TextDocument.Formatting.Params :
  M extends LSPRequest.TextDocument.CodeAction.Method ? LSPRequest.TextDocument.CodeAction.Params :
  M extends LSPRequest.TextDocument.Rename.Method ? LSPRequest.TextDocument.Rename.Params :
  M extends LSPRequest.Workspace.Symbol.Method ? LSPRequest.Workspace.Symbol.Params :
  M extends LSPRequest.Workspace.ExecuteCommand.Method ? LSPRequest.Workspace.ExecuteCommand.Params :
  M extends LSPRequest.Initialize.Method ? LSPRequest.Initialize.Params :
  M extends LSPRequest.Shutdown.Method ? LSPRequest.Shutdown.Params :
  never; // Extend for all LSP request methods

type InferRequestResult<M extends string> =
  M extends LSPRequest.TextDocument.Hover.Method ? LSPRequest.TextDocument.Hover.Result :
  M extends LSPRequest.TextDocument.Completion.Method ? LSPRequest.TextDocument.Completion.Result :
  M extends LSPRequest.TextDocument.DocumentSymbol.Method ? LSPRequest.TextDocument.DocumentSymbol.Result :
  M extends LSPRequest.TextDocument.Definition.Method ? LSPRequest.TextDocument.Definition.Result :
  M extends LSPRequest.TextDocument.References.Method ? LSPRequest.TextDocument.References.Result :
  M extends LSPRequest.TextDocument.Formatting.Method ? LSPRequest.TextDocument.Formatting.Result :
  M extends LSPRequest.TextDocument.CodeAction.Method ? LSPRequest.TextDocument.CodeAction.Result :
  M extends LSPRequest.TextDocument.Rename.Method ? LSPRequest.TextDocument.Rename.Result :
  M extends LSPRequest.Workspace.Symbol.Method ? LSPRequest.Workspace.Symbol.Result :
  M extends LSPRequest.Workspace.ExecuteCommand.Method ? LSPRequest.Workspace.ExecuteCommand.Result :
  M extends LSPRequest.Initialize.Method ? LSPRequest.Initialize.Result :
  M extends LSPRequest.Shutdown.Method ? LSPRequest.Shutdown.Result :
  never; // Extend for all LSP request methods

type InferNotificationParams<M extends string> =
  M extends LSPNotification.TextDocument.DidOpen.Method ? LSPNotification.TextDocument.DidOpen.Params :
  M extends LSPNotification.TextDocument.DidChange.Method ? LSPNotification.TextDocument.DidChange.Params :
  M extends LSPNotification.TextDocument.DidClose.Method ? LSPNotification.TextDocument.DidClose.Params :
  M extends LSPNotification.TextDocument.DidSave.Method ? LSPNotification.TextDocument.DidSave.Params :
  M extends LSPNotification.Workspace.DidChangeConfiguration.Method ? LSPNotification.Workspace.DidChangeConfiguration.Params :
  M extends LSPNotification.Workspace.DidChangeWatchedFiles.Method ? LSPNotification.Workspace.DidChangeWatchedFiles.Params :
  M extends LSPNotification.Workspace.DidChangeWorkspaceFolders.Method ? LSPNotification.Workspace.DidChangeWorkspaceFolders.Params :
  M extends LSPNotification.Initialized.Method ? LSPNotification.Initialized.Params :
  M extends LSPNotification.Exit.Method ? LSPNotification.Exit.Params :
  never; // Extend for all LSP notification methods

// Union types of all valid method names (auto-derived from namespaces)
type LSPRequestMethod =
  | LSPRequest.TextDocument.Hover.Method
  | LSPRequest.TextDocument.Completion.Method
  | LSPRequest.TextDocument.DocumentSymbol.Method
  | LSPRequest.TextDocument.Definition.Method
  | LSPRequest.TextDocument.References.Method
  | LSPRequest.TextDocument.Formatting.Method
  | LSPRequest.TextDocument.CodeAction.Method
  | LSPRequest.TextDocument.Rename.Method
  | LSPRequest.Workspace.Symbol.Method
  | LSPRequest.Workspace.ExecuteCommand.Method
  | LSPRequest.Initialize.Method
  | LSPRequest.Shutdown.Method;
  // ... (all LSP 3.17 request methods)

type LSPNotificationMethod =
  | LSPNotification.TextDocument.DidOpen.Method
  | LSPNotification.TextDocument.DidChange.Method
  | LSPNotification.TextDocument.DidClose.Method
  | LSPNotification.TextDocument.DidSave.Method
  | LSPNotification.Workspace.DidChangeConfiguration.Method
  | LSPNotification.Workspace.DidChangeWatchedFiles.Method
  | LSPNotification.Workspace.DidChangeWorkspaceFolders.Method
  | LSPNotification.Initialized.Method
  | LSPNotification.Exit.Method;
  // ... (all LSP 3.17 notification methods)

/**
 * Type Inference Benefits:
 *
 * 1. Zero manual mapping - types inferred directly from namespace definitions
 * 2. Single source of truth - add a namespace, get automatic type support
 * 3. No map maintenance - InferRequestParams/Result uses conditional types
 * 4. Compile-time validation - invalid method names caught by LSPRequestMethod union
 *
 * Namespace Structure Metadata:
 *
 * Each request method namespace provides comprehensive metadata:
 * - Method (type & const): String literal for method name (runtime & type-level)
 * - Params: Request parameter type from LSP spec
 * - Result: Response result type from LSP spec
 * - ClientCapability: Client capability interface (e.g., HoverClientCapabilities)
 * - ServerCapability: Key in ServerCapabilities object (e.g., 'hoverProvider')
 * - Options: Server options type for the capability (e.g., HoverOptions)
 * - RegistrationOptions: Dynamic registration options (e.g., HoverRegistrationOptions)
 *
 * This structure enables:
 * - Automatic type inference for handlers
 * - Runtime method name validation
 * - Capability negotiation helpers
 * - Dynamic registration support
 * - Clear separation of client vs server capabilities
 *
 * Example usage:
 *   type HoverParams = InferRequestParams<'textDocument/hover'>
 *   // Resolves to: HoverParams from vscode-languageserver-protocol
 *
 *   type HoverResult = InferRequestResult<'textDocument/hover'>
 *   // Resolves to: Hover | null
 *
 *   type HoverServerKey = LSPRequest.TextDocument.Hover.ServerCapability
 *   // Resolves to: 'hoverProvider'
 *
 * Adding new methods:
 *   1. Define namespace with all metadata fields
 *   2. Add to InferRequestParams/Result conditionals
 *   3. Add to LSPRequestMethod union
 *   → Automatically works in onRequest/sendRequest signatures
 * 1. Zero manual mapping - types inferred directly from namespace definitions
 * 2. Single source of truth - add a namespace, get automatic type support
 * 3. No map maintenance - InferRequestParams/Result uses conditional types
 * 4. Compile-time validation - invalid method names caught by LSPRequestMethod union
 *
 * Example usage:
 *   type HoverParams = InferRequestParams<'textDocument/hover'>
 *   // Resolves to: LSPRequest.TextDocument.Hover.Params (HoverParams)
 *
 *   type HoverResult = InferRequestResult<'textDocument/hover'>
 *   // Resolves to: LSPRequest.TextDocument.Hover.Result (Hover | null)
 *
 * Adding new methods:
 *   1. Define namespace (e.g., LSPRequest.TextDocument.NewFeature)
 *   2. Add to InferRequestParams/Result conditionals
 *   3. Add to LSPRequestMethod union
 *   → Automatically works in onRequest/sendRequest signatures
 */
```

**Benefits**:
- Hierarchical structure mirrors LSP specification (textDocument/*, workspace/*)
- Each method namespace can contain additional metadata (capability name, deprecation info, etc.)
- Path types ('textDocument', 'workspace') enable programmatic method name construction
- Extensible for future LSP versions without breaking changes
- Clear organization by feature area
- Enables capability-aware type filtering

### Transport Interface

Abstract interface for message transmission across different channels. **Architecture follows MCP SDK transport patterns** for familiar developer experience.

```typescript
interface Transport {
  // Send message to remote peer
  send(message: Message): Promise<void>;

  // Subscribe to incoming messages
  onMessage(handler: (message: Message) => void): Disposable;

  // Subscribe to transport errors
  onError(handler: (error: Error) => void): Disposable;

  // Close connection
  close(): Promise<void>;

  // Check connection status
  isConnected(): boolean;
}
```

### Built-in Transport Implementations

#### StdioTransport

Communicates via stdin/stdout (standard for LSP servers).

```typescript
class StdioTransport implements Transport {
  constructor(options?: StdioTransportOptions);
}

interface StdioTransportOptions {
  // For server: use process.stdin/stdout
  // For client: spawn child process
  command?: string;        // Command to spawn (client mode)
  args?: string[];         // Command arguments (client mode)
  cwd?: string;            // Working directory
  env?: Record<string, string>;  // Environment variables
}

// Server usage (read from stdin, write to stdout)
const transport = new StdioTransport();

// Client usage (spawn language server process)
const transport = new StdioTransport({
  command: 'typescript-language-server',
  args: ['--stdio']
});
```

#### WebSocketTransport

Communicates via WebSocket connection (for remote servers).

```typescript
class WebSocketTransport implements Transport {
  constructor(options: WebSocketTransportOptions);
}

interface WebSocketTransportOptions {
  // Client mode: connect to URL
  url?: string;

  // Server mode: accept WebSocket connection
  socket?: WebSocket;  // WebSocket instance

  // Reconnection strategy
  reconnect?: boolean;
  maxReconnectAttempts?: number;
  reconnectDelay?: number;
}

// Client usage
const transport = new WebSocketTransport({
  url: 'ws://localhost:8080/lsp'
});

// Server usage (with ws library)
wss.on('connection', (socket) => {
  const transport = new WebSocketTransport({ socket });
  server.listen(transport);
});
```

---

## Protocol Types

**Type-only re-exports** from `vscode-languageserver-protocol`. These types are used at compile time only; no runtime dependency on the vscode-languageserver-* packages. All runtime logic (JSON-RPC handling, validation, etc.) is implemented in @lspy packages.

### Core Types

```typescript
// Position in document (0-indexed)
interface Position {
  line: number;
  character: number;
}

// Range of positions
interface Range {
  start: Position;
  end: Position;
}

// Document location
interface Location {
  uri: DocumentUri;
  range: Range;
}

// Document URI (string validated as URI)
type DocumentUri = string;

// Text edit
interface TextEdit {
  range: Range;
  newText: string;
}

// Diagnostic message
interface Diagnostic {
  range: Range;
  severity?: DiagnosticSeverity;
  code?: string | number;
  source?: string;
  message: string;
  relatedInformation?: DiagnosticRelatedInformation[];
  tags?: DiagnosticTag[];
}
```

### Request/Response Types

50+ LSP message types re-exported from `vscode-languageserver-protocol` and referenced in namespace definitions:

```typescript
// These types are imported from vscode-languageserver-protocol
// and used as Params/Result types in LSPRequest/LSPNotification namespaces

// Text document synchronization (used in LSPNotification.TextDocument.*)
interface DidOpenTextDocumentParams { ... }
interface DidChangeTextDocumentParams { ... }
interface DidCloseTextDocumentParams { ... }

// Language features (used in LSPRequest.TextDocument.*)
interface HoverParams { ... }           // → LSPRequest.TextDocument.Hover.Params
interface Hover { ... }                 // → LSPRequest.TextDocument.Hover.Result
interface CompletionParams { ... }      // → LSPRequest.TextDocument.Completion.Params
interface CompletionList { ... }        // → LSPRequest.TextDocument.Completion.Result
interface DocumentSymbolParams { ... }  // → LSPRequest.TextDocument.DocumentSymbol.Params
interface DocumentSymbol { ... }        // → LSPRequest.TextDocument.DocumentSymbol.Result
interface DefinitionParams { ... }      // → LSPRequest.TextDocument.Definition.Params
type Definition = Location | Location[]; // → LSPRequest.TextDocument.Definition.Result

// Workspace operations (used in LSPRequest.Workspace.*)
interface WorkspaceSymbolParams { ... } // → LSPRequest.Workspace.Symbol.Params
interface SymbolInformation { ... }     // → LSPRequest.Workspace.Symbol.Result
interface ExecuteCommandParams { ... }  // → LSPRequest.Workspace.ExecuteCommand.Params

// ... all LSP 3.17 types mapped to namespace structure
```

### Validation Schemas

Zod schemas matching TypeScript types:

```typescript
import { z } from 'zod';

// Exported alongside types for runtime validation
export const PositionSchema = z.object({
  line: z.number().int().nonnegative(),
  character: z.number().int().nonnegative()
});

export const RangeSchema = z.object({
  start: PositionSchema,
  end: PositionSchema
});

// ... schemas for all LSP types
```

---

## JSON-RPC Types

Core JSON-RPC 2.0 message types. **Custom implementation following MCP SDK patterns** - no dependency on vscode-jsonrpc. This provides full control over message handling, simplifies browser support, and aligns with MCP SDK architecture.

```typescript
// Base message
interface Message {
  jsonrpc: '2.0';
}

// Request message
interface RequestMessage extends Message {
  id: number | string;
  method: string;
  params?: any;
}

// Response message
interface ResponseMessage extends Message {
  id: number | string;
  result?: any;
  error?: ResponseError;
}

// Notification message
interface NotificationMessage extends Message {
  method: string;
  params?: any;
}

// Error object
interface ResponseError {
  code: number;
  message: string;
  data?: any;
}
```

---

## Utility Types

### CancellationToken

```typescript
interface CancellationToken {
  readonly isCancellationRequested: boolean;
  onCancellationRequested: Event<void>;
}

// Create cancellation token source
class CancellationTokenSource {
  constructor();

  get token(): CancellationToken;
  cancel(): void;
  dispose(): void;
}
```

### Disposable

```typescript
interface Disposable {
  dispose(): void;
}

// Combine multiple disposables
class DisposableStore implements Disposable {
  add(disposable: Disposable): void;
  dispose(): void;
}
```

### Logger

MCP SDK-style logging interface.

```typescript
interface Logger {
  trace(message: string, ...args: any[]): void;
  debug(message: string, ...args: any[]): void;
  info(message: string, ...args: any[]): void;
  warn(message: string, ...args: any[]): void;
  error(message: string, ...args: any[]): void;
}

// Default console logger
class ConsoleLogger implements Logger {
  constructor(level: LogLevel);
}

type LogLevel = 'trace' | 'debug' | 'info' | 'warn' | 'error';
```

---

## Usage Examples

### Creating Custom Transport

```typescript
import { Transport, Message, Disposable } from '@lspeasy/core';
import { EventEmitter } from 'events';

class HttpTransport implements Transport {
  private emitter = new EventEmitter();
  private connected = false;

  constructor(private url: string) {}

  async send(message: Message): Promise<void> {
    await fetch(this.url, {
      method: 'POST',
      body: JSON.stringify(message)
    });
  }

  onMessage(handler: (message: Message) => void): Disposable {
    this.emitter.on('message', handler);
    return {
      dispose: () => this.emitter.off('message', handler)
    };
  }

  onError(handler: (error: Error) => void): Disposable {
    this.emitter.on('error', handler);
    return {
      dispose: () => this.emitter.off('error', handler)
    };
  }

  async close(): Promise<void> {
    this.connected = false;
  }

  isConnected(): boolean {
    return this.connected;
  }
}
```

### Using Validation Schemas

```typescript
import { HoverParams, HoverParamsSchema } from '@lspeasy/core/protocol';

function validateHoverParams(data: unknown): HoverParams {
  return HoverParamsSchema.parse(data);  // Throws ZodError if invalid
}

// Safe parsing
const result = HoverParamsSchema.safeParse(data);
if (result.success) {
  const params: HoverParams = result.data;
} else {
  console.error('Validation errors:', result.error);
}
```

---

## Performance Guarantees

- Transport.send(): <0.5ms overhead (excludes I/O)
- Zod validation: <1ms (p95) for typical LSP messages
- Message serialization (JSON.stringify): <0.2ms for typical messages
- Memory: <10MB baseline for core package

---

## Compatibility

### Dependencies

**Runtime (peer dependencies)**:
- `zod`: ^3.25.0 (imports from zod/v4 internally for validation)

**Type-only (devDependencies)**:
- `vscode-languageserver-protocol`: ^3.17.0 (LSP type definitions only, no runtime usage)

**Note**:
- **JSON-RPC 2.0 implementation**: Custom implementation following MCP SDK architecture (no vscode-jsonrpc dependency)
- **LSP types**: Re-exported from `vscode-languageserver-protocol` for spec compliance, but all runtime logic implemented independently
- **Transport layer**: Custom implementations (StdioTransport, WebSocketTransport) following MCP SDK patterns
- This architecture ensures:
  - Zero transitive runtime dependencies from vscode-* packages
  - Full control over protocol implementation
  - Smaller bundle sizes (<100KB core package gzipped)
  - Clean browser compatibility path (future)
  - Familiar patterns for developers using MCP SDK

### Node.js

- Minimum: Node.js 20.0.0
- Tested: Node.js 20.x, 22.x

### Browser

- Not supported in v1.0 (Node.js only)
- Planned for v1.1+ with WebSocket-only transport

---

## Breaking Change Policy

- Transport interface changes: MAJOR version bump
- New required transport methods: MAJOR version bump
- Protocol type changes (matching LSP spec updates): MINOR version bump
- Internal optimizations: PATCH version bump
