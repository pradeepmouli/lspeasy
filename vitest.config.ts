import { defineConfig } from 'vitest/config';

export default defineConfig({
  test: {
    globals: true,
    environment: 'node',
    include: ['packages/**/test/**/*.test.ts', 'packages/**/src/**/*.test.ts'],
    exclude: ['**/node_modules/**', '**/dist/**', '**/build/**'],
    coverage: {
      provider: 'v8',
      reporter: ['text', 'html', 'lcov'],
      include: ['packages/*/src/**/*.ts'],
      exclude: ['**/*.test.ts', '**/*.spec.ts', '**/test/**', '**/dist/**', '**/node_modules/**'],
      thresholds: {
        lines: 74,
        functions: 72,
        branches: 64,
        statements: 74
      }
    },
    typecheck: {
      enabled: false // Run type checking separately with tsc
    }
  }
});
