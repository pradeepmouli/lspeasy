/**
 * Parameter validation using Zod schemas
 */

import { z, ZodError } from 'zod';
import { ResponseError } from '@lspy/core';
import type { RequestContext } from './types.js';

/**
 * Basic Zod schemas for LSP types (minimal validation)
 * Full validation can be added as needed
 */

// Position schema
export const positionSchema = z.object({
  line: z.number().int().min(0),
  character: z.number().int().min(0)
});

// Range schema
export const rangeSchema = z.object({
  start: positionSchema,
  end: positionSchema
});

// TextDocumentIdentifier schema
export const textDocumentIdentifierSchema = z.object({
  uri: z.string()
});

// TextDocumentPositionParams schema
export const textDocumentPositionParamsSchema = z.object({
  textDocument: textDocumentIdentifierSchema,
  position: positionSchema
});

// HoverParams = TextDocumentPositionParams
export const hoverParamsSchema = textDocumentPositionParamsSchema;

// CompletionParams schema
export const completionParamsSchema = textDocumentPositionParamsSchema.extend({
  context: z
    .object({
      triggerKind: z.number(),
      triggerCharacter: z.string().optional()
    })
    .optional()
});

// DefinitionParams = TextDocumentPositionParams
export const definitionParamsSchema = textDocumentPositionParamsSchema;

// ReferenceParams schema
export const referenceParamsSchema = textDocumentPositionParamsSchema.extend({
  context: z.object({
    includeDeclaration: z.boolean()
  })
});

// DocumentSymbolParams schema
export const documentSymbolParamsSchema = z.object({
  textDocument: textDocumentIdentifierSchema
});

// InitializeParams schema
export const initializeParamsSchema = z.object({
  processId: z.number().nullable(),
  clientInfo: z
    .object({
      name: z.string(),
      version: z.string().optional()
    })
    .optional(),
  locale: z.string().optional(),
  rootPath: z.string().nullable().optional(),
  rootUri: z.string().nullable(),
  capabilities: z.any(),
  trace: z.enum(['off', 'messages', 'verbose']).optional(),
  workspaceFolders: z.array(z.any()).nullable().optional()
});

// DidOpenTextDocumentParams schema
export const didOpenTextDocumentParamsSchema = z.object({
  textDocument: z.object({
    uri: z.string(),
    languageId: z.string(),
    version: z.number(),
    text: z.string()
  })
});

// DidChangeTextDocumentParams schema
export const didChangeTextDocumentParamsSchema = z.object({
  textDocument: z.object({
    uri: z.string(),
    version: z.number()
  }),
  contentChanges: z.array(z.any())
});

// DidCloseTextDocumentParams schema
export const didCloseTextDocumentParamsSchema = z.object({
  textDocument: textDocumentIdentifierSchema
});

/**
 * Schema registry for LSP methods
 */
export const methodSchemas: Record<string, z.ZodSchema | undefined> = {
  initialize: initializeParamsSchema,
  'textDocument/hover': hoverParamsSchema,
  'textDocument/completion': completionParamsSchema,
  'textDocument/definition': definitionParamsSchema,
  'textDocument/references': referenceParamsSchema,
  'textDocument/documentSymbol': documentSymbolParamsSchema,
  'textDocument/didOpen': didOpenTextDocumentParamsSchema,
  'textDocument/didChange': didChangeTextDocumentParamsSchema,
  'textDocument/didClose': didCloseTextDocumentParamsSchema
};

/**
 * Validate request parameters
 */
export function validateParams(
  method: string,
  params: unknown,
  onValidationError?: (error: ZodError, context: RequestContext) => any
): unknown {
  const schema = methodSchemas[method];

  if (!schema) {
    // No schema defined, skip validation
    return params;
  }

  try {
    return schema.parse(params);
  } catch (error) {
    if (error instanceof ZodError) {
      if (onValidationError) {
        const errorObj = onValidationError(error, {
          id: -1,
          method,
          clientCapabilities: undefined
        });
        throw new ResponseError(errorObj.code, errorObj.message, errorObj.data);
      }

      // Default validation error handling
      throw ResponseError.invalidParams(
        `Invalid params for ${method}: ${error.message}`,
        error.errors
      );
    }
    throw error;
  }
}
