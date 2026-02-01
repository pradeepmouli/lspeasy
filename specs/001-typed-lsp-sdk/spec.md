# Feature Specification: Strongly-Typed LSP SDK with MCP-Like Ergonomics

**Feature Branch**: `001-typed-lsp-sdk`
**Created**: 2026-01-29
**Status**: Draft
**Input**: User description: "Build a strongly-typed typescript sdk for lsp servers and clients with familiar (if not identical) ergonomics to the official typescript mcp sdk (https://github.com/modelcontextprotocol/typescript-sdk)"

## Clarifications

### Session 2026-01-29

- Q: For runtime validation failures (when Zod schema validation rejects a request), how should the SDK handle the error? → A: Reject with -32602 and detailed validation error from Zod, but allow developers to customize error transformation
- Q: Should the SDK provide built-in transport implementations or only define transport interfaces? → A: Include stdio and WebSocket transports in core packages; provide Transport interface for custom implementations
- Q: How should the SDK handle the Zod peer dependency across packages? → A: Declare Zod v3.25+ as peer dependency for compatibility, but import from zod/v4 internally like MCP SDK
- Q: What level of built-in logging should the SDK provide for debugging LSP communication? → A: Comprehensive built-in logging with multiple log levels (trace, debug, info, warn, error) and file output, following MCP SDK's logging approach
- Q: For handler registration, should we match MCP SDK's non-chaining pattern? → A: Support both patterns: chaining optional via return type
- Q: How should packages be organized in the monorepo? → A: Organize similarly to MCP SDK with separated client, core, and server packages

## User Scenarios & Testing *(mandatory)*

<!--
  IMPORTANT: User stories should be PRIORITIZED as user journeys ordered by importance.
  Each user story/journey must be INDEPENDENTLY TESTABLE - meaning if you implement just ONE of them,
  you should still have a viable MVP (Minimum Viable Product) that delivers value.

  Assign priorities (P1, P2, P3, etc.) to each story, where P1 is the most critical.
  Think of each story as a standalone slice of functionality that can be:
  - Developed independently
  - Tested independently
  - Deployed independently
  - Demonstrated to users independently
-->

### User Story 1 - Build LSP Server with Simple API (Priority: P1)

A developer wants to create a language server for their custom language by implementing handlers for completion, hover, and diagnostics without dealing with low-level JSON-RPC details.

**Why this priority**: This is the core value proposition - developers should be able to build LSP servers as easily as they build MCP servers. This is the MVP that validates the SDK design.

**Independent Test**: Can be fully tested by creating a minimal LSP server that responds to initialization and at least one capability (e.g., hover), connecting it to a test client, and verifying correct message exchange.

**Acceptance Scenarios**:

1. **Given** a new TypeScript project, **When** developer imports `@lspeasy/server` and defines request handlers, **Then** they can start a server with stdio transport in <30 lines of code
2. **Given** an LSP server implementation, **When** client sends initialize request, **Then** server responds with declared capabilities without manual JSON-RPC handling
3. **Given** a server with registered handlers, **When** client sends textDocument/hover request, **Then** handler receives typed parameters and returns typed response

---

### User Story 2 - Build LSP Client to Connect to Any Server (Priority: P2)

A tool developer wants to programmatically interact with any LSP-compliant language server (Rust Analyzer, TypeScript Language Server, etc.) using a high-level TypeScript API.

**Why this priority**: Client capability is essential for building IDE extensions, language tools, and automation. It's the second pillar of the SDK after servers work.

**Independent Test**: Can be tested independently by connecting to a real language server (e.g., typescript-language-server), sending initialize + textDocument/definition request, and receiving typed responses.

**Acceptance Scenarios**:

1. **Given** an LSP client instance, **When** connecting to a language server via stdio, **Then** client completes initialization handshake automatically
2. **Given** a connected client, **When** requesting textDocument/completion with position, **Then** client receives typed CompletionList or CompletionItem[]
3. **Given** a client with active connection, **When** sending shutdown request, **Then** connection closes gracefully with proper sequence (shutdown → exit)

---

### User Story 3 - Use Multiple Transport Layers (Priority: P3)

A developer wants to deploy their language server via different transports (stdio for CLI tools, WebSocket for browser-based editors, HTTP for cloud deployments) without rewriting server logic.

**Why this priority**: Transport flexibility is important for production deployments but not needed for initial development. The core server/client logic must work first.

**Independent Test**: Can be tested by creating one server implementation and connecting via stdio transport, then switching to WebSocket transport without changing handler code.

**Acceptance Scenarios**:

1. **Given** an LSP server with handlers defined, **When** switching from stdio to WebSocket transport, **Then** server continues responding correctly without code changes
2. **Given** multiple clients connecting via different transports, **When** requests arrive simultaneously, **Then** server handles them concurrently with proper isolation
3. **Given** a transport disconnection, **When** connection drops unexpectedly, **Then** server cleans up resources and logs error without crashing

---

### User Story 4 - Handle Advanced LSP Features (Priority: P4)

A language server developer wants to implement advanced LSP capabilities like workspace folders, file watching, progress reporting, and partial result streaming.

**Why this priority**: These are advanced features needed for production-quality language servers but not required for basic functionality. Can be added incrementally.

**Independent Test**: Can be tested by implementing workspace/didChangeWorkspaceFolders handler and verifying multi-folder support, or implementing progress reporting for long-running operations.

**Acceptance Scenarios**:

1. **Given** a server supporting workspace folders, **When** client adds new workspace folder, **Then** server receives notification with typed WorkspaceFoldersChangeEvent
2. **Given** a long-running operation (indexing), **When** server creates progress token, **Then** client receives typed progress notifications (begin → report → end)
3. **Given** a large completion request, **When** server streams partial results, **Then** client receives incremental CompletionList updates

