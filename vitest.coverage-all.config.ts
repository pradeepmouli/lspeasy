import { defineConfig, mergeConfig } from 'vitest/config';
import baseConfig from './vitest.config';

/**
 * Coverage configuration for the full workspace.
 * Current thresholds reflect the baseline state across all packages.
 * Target thresholds are >= 80% lines/functions/statements and >= 75% branches,
 * which the core package already meets. These lower thresholds allow incremental
 * improvement across the entire monorepo.
 */
export default mergeConfig(
  baseConfig,
  defineConfig({
    test: {
      coverage: {
        thresholds: {
          lines: 74,
          functions: 72,
          branches: 64,
          statements: 74
        }
      }
    }
  })
);
