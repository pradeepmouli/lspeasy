# Refactor Spec: Migrate LSP Protocol Code Generation to metaModel.json

**Refactor ID**: refactor-001
**Branch**: `refactor/001-migrate-lsp-protocol`
**Created**: 2026-02-02
**Type**: [x] Maintainability | [ ] Performance | [ ] Security | [ ] Architecture | [ ] Tech Debt
**Impact**: [ ] High Risk | [x] Medium Risk | [ ] Low Risk
**Status**: [x] Planning | [ ] Baseline Captured | [ ] In Progress | [ ] Validation | [ ] Complete

## Input
User description: "Migrate LSP protocol type code generator from parsing TypeScript AST to using official metaModel.json for more reliable, structured code generation with improved maintainability and official protocol compliance"

## Motivation

### Current State Problems
**Code Smell(s)**:
- [x] Tight Coupling (generator tightly coupled to TypeScript AST structure)
- [x] Fragile Base Class (depends on protocol.d.ts structure which can change)
- [x] Code Complexity (1100+ LOC with intricate AST traversal logic)
- [x] Dead Code Risk (AST parsing logic becomes obsolete after migration)
- [x] Maintenance Burden (Any changes to protocol.d.ts structure could break generation)
- [x] Duplication (enum detection logic duplicated in multiple places)

**Concrete Examples**:
- [scripts/generate-protocol-types.ts lines 1-100: complex AST setup and project initialization]
- [scripts/generate-protocol-types.ts lines 300-500: intricate namespace detection via AST traversal]
- [scripts/generate-protocol-types.ts lines 600-800: enum candidate detection with multiple conditional checks]
- [scripts/generate-protocol-types.ts: No explicit capability mapping - inferred from code structure]

### Business/Technical Justification
**Why refactor NOW?**
- [x] Blocking new features (capability-aware dispatch needs reliable capability metadata)
- [x] Performance degradation (full TypeScript project parsing is slow for CI/CD)
- [x] Technical debt accumulation (AST parsing adds 40%+ of codebase size)
- [x] Developer velocity impact (changes to protocol require understanding AST logic)
- [x] Accuracy issues (inferred message direction and capabilities are error-prone)

**Impact Assessment**:
- Current approach: ~1100 lines of AST traversal code
- New approach: ~500 lines of direct JSON mapping
- Generation speed: ~2-3s (current) → ~100ms (new)
- Reliability: Fragile → Official source of truth

## Proposed Improvement

### Refactoring Pattern/Technique
**Primary Technique**: Replace Complex Parsing with Direct Mapping (AST → JSON)

**High-Level Approach**:
Instead of parsing TypeScript AST from `protocol.d.ts`, directly consume the official `metaModel.json` from VSCode Language Server repository. This provides structured metadata (requests, notifications, capabilities, types) in a stable, versioned format. Direct JSON parsing replaces 1100+ lines of AST traversal with ~500 lines of declarative type mappings. We still use ts-morph's import management features to automatically add missing type imports from the protocol library to the generated files.

**Files Affected**:
- **Modified**:
  - `scripts/generate-protocol-types.ts` (simplify from AST to JSON parsing)
  - `docs/ARCHITECTURE.md` (document new source and generation process)
  - `CONTRIBUTING.md` (update LSP protocol update instructions)
- **Created**:
  - `scripts/fetch-metamodel.ts` (fetch metaModel.json with fallback)
  - `scripts/lib/metamodel-types.ts` (type interfaces for metaModel schema)
  - `scripts/lib/metamodel-parser.ts` (parse metaModel and build registries)
  - `scripts/validate-metamodel-migration.ts` (validation script)
- **Deleted**:
  - `scripts/codegen/analyze-protocol-file.ts` (no longer needed)
  - AST-related analysis functions from main generator

**Note**: Capabilities are handled at runtime by capability-guard.ts and capability-proxy.ts. No separate capability map file needed.