---

### Edge Cases

- What happens when client sends request before initialization completes? (Must respond with -32002 ServerNotInitialized error per LSP spec)
- How does server handle requests during shutdown sequence? (Must respond with -32603 InvalidRequest error per LSP spec)
- What if client sends malformed JSON-RPC message? (Must respond with -32700 ParseError per LSP spec)
- How are concurrent requests with cancellation tokens handled? (Must support $/cancelRequest for long operations; cancellation propagated via CancellationToken interface)
- What if transport buffer overflows with large responses? (Must implement streaming or chunking; configurable buffer limits)
- How does SDK handle protocol version mismatches? (Must declare supported version range in initialization; reject incompatible clients with clear error message)
- What happens when validation fails? (Reject with -32602 InvalidParams including detailed Zod error; developers may customize error transformation)

## Requirements *(mandatory)*

### Functional Requirements

- **FR-001**: SDK MUST provide `@lspeasy/server` package for building LSP servers with typed request/notification handlers
- **FR-002**: SDK MUST provide `@lspeasy/client` package for connecting to LSP servers with typed request methods
- **FR-003**: SDK MUST provide `@lspeasy/core` package with shared types, utilities, and base functionality used by both client and server
- **FR-003a**: `@lspeasy/core` MUST include TypeScript definitions for all LSP 3.17 message types, JSON-RPC primitives, and common protocol utilities
- **FR-004**: Server MUST support registering handlers via fluent API compatible with MCP SDK patterns (e.g., `server.onRequest('textDocument/hover', handler)`); handler registration methods MUST support optional method chaining (return `this`) while remaining compatible with non-chaining usage
- **FR-005**: Client MUST provide high-level methods for common requests (e.g., `client.textDocument.hover(params)`)
- **FR-006**: SDK MUST handle LSP initialization handshake automatically (initialize request/response, initialized notification)
- **FR-007**: SDK MUST support stdio transport as default; SDK MUST include WebSocket transport implementation; SDK MUST provide abstract Transport interface for custom transport implementations (HTTP, IPC, etc.)
- **FR-008**: Server MUST validate request parameters against LSP schemas at runtime using Zod (peer dependency v3.25+, internally importing from zod/v4), rejecting invalid requests with LSP error code -32602 (InvalidParams) including detailed Zod validation errors; developers MAY customize error transformation via error handler hooks
- **FR-009**: Client MUST validate server responses against LSP schemas at runtime using Zod (peer dependency v3.25+, internally importing from zod/v4), rejecting invalid responses with detailed validation errors; developers MAY customize error transformation via error handler hooks
- **FR-010**: SDK MUST support cancellation tokens for long-running operations via `$/cancelRequest`
- **FR-011**: SDK MUST emit typed events for connection lifecycle (connected, disconnected, error)
- **FR-012**: Server MUST support capability negotiation during initialization with type-safe capability objects
- **FR-013**: SDK MUST provide TypeScript interfaces matching LSP specification exactly (DocumentUri, Position, Range, etc.)
- **FR-014**: SDK MUST support bidirectional communication (client→server requests AND server→client requests)
- **FR-015**: SDK MUST handle JSON-RPC error codes and messages according to LSP specification
- **FR-016**: SDK MUST provide comprehensive built-in logging following MCP SDK patterns with multiple log levels (trace, debug, info, warn, error) and optional file output for debugging LSP message exchange

### Key Entities

**Package: @lspeasy/server**
- **LSPServer**: Main server class that manages connection, capabilities, and request routing
- **RequestHandler**: Type-safe function signature for handling specific LSP requests
- **NotificationHandler**: Type-safe function signature for handling LSP notifications
- **ServerCapabilities**: Strongly-typed object representing server's advertised capabilities

**Package: @lspeasy/client**
- **LSPClient**: Main client class that manages connection, initialization, and typed request methods
- **ClientCapabilities**: Strongly-typed object representing client's supported features

**Package: @lspeasy/core**
- **Transport**: Abstract interface for stdio, WebSocket, HTTP transports (message send/receive); stdio and WebSocket implementations included
- **Message**: Union type of LSP request, response, notification, and error messages
- **CancellationToken**: Interface for aborting long-running operations
- **Protocol Types**: LSP 3.17 message types (Position, Range, DocumentUri, TextEdit, etc.)
- **JSON-RPC Types**: Request, Response, Notification, Error primitives

## Success Criteria *(mandatory)*

### Measurable Outcomes

- **SC-001**: Developers can create a minimal working LSP server (with 1+ capability) in under 30 lines of code
- **SC-002**: SDK successfully connects to and communicates with 3 real-world language servers (typescript-language-server, rust-analyzer, pyright) without errors
- **SC-003**: All LSP 3.17 core message types are represented with TypeScript definitions passing strict type checking
- **SC-004**: Runtime schema validation catches 100% of malformed requests in integration tests
- **SC-005**: Server handles 1000+ concurrent requests without memory leaks or crashes
- **SC-006**: API surface achieves 95%+ similarity to MCP SDK patterns (class names, method signatures, handler registration)
- **SC-007**: Developers report 80%+ satisfaction with API ergonomics in user testing (5+ participants)
- **SC-008**: SDK successfully implements and tests at least 10 LSP capabilities (textDocument/completion, hover, definition, references, etc.)
- **SC-009**: Cancellation tokens abort long-running operations within 100ms of $/cancelRequest
- **SC-010**: Documentation includes runnable examples for server and client matching MCP SDK documentation quality
