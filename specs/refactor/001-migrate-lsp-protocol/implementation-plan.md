# Implementation Plan: LSP Protocol Code Generation Migration

**Refactor ID**: refactor-001
**Branch**: refactor/001-migrate-lsp-protocol
**Target Completion**: 2026-02-07 (5 days)

---

## Overview

Migrate code generation from TypeScript AST parsing to metaModel.json parsing while preserving all existing behavior. Use ts-morph for import management only.

**Goal**: Replace complex AST analysis (1,100 LOC) with simple JSON parsing (500 LOC) while maintaining identical output and 100% test pass rate.

---

## Phase 1: Foundation (Day 1 - Feb 3, 2026)

### Task 1.1: Create metaModel.json Fetcher
**File**: `scripts/fetch-metamodel.ts`

**Implementation Steps**:
1. Create function to fetch metaModel.json from GitHub URL
2. Add local caching mechanism (.cache/metamodel/)
3. Implement npm module fallback (vscode-languageserver-protocol)
4. Add error handling for network failures
5. Export `fetchMetaModel(options?)` function

**Acceptance Criteria**:
- [ ] Fetches from GitHub successfully
- [ ] Falls back to npm module if GitHub fails
- [ ] Caches locally to avoid repeated downloads
- [ ] Returns parsed JSON object
- [ ] Handles network errors gracefully

**Test**:
```bash
pnpm tsx scripts/fetch-metamodel.ts
# Should download and cache metaModel.json
```

---

### Task 1.2: Define metaModel Type Interfaces
**File**: `scripts/lib/metamodel-types.ts`

**Implementation Steps**:
1. Create interfaces matching metaModel.json schema:
   - `MetaModel` (root)
   - `Request`, `Notification`
   - `Structure`, `Property`
   - `Enumeration`, `EnumerationEntry`
   - `TypeAlias`
   - Type union types: `Type`, `BaseType`, `ReferenceType`, etc.
2. Add JSDoc comments from schema documentation
3. Export all type interfaces

**Acceptance Criteria**:
- [ ] All interfaces match official metaModel.json schema
- [ ] Types are fully type-safe (no `any`)
- [ ] JSDoc documentation added
- [ ] File compiles without errors

**Test**:
```bash
pnpm tsx -e "import * as types from './scripts/lib/metamodel-types.js'; console.log('Types loaded')"
```

---

### Task 1.3: Create metaModel Parser
**File**: `scripts/lib/metamodel-parser.ts`

**Implementation Steps**:
1. Create `MetaModelParser` class with constructor taking `MetaModel`
2. Implement `buildRegistry()` - index requests and notifications by method name
3. Implement `getCategories()` - extract categories from method names (e.g., "textDocument" from "textDocument/hover")
4. Implement helper methods:
   - `resolveType(type: Type): Type` - resolve type references
   - `getAllStructures(): Structure[]`
   - `getAllEnumerations(): Enumeration[]`
   - `getAllTypeAliases(): TypeAlias[]`
5. Add error handling for malformed data

**Acceptance Criteria**:
- [ ] Parser successfully indexes all requests
- [ ] Parser successfully indexes all notifications
- [ ] Categories extracted correctly from method names
- [ ] Type resolution works for references
- [ ] All public methods have JSDoc

**Test**:
```bash
# Create simple test script
pnpm tsx -e "
import { fetchMetaModel } from './scripts/fetch-metamodel.js';
import { MetaModelParser } from './scripts/lib/metamodel-parser.js';
const model = await fetchMetaModel();
const parser = new MetaModelParser(model);
const registry = parser.buildRegistry();
console.log('Requests:', registry.requests.size);
console.log('Notifications:', registry.notifications.size);
console.log('Categories:', parser.getCategories().size);
"
```

---

### Task 1.4: Phase 1 Validation
**Validation Steps**:
1. Run type checking: `pnpm run type-check`
2. Run linting: `pnpm run lint`
3. Verify all new files compile
4. Manual test: fetch and parse metaModel.json

**Exit Criteria**:
- [ ] All files compile without errors
- [ ] Linting passes
- [ ] Can successfully fetch and parse metaModel.json
- [ ] Parser builds registries correctly

---

## Phase 2: Code Generation Refactoring (Days 2-3 - Feb 4-5, 2026)

### Task 2.1: Backup Current Implementation
**Steps**:
1. Create backup: `cp scripts/generate-protocol-types.ts scripts/generate-protocol-types.ts.backup`
2. Commit current state to git
3. Tag: `git tag refactor-001-phase1-complete`

