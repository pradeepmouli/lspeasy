/**
 * Parameter validation using Zod schemas
 */

import { z, ZodError } from 'zod';
import { ResponseError } from '@lspeasy/core';
import type { RequestContext, NotificationContext } from './types.js';

/**
 * Zod schemas imported from @lspeasy/core
 * These are comprehensive LSP protocol schemas
 */
import {
  HoverParamsSchema as hoverParamsSchema,
  CompletionParamsSchema as completionParamsSchema,
  DefinitionParamsSchema as definitionParamsSchema,
  ReferenceParamsSchema as referenceParamsSchema,
  DocumentSymbolParamsSchema as documentSymbolParamsSchema,
  InitializeParamsSchema as initializeParamsSchema,
  DidOpenTextDocumentParamsSchema as didOpenTextDocumentParamsSchema,
  DidChangeTextDocumentParamsSchema as didChangeTextDocumentParamsSchema,
  DidCloseTextDocumentParamsSchema as didCloseTextDocumentParamsSchema
} from '@lspeasy/core';

/**
 * Schema registry for LSP methods
 * Now using schemas from @lspeasy/core
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
/**
 * Validate request/notification parameters
 * @param method - The LSP method name
 * @param params - The parameters to validate
 * @param context - The request/notification context (optional for validation-only calls)
 * @param onValidationError - Optional custom validation error handler
 * @returns Validated parameters
 * @throws ResponseError if validation fails
 */
export function validateParams(
  method: string,
  params: unknown,
  context?: RequestContext | NotificationContext,
  onValidationError?: (error: ZodError, context: RequestContext | NotificationContext) => any
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
      if (onValidationError && context) {
        const errorObj = onValidationError(error, context);
        throw new ResponseError(errorObj.code, errorObj.message, errorObj.data);
      }

      // Default validation error handling
      throw ResponseError.invalidParams(
        `Invalid params for ${method}: ${error.message}`,
        error.issues
      );
    }
    throw error;
  }
}
