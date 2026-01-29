import { bench, describe } from 'vitest';
import { unique, flatten, chunk, capitalize } from './packages/utils/src/index';

describe('Benchmarks', () => {
  describe('Array Operations', () => {
    const largeArray = Array.from({ length: 10000 }, (_, i) => i % 100);
    const deepArray = Array.from({ length: 100 }, () => [1, 2, [3, 4]]);

    bench('unique - large array', () => {
      unique(largeArray);
    });

    bench('flatten - deep array', () => {
      flatten(deepArray, 2);
    });

    bench('chunk - large array', () => {
      chunk(largeArray, 10);
    });
  });

  describe('String Operations', () => {
    const longString = 'Hello World'.repeat(100);

    bench('capitalize', () => {
      capitalize('hello');
    });

    bench('capitalize - long string', () => {
      capitalize(longString);
    });
  });
});
