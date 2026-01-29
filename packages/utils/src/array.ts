/**
 * Array utility functions
 * @packageDocumentation
 */

/**
 * Removes duplicates from an array
 * @param arr - The array to deduplicate
 * @returns Array with unique elements
 * @example
 * ```ts
 * unique([1, 2, 2, 3]); // [1, 2, 3]
 * ```
 */
export function unique<T>(arr: T[]): T[] {
  return Array.from(new Set(arr));
}

/**
 * Groups array elements by a key function
 * @param arr - The array to group
 * @param keyFn - Function to determine group key
 * @returns Object with grouped elements
 * @example
 * ```ts
 * groupBy([1, 2, 3], n => n % 2); // { '0': [2], '1': [1, 3] }
 * ```
 */
export function groupBy<T, K extends string | number>(
  arr: T[],
  keyFn: (item: T) => K
): Record<K, T[]> {
  return arr.reduce(
    (acc, item) => {
      const key = keyFn(item);
      if (!acc[key]) acc[key] = [];
      acc[key]!.push(item);
      return acc;
    },
    {} as Record<K, T[]>
  );
}

/**
 * Flattens a nested array
 * @param arr - The array to flatten
 * @param depth - Depth to flatten (default: 1)
 * @returns Flattened array
 * @example
 * ```ts
 * flatten([[1, 2], [3, [4, 5]]], 1); // [1, 2, 3, [4, 5]]
 * ```
 */
export function flatten<T>(arr: Array<T | T[]>, depth: number = 1): T[] {
  if (depth === 0) return arr as T[];
  return arr.reduce((acc: T[], item) => {
    return Array.isArray(item) ? [...acc, ...flatten(item, depth - 1)] : [...acc, item];
  }, []);
}

/**
 * Chunks an array into smaller arrays
 * @param arr - The array to chunk
 * @param size - Size of each chunk
 * @returns Array of chunks
 * @example
 * ```ts
 * chunk([1, 2, 3, 4, 5], 2); // [[1, 2], [3, 4], [5]]
 * ```
 */
export function chunk<T>(arr: T[], size: number): T[][] {
  const chunks: T[][] = [];
  for (let i = 0; i < arr.length; i += size) {
    chunks.push(arr.slice(i, i + size));
  }
  return chunks;
}
