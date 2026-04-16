# Memory Verification

## Pending Requests and Event Listeners

Manual verification steps:

1. Run unit tests with `pnpm run test:unit`.
2. Run a client/server connection loop and monitor heap growth (Node --inspect or `node --trace-gc`).
3. Verify that pending requests and event listeners are cleared on disconnect/close.

Signals to watch:
- Heap usage stabilizes after repeated connect/disconnect cycles.
- No unbounded growth in pending request counts.
