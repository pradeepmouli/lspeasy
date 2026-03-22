# Functions

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
