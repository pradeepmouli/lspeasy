import { describe, it, expect } from 'vitest';
import { isValidEmail, createSuccessResponse, delay } from '@company/core';
import { capitalize, unique } from '@company/utils';

describe('Integration Tests', () => {
  describe('Core + Utils Integration', () => {
    it('should use core validation with utils string formatting', async () => {
      // This demonstrates cross-package integration
      const email = 'john.doe@example.com';
      const isValid = isValidEmail(email);

      expect(isValid).toBe(true);

      // Format the result
      const emailName = capitalize(email.split('@')[0]!.replace('.', ' '));
      expect(emailName).toBe('John doe');
    });

    it('should create response with processed data', () => {
      const emails = ['USER@example.com', 'ADMIN@example.com'];
      const uniqueEmails = unique(emails.map((e) => e.toLowerCase()));

      const response = createSuccessResponse({
        emails: uniqueEmails,
        count: uniqueEmails.length
      });

      expect(response.success).toBe(true);
      expect(response.data?.count).toBe(2);
    });

    it('should handle async operations across packages', async () => {
      const startTime = Date.now();

      // Use core delay utility
      await delay(100);

      const emails = ['test@example.com'];
      const validated = emails.filter((e) => isValidEmail(e));

      const response = createSuccessResponse({
        validated,
        processingTime: Date.now() - startTime
      });

      expect(response.success).toBe(true);
      expect(response.data?.processingTime).toBeGreaterThanOrEqual(100);
      expect(response.data?.validated).toHaveLength(1);
    });
  });

  describe('Workflow Examples', () => {
    it('should process user data workflow', async () => {
      // Simulates a realistic workflow using multiple utilities
      const users = [
        { id: 1, email: 'alice@example.com', name: 'alice' },
        { id: 2, email: 'bob@example.com', name: 'bob' },
        { id: 3, email: 'invalid-email', name: 'charlie' }
      ];

      // Validate and process
      const validUsers = users.filter((u) => isValidEmail(u.email));
      const processedUsers = validUsers.map((u) => ({
        ...u,
        displayName: capitalize(u.name)
      }));

      const response = createSuccessResponse(processedUsers);

      expect(response.success).toBe(true);
      expect(response.data).toHaveLength(2);
      expect(response.data?.[0]?.displayName).toBe('Alice');
    });

    it('should handle error conditions gracefully', () => {
      const invalidEmail = 'not-an-email';
      const isValid = isValidEmail(invalidEmail);

      const response = isValid
        ? createSuccessResponse({ email: invalidEmail })
        : createSuccessResponse({ invalid: true, email: invalidEmail });

      expect(response.success).toBe(true);
      expect(response.data?.invalid).toBe(true);
    });
  });
});
