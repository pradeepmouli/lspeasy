import { describe, it, expect } from 'vitest';
import {
  capitalize,
  camelCase,
  kebabCase,
  truncate,
  unique,
  groupBy,
  flatten,
  chunk
} from './index';

describe('String Utils', () => {
  describe('capitalize', () => {
    it('should capitalize first letter', () => {
      expect(capitalize('hello')).toBe('Hello');
      expect(capitalize('world')).toBe('World');
    });

    it('should handle empty strings', () => {
      expect(capitalize('')).toBe('');
    });
  });

  describe('camelCase', () => {
    it('should convert to camelCase', () => {
      expect(camelCase('hello-world')).toBe('helloWorld');
      expect(camelCase('hello_world')).toBe('helloWorld');
    });
  });

  describe('kebabCase', () => {
    it('should convert to kebab-case', () => {
      expect(kebabCase('HelloWorld')).toBe('hello-world');
      expect(kebabCase('helloWorld')).toBe('hello-world');
    });
  });

  describe('truncate', () => {
    it('should truncate long strings', () => {
      expect(truncate('Hello World', 8)).toBe('Hello...');
    });

    it('should not truncate short strings', () => {
      expect(truncate('Hi', 8)).toBe('Hi');
    });
  });
});

describe('Array Utils', () => {
  describe('unique', () => {
    it('should remove duplicates', () => {
      expect(unique([1, 2, 2, 3])).toEqual([1, 2, 3]);
      expect(unique(['a', 'b', 'a'])).toEqual(['a', 'b']);
    });
  });

  describe('groupBy', () => {
    it('should group elements', () => {
      const result = groupBy([1, 2, 3, 4], (n) => n % 2);
      expect(result[0]).toEqual([2, 4]);
      expect(result[1]).toEqual([1, 3]);
    });
  });

  describe('flatten', () => {
    it('should flatten arrays', () => {
      expect(
        flatten(
          [
            [1, 2],
            [3, 4]
          ],
          1
        )
      ).toEqual([1, 2, 3, 4]);
    });

    it('should respect depth parameter', () => {
      expect(
        flatten(
          [
            [1, [2]],
            [3, [4]]
          ],
          1
        )
      ).toEqual([1, [2], 3, [4]]);
    });
  });

  describe('chunk', () => {
    it('should split array into chunks', () => {
      expect(chunk([1, 2, 3, 4, 5], 2)).toEqual([[1, 2], [3, 4], [5]]);
    });
  });
});