---

### Task 2.2: Refactor Main Generator (Part 1 - Structure)
**File**: `scripts/generate-protocol-types.ts`

**Implementation Steps**:
1. **Remove** AST analysis imports and functions:
   - Remove `analyzeProtocolFile()`
   - Remove `analyzeTypesFile()`
   - Keep ts-morph imports for Project/SourceFile
2. **Add** metaModel imports:
   - Import `fetchMetaModel`
   - Import `MetaModelParser`
   - Import type interfaces
3. **Update** main class structure:
   - Replace `protocolFile` path with metaModel fetching
   - Remove AST-related properties
   - Add `parser: MetaModelParser` property

**Acceptance Criteria**:
- [ ] Old AST code removed
- [ ] New imports added
- [ ] Class structure updated
- [ ] File still compiles

---

### Task 2.3: Refactor Main Generator (Part 2 - Initialization)
**File**: `scripts/generate-protocol-types.ts`

**Implementation Steps**:
1. **Update** `initialize()` method:
   - Fetch metaModel.json instead of loading protocol.d.ts
   - Create parser instance
   - Build registries
2. **Remove** Project initialization for protocol analysis
3. **Keep** Project initialization for output file generation (ts-morph usage)

**Acceptance Criteria**:
- [ ] Initialization fetches metaModel successfully
- [ ] Parser is initialized correctly
- [ ] Output file generation still uses ts-morph

**Code Pattern**:
```typescript
async initialize() {
  console.log('Fetching metaModel.json...');
  const metaModel = await fetchMetaModel({ cache: true });
  
  this.parser = new MetaModelParser(metaModel);
  console.log('Building registries...');
  this.registry = this.parser.buildRegistry();
  
  // Keep ts-morph for output generation
  this.outputProject = new Project({
    compilerOptions: { /* ... */ }
  });
}
```

---

### Task 2.4: Refactor Main Generator (Part 3 - Type Discovery)
**File**: `scripts/generate-protocol-types.ts`

**Implementation Steps**:
1. **Replace** `discoverTypes()` method:
   - Use `parser.getAllStructures()`
   - Use `parser.getAllTypeAliases()`
   - Build `allTypes` Set from metaModel data
2. **Replace** `discoverEnums()` method:
   - Use `parser.getAllEnumerations()`
   - Build `enumCandidates` Map from metaModel enumerations
3. **Update** category detection:
   - Use `parser.getCategories()`

**Acceptance Criteria**:
- [ ] All types discovered from metaModel
- [ ] All enums discovered from metaModel
- [ ] Categories extracted correctly
- [ ] Data structures populated (allTypes, enumCandidates, categories)

---

### Task 2.5: Refactor Main Generator (Part 4 - Code Generation)
**File**: `scripts/generate-protocol-types.ts`

**Implementation Steps**:
1. **Update** `generateTypes()` method:
   - Generate type exports from metaModel structures and type aliases
   - Use existing ts-morph code for adding imports
   - Maintain same output format
2. **Update** `generateNamespaces()` method:
   - Generate namespaces from registry data
   - Use categories from parser
   - Use existing ts-morph code for adding imports
   - Maintain same output format
3. **Test** generation produces identical output

**Acceptance Criteria**:
- [ ] types.ts generated with all LSP types
- [ ] namespaces.ts generated with all methods
- [ ] Output format matches current implementation
- [ ] Imports added automatically via ts-morph

---

### Task 2.6: Clean Up and Simplify
**File**: `scripts/generate-protocol-types.ts`

**Implementation Steps**:
1. Remove unused helper functions
2. Remove complex AST traversal logic
3. Simplify type resolution (now direct from metaModel)
4. Clean up comments and documentation
5. Reduce overall LOC to ~500

**Acceptance Criteria**:
- [ ] All dead code removed
- [ ] No AST parsing logic remains
- [ ] LOC reduced significantly
- [ ] Code is cleaner and more maintainable

---

### Task 2.7: Create Validation Script
**File**: `scripts/validate-metamodel-migration.ts`

**Implementation Steps**:
1. Create validation script that:
   - Imports generated types and namespaces
   - Runs TypeScript compiler check
   - Compares line counts with baseline
   - Runs test suite
   - Reports success/failure
2. Add to package.json scripts

**Acceptance Criteria**:
- [ ] Script validates generated files compile
- [ ] Script runs test suite
- [ ] Script reports clear success/failure
- [ ] Can be run as: `pnpm validate:migration`

