/**
 * Test fixtures for common data structures
 * @packageDocumentation
 */

/**
 * Creates mock user data for testing
 * @param overrides - Partial user data to override defaults
 * @returns Mock user object
 * @example
 * ```ts
 * const user = createMockUser({ name: 'John' });
 * expect(user.name).toBe('John');
 * expect(user.email).toBe('user@example.com');
 * ```
 */
export function createMockUser(overrides?: Partial<any>): any {
  return {
    id: 1,
    name: 'Test User',
    email: 'user@example.com',
    createdAt: new Date('2024-01-01'),
    ...overrides
  };
}

/**
 * Creates mock email data for testing
 * @param overrides - Partial email data to override defaults
 * @returns Mock email object
 * @example
 * ```ts
 * const email = createMockEmail({ to: 'john@example.com' });
 * expect(email.to).toBe('john@example.com');
 * ```
 */
export function createMockEmail(overrides?: Partial<any>): any {
  return {
    id: 'msg_1',
    from: 'noreply@example.com',
    to: 'recipient@example.com',
    subject: 'Test Email',
    body: 'This is a test email.',
    sentAt: new Date('2024-01-01T12:00:00'),
    ...overrides
  };
}

/**
 * Creates mock API response for testing
 * @param overrides - Partial response data to override defaults
 * @returns Mock API response
 * @example
 * ```ts
 * const response = createMockApiResponse({ status: 201 });
 * expect(response.status).toBe(201);
 * ```
 */
export function createMockApiResponse(overrides?: Partial<any>): any {
  return {
    status: 200,
    success: true,
    data: {},
    timestamp: new Date().toISOString(),
    ...overrides
  };
}

/**
 * Creates mock error response for testing
 * @param message - Error message
 * @returns Mock error response
 * @example
 * ```ts
 * const error = createMockErrorResponse('Not found');
 * expect(error.success).toBe(false);
 * ```
 */
export function createMockErrorResponse(message: string = 'Test error'): any {
  return {
    status: 400,
    success: false,
    error: message,
    timestamp: new Date().toISOString()
  };
}

/**
 * Creates an array of mock items
 * @param count - Number of items to create
 * @param factory - Function to create individual items
 * @returns Array of mock items
 * @example
 * ```ts
 * const users = createMockArray(5, (i) => ({ id: i, name: `User${i}` }));
 * expect(users).toHaveLength(5);
 * ```
 */
export function createMockArray<T>(count: number, factory: (index: number) => T): T[] {
  return Array.from({ length: count }, (_, i) => factory(i));
}