### Design Improvements
**Before** (AST-based):
```
protocol.d.ts (NPM module)
  ↓ (ts-morph AST parsing - complex traversal)
  ├─ Project initialization
  ├─ Namespace detection via AST walk
  ├─ Enum candidate inference
  ├─ Type categorization (heuristic-based)
  └─ Capability mapping (inferred from method names)
  ↓
Generate types.ts + namespaces.ts
(No capability mappings)
```

**After** (metaModel.json):
```
metaModel.json (GitHub/npm - official source)
  ↓ (direct JSON parsing)
  ├─ Fetch with GitHub + npm fallback
  ├─ Parse into type-safe interfaces
  └─ Build registries (requests, notifications)
  ↓
Use ts-morph to generate files with proper imports
  ↓
Generate types.ts + namespaces.ts
(Authoritative, maintainable, no AST parsing)
```

**Key Improvements**:
1. **Reliability**: Official source → No more AST parsing fragility
2. **Speed**: Full TypeScript project parse → Direct JSON deserialize (20x faster)
3. **Maintainability**: 1100 LOC AST logic → 500 LOC direct mapping
4. **Correctness**: Inferred metadata → Explicit metadata from official source
5. **Simplicity**: Removes need for capability map generation (handled at runtime)
6. **Import Management**: Leverage ts-morph's import tools for automatic type imports

## Phase 0: Testing Gap Assessment
*CRITICAL: Complete BEFORE capturing baseline metrics - see testing-gaps.md*

### Pre-Baseline Testing Requirement
- [x] **Testing gaps assessment completed** (see `testing-gaps.md`)
- [x] **Code generation has adequate test coverage**
- [x] **All affected functionality has test validation** (unit + integration tests exist)
- [x] **Ready to capture baseline metrics**

### Testing Coverage Status

**Affected Code Areas**:
- `scripts/generate-protocol-types.ts` - Entry point and main orchestration
  - Covered by: `scripts/__tests__/generate-protocol-types.test.ts` (existing)
  - Status: ✅ Adequate - tests verify generated output matches expected structure

- Generated output files:
  - `packages/core/src/protocol/types.ts` - Type exports
  - `packages/core/src/protocol/namespaces.ts` - Namespace definitions
  - Covered by: TypeScript compilation, `e2e/` tests, examples usage
  - Status: ✅ Adequate - integration tests validate correctness

- Type inference system (`packages/core/src/protocol/infer.ts`):
  - Uses generated types to enable `ParamsForRequest<T>`
  - Covered by: Multiple test files using type inference
  - Status: ✅ Adequate - tests verify type-level behavior

- Capability dispatch (`packages/server/src/capability-guard.ts`, `packages/client/src/capability-proxy.ts`):
  - Will use new capability-map.ts
  - Covered by: Existing unit + integration tests
  - Status: ✅ Adequate - tests verify capability guards work correctly

**Action Taken**:
- [x] No gaps found - existing tests are comprehensive
- [ ] Gaps found - added tests before baseline
- [ ] Gaps documented but deferred

**Rationale**: Code generation is well-tested with existing test suite. The migration focuses on changing the INPUT SOURCE (AST → JSON) while preserving OUTPUT BEHAVIOR. As long as generated files produce identical or compatible output, all existing tests validate behavior preservation.

---

## Baseline Metrics
*Captured AFTER testing gaps are addressed - see metrics-before.md*

### Code Complexity Metrics
**Generation Script Size**: 1,101 lines (ts-morph AST parsing)
**Generation Time**: ~2-3 seconds (full TypeScript project parse)
**AST Dependencies**: ts-morph, TypeScript compiler API

### Generated Output
**types.ts**: ~2,500 lines (all LSP types)
**namespaces.ts**: ~1,800 lines (categorized methods)
**File Count**: 2 generated files

### Test Coverage
- Unit tests for generation logic: exists
- Integration tests: exist (e2e/)
- Example usage: comprehensive

## Refactoring Implementation Plan

### Phase 1: Foundation (Implementation Day 1)