**Script Structure**:
```typescript
async function validate() {
  console.log('🔍 Validating metaModel migration...\n');
  
  // 1. Check files exist
  // 2. Check files compile
  // 3. Run type checking
  // 4. Run tests
  // 5. Compare with baseline
  
  console.log('\n✅ Migration validation passed!');
}
```

---

### Task 2.8: Phase 2 Validation
**Validation Steps**:
1. Generate types: `pnpm tsx scripts/generate-protocol-types.ts`
2. Check output files created and valid
3. Run type checking: `pnpm run type-check`
4. Run tests: `pnpm test`
5. Run validation: `pnpm tsx scripts/validate-metamodel-migration.ts`

**Exit Criteria**:
- [ ] types.ts generated successfully
- [ ] namespaces.ts generated successfully
- [ ] All files compile without errors
- [ ] All tests pass (100% pass rate)
- [ ] Validation script passes

---

## Phase 3: Testing & Validation (Day 4 - Feb 6, 2026)

### Task 3.1: Output Comparison
**Steps**:
1. Generate files with new implementation
2. Compare with git history (before changes)
3. Check line counts match expectations
4. Verify all exports are present
5. Manual spot-check critical types

**Comparison Commands**:
```bash
# Compare types.ts
wc -l packages/core/src/protocol/types.ts
git diff HEAD~1 packages/core/src/protocol/types.ts | head -100

# Compare namespaces.ts
wc -l packages/core/src/protocol/namespaces.ts
git diff HEAD~1 packages/core/src/protocol/namespaces.ts | head -100

# Check exports
grep "^export " packages/core/src/protocol/types.ts | wc -l
grep "^export namespace" packages/core/src/protocol/namespaces.ts | wc -l
```

**Acceptance Criteria**:
- [ ] types.ts structure matches previous version
- [ ] namespaces.ts structure matches previous version
- [ ] All critical types present (Position, Range, TextDocument, etc.)
- [ ] All method namespaces present (textDocument, workspace, etc.)

---

### Task 3.2: Integration Testing
**Steps**:
1. Run full test suite: `pnpm test`
2. Run e2e tests: `pnpm test:e2e`
3. Check type inference tests pass
4. Check capability tests pass
5. Verify examples compile and run

**Test Commands**:
```bash
# Full test suite
pnpm test

# E2E tests
pnpm test:e2e

# Type inference
pnpm test -- packages/core/test/protocol/infer.test.ts

# Capability tests
pnpm test -- packages/server/test/capability-guard.test.ts
pnpm test -- packages/client/test/capability-proxy.test.ts

# Examples
pnpm run type-check
cd examples && pnpm tsx client/basic-client.ts
```

**Acceptance Criteria**:
- [ ] All unit tests pass (100%)
- [ ] All integration tests pass (100%)
- [ ] All e2e tests pass (100%)
- [ ] Type inference works correctly
- [ ] Capability dispatch works correctly
- [ ] All examples compile and run

---

### Task 3.3: Performance Validation
**Steps**:
1. Measure generation time (before/after)
2. Verify 20x speed improvement achieved
3. Check memory usage is reasonable
4. Verify deterministic output (same input → same output)

**Performance Commands**:
```bash
# Measure generation time
time pnpm tsx scripts/generate-protocol-types.ts

# Run multiple times to verify consistency
for i in {1..3}; do
  echo "Run $i:"
  time pnpm tsx scripts/generate-protocol-types.ts
done

# Check output is deterministic
pnpm tsx scripts/generate-protocol-types.ts
cp packages/core/src/protocol/types.ts /tmp/types1.ts
pnpm tsx scripts/generate-protocol-types.ts
diff /tmp/types1.ts packages/core/src/protocol/types.ts
```

**Acceptance Criteria**:
- [ ] Generation time < 500ms (was ~2-3s)
- [ ] Performance improvement 20x or better
- [ ] Output is deterministic
- [ ] No memory leaks

---

### Task 3.4: Edge Case Testing
**Steps**:
1. Test with missing metaModel.json (should use fallback)
2. Test with network failure (should use cache/fallback)
3. Test with malformed metaModel.json (should error gracefully)
4. Verify error messages are helpful

**Test Scenarios**:
```bash
# Test fallback mechanism
rm -rf .cache/metamodel
# Disconnect network
pnpm tsx scripts/generate-protocol-types.ts

# Test with invalid JSON
echo "invalid" > .cache/metamodel/metaModel-3.17.0.json
pnpm tsx scripts/generate-protocol-types.ts
```

