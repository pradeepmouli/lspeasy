# ADR-002: oxlint and oxfmt

**Date**: 2024-01-01
**Status**: Accepted

## Context

Code quality tooling requires choosing:
- A linter for finding code issues
- A formatter for consistent code style

Traditional choices were:
- ESLint + Prettier
- ESLint + Prettier with additional plugins
- Rust-based tools (oxlint + oxfmt)

## Decision

**We chose oxlint for linting and oxfmt for formatting** instead of ESLint/Prettier.

## Rationale

1. **Performance**: Rust-based tools are 10-20x faster than Node.js alternatives
2. **Simplicity**: Single tool replaces both ESLint and Prettier, reducing configuration complexity
3. **Modern**: Built with modern understanding of JavaScript/TypeScript linting
4. **Configuration**: Cleaner configuration files without extensive plugin setup
5. **Zero-Config**: Works well with minimal configuration
6. **Active Development**: Regular updates and improvements

### Performance Comparison

```
ESLint: ~2-3 seconds for moderate codebase
oxlint: ~100-300ms for same codebase
```

## Consequences

### Positive
- ✅ Significantly faster linting and formatting
- ✅ Faster CI/CD pipeline execution
- ✅ Better developer experience (quicker feedback)
- ✅ Simpler configuration
- ✅ Single tool to maintain

### Negative
- ⚠️ Less ecosystem maturity than ESLint (though rapidly improving)
- ⚠️ Fewer plugins/extensions compared to ESLint
- ⚠️ Smaller community (but growing)
- ⚠️ Some edge cases may require workarounds

## Alternatives Considered

1. **ESLint + Prettier**: Proven, large ecosystem, slower, requires more config
2. **Rome/Biome**: Similar Rust-based approach, more opinionated, larger scope
3. **Cargo-based tools**: Less integrated with JavaScript ecosystem

## Migration Path

To switch back to ESLint/Prettier if needed:
1. Create `.eslintrc.json` and `.prettierrc.json` with equivalent rules
2. Install ESLint and Prettier packages
3. Update `package.json` scripts
4. Update `.github/workflows/ci.yml`
5. Remove oxlint/oxfmt configs

## References

- [oxlint GitHub](https://github.com/oxc-project/oxc)
- [oxfmt GitHub](https://github.com/oxc-project/oxc)
- [ESLint](https://eslint.org/)
- [Prettier](https://prettier.io/)
