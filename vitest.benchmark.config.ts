/**
 * Vitest configuration for benchmark tests
 */

import { fileURLToPath } from 'node:url';
import { defineConfig } from 'vitest/config';

export default defineConfig({
  test: {
    benchmark: {
      include: ['**/benchmarks/**/*.bench.ts'],
      exclude: ['**/node_modules/**', '**/dist/**'],
      reporters: ['default', 'verbose'],
      outputFile: './benchmark-results.json'
    },
    deps: {
      inline: [
        '@lspeasy/core',
        '@lspeasy/core/utils',
        '@lspeasy/core/utils/internal',
        '@lspeasy/core/protocol/enums',
        '@lspeasy/server',
        '@lspeasy/client'
      ]
    }
  },
  resolve: {
    alias: [
      {
        find: /^@lspeasy\/core\/utils\/internal$/,
        replacement: fileURLToPath(
          new URL('./packages/core/src/utils/internal.ts', import.meta.url)
        )
      },
      {
        find: /^@lspeasy\/core\/utils$/,
        replacement: fileURLToPath(new URL('./packages/core/src/utils/index.ts', import.meta.url))
      },
      {
        find: /^@lspeasy\/core\/protocol\/enums$/,
        replacement: fileURLToPath(
          new URL('./packages/core/src/protocol/enums.ts', import.meta.url)
        )
      },
      {
        find: /^@lspeasy\/core$/,
        replacement: fileURLToPath(new URL('./packages/core/src/index.ts', import.meta.url))
      },
      {
        find: /^@lspeasy\/server$/,
        replacement: fileURLToPath(new URL('./packages/server/src/index.ts', import.meta.url))
      },
      {
        find: /^@lspeasy\/client$/,
        replacement: fileURLToPath(new URL('./packages/client/src/index.ts', import.meta.url))
      }
    ]
  }
});
