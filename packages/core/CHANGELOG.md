# @lspeasy/core

## 1.0.1

### Patch Changes

- Fix request lifecycle handling to avoid unhandled promise rejections in cancellation and error-response paths.

  Relocate the pino middleware workspace package from `packages/middleware-pino` to `packages/middleware/pino` and update monorepo workspace/config documentation paths.

  Adjust release and changeset automation defaults for this repository's `master` default branch.
