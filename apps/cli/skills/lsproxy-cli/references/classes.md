# Classes

## session

### `RefactorSession`
```ts
constructor(opts: SessionOptions): RefactorSession
```
**Methods:**
- `start(): Promise<void>` — Spawn the server (or reuse a pre-built transport) and complete the LSP handshake.
- `open(anchorFile: string): Promise<void>` — Notify the server that an anchor file is open.
- `requestWithRetry<R>(run: () => Promise<R | null | undefined>): Promise<R | null>` — Run a request immediately and retry with exponential backoff while the
server returns null (i.e. it is still indexing). Gives up after
`indexWaitMs` total elapsed time and returns null.

Initial retry delay: 250 ms, doubling each round, capped at 5 s per
attempt. The first attempt is always immediate so fast servers pay no
extra latency at all.
- `takeCapturedEdits(): WorkspaceEdit[]` — Drain ALL edits pushed by the server via `workspace/applyEdit` since the
last drain, in arrival order. Returns an empty array if none were pushed.
Callers apply them in order so a multi-applyEdit command is fully honored.
- `stop(): Promise<void>` — Shut down the client and kill the server process.
