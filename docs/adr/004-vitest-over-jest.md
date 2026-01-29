# ADR-004: Vitest over Jest

**Date**: 2024-01-01
**Status**: Accepted

## Context

Testing framework selection needed to balance:
- TypeScript support
- Development experience
- Performance
- Integration with build tools
- Ecosystem maturity

Main contenders:
- Jest (proven, widely-used)
- Vitest (modern, TypeScript-first)
- Mocha + other tools (modular, but requires assembly)

## Decision

**We chose Vitest as the testing framework** instead of Jest.

## Rationale

1. **Vite Integration**: Built on top of Vite, shares configuration
2. **TypeScript-First**: Excellent out-of-the-box TypeScript support
3. **ESM Native**: Full ES Modules support (Jest has limitations)
4. **Speed**: Significantly faster test execution
5. **API Compatibility**: Jest-like API, easy migration path
6. **Unified Config**: Fewer configuration files to maintain
7. **Modern Codebase**: Active development, regular updates

### Performance Comparison

```
Jest: ~3-5 seconds for moderate test suite
Vitest: ~800ms-1.5s for same test suite
```

## Consequences

### Positive
- ✅ Faster test feedback loop
- ✅ Better TypeScript integration
- ✅ Native ESM support without transformations
- ✅ Easier configuration with existing Vite setup
- ✅ Better for monorepo testing
- ✅ Cleaner async/await support

### Negative
- ⚠️ Smaller ecosystem than Jest
- ⚠️ Some legacy integrations may need adapters
- ⚠️ Newer tool, fewer Stack Overflow answers
- ⚠️ Some enterprise tools may lack Vitest support

## Configuration Example

```typescript
// vitest.config.ts
import { defineConfig } from 'vitest/config';

export default defineConfig({
  test: {
    globals: true,
    environment: 'node',
    coverage: {
      provider: 'v8',
      reporter: ['text', 'html', 'lcov'],
      lines: 80,
      functions: 80,
      branches: 75,
      statements: 80,
    },
  },
});
```

## Alternatives Considered

1. **Jest**: Mature, widespread, but slower and harder TypeScript setup
2. **Mocha**: Modular but requires manual setup and config
3. **Node's native test runner**: Limited features, early stage

## Migration Path (Jest → Vitest)

If switching back to Jest:
1. Create `jest.config.js`
2. Reinstall Jest and related packages
3. Update test scripts in `package.json`
4. Adjust imports if using Vitest-specific APIs
5. Remove Vitest config

Most tests will work with minimal changes due to Jest API compatibility.

## Testing Best Practices

```typescript
import { describe, it, expect, beforeEach } from 'vitest';

describe('MyFunction', () => {
  let result: any;

  beforeEach(() => {
    result = null;
  });

  it('should work correctly', () => {
    result = myFunction();
    expect(result).toBeDefined();
  });

  it('should handle errors', () => {
    expect(() => myFunction(null)).toThrow();
  });
});
```

## References

- [Vitest Documentation](https://vitest.dev/)
- [Vite Documentation](https://vitejs.dev/)
- [Jest Documentation](https://jestjs.io/)
- [Vitest vs Jest](https://vitest.dev/guide/comparisons.html)
