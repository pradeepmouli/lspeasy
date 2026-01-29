/**
 * String utility functions
 * @packageDocumentation
 */

/**
 * Capitalizes the first letter of a string
 * @param str - The string to capitalize
 * @returns The capitalized string
 * @example
 * ```ts
 * capitalize('hello'); // 'Hello'
 * ```
 */
export function capitalize(str: string): string {
  if (str.length === 0) return str;
  return str.charAt(0).toUpperCase() + str.slice(1);
}

/**
 * Converts a string to camelCase
 * @param str - The string to convert
 * @returns The camelCase string
 * @example
 * ```ts
 * camelCase('hello-world'); // 'helloWorld'
 * ```
 */
export function camelCase(str: string): string {
  return str.toLowerCase().replace(/[-_\s]+(\w)/g, (_, letter) => letter.toUpperCase());
}

/**
 * Converts a string to kebab-case
 * @param str - The string to convert
 * @returns The kebab-case string
 * @example
 * ```ts
 * kebabCase('HelloWorld'); // 'hello-world'
 * ```
 */
export function kebabCase(str: string): string {
  return str
    .replace(/([a-z0-9])([A-Z])/g, '$1-$2')
    .replace(/([A-Z])([A-Z][a-z])/g, '$1-$2')
    .toLowerCase();
}

/**
 * Truncates a string to a maximum length
 * @param str - The string to truncate
 * @param maxLength - Maximum length
 * @param suffix - Suffix to add if truncated (default: '...')
 * @returns The truncated string
 * @example
 * ```ts
 * truncate('Hello World', 8); // 'Hello...'
 * ```
 */
export function truncate(str: string, maxLength: number, suffix: string = '...'): string {
  if (str.length <= maxLength) return str;
  return str.slice(0, maxLength - suffix.length) + suffix;
}
