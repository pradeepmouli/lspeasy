# Types & Enums

## Types

### `HandlerSignature`
```ts
RequestHandler<ShowDocumentParams, ShowDocumentResult, void>
```

### `MiddlewareSignature`
```ts
(params: ShowDocumentParams, next: HandlerSignature) => HandlerResult<ShowDocumentResult, void>
```
