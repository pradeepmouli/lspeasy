/**
 * Zod schemas for LSP protocol types
 * Runtime validators matching TypeScript types from vscode-languageserver-protocol
 */

import { z } from 'zod';

/**
 * Position in a text document expressed as zero-based line and character offset
 */
export const PositionSchema = z.object({
  line: z.number().int().min(0),
  character: z.number().int().min(0)
});

/**
 * Range in a text document expressed as (zero-based) start and end positions
 */
export const RangeSchema = z.object({
  start: PositionSchema,
  end: PositionSchema
});

/**
 * Text document identifier
 */
export const TextDocumentIdentifierSchema = z.object({
  uri: z.string() // DocumentUri
});

/**
 * Versioned text document identifier
 */
export const VersionedTextDocumentIdentifierSchema = z.object({
  uri: z.string(), // DocumentUri
  version: z.number().int()
});

/**
 * Text document position params (common base)
 */
export const TextDocumentPositionParamsSchema = z.object({
  textDocument: TextDocumentIdentifierSchema,
  position: PositionSchema
});

/**
 * Location represents a location inside a resource
 */
export const LocationSchema = z.object({
  uri: z.string(), // DocumentUri
  range: RangeSchema
});

/**
 * Text edit to modify a text document
 */
export const TextEditSchema = z.object({
  range: RangeSchema,
  newText: z.string()
});

/**
 * Diagnostic severity
 */
export const DiagnosticSeveritySchema = z.union([
  z.literal(1), // Error
  z.literal(2), // Warning
  z.literal(3), // Information
  z.literal(4) // Hint
]);

/**
 * Diagnostic represents a diagnostic, such as a compiler error or warning
 */
export const DiagnosticSchema = z.object({
  range: RangeSchema,
  severity: DiagnosticSeveritySchema.optional(),
  code: z.union([z.number(), z.string()]).optional(),
  source: z.string().optional(),
  message: z.string(),
  tags: z.array(z.number()).optional(),
  relatedInformation: z.array(z.any()).optional(), // DiagnosticRelatedInformation[]
  data: z.unknown().optional()
});

/**
 * Hover params
 */
export const HoverParamsSchema = TextDocumentPositionParamsSchema;

/**
 * Markup content (markdown or plaintext)
 */
export const MarkupContentSchema = z.object({
  kind: z.union([z.literal('plaintext'), z.literal('markdown')]),
  value: z.string()
});

/**
 * Hover result
 */
export const HoverSchema = z.object({
  contents: z.union([
    z.string(),
    MarkupContentSchema,
    z.object({ language: z.string(), value: z.string() }),
    z.array(z.union([z.string(), z.object({ language: z.string(), value: z.string() })]))
  ]),
  range: RangeSchema.optional()
});

/**
 * Completion params
 */
export const CompletionParamsSchema = TextDocumentPositionParamsSchema.extend({
  workDoneToken: z.union([z.string(), z.number()]).optional(),
  partialResultToken: z.union([z.string(), z.number()]).optional(),
  context: z
    .object({
      triggerKind: z.number(),
      triggerCharacter: z.string().optional()
    })
    .optional()
});

/**
 * Completion item kind
 */
export const CompletionItemKindSchema = z.number().int().min(1).max(25);

/**
 * Completion item
 */
export const CompletionItemSchema = z.object({
  label: z.string(),
  kind: CompletionItemKindSchema.optional(),
  tags: z.array(z.number()).optional(),
  detail: z.string().optional(),
  documentation: z.union([z.string(), MarkupContentSchema]).optional(),
  deprecated: z.boolean().optional(),
  preselect: z.boolean().optional(),
  sortText: z.string().optional(),
  filterText: z.string().optional(),
  insertText: z.string().optional(),
  insertTextFormat: z.union([z.literal(1), z.literal(2)]).optional(),
  textEdit: TextEditSchema.optional(),
  additionalTextEdits: z.array(TextEditSchema).optional(),
  commitCharacters: z.array(z.string()).optional(),
  command: z.any().optional(), // Command
  data: z.unknown().optional()
});

