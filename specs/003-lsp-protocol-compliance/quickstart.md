# Quickstart: LSP Protocol Compliance Gaps

## Prerequisites

- Node.js >= 20
- pnpm workspace installed
- Vitest test environment configured

## 1) Dynamic capability registration

```ts
const client = new LSPClient({
  dynamicRegistration: {
    allowUndeclaredDynamicRegistration: false
  }
});

await client.connect(transport);

// Server sends client/registerCapability
// Client stores registration + updates runtime capability view
const capabilities = client.getRuntimeCapabilities();
```

Compatibility mode example:

```ts
const client = new LSPClient({
  dynamicRegistration: {
    allowUndeclaredDynamicRegistration: true
  }
});
```

## 2) TCP transport

```ts
const transport = new TcpTransport({
  mode: 'client',
  host: '127.0.0.1',
  port: 2087,
  reconnect: {
    enabled: true,
    initialDelayMs: 250,
    maxDelayMs: 5000,
    multiplier: 2
  }
});
await client.connect(transport);
```

## 3) Dedicated worker transport

```ts
const worker = new Worker(new URL('./lsp-worker.js', import.meta.url), { type: 'module' });
const transport = new DedicatedWorkerTransport({ worker });
await client.connect(transport);
```

## 4) Shared worker transport

```ts
const sharedWorker = new SharedWorker('/lsp-shared-worker.js', { type: 'module' });
const transport = new SharedWorkerTransport({
  worker: sharedWorker,
  port: sharedWorker.port,
  clientId: crypto.randomUUID()
});
await client.connect(transport);
```

## 5) Partial result streaming

```ts
const result = await client.sendRequestWithPartialResults('textDocument/references', params, {
  token: 'refs-1',
  onPartial: (batch) => renderBatch(batch)
});

if (result.cancelled) {
  console.log('Cancelled with partials:', result.partialResults);
} else {
  console.log('Final aggregate:', result.finalResult);
}
```

## 6) Notebook sync APIs

```ts
await client.notebookDocument.didOpen(openParams);
await client.notebookDocument.didChange(changeParams);
await client.notebookDocument.didSave(saveParams);
await client.notebookDocument.didClose(closeParams);
```

Server side:

```ts
server.notebookDocument.onDidOpen((params) => handleOpen(params));
server.notebookDocument.onDidChange((params) => handleChange(params));
```

## 7) Verification checklist

- Dynamic registration register/unregister passes with strict + compatibility modes
- Unknown unregister ID returns `-32602`
- TCP server mode rejects extra concurrent connections
- Dedicated/Shared worker transports maintain ordering and request correlation
- Shared worker transport isolates routing per `MessagePort`
- Partial results preserve batch order and structured cancellation shape
- Notebook sync namespace methods are available and typed

## 8) Coverage and threshold check

- Core command: `pnpm test:coverage`
- Core package threshold target: `>= 80%` lines/functions/statements and `>= 75%` branches
- Core result: `lines 88.60%`, `functions 86.87%`, `statements 88.60%`, `branches 77.01%`
- Optional full-workspace baseline: `pnpm test:coverage:all` (currently below global thresholds).