**Acceptance Criteria**:
- [ ] Fallback works when GitHub unavailable
- [ ] Cache works correctly
- [ ] Errors are caught and reported clearly
- [ ] No crashes on invalid input

---

### Task 3.5: Phase 3 Validation
**Final Checks**:
1. All tests pass
2. Performance targets met
3. Edge cases handled
4. Documentation accurate

**Exit Criteria**:
- [ ] 100% test pass rate
- [ ] Performance improved 20x
- [ ] All edge cases handled gracefully
- [ ] Ready for documentation phase

---

## Phase 4: Documentation (Day 5 - Feb 7, 2026)

### Task 4.1: Update ARCHITECTURE.md
**File**: `docs/ARCHITECTURE.md`

**Updates**:
1. Add section: "Code Generation from metaModel.json"
2. Explain new source (metaModel.json vs protocol.d.ts)
3. Document generation process
4. Add architecture diagram
5. Explain ts-morph usage for imports

**Content Outline**:
```markdown
## Code Generation

### metaModel.json Source

The LSP protocol types are generated from the official `metaModel.json`...

**Source**: https://github.com/microsoft/vscode-languageserver-node/...

**Generation Process**:
1. Fetch metaModel.json (cached locally)
2. Parse into type-safe TypeScript interfaces
3. Generate types.ts and namespaces.ts
4. Use ts-morph to add missing imports
5. Validate output compiles

**Advantages**:
- Official, versioned source of truth
- Structured metadata
- 20x faster than AST parsing
- Simpler, more maintainable
```

**Acceptance Criteria**:
- [ ] Section added to ARCHITECTURE.md
- [ ] Clear explanation of new approach
- [ ] Links to metaModel.json source
- [ ] Diagrams updated

---

### Task 4.2: Update CONTRIBUTING.md
**File**: `CONTRIBUTING.md`

**Updates**:
1. Add section: "Updating LSP Protocol Support"
2. Explain how to run code generation
3. Document validation steps
4. Add troubleshooting tips

**Content Outline**:
```markdown
## Updating LSP Protocol Support

When a new LSP protocol version is released:

1. Run code generation:
   ```bash
   pnpm tsx scripts/generate-protocol-types.ts
   ```

2. Validate changes:
   ```bash
   pnpm tsx scripts/validate-metamodel-migration.ts
   pnpm test
   ```

3. Review generated diffs
4. Update CHANGELOG.md
5. Commit changes

### Troubleshooting

**Generation fails**: Check network connection...
**Tests fail**: Verify backward compatibility...
```

**Acceptance Criteria**:
- [ ] Clear instructions for updating protocol
- [ ] Troubleshooting section added
- [ ] Examples provided

---

### Task 4.3: Update CHANGELOG.md
**File**: `CHANGELOG.md`

**Updates**:
1. Add entry for this refactoring
2. Note performance improvements
3. List breaking changes (should be none)
4. Credit contributors

**Content**:
```markdown
## [Unreleased]

### Changed
- Migrated LSP protocol code generation from TypeScript AST parsing to metaModel.json parsing
- Improved generation speed by 20x (~100ms vs ~2-3s)
- Simplified code generation logic (500 LOC vs 1,100 LOC)

### Technical
- Code generator now uses official metaModel.json from VSCode Language Server
- Removed complex AST traversal logic
- Retained ts-morph for automatic import management
- No breaking changes - all existing types and namespaces preserved
```

**Acceptance Criteria**:
- [ ] Entry added to CHANGELOG.md
- [ ] Changes documented clearly
- [ ] No breaking changes listed

---

### Task 4.4: Update README (if needed)
**File**: `README.md`

**Check if updates needed**:
- [ ] Code generation mentioned? Update if yes
- [ ] Performance claims updated
- [ ] Installation/setup still accurate

---

### Task 4.5: Phase 4 Validation
**Final Documentation Review**:
1. Read all updated documentation
2. Verify accuracy
3. Check links work
4. Ensure formatting correct
5. Get peer review if possible

**Exit Criteria**:
- [ ] All documentation updated
- [ ] Documentation accurate and clear
- [ ] Links work
- [ ] Ready for PR

---

## Final Validation & Completion

### Pre-PR Checklist
- [ ] All phases complete
- [ ] All tests pass (100%)
- [ ] Performance targets met
- [ ] Documentation updated
- [ ] Code reviewed (self-review)
- [ ] Git history clean
- [ ] No debug code left
- [ ] CHANGELOG.md updated

