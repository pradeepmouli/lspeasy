# Behavioral Snapshot: LSP Protocol Code Generation Migration

**Refactor**: refactor-001-migrate-lsp-protocol
**Date**: 2026-02-02
**Purpose**: Document observable behaviors to verify they are preserved after refactoring

---

## Overview

This document captures key observable behaviors of the code generation system BEFORE refactoring. After refactoring, all behaviors must remain identical or compatible.

**Key Invariant**: The refactoring changes HOW code is generated (AST → JSON), but NOT WHAT is generated. All output files and their usage must be identical.

---

## Key Behaviors to Preserve

### Behavior 1: Generate types.ts with All LSP Types
**What**: Running the generator produces a complete types.ts file with all LSP protocol types
**Input**: `pnpm tsx scripts/generate-protocol-types.ts`
**Expected Output**:
- File: `packages/core/src/protocol/types.ts` is created/updated
- Size: Approximately 2,500 lines
- Content: All LSP types (Request, Response, Notification, etc.)
- Quality: Compiles without errors

**How to Verify Before Refactoring**:
```bash
# Generate types
pnpm tsx scripts/generate-protocol-types.ts

# Check file exists and size
wc -l packages/core/src/protocol/types.ts

# Verify it compiles
pnpm run type-check

# Record line count for comparison
git diff --stat packages/core/src/protocol/types.ts
```

**Actual Output (Before Refactoring)**:
- [To be captured when baseline is established]

**Actual Output (After Refactoring)**:
- [To be verified - must be identical or better]

---

### Behavior 2: Generate namespaces.ts with Categorized Methods
**What**: Running the generator produces a namespaces.ts file with methods organized by category
**Input**: `pnpm tsx scripts/generate-protocol-types.ts`
**Expected Output**:
- File: `packages/core/src/protocol/namespaces.ts` is created/updated
- Size: Approximately 1,800 lines
- Content: Categorized namespaces (textDocument, workspace, window, etc.)
- Quality: Compiles without errors
- Categories: At least 20+ main categories (textDocument, workspace, client, etc.)

**How to Verify Before Refactoring**:
```bash
# Check file exists and size
wc -l packages/core/src/protocol/namespaces.ts

# Verify structure
grep "export namespace" packages/core/src/protocol/namespaces.ts | wc -l

# Verify it compiles
pnpm run type-check

# Record structure for comparison
head -50 packages/core/src/protocol/namespaces.ts
```

**Actual Output (Before Refactoring)**:
- [To be captured when baseline is established]

**Actual Output (After Refactoring)**:
- [To be verified - must be identical or better]

---

### Behavior 3: Type Inference Works for All Request/Response Types
**What**: The type inference system (`ParamsForRequest<T>`) works correctly with generated types
**Input**: TypeScript code using `ParamsForRequest<'textDocument/hover'>` etc.
**Expected Output**:
- Type is correctly inferred to `HoverParams`
- IDE autocomplete works
- TypeScript compiler validates types
- Return type is correctly inferred

**How to Verify Before Refactoring**:
```bash
# Run tests that use type inference
pnpm test -- packages/core/test/protocol/infer.test.ts

# Verify examples compile (they use type inference)
pnpm run type-check

# Run e2e tests (they use inference in real code)
pnpm test:e2e
```

**Test Evidence (Before Refactoring)**:
- All inference tests pass: ✅ [percentage]
- E2E tests pass: ✅ [count]
- Examples compile: ✅ [count]

**Test Evidence (After Refactoring)**:
- All inference tests pass: ✅ [must be same or better]
- E2E tests pass: ✅ [must be same or better]
- Examples compile: ✅ [must be same or better]

---

### Behavior 4: Generated Types Compile Without Errors
**What**: All TypeScript code that uses generated types compiles successfully
**Input**: Full TypeScript project with generated types
**Expected Output**:
- TypeScript compiler returns no errors
- No type mismatches in generated code
- All type exports are accessible

**How to Verify Before Refactoring**:
```bash
# Run type checker
pnpm run type-check

# Specifically check generated files compile
npx tsgo --noEmit packages/core/src/protocol/types.ts
npx tsgo --noEmit packages/core/src/protocol/namespaces.ts

# Build all packages (they depend on generated types)
pnpm run build
```

**Test Evidence (Before Refactoring)**:
- Type checking passes: ✅
- Build succeeds: ✅
- No errors reported: ✅

**Test Evidence (After Refactoring)**:
- Type checking passes: ✅ [must be same or better]
- Build succeeds: ✅ [must be same or better]
- No errors reported: ✅ [must be same or better]

---

### Behavior 5: All LSP Methods Have Correct Signatures
**What**: Each LSP method (request/notification) has the correct parameter and return types
**Input**: Generated namespaces with method definitions
**Expected Output**:
- `textDocument/hover` has params: `HoverParams`, returns: `Hover | null`
- `textDocument/completion` has params: `CompletionParams`, returns: `CompletionItem[]`
- `initialized` notification has params: `InitializedParams`
- All method signatures match LSP specification

**How to Verify Before Refactoring**:
```bash
# Extract sample method signatures
grep -A 5 "textDocument/hover" packages/core/src/protocol/namespaces.ts

# Run e2e tests (they verify real method signatures)
pnpm test:e2e

# Check examples (they use real methods)
pnpm tsx examples/client/basic-client.ts --type-check
```

**Sample Methods to Verify**:
- `textDocument/hover`
- `textDocument/completion`
- `initialized`
- `shutdown`
- `exit`

