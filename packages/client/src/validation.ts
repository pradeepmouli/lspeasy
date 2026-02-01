/**
 * Response validation utilities for LSP client
 * Validates server responses against expected schemas
 */

import { z } from 'zod';
import type { LSPRequestMethod } from '@lspeasy/core';

/**
 * Validation error thrown when server response doesn't match expected schema
 */
export class ResponseValidationError extends Error {
  constructor(
    public readonly method: string,
    public readonly errors: z.ZodError,
    public readonly response: unknown
  ) {
    super(`Response validation failed for ${method}: ${errors.message}`);
    this.name = 'ResponseValidationError';
  }
}

/**
 * Validates a response against a Zod schema
 * @param method - LSP method name for error reporting
 * @param schema - Zod schema to validate against
 * @param response - Response data to validate
 * @returns Validated and typed response
 * @throws ResponseValidationError if validation fails
 */
export function validateResponse<T>(
  method: LSPRequestMethod,
  schema: z.ZodSchema<T>,
  response: unknown
): T {
  const result = schema.safeParse(response);

  if (!result.success) {
    throw new ResponseValidationError(String(method), result.error, response);
  }

  return result.data;
}

/**
 * Options for response validation
 */
export interface ValidationOptions {
  /**
   * Whether to validate responses (default: true)
   */
  enabled?: boolean;

  /**
   * Custom error handler for validation failures
   * If not provided, throws ResponseValidationError
   */
  onValidationError?: (error: ResponseValidationError) => void;
}

/**
 * Creates a response validator with custom options
 */
export function createValidator(options: ValidationOptions = {}) {
  const { enabled = true, onValidationError } = options;

  return function validate<T>(
    method: LSPRequestMethod,
    schema: z.ZodSchema<T>,
    response: unknown
  ): T {
    if (!enabled) {
      return response as T;
    }

    try {
      return validateResponse(method, schema, response);
    } catch (error) {
      if (error instanceof ResponseValidationError && onValidationError) {
        onValidationError(error);
      }
      throw error;
    }
  };
}
