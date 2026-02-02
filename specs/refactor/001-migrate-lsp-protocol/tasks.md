# Refactor Tasks: LSP Protocol Code Generation Migration

**Refactor ID**: refactor-001
**Branch**: refactor/001-migrate-lsp-protocol
**Target**: 2026-02-07 (5 days)

---

## Task Format

```
- [ ] [TaskID] [P] Description with file path
```

- `[P]` = Parallelizable (can be done independently)
- Tasks without `[P]` must be done sequentially

---

## Phase 1: Foundation (Day 1 - Feb 3, 2026)

### Setup & Infrastructure

- [ ] T001 Create metaModel fetcher in scripts/fetch-metamodel.ts
  - Implement fetchMetaModel() function
  - Add GitHub URL fetching with https module
  - Add local caching to .cache/metamodel/
  - Implement npm module fallback
  - Add error handling for network failures
  - Export fetchMetaModel(options?) function
  
- [ ] T002 [P] Define metaModel type interfaces in scripts/lib/metamodel-types.ts
  - Create MetaModel root interface
  - Create Request, Notification interfaces
  - Create Structure, Property interfaces
  - Create Enumeration, EnumerationEntry interfaces
  - Create TypeAlias interface
  - Create Type union types (BaseType, ReferenceType, ArrayType, etc.)
  - Add JSDoc documentation
  - Ensure all types match metaModel.json schema

- [ ] T003 Create metaModel parser in scripts/lib/metamodel-parser.ts
  - Create MetaModelParser class
  - Implement buildRegistry() method
  - Implement getCategories() method
  - Implement resolveType() helper
  - Implement getAllStructures() method
  - Implement getAllEnumerations() method
  - Implement getAllTypeAliases() method
  - Add error handling

- [ ] T004 Validate Phase 1 completion
  - Run type checking: pnpm run type-check
  - Run linting: pnpm run lint
  - Test fetching metaModel.json manually
  - Test parser builds registries correctly
  - Verify all new files compile
  - Commit Phase 1 changes

---

## Phase 2: Code Generation Refactoring (Days 2-3 - Feb 4-5, 2026)

### Preparation

- [ ] T005 Backup current implementation
  - Copy scripts/generate-protocol-types.ts to scripts/generate-protocol-types.ts.backup
  - Commit current state
  - Create git tag: refactor-001-phase1-complete

### Refactor Generator Structure

- [ ] T006 Remove AST analysis code from scripts/generate-protocol-types.ts
  - Remove analyzeProtocolFile() function
  - Remove analyzeTypesFile() function
  - Remove AST-related imports (keep ts-morph Project/SourceFile)
  - Remove AST-related class properties
  - Commit: "refactor: remove AST analysis functions"

- [ ] T007 Add metaModel imports to scripts/generate-protocol-types.ts
  - Import fetchMetaModel from scripts/fetch-metamodel.ts
  - Import MetaModelParser from scripts/lib/metamodel-parser.ts
  - Import type interfaces from scripts/lib/metamodel-types.ts
  - Add parser property to class
  - Commit: "refactor: add metaModel imports"

### Refactor Initialization

- [ ] T008 Update initialize() method in scripts/generate-protocol-types.ts
  - Replace protocol.d.ts loading with fetchMetaModel()
  - Create MetaModelParser instance
  - Call buildRegistry()
  - Keep ts-morph Project for output generation
  - Remove Project initialization for protocol analysis
  - Test initialization works
  - Commit: "refactor: update initialization to use metaModel"

### Refactor Type Discovery

- [ ] T009 Replace type discovery in scripts/generate-protocol-types.ts
  - Replace discoverTypes() with parser.getAllStructures()
  - Use parser.getAllTypeAliases() for type aliases
  - Build allTypes Set from metaModel data
  - Update type categorization logic
  - Test type discovery works
  - Commit: "refactor: replace type discovery with metaModel parser"

- [ ] T010 Replace enum discovery in scripts/generate-protocol-types.ts
  - Replace discoverEnums() with parser.getAllEnumerations()
  - Build enumCandidates Map from metaModel enumerations
  - Remove AST-based enum detection
  - Test enum discovery works
  - Commit: "refactor: replace enum discovery with metaModel parser"

- [ ] T011 Update category detection in scripts/generate-protocol-types.ts
  - Use parser.getCategories() for category extraction
  - Remove AST-based category detection
  - Test categories are correct
  - Commit: "refactor: use metaModel parser for categories"

### Refactor Code Generation