**Test Evidence (Before Refactoring)**:
- E2E tests pass: ✅ [number of tests]
- Examples work: ✅ [number of examples]
- Method signatures correct: ✅ [spot checks done]

**Test Evidence (After Refactoring)**:
- E2E tests pass: ✅ [must be same or better]
- Examples work: ✅ [must be same or better]
- Method signatures correct: ✅ [must be same or better]

---

### Behavior 6: Capability-Aware Dispatch Works at Runtime
**What**: Capability guards and proxies work correctly with generated type information
**Input**: Request to send `textDocument/hover` (requires `hoverProvider` capability)
**Expected Output**:
- Capability check succeeds if capability is supported
- Method can be dispatched correctly
- Type safety is enforced
- **Note**: Capabilities are validated at runtime, not via static map

**How to Verify Before Refactoring**:
```bash
# Run capability guard tests
pnpm test -- packages/server/test/capability-guard.test.ts

# Run capability proxy tests
pnpm test -- packages/client/test/capability-proxy.test.ts

# Integration tests verify real capability dispatch
pnpm test:e2e
```

**Test Evidence (Before Refactoring)**:
- Capability guard tests pass: ✅ [number of tests]
- Capability proxy tests pass: ✅ [number of tests]
- Integration tests pass: ✅ [number of tests]

**Test Evidence (After Refactoring)**:
- Capability guard tests pass: ✅ [must be same or better]
- Capability proxy tests pass: ✅ [must be same or better]
- Integration tests pass: ✅ [must be same or better]

---

## Verification Test Commands

### Run Before Refactoring
```bash
# Capture baseline behaviors
pnpm test
pnpm test:e2e
pnpm run type-check
pnpm run build

# Measure generation time and file sizes
time pnpm tsx scripts/generate-protocol-types.ts
du -h packages/core/src/protocol/types.ts
du -h packages/core/src/protocol/namespaces.ts
```

### Run After Refactoring
```bash
# Verify all behaviors preserved
pnpm test
pnpm test:e2e
pnpm run type-check
pnpm run build

# Verify file sizes match expectations
wc -l packages/core/src/protocol/types.ts
wc -l packages/core/src/protocol/namespaces.ts

# Measure generation time (should be faster)
time pnpm tsx scripts/generate-protocol-types.ts

# Validate migration
pnpm tsx scripts/validate-metamodel-migration.ts
```

### Critical Validation
```bash
# These commands MUST succeed after refactoring
pnpm test --run              # All tests pass
pnpm test:e2e --run          # All e2e tests pass
pnpm run type-check          # No type errors
pnpm run build               # Build succeeds
```

---

## Behavioral Invariants (Non-Negotiable)

1. ✅ **Type Compatibility**: All existing code using `types.ts` continues to compile
2. ✅ **Namespace Structure**: All namespaces and methods present with same signatures
3. ✅ **Type Inference**: `ParamsForRequest<T>` and `ResultForRequest<T>` work identically
4. ✅ **Method Availability**: All LSP methods (requests/notifications) available
5. ✅ **Capability Mapping**: Capability → method mappings correct
6. ✅ **Error Handling**: Same error scenarios produce same results
7. ✅ **Performance**: No significant performance regression in code generation

---

## Behavior Change Assessment

**Question**: Is this a behavior-changing refactoring?

**Answer**: NO - This is a BEHAVIOR-PRESERVING refactoring.

- ✅ Input changes: TypeScript AST → metaModel.json
- ❌ Output does NOT change: Same types.ts, same namespaces.ts
- ❌ API does NOT change: Same exports, same signatures
- ❌ Behavior does NOT change: Same observable behavior

**Consequence**: All existing tests remain valid and should pass without modification.

---

## Success Criteria

✅ **Refactoring is complete when**:

1. All test suites pass (unit, integration, e2e): **100% pass rate**
2. Type checking passes: **No TypeScript errors**
3. Build succeeds: **All packages build successfully**
4. Generated files are valid: **types.ts and namespaces.ts compile**
5. Behavioral snapshot matches: **All observable behaviors preserved**
6. Examples work: **All examples compile and run**
7. Performance improved: **Generation time reduced (20x expected)**

---

## Baseline Metrics (To Be Captured)

**Before Refactoring**:
- [ ] Generation time: `[time in seconds]`
- [ ] types.ts line count: `[count]`
- [ ] namespaces.ts line count: `[count]`
- [ ] Test pass rate: `[percentage]`
- [ ] Type check status: `[pass/fail]`

**After Refactoring**:
- [ ] Generation time: `[time in seconds]` (expect ~100ms, was ~2-3s)
- [ ] types.ts line count: `[count]` (should be identical)
- [ ] namespaces.ts line count: `[count]` (should be identical)
- [ ] Test pass rate: `[percentage]` (must be 100%)
- [ ] Type check status: `[pass/fail]` (must pass)

---

## Documentation References

- **Refactoring Spec**: [refactor-spec.md](refactor-spec.md)
- **Testing Gap Assessment**: [testing-gaps.md](testing-gaps.md)
- **Code Generation**: [scripts/generate-protocol-types.ts](../../scripts/generate-protocol-types.ts)
- **Type Inference**: [packages/core/src/protocol/infer.ts](../../packages/core/src/protocol/infer.ts)
- **Related Spec**: [001-typed-lsp-sdk](../001-typed-lsp-sdk/spec.md)

---

## Sign-Off

**Behavioral snapshot prepared**: 2026-02-02
**Status**: ✅ READY TO IMPLEMENT

This snapshot documents the expected behaviors before refactoring begins. All behaviors must be verified to match after refactoring is complete.
