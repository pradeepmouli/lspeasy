---
"@lsproxy/proxy": patch
"@lspeasy/core": patch
---

Fix backend spawn failures crashing the proxy daemon and fix `MessageReader`/`MessageWriter` wiping out other listeners on a shared stream, so a misconfigured `lsp.json` entry (e.g. a binary that isn't on PATH) now surfaces as a clear error to the CLI instead of crashing the entire daemon (taking down every other language's live backend) or leaving the request hanging/silently failing.

- `BackendPool.startBackend` now attaches an `error` handler to the spawned backend process and rejects `ensureBackend`'s promise with a clear message instead of letting Node's default "unhandled 'error' event" behavior crash the daemon process.
- `MessageReader.close()` / `MessageWriter.close()` now remove only their own listeners instead of calling `stream.removeAllListeners()`, which previously deleted other consumers' listeners on a shared socket (e.g. `SocketTransport`'s own `'close'` handler) before the stream's `'close'` event ever fired — silently preventing `LSPClient.handleClose()` from ever running when a peer connection died abruptly.
