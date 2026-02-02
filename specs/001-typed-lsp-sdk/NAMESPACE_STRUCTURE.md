# LSP Namespace Structure - Design Documentation

**Date**: 2026-01-29
**Status**: Implemented
**Location**: `packages/core/src/protocol/namespaces.ts`

## Overview

The LSP SDK uses a hierarchical namespace structure to organize LSP protocol methods, providing comprehensive metadata for each method. This design enables automatic type inference, runtime validation, and clear separation of client vs server capabilities.

## Namespace Fields

Each request method namespace includes the following fields:

### Core Fields

| Field | Type | Description | Example |
|-------|------|-------------|---------|
| `Method` (type) | String literal type | Method name as type | `type Method = 'textDocument/hover'` |
| `Method` (const) | String constant | Method name at runtime | `const Method = 'textDocument/hover'` |
| `Params` | Type alias | Request parameters from LSP spec | `type Params = HoverParams` |
| `Result` | Type alias | Response result from LSP spec | `type Result = Hover \| null` |

### Capability Fields

| Field | Type | Description | Example |
|-------|------|-------------|---------|
| `ClientCapability` | Type alias | Client capability interface | `type ClientCapability = HoverClientCapabilities` |
| `ServerCapability` | String literal type | Key in ServerCapabilities object | `type ServerCapability = 'hoverProvider'` |

### Registration Fields

| Field | Type | Description | Example |
|-------|------|-------------|---------|
| `Options` | Type alias | Server options for capability | `type Options = HoverOptions` |
| `RegistrationOptions` | Type alias | Dynamic registration options | `type RegistrationOptions = HoverRegistrationOptions` |

## Example: Complete Namespace

```typescript
export namespace LSPRequest {
  export namespace TextDocument {
    export namespace Hover {
      // Method name (type and runtime)
      export type Method = 'textDocument/hover';
      export const Method = 'textDocument/hover';

      // Request/Response types
      export type Params = HoverParams;
      export type Result = Hover | null;

      // Capabilities
      export type ClientCapability = HoverClientCapabilities;
      export type ServerCapability = 'hoverProvider';

      // Registration
      export type Options = HoverOptions;
      export type RegistrationOptions = HoverRegistrationOptions;
    }
  }
}
```

## Benefits

### 1. Automatic Type Inference

```typescript
// Handler types are automatically inferred from method name
server.onRequest('textDocument/hover', async (params) => {
  // params is automatically HoverParams
  // return type is automatically Hover | null
  return { contents: 'Documentation' };
});
```

### 2. Single Source of Truth

All method metadata lives in one place. Add a new method namespace and get:
- Type inference
- Runtime validation
- Capability negotiation support
- Registration support

### 3. Clear Capability Separation

```typescript
// Client capabilities (what client supports)
type ClientCap = LSPRequest.TextDocument.Hover.ClientCapability;
// → HoverClientCapabilities

// Server capability key (what goes in ServerCapabilities object)
type ServerKey = LSPRequest.TextDocument.Hover.ServerCapability;
// → 'hoverProvider'
```

### 4. Runtime & Compile-Time Safety

```typescript
// Runtime access to method name
const method = LSPRequest.TextDocument.Hover.Method;
// → 'textDocument/hover'

// Compile-time type checking
type Method = LSPRequest.TextDocument.Hover.Method;
// → 'textDocument/hover' (literal type)
```

## Usage Patterns

### Setting Server Capabilities

```typescript
const capabilities: ServerCapabilities = {
  // Use ServerCapability type to ensure correct key
  [LSPRequest.TextDocument.Hover.ServerCapability]: true
};
```

### Dynamic Registration

```typescript
const registrationOptions: LSPRequest.TextDocument.Hover.RegistrationOptions = {
  documentSelector: [{ language: 'typescript' }]
};
```

### Accessing Method Metadata

```typescript
// Get all metadata for a method
type HoverMeta = {
  method: typeof LSPRequest.TextDocument.Hover.Method;
  params: LSPRequest.TextDocument.Hover.Params;
  result: LSPRequest.TextDocument.Hover.Result;
  clientCap: LSPRequest.TextDocument.Hover.ClientCapability;
  serverCap: LSPRequest.TextDocument.Hover.ServerCapability;
  options: LSPRequest.TextDocument.Hover.Options;
  registration: LSPRequest.TextDocument.Hover.RegistrationOptions;
};
```

## Adding New Methods

To add a new LSP method to the namespace structure:

1. **Add imports** in `packages/core/src/protocol/namespaces.ts`:
   ```typescript
   import type {
     NewMethodParams,
     NewMethodResult,
     NewMethodOptions,
     NewMethodRegistrationOptions,
     NewMethodClientCapabilities
   } from 'vscode-languageserver-protocol';
   ```

2. **Define namespace** with all fields:
   ```typescript
   export namespace NewMethod {
     export type Method = 'textDocument/newMethod';
     export const Method = 'textDocument/newMethod';
     export type Params = NewMethodParams;
     export type Result = NewMethodResult | null;
     export type ClientCapability = NewMethodClientCapabilities;
     export type ServerCapability = 'newMethodProvider';
     export type Options = NewMethodOptions;
     export type RegistrationOptions = NewMethodRegistrationOptions;
   }
   ```

3. **Update type inference** in `packages/core/src/protocol/infer.ts`:
   ```typescript
   export type InferRequestParams<M extends string> =
     M extends LSPRequest.TextDocument.NewMethod.Method ? LSPRequest.TextDocument.NewMethod.Params :
     // ... rest of conditionals
     never;

   export type InferRequestResult<M extends string> =
     M extends LSPRequest.TextDocument.NewMethod.Method ? LSPRequest.TextDocument.NewMethod.Result :
     // ... rest of conditionals
     never;

   export type LSPRequestMethod =
     | LSPRequest.TextDocument.NewMethod.Method
     | // ... rest of methods
   ```

4. **Add Zod schema** (if needed) in `packages/core/src/protocol/schemas.ts`

## Implementation Notes

- All types are re-exported from `vscode-languageserver-protocol` (type-only imports)
- Namespace structure mirrors LSP specification organization (`textDocument/*`, `workspace/*`, etc.)
- Lifecycle methods (`initialize`, `shutdown`) have `never` for capabilities (always available)
- ESLint rule `no-unused-vars` is disabled for the imports section as types are used in type positions

## Related Files

- Implementation: [`packages/core/src/protocol/namespaces.ts`](../../packages/core/src/protocol/namespaces.ts)
- Type Inference: [`packages/core/src/protocol/infer.ts`](../../packages/core/src/protocol/infer.ts)
- Contract: [`contracts/core-api.md`](contracts/core-api.md)
- Tasks: [`tasks.md`](tasks.md) (T019)
