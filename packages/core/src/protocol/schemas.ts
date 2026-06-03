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
 * Workspace edit — either a `changes` map of uri→TextEdit[] or a sequential
 * `documentChanges` array. `documentChanges` items may be text edits or
 * resource operations (create/rename/delete); they are typed as `unknown` here
 * so consumers can narrow them with their own guards.
 */
export const WorkspaceEditSchema = z.object({
  changes: z.record(z.string(), z.array(TextEditSchema)).optional(),
  documentChanges: z.array(z.unknown()).optional()
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

/** Rename params — file + position + new symbol name */
export const RenameParamsSchema = TextDocumentPositionParamsSchema.extend({
  newName: z.string()
});

/** Code action context */
export const CodeActionContextSchema = z.object({
  diagnostics: z.array(DiagnosticSchema),
  only: z.array(z.string()).optional(),
  triggerKind: z.number().int().optional()
});

/** Code action params — file + range + context */
export const CodeActionParamsSchema = z.object({
  textDocument: TextDocumentIdentifierSchema,
  range: RangeSchema,
  context: CodeActionContextSchema
});

/** Shared formatting options */
export const FormattingOptionsSchema = z.object({
  tabSize: z.number().int(),
  insertSpaces: z.boolean(),
  trimTrailingWhitespace: z.boolean().optional(),
  insertFinalNewline: z.boolean().optional(),
  trimFinalNewlines: z.boolean().optional()
});

/** Document formatting params — file + options */
export const DocumentFormattingParamsSchema = z.object({
  textDocument: TextDocumentIdentifierSchema,
  options: FormattingOptionsSchema
});

/** Document range formatting params — file + range + options */
export const DocumentRangeFormattingParamsSchema = z.object({
  textDocument: TextDocumentIdentifierSchema,
  range: RangeSchema,
  options: FormattingOptionsSchema
});

/** Workspace symbol params — query string only */
export const WorkspaceSymbolParamsSchema = z.object({
  query: z.string()
});

/** Folding range params — file only */
export const FoldingRangeParamsSchema = z.object({
  textDocument: TextDocumentIdentifierSchema
});

/** Inlay hint params — file + range */
export const InlayHintParamsSchema = z.object({
  textDocument: TextDocumentIdentifierSchema,
  range: RangeSchema
});

/** Code lens params — file only */
export const CodeLensParamsSchema = z.object({
  textDocument: TextDocumentIdentifierSchema
});

export const SignatureHelpParamsSchema = TextDocumentPositionParamsSchema;
export const TypeDefinitionParamsSchema = TextDocumentPositionParamsSchema;
export const ImplementationParamsSchema = TextDocumentPositionParamsSchema;
export const DeclarationParamsSchema = TextDocumentPositionParamsSchema;
export const DocumentHighlightParamsSchema = TextDocumentPositionParamsSchema;

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
  // Request params (existing)
  'textDocument/hover': HoverParamsSchema,
  'textDocument/completion': CompletionParamsSchema,
  'textDocument/definition': DefinitionParamsSchema,
  'textDocument/references': ReferenceParamsSchema,
  'textDocument/documentSymbol': DocumentSymbolParamsSchema,
  initialize: InitializeParamsSchema,

  // New request params
  'textDocument/rename': RenameParamsSchema,
  'textDocument/codeAction': CodeActionParamsSchema,
  'textDocument/signatureHelp': SignatureHelpParamsSchema,
  'textDocument/typeDefinition': TypeDefinitionParamsSchema,
  'textDocument/implementation': ImplementationParamsSchema,
  'textDocument/declaration': DeclarationParamsSchema,
  'textDocument/documentHighlight': DocumentHighlightParamsSchema,
  'textDocument/formatting': DocumentFormattingParamsSchema,
  'textDocument/rangeFormatting': DocumentRangeFormattingParamsSchema,
  'textDocument/foldingRange': FoldingRangeParamsSchema,
  'textDocument/inlayHint': InlayHintParamsSchema,
  'textDocument/codeLens': CodeLensParamsSchema,
  'workspace/symbol': WorkspaceSymbolParamsSchema,

  // Notification params (existing)
  'textDocument/didOpen': DidOpenTextDocumentParamsSchema,
  'textDocument/didChange': DidChangeTextDocumentParamsSchema,
  'textDocument/didClose': DidCloseTextDocumentParamsSchema,
  'textDocument/didSave': DidSaveTextDocumentParamsSchema
} as const;

/**
 * Looks up the Zod validation schema for a given LSP method.
 *
 * @param method - The LSP method string to look up (e.g. `'textDocument/hover'`).
 * @returns The Zod schema for the method's params, or `undefined` if none is registered.
 */
export function getSchemaForMethod(method: string): z.ZodType<any> | undefined {
  return LSPSchemas[method as keyof typeof LSPSchemas];
}