- [ ] T012 Update generateTypes() method in scripts/generate-protocol-types.ts
  - Generate type exports from metaModel structures
  - Generate type exports from metaModel type aliases
  - Maintain same output format
  - Use ts-morph for automatic import addition
  - Test types.ts generation
  - Compare output with baseline
  - Commit: "refactor: update type generation"

- [ ] T013 Update generateNamespaces() method in scripts/generate-protocol-types.ts
  - Generate namespaces from registry data
  - Use categories from parser
  - Maintain same output format
  - Use ts-morph for automatic import addition
  - Test namespaces.ts generation
  - Compare output with baseline
  - Commit: "refactor: update namespace generation"

### Cleanup

- [ ] T014 Clean up and simplify scripts/generate-protocol-types.ts
  - Remove unused helper functions
  - Remove complex AST traversal logic
  - Simplify type resolution
  - Update comments and documentation
  - Verify LOC reduced to ~500
  - Commit: "refactor: clean up generator code"

### Validation Infrastructure

- [ ] T015 Create validation script in scripts/validate-metamodel-migration.ts
  - Check generated files exist
  - Import and validate types.ts compiles
  - Import and validate namespaces.ts compiles
  - Run TypeScript compiler check
  - Compare line counts with baseline
  - Run test suite
  - Report success/failure clearly
  - Add script to package.json

- [ ] T016 Validate Phase 2 completion
  - Generate types: pnpm tsx scripts/generate-protocol-types.ts
  - Verify types.ts created and valid
  - Verify namespaces.ts created and valid
  - Run type checking: pnpm run type-check
  - Run tests: pnpm test
  - Run validation: pnpm tsx scripts/validate-metamodel-migration.ts
  - All tests must pass (100%)
  - Commit Phase 2 changes

---

## Phase 3: Testing & Validation (Day 4 - Feb 6, 2026)

### Output Comparison

- [ ] T017 Compare generated output with baseline
  - Generate files with new implementation
  - Compare types.ts line count with git history
  - Compare namespaces.ts line count with git history
  - Check all exports are present
  - Verify critical types exist (Position, Range, TextDocument, etc.)
  - Verify critical namespaces exist (textDocument, workspace, etc.)
  - Document any differences
  - Commit: "test: validate output comparison"

### Integration Testing

- [ ] T018 [P] Run full test suite
  - Execute: pnpm test
  - Verify 100% pass rate
  - Document any failures
  - Fix any issues found

- [ ] T019 [P] Run e2e tests
  - Execute: pnpm test:e2e
  - Verify all e2e tests pass
  - Document any failures
  - Fix any issues found

- [ ] T020 [P] Test type inference
  - Run: pnpm test -- packages/core/test/protocol/infer.test.ts
  - Verify ParamsForRequest<T> works
  - Verify ResultForRequest<T> works
  - Test with sample methods (textDocument/hover, etc.)
  - Fix any issues found

- [ ] T021 [P] Test capability dispatch
  - Run: pnpm test -- packages/server/test/capability-guard.test.ts
  - Run: pnpm test -- packages/client/test/capability-proxy.test.ts
  - Verify capability guards work at runtime
  - Verify capability proxies work at runtime
  - Fix any issues found

- [ ] T022 [P] Verify examples compile and run
  - Execute: pnpm run type-check
  - Test: cd examples && pnpm tsx client/basic-client.ts
  - Verify all examples work
  - Document any failures
  - Fix any issues found

### Performance Validation

- [ ] T023 Measure and validate performance
  - Measure generation time: time pnpm tsx scripts/generate-protocol-types.ts
  - Run 3 times and average
  - Verify < 500ms (target: 20x improvement from ~2-3s)
  - Test deterministic output (run twice, diff results)
  - Check memory usage is reasonable
  - Document performance metrics
  - Commit: "test: validate performance improvements"

### Edge Case Testing

- [ ] T024 Test edge cases and error handling
  - Test with missing metaModel.json (should use fallback)
  - Test with network failure (should use cache)
  - Test with malformed metaModel.json (should error gracefully)
  - Verify error messages are clear
  - Document error handling behavior
  - Commit: "test: validate edge cases"

- [ ] T025 Validate Phase 3 completion
  - All tests pass (100%)
  - Performance targets met (< 500ms, 20x improvement)
  - Edge cases handled gracefully
  - Output matches baseline expectations
  - Documentation accurate
  - Ready for documentation phase

---

## Phase 4: Documentation (Day 5 - Feb 7, 2026)

### Architecture Documentation

- [ ] T026 [P] Update docs/ARCHITECTURE.md
  - Add "Code Generation from metaModel.json" section
  - Explain metaModel.json vs protocol.d.ts approach
  - Document generation process flow
  - Add architecture diagram
  - Explain ts-morph usage for imports
  - List advantages of new approach
  - Add link to metaModel.json source
  - Commit: "docs: update architecture documentation"

