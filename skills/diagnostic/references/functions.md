# Functions

## `create`
Creates a new Diagnostic literal.
```ts
create(range: Range, message: string, severity?: DiagnosticSeverity, code?: string | number, source?: string, relatedInformation?: DiagnosticRelatedInformation[]): Diagnostic
```
**Parameters:**
- `range: Range` — 
- `message: string` — 
- `severity: DiagnosticSeverity` (optional) — 
- `code: string | number` (optional) — 
- `source: string` (optional) — 
- `relatedInformation: DiagnosticRelatedInformation[]` (optional) — 
**Returns:** `Diagnostic`

## `is`
Checks whether the given literal conforms to the Diagnostic interface.
```ts
is(value: any): value is Diagnostic
```
**Parameters:**
- `value: any` — 
**Returns:** `value is Diagnostic`