/**
 * Completion list
 */
export const CompletionListSchema = z.object({
  isIncomplete: z.boolean(),
  items: z.array(CompletionItemSchema)
});

/**
 * Definition params
 */
export const DefinitionParamsSchema = TextDocumentPositionParamsSchema;

/**
 * Reference params
 */
export const ReferenceParamsSchema = TextDocumentPositionParamsSchema.extend({
  context: z.object({
    includeDeclaration: z.boolean()
  })
});

/**
 * Document symbol params
 */
export const DocumentSymbolParamsSchema = z.object({
  textDocument: TextDocumentIdentifierSchema
});

/**
 * Symbol kind
 */
export const SymbolKindSchema = z.number().int().min(1).max(26);

/**
 * Document symbol
 */
export const DocumentSymbolSchema: z.ZodType<any> = z.lazy(() =>
  z.object({
    name: z.string(),
    detail: z.string().optional(),
    kind: SymbolKindSchema,
    tags: z.array(z.number()).optional(),
    deprecated: z.boolean().optional(),
    range: RangeSchema,
    selectionRange: RangeSchema,
    children: z.array(DocumentSymbolSchema).optional()
  })
);

/**
 * Initialize params
 */
export const InitializeParamsSchema = z.object({
  processId: z.union([z.number(), z.null()]),
  clientInfo: z
    .object({
      name: z.string(),
      version: z.string().optional()
    })
    .optional(),
  locale: z.string().optional(),
  rootPath: z.union([z.string(), z.null()]).optional(),
  rootUri: z.union([z.string(), z.null()]),
  initializationOptions: z.unknown().optional(),
  capabilities: z.any(), // ClientCapabilities
  trace: z.enum(['off', 'messages', 'verbose']).optional(),
  workspaceFolders: z
    .array(
      z.object({
        uri: z.string(),
        name: z.string()
      })
    )
    .nullable()
    .optional()
});

/**
 * Did open text document params
 */
export const DidOpenTextDocumentParamsSchema = z.object({
  textDocument: z.object({
    uri: z.string(),
    languageId: z.string(),
    version: z.number().int(),
    text: z.string()
  })
});

/**
 * Text document content change event
 */
export const TextDocumentContentChangeEventSchema = z.union([
  z.object({
    range: RangeSchema,
    rangeLength: z.number().optional(),
    text: z.string()
  }),
  z.object({
    text: z.string()
  })
]);

/**
 * Did change text document params
 */
export const DidChangeTextDocumentParamsSchema = z.object({
  textDocument: VersionedTextDocumentIdentifierSchema,
  contentChanges: z.array(TextDocumentContentChangeEventSchema)
});

/**
 * Did close text document params
 */
export const DidCloseTextDocumentParamsSchema = z.object({
  textDocument: TextDocumentIdentifierSchema
});

/**
 * Did save text document params
 */
export const DidSaveTextDocumentParamsSchema = z.object({
  textDocument: TextDocumentIdentifierSchema,
  text: z.string().optional()
});

/**
 * Schema registry for method-based lookup
 */
export const LSPSchemas = {
  // Request params
  'textDocument/hover': HoverParamsSchema,
  'textDocument/completion': CompletionParamsSchema,
  'textDocument/definition': DefinitionParamsSchema,
  'textDocument/references': ReferenceParamsSchema,
  'textDocument/documentSymbol': DocumentSymbolParamsSchema,
  initialize: InitializeParamsSchema,

  // Notification params
  'textDocument/didOpen': DidOpenTextDocumentParamsSchema,
  'textDocument/didChange': DidChangeTextDocumentParamsSchema,
  'textDocument/didClose': DidCloseTextDocumentParamsSchema,
  'textDocument/didSave': DidSaveTextDocumentParamsSchema
} as const;

/**
 * Get schema for a given method
 */
export function getSchemaForMethod(method: string): z.ZodType<any> | undefined {
  return LSPSchemas[method as keyof typeof LSPSchemas];
}