### Contributing Guidelines

- [ ] T027 [P] Update CONTRIBUTING.md
  - Add "Updating LSP Protocol Support" section
  - Explain how to run code generation
  - Document validation steps
  - Add troubleshooting tips
  - Provide examples
  - Commit: "docs: update contributing guidelines"

### Changelog

- [ ] T028 [P] Update CHANGELOG.md
  - Add entry for this refactoring
  - Note performance improvements (20x faster)
  - Document code simplification (55% LOC reduction)
  - List what changed (technical details)
  - Confirm no breaking changes
  - Credit approach (official metaModel.json source)
  - Commit: "docs: update changelog"

### Review & Polish

- [ ] T029 Review all documentation
  - Read ARCHITECTURE.md for accuracy
  - Read CONTRIBUTING.md for clarity
  - Read CHANGELOG.md for completeness
  - Verify all links work
  - Check formatting is correct
  - Get peer review if available

- [ ] T030 Validate Phase 4 completion
  - All documentation updated
  - Documentation accurate and clear
  - Links verified
  - Formatting correct
  - Ready for PR

---

## Final Validation & PR

### Pre-PR Checklist

- [ ] T031 Final validation before PR
  - All phases complete (1-4)
  - All tests pass (100%)
  - Performance targets met (< 500ms)
  - Documentation updated (ARCHITECTURE, CONTRIBUTING, CHANGELOG)
  - Code reviewed (self-review)
  - Git history clean (meaningful commits)
  - No debug code left
  - No commented-out code
  - All acceptance criteria met

### Pull Request

- [ ] T032 Create pull request
  - Push branch: git push origin refactor/001-migrate-lsp-protocol
  - Create PR on GitHub
  - Use PR template from implementation-plan.md
  - Link to refactor-spec.md
  - Summarize changes (AST → metaModel.json)
  - Note performance improvements (20x faster)
  - Confirm all tests pass (100%)
  - List documentation updates
  - Request review
  - Address feedback
  - Merge when approved

---

## Task Summary

**Total Tasks**: 32

### By Phase
- Phase 1 (Foundation): 4 tasks
- Phase 2 (Code Generation): 12 tasks
- Phase 3 (Testing): 9 tasks
- Phase 4 (Documentation): 5 tasks
- Final: 2 tasks

### Parallelizable Tasks
Tasks marked with [P] can be done independently:
- T002 (metaModel types)
- T018-T022 (integration tests)
- T026-T028 (documentation)

### Critical Path
Sequential tasks that must be done in order:
1. T001 (fetcher) → T003 (parser) → T004 (validate)
2. T005-T007 (setup) → T008 (initialize) → T009-T011 (discovery) → T012-T013 (generation) → T014 (cleanup)
3. T015-T016 (validation)
4. T017 (comparison) → T023-T025 (testing)
5. T029-T032 (review & PR)

---

## Progress Tracking

Update this section as tasks are completed:

**Phase 1**: 0/4 tasks complete (0%)
**Phase 2**: 0/12 tasks complete (0%)
**Phase 3**: 0/9 tasks complete (0%)
**Phase 4**: 0/5 tasks complete (0%)
**Final**: 0/2 tasks complete (0%)

**Overall**: 0/32 tasks complete (0%)

---

## Quick Reference

### Key Files
- `scripts/fetch-metamodel.ts` - Fetches metaModel.json
- `scripts/lib/metamodel-types.ts` - Type definitions
- `scripts/lib/metamodel-parser.ts` - Parser logic
- `scripts/generate-protocol-types.ts` - Main generator
- `scripts/validate-metamodel-migration.ts` - Validation

### Key Commands
```bash
# Generate types
pnpm tsx scripts/generate-protocol-types.ts

# Validate migration
pnpm tsx scripts/validate-metamodel-migration.ts

# Run tests
pnpm test
pnpm test:e2e

# Type check
pnpm run type-check

# Lint
pnpm run lint

# Measure performance
time pnpm tsx scripts/generate-protocol-types.ts
```

### Success Criteria
- ✅ All tests pass (100%)
- ✅ Generation < 500ms (20x improvement)
- ✅ LOC reduced to ~500 (55% reduction)
- ✅ No breaking changes
- ✅ All documentation updated

---

## Related Documents

- [Refactor Spec](refactor-spec.md)
- [Implementation Plan](implementation-plan.md)
- [Testing Gaps](testing-gaps.md)
- [Behavioral Snapshot](behavioral-snapshot.md)
- [Metrics Before](metrics-before.md)
