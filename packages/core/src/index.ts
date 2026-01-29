/**
 * Core utility functions and types for the monorepo
 * @packageDocumentation
 */

import { z } from 'zod';

/**
 * Represents an API response with status and data
 */
export interface ApiResponse<T> {
  success: boolean;
  data?: T;
  error?: string;
}

/**
 * Validates an email address
 * @param email - The email address to validate
 * @returns true if valid, false otherwise
 * @example
 * ```ts
 * isValidEmail('user@example.com'); // true
 * isValidEmail('invalid'); // false
 * ```
 */
export function isValidEmail(email: string): boolean {
  const emailSchema = z.string().email();
  return emailSchema.safeParse(email).success;
}

/**
 * Creates a successful API response
 * @param data - The response data
 * @returns An API response with success=true
 * @example
 * ```ts
 * const response = createSuccessResponse({ id: 1, name: 'John' });
 * // { success: true, data: { id: 1, name: 'John' } }
 * ```
 */
export function createSuccessResponse<T>(data: T): ApiResponse<T> {
  return {
    success: true,
    data
  };
}

/**
 * Creates an error API response
 * @param error - The error message
 * @returns An API response with success=false
 * @example
 * ```ts
 * const response = createErrorResponse('Not found');
 * // { success: false, error: 'Not found' }
 * ```
 */
export function createErrorResponse(error: string): ApiResponse<never> {
  return {
    success: false,
    error
  };
}

/**
 * Delays execution for a specified number of milliseconds
 * @param ms - Milliseconds to delay
 * @returns A promise that resolves after the delay
 * @example
 * ```ts
 * await delay(1000); // Wait 1 second
 * ```
 */
export async function delay(ms: number): Promise<void> {
  return new Promise((resolve) => {
    setTimeout(resolve, ms);
  });
}