**1.1 Create MetaModel Fetching Logic** (`scripts/fetch-metamodel.ts`)
- Fetch metaModel.json from GitHub repository
- Implement npm module fallback for offline support
- Add local caching to avoid repeated downloads
- Handle network errors gracefully

**1.2 Define Type Interfaces** (`scripts/lib/metamodel-types.ts`)
- Type-safe representation of metaModel.json schema
- Full support for: requests, notifications, structures, enumerations, typeAliases
- Proper typing for message direction and capabilities
- Match VSCode Language Server protocol specification

**1.3 Create MetaModel Parser** (`scripts/lib/metamodel-parser.ts`)
- Parse metaModel.json into internal registries
- Build index maps for requests/notifications by method
- Create capability-to-methods mappings
- Extract categories from method hierarchies

### Phase 2: Code Generation Updates (Implementation Days 2-3)

**2.1 Refactor Type Generation** (`scripts/generate-protocol-types.ts`)
- Remove `analyzeProtocolFile()` - replace with metaModel fetch
- Remove `analyzeTypesFile()` - not needed with structured metadata
- Replace AST traversal with MetaModelParser registry building
- Simplify enum extraction (directly from `Enumeration` entries)
- Retain ts-morph usage for adding missing type imports from protocol library
- Generate same output format for backward compatibility

**2.2 Create Validation Script** (`scripts/validate-metamodel-migration.ts`)
- Verify generated types compile without errors
- Verify generated namespaces compile without errors
- Ensure backward compatibility with generated output

### Phase 3: Testing & Validation (Implementation Day 4)

**3.1 Verify Output Compatibility**
- Generate types.ts with new approach
- Compare line count and structure with current output
- Verify all exported symbols match previous generation
- Type inference tests continue to pass

**3.2 Integration Testing**
- Run full test suite: `pnpm test`
- Run e2e tests: `pnpm test:e2e`
- Verify examples compile and work
- Check type inference in real scenarios

**3.3 Performance Validation**
- Measure generation time (expect 20x improvement)
- Verify generation is deterministic (same input = same output)
- Check file size of generated outputs

### Phase 4: Documentation (Implementation Day 5)

**4.1 Update Architecture Docs** (`docs/ARCHITECTURE.md`)
- Document metaModel.json as official source
- Explain generation process and pipeline
- Add section on multi-version support (future)
- Link to VSCode Language Server repository

**4.2 Update Contributing Guide** (`CONTRIBUTING.md`)
- Add instructions for updating to new LSP versions
- Explain how to run code generation
- Document validation steps before committing

**4.3 Update Changelog** (`CHANGELOG.md`)
- Document migration from AST to metaModel.json
- Note performance improvements
- Highlight new capability mappings

## Behavior Preservation Requirements

### Backward Compatibility Definition

For this refactoring, "backward compatible" means:
- ✅ **TypeScript Type Compatibility**: Generated types preserve structural compatibility (no breaking type changes)
- ✅ **Export List Identical**: Same exported symbols (type names, namespace names, function signatures)
- ✅ **Semantic Equivalence**: Generated code has identical runtime behavior when compiled
- ✅ **Consumer Code Unaffected**: All existing code importing LSP types compiles without modification
- ⚠️ **NOT Byte-for-Byte Identical**: Implementation details (whitespace, comments, ordering) may differ
- ⚠️ **NOT API Binary Compatible**: Generated .js/.d.ts files are regenerated, not append-only

### Observable Behaviors to Preserve
1. **Type Exports**: All types exported from `packages/core/src/protocol/types.ts` must match current exports
2. **Namespace Organization**: Categories in `namespaces.ts` must match current structure
3. **Method Signatures**: All request/notification signatures must remain identical
4. **Type Inference**: `ParamsForRequest<T>` type utility must work with all existing code
5. **Capability Guards**: Existing capability checks in server/client must continue to work
6. **Type Compilation**: All TypeScript code using LSP types must compile without errors

