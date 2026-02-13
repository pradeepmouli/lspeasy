import { defineConfig, mergeConfig } from 'vitest/config';
import baseConfig from './vitest.config';

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
