# ADR-003: ES Modules (ESM)

**Date**: 2024-01-01
**Status**: Accepted

## Context

Node.js supports both CommonJS (CJS) and ES Modules (ESM). We needed to choose which module system to use for this template, considering:
- Industry trends
- Node.js support
- Ecosystem compatibility
- TypeScript integration
- Future-proofing

## Decision

**We chose ES Modules (ESM) as the primary module system** for all TypeScript code.

## Rationale

1. **Future Standard**: ESM is the standard module system for JavaScript (ECMAScript 2015+)
2. **Node.js Official Direction**: Node.js moving towards ESM as primary
3. **Widespread Adoption**: Most modern packages now support ESM
4. **Better Tooling**: TypeScript and bundlers have excellent ESM support
5. **Async By Default**: ESM is async-friendly, better for modern patterns
6. **Tree Shaking**: Better dead code elimination with ESM
7. **Named Exports**: More flexible export/import patterns

## Consequences

### Positive
- ✅ Future-proof, aligns with JavaScript standards
- ✅ Better interoperability with modern packages
- ✅ Smaller bundle sizes with better tree-shaking
- ✅ Clearer import/export semantics
- ✅ Better static analysis capabilities

### Negative
- ⚠️ Some older packages still CommonJS-only
- ⚠️ Slightly more complex loading behavior
- ⚠️ Dynamic requires need workarounds
- ⚠️ Top-level await considerations

## Configuration

```json
{
  "type": "module",
  "compilerOptions": {
    "module": "ESNext",
    "target": "ES2022"
  }
}
```

## Alternatives Considered

1. **CommonJS**: Mature, many packages support it, but deprecated in favor of ESM
2. **Mixed CJS/ESM**: Complex, harder to maintain and debug

## Migration Path

If reverting to CommonJS:
1. Change `"type": "commonjs"` in `package.json`
2. Update TypeScript config: `"module": "CommonJS"`
3. Convert imports: `import` → `require`
4. Convert exports: `export` → `module.exports`
5. Update `package.json` exports

## Interoperability with CommonJS

For consuming CommonJS modules in ESM:

```typescript
// Direct import of CJS module
import cjsModule from 'some-cjs-package';

// Using createRequire for edge cases
import { createRequire } from 'module';
const require = createRequire(import.meta.url);
```

## References

- [Node.js ES Modules Documentation](https://nodejs.org/api/esm.html)
- [MDN: JavaScript Modules](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Guide/Modules)
- [TypeScript ESM Guide](https://www.typescriptlang.org/docs/handbook/esm-node.html)