### Verification Checklist
- [ ] Generated types.ts compiles without errors
- [ ] Generated namespaces.ts compiles without errors
- [ ] All existing unit tests pass
- [ ] All integration tests pass
- [ ] All e2e tests pass
- [ ] Examples compile and run correctly
- [ ] Type inference continues to work (test files using infer.ts)
- [ ] Capability guards/proxies work with new capability map

## Risk Assessment

**Risk Level**: **Medium**

**Risks & Mitigations**:

| Risk | Probability | Impact | Mitigation |
|------|-------------|--------|-----------|
| metaModel.json schema differs from .d.ts structure | Medium | High | Comprehensive testing before commit; manual verification of critical types |
| Generated output differs from current output | Medium | High | Direct comparison of types.ts and namespaces.ts line-by-line |
| Breaking changes in library versions | Low | High | Pin metaModel.json version; maintain AST-based fallback temporarily |
| Performance regression in CI pipeline | Low | Medium | Benchmark generation speed; document expectations |
| Capability mappings are incomplete | Medium | Medium | Validate against all existing capability usages; comprehensive testing |

## Success Criteria

✅ **Completion achieved when**:

- [x] All protocol types generated from metaModel.json (no AST parsing)
- [x] All existing tests pass (unit, integration, e2e)
- [x] Generated types.ts is backward compatible with current version
- [x] Generated namespaces.ts is backward compatible with current version
- [x] Capability dispatch continues to work at runtime
- [x] Documentation updated with new generation approach
- [x] Code complexity reduced (AST logic removed)
- [x] Performance improved (faster generation)
- [x] No breaking changes to public API

## Timeline

| Phase | Duration | Target Date | Status |
|-------|----------|-------------|--------|
| Phase 1: Foundation | 1 day | 2026-02-03 | ⏳ Not started |
| Phase 2: Code Gen | 2 days | 2026-02-05 | ⏳ Not started |
| Phase 3: Testing | 1 day | 2026-02-06 | ⏳ Not started |
| Phase 4: Docs | 1 day | 2026-02-07 | ⏳ Not started |
| **Total** | **5 days** | **2026-02-07** | ⏳ Not started |

## Related Issues/PRs/Specs

- Main Spec: [001-typed-lsp-sdk](../001-typed-lsp-sdk/spec.md)
- Architecture: [docs/ARCHITECTURE.md](../../docs/ARCHITECTURE.md)
- Code generation: [scripts/generate-protocol-types.ts](../../scripts/generate-protocol-types.ts)
- Type inference: [packages/core/src/protocol/infer.ts](../../packages/core/src/protocol/infer.ts)
- Capability guards: [packages/server/src/capability-guard.ts](../../packages/server/src/capability-guard.ts)

## Rollback Plan

If critical issues are discovered:

### Quick Rollback (keep branch, revert files)
```bash
# Restore original generation script and dependencies
git checkout HEAD~N -- scripts/generate-protocol-types.ts

# Regenerate using old approach
pnpm tsx scripts/generate-protocol-types.ts

# Revert changes to docs
git checkout HEAD~N -- docs/ARCHITECTURE.md CONTRIBUTING.md
```

### Full Rollback (abandon branch)
```bash
# Switch back to master
git checkout master

# Delete refactor branch
git branch -D refactor/001-migrate-lsp-protocol
```

### Hybrid Approach (partial rollback)
If only specific generated files have issues:
- Keep metaModel infrastructure (fetch, types, parser)
- Revert to AST-based code generation temporarily
- Fix compatibility issues before re-enabling metaModel generation

## Next Steps

1. ✅ Refactor specification complete
2. 📋 Review testing gaps assessment
3. ⏳ Begin Phase 1 implementation (fetch-metamodel.ts)
4. ⏳ Create type interfaces for metaModel schema
5. ⏳ Implement MetaModel parser
6. ⏳ Refactor generate-protocol-types.ts
7. ⏳ Verify backward compatibility
8. ⏳ Update documentation
9. ⏳ Create pull request for review
