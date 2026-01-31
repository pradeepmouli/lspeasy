/**
 * Vitest configuration for benchmark tests
 */

import { defineConfig } from 'vitest/config';

export default defineConfig({
  test: {
    benchmark: {
      include: ['**/benchmarks/**/*.bench.ts'],
      exclude: ['**/node_modules/**', '**/dist/**'],
      reporters: ['default', 'verbose'],
      outputFile: './benchmark-results.json'
    }
  },
  resolve: {
    alias: {
      '@lspy/core': new URL('./packages/core/src/index.ts', import.meta.url).pathname,
      '@lspy/server': new URL('./packages/server/src/index.ts', import.meta.url).pathname,
      '@lspy/client': new URL('./packages/client/src/index.ts', import.meta.url).pathname
    }
  }
});
