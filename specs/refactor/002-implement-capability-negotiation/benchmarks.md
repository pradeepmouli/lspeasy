# Benchmarks

## Request Dispatch / Handler Lookup

**Command**:
```bash
pnpm vitest bench -c vitest.benchmark.config.ts --run packages/server/test/benchmarks/dispatcher.bench.ts
```

**Baseline**: First run (no prior baseline).

**Result**:
- dispatch request handler lookup: 2,334,314.86 hz (mean ~0.0004s)
- dispatch notification handler lookup: 5,605,167.28 hz (mean ~0.0002s)
- notification lookup ~2.40x faster

**Notes**:
- Dispatcher benchmarks live in packages/server/test/benchmarks/dispatcher.bench.ts.
- Benchmark results are written to benchmark-results.json by Vitest.
