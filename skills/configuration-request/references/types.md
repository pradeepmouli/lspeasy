# Types & Enums

## Types

### `HandlerSignature`
```ts
RequestHandler<ConfigurationParams, LSPAny[], void>
```

### `MiddlewareSignature`
```ts
(params: ConfigurationParams, token: CancellationToken, next: HandlerSignature) => HandlerResult<LSPAny[], void>
```
