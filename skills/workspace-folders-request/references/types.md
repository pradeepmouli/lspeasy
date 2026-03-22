# Types & Enums

## Types

### `HandlerSignature`
```ts
RequestHandler0<WorkspaceFolder[] | null, void>
```

### `MiddlewareSignature`
```ts
(token: CancellationToken, next: HandlerSignature) => HandlerResult<WorkspaceFolder[] | null, void>
```