### Create Pull Request
**Steps**:
1. Push branch: `git push origin refactor/001-migrate-lsp-protocol`
2. Create PR on GitHub
3. Fill in PR template:
   - Link to refactor-spec.md
   - Summarize changes
   - Note performance improvements
   - Confirm all tests pass
   - List documentation updates
4. Request review
5. Address feedback
6. Merge when approved

**PR Title**: `refactor: migrate LSP protocol code generation to metaModel.json`

**PR Description Template**:
```markdown
## Summary
Migrates LSP protocol code generation from TypeScript AST parsing to official metaModel.json parsing.

## Motivation
- Current AST parsing is fragile and complex (1,100 LOC)
- Slow generation time (~2-3 seconds)
- Blocks capability-aware features

## Changes
- ✅ New: metaModel.json fetching with cache and fallback
- ✅ New: Type-safe metaModel parser
- ✅ Refactored: generate-protocol-types.ts (now ~500 LOC)
- ✅ Removed: Complex AST analysis logic
- ✅ Retained: ts-morph for import management

## Performance
- Generation time: 2-3s → ~100ms (20x improvement)
- Code complexity: 1,100 LOC → 500 LOC (55% reduction)

## Testing
- [x] All unit tests pass (100%)
- [x] All integration tests pass (100%)
- [x] All e2e tests pass (100%)
- [x] Type inference validated
- [x] Capability dispatch validated
- [x] Examples compile and run

## Documentation
- [x] ARCHITECTURE.md updated
- [x] CONTRIBUTING.md updated
- [x] CHANGELOG.md updated

## Related
- Spec: [refactor-spec.md](specs/refactor/001-migrate-lsp-protocol/refactor-spec.md)
- Testing: [testing-gaps.md](specs/refactor/001-migrate-lsp-protocol/testing-gaps.md)
```

---

## Rollback Procedure

If critical issues discovered at any phase:

### Quick Rollback
```bash
# Restore original generator
git checkout HEAD~N -- scripts/generate-protocol-types.ts

# Regenerate with old approach
pnpm tsx scripts/generate-protocol-types.ts

# Verify
pnpm test
```

### Full Rollback
```bash
# Return to master
git checkout master

# Delete refactor branch
git branch -D refactor/001-migrate-lsp-protocol
```

---

## Success Metrics

### Code Quality
- ✅ LOC reduced from 1,100 to ~500 (target: 50%+ reduction)
- ✅ Cyclomatic complexity reduced
- ✅ No AST parsing logic remains

### Performance
- ✅ Generation time < 500ms (target: 20x improvement)
- ✅ Deterministic output
- ✅ No memory leaks

### Reliability
- ✅ 100% test pass rate
- ✅ No breaking changes
- ✅ Backward compatible
- ✅ All examples work

### Maintainability
- ✅ Code is simpler and easier to understand
- ✅ Official source of truth (metaModel.json)
- ✅ Better error messages
- ✅ Documentation updated

---

## Timeline

| Day | Date | Phase | Tasks | Status |
|-----|------|-------|-------|--------|
| 1 | Feb 3 | Phase 1: Foundation | 1.1-1.4 | ⏳ Pending |
| 2 | Feb 4 | Phase 2: Code Gen (Part 1) | 2.1-2.4 | ⏳ Pending |
| 3 | Feb 5 | Phase 2: Code Gen (Part 2) | 2.5-2.8 | ⏳ Pending |
| 4 | Feb 6 | Phase 3: Testing | 3.1-3.5 | ⏳ Pending |
| 5 | Feb 7 | Phase 4: Documentation | 4.1-4.5 | ⏳ Pending |

**Total**: 5 days

---

## Notes & Decisions

### Design Decisions
- ✅ Use metaModel.json as source (official, structured)
- ✅ Retain ts-morph for import management only
- ✅ No separate capability map (handled at runtime)
- ✅ Cache metaModel.json locally
- ✅ Fallback to npm module if GitHub unavailable

### Risk Mitigations
- Comprehensive testing at each phase
- Backup original implementation
- Git tags at phase boundaries
- Validation script for quick checks
- Clear rollback procedure

---

## Contact & Resources

**Refactor Spec**: [refactor-spec.md](refactor-spec.md)
**Testing Gaps**: [testing-gaps.md](testing-gaps.md)
**Behavioral Snapshot**: [behavioral-snapshot.md](behavioral-snapshot.md)

**VSCode Language Server**: https://github.com/microsoft/vscode-languageserver-node
**metaModel.json**: https://github.com/microsoft/vscode-languageserver-node/blob/main/protocol/metaModel.json
