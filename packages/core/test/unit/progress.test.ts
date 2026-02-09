/**
 * Tests for progress helper functions
 */

import { describe, it, expect } from 'vitest';
import {
  createProgressBegin,
  createProgressReport,
  createProgressEnd,
  createProgressCreateParams
} from '@lspeasy/core';

describe('Progress Helpers', () => {
  describe('createProgressBegin', () => {
    it('should create basic progress begin', () => {
      const result = createProgressBegin('Loading');
      expect(result).toEqual({
        kind: 'begin',
        title: 'Loading'
      });
    });

    it('should include optional fields when provided', () => {
      const result = createProgressBegin('Loading', true, 'Starting...', 0);
      expect(result).toEqual({
        kind: 'begin',
        title: 'Loading',
        cancellable: true,
        message: 'Starting...',
        percentage: 0
      });
    });

    it('should preserve empty string message', () => {
      const result = createProgressBegin('Loading', undefined, '');
      expect(result).toHaveProperty('message');
      expect(result.message).toBe('');
    });

    it('should preserve zero percentage', () => {
      const result = createProgressBegin('Loading', undefined, undefined, 0);
      expect(result).toHaveProperty('percentage');
      expect(result.percentage).toBe(0);
    });
  });

  describe('createProgressReport', () => {
    it('should create basic progress report', () => {
      const result = createProgressReport();
      expect(result).toEqual({
        kind: 'report'
      });
    });

    it('should include optional fields when provided', () => {
      const result = createProgressReport('Processing...', 50, true);
      expect(result).toEqual({
        kind: 'report',
        message: 'Processing...',
        percentage: 50,
        cancellable: true
      });
    });

    it('should preserve empty string message', () => {
      const result = createProgressReport('');
      expect(result).toHaveProperty('message');
      expect(result.message).toBe('');
    });

    it('should preserve zero percentage', () => {
      const result = createProgressReport(undefined, 0);
      expect(result).toHaveProperty('percentage');
      expect(result.percentage).toBe(0);
    });

    it('should handle edge case: empty string and zero percentage', () => {
      const result = createProgressReport('', 0);
      expect(result).toEqual({
        kind: 'report',
        message: '',
        percentage: 0
      });
    });

    it('should omit undefined fields', () => {
      const result = createProgressReport(undefined, 50);
      expect(result).not.toHaveProperty('message');
      expect(result).toHaveProperty('percentage');
      expect(result.percentage).toBe(50);
    });
  });

  describe('createProgressEnd', () => {
    it('should create basic progress end', () => {
      const result = createProgressEnd();
      expect(result).toEqual({
        kind: 'end'
      });
    });

    it('should include message when provided', () => {
      const result = createProgressEnd('Completed');
      expect(result).toEqual({
        kind: 'end',
        message: 'Completed'
      });
    });

    it('should preserve empty string message', () => {
      const result = createProgressEnd('');
      expect(result).toHaveProperty('message');
      expect(result.message).toBe('');
    });

    it('should omit message when undefined', () => {
      const result = createProgressEnd(undefined);
      expect(result).not.toHaveProperty('message');
    });
  });

  describe('createProgressCreateParams', () => {
    it('should create params with string token', () => {
      const result = createProgressCreateParams('token-123');
      expect(result).toEqual({
        token: 'token-123'
      });
    });

    it('should create params with numeric token', () => {
      const result = createProgressCreateParams(12345);
      expect(result).toEqual({
        token: 12345
      });
    });
  });
});
