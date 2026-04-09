# Functions

## `is`
```ts
is(value: any): value is TextDocumentFilter
```
**Parameters:**
- `value: any` — 
**Returns:** `value is TextDocumentFilter`

## `is`
```ts
is(value: any): value is NotebookDocumentFilter
```
**Parameters:**
- `value: any` — 
**Returns:** `value is NotebookDocumentFilter`

## `is`
```ts
is(value: any): value is NotebookCellTextDocumentFilter
```
**Parameters:**
- `value: any` — 
**Returns:** `value is NotebookCellTextDocumentFilter`

## `is`
```ts
is(value: any[] | null | undefined): value is DocumentSelector
```
**Parameters:**
- `value: any[] | null | undefined` — 
**Returns:** `value is DocumentSelector`

## `hasId`
```ts
hasId(value: object): value is { id: string }
```
**Parameters:**
- `value: object` — 
**Returns:** `value is { id: string }`

## `is`
```ts
is(value: any): value is TextDocumentRegistrationOptions
```
**Parameters:**
- `value: any` — 
**Returns:** `value is TextDocumentRegistrationOptions`

## `isIncremental`
Checks whether the information describes a delta event.
```ts
isIncremental(event: TextDocumentContentChangeEvent): event is { range: Range; rangeLength?: number; text: string }
```
**Parameters:**
- `event: TextDocumentContentChangeEvent` — 
**Returns:** `event is { range: Range; rangeLength?: number; text: string }`

## `isFull`
Checks whether the information describes a full replacement event.
```ts
isFull(event: TextDocumentContentChangeEvent): event is { text: string }
```
**Parameters:**
- `event: TextDocumentContentChangeEvent` — 
**Returns:** `event is { text: string }`

## `is`
```ts
is(value: any): value is RelativePattern
```
**Parameters:**
- `value: any` — 
**Returns:** `value is RelativePattern`

## `is`
```ts
is(value: any): value is WorkDoneProgressOptions
```
**Parameters:**
- `value: any` — 
**Returns:** `value is WorkDoneProgressOptions`

## `hasWorkDoneProgress`
```ts
hasWorkDoneProgress(value: any): value is { workDoneProgress: boolean }
```
**Parameters:**
- `value: any` — 
**Returns:** `value is { workDoneProgress: boolean }`

## `is`
```ts
is(value: ProgressType<any>): value is ProgressType<WorkDoneProgressBegin | WorkDoneProgressReport | WorkDoneProgressEnd>
```
**Parameters:**
- `value: ProgressType<any>` — 
**Returns:** `value is ProgressType<WorkDoneProgressBegin | WorkDoneProgressReport | WorkDoneProgressEnd>`

## `is`
```ts
is(value: any): value is DiagnosticServerCancellationData
```
**Parameters:**
- `value: any` — 
**Returns:** `value is DiagnosticServerCancellationData`

## `is`
```ts
is(value: any): value is NotebookCellKind
```
**Parameters:**
- `value: any` — 
**Returns:** `value is NotebookCellKind`

## `create`
```ts
create(executionOrder: number, success?: boolean): ExecutionSummary
```
**Parameters:**
- `executionOrder: number` — 
- `success: boolean` (optional) — 
**Returns:** `ExecutionSummary`

## `is`
```ts
is(value: any): value is ExecutionSummary
```
**Parameters:**
- `value: any` — 
**Returns:** `value is ExecutionSummary`

## `equals`
```ts
equals(one: ExecutionSummary | undefined, other: ExecutionSummary | undefined): boolean
```
**Parameters:**
- `one: ExecutionSummary | undefined` — 
- `other: ExecutionSummary | undefined` — 
**Returns:** `boolean`

## `create`
```ts
create(kind: NotebookCellKind, document: string): NotebookCell
```
**Parameters:**
- `kind: NotebookCellKind` — 
- `document: string` — 
**Returns:** `NotebookCell`

## `is`
```ts
is(value: any): value is NotebookCell
```
**Parameters:**
- `value: any` — 
**Returns:** `value is NotebookCell`

## `diff`
```ts
diff(one: NotebookCell, two: NotebookCell): Set<keyof NotebookCell>
```
**Parameters:**
- `one: NotebookCell` — 
- `two: NotebookCell` — 
**Returns:** `Set<keyof NotebookCell>`

## `create`
```ts
create(uri: string, notebookType: string, version: number, cells: NotebookCell[]): NotebookDocument
```
**Parameters:**
- `uri: string` — 
- `notebookType: string` — 
- `version: number` — 
- `cells: NotebookCell[]` — 
**Returns:** `NotebookDocument`

## `is`
```ts
is(value: any): value is NotebookDocument
```
**Parameters:**
- `value: any` — 
**Returns:** `value is NotebookDocument`

## `is`
```ts
is(value: any): value is NotebookCellArrayChange
```
**Parameters:**
- `value: any` — 
**Returns:** `value is NotebookCellArrayChange`

## `create`
```ts
create(start: number, deleteCount: number, cells?: NotebookCell[]): NotebookCellArrayChange
```
**Parameters:**
- `start: number` — 
- `deleteCount: number` — 
- `cells: NotebookCell[]` (optional) — 
**Returns:** `NotebookCellArrayChange`
