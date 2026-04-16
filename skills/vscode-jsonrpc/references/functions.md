# Functions

## connection.d

### `is`
```ts
is(value: any): value is string | number
```
**Parameters:**
- `value: any`
**Returns:** `value is string | number`

### `is`
```ts
is(value: any): value is ConnectionStrategy
```
**Parameters:**
- `value: any`
**Returns:** `value is ConnectionStrategy`

### `is`
```ts
is(value: any): value is ConnectionOptions
```
**Parameters:**
- `value: any`
**Returns:** `value is ConnectionOptions`

### `fromString`
```ts
fromString(value: string): Trace
```
**Parameters:**
- `value: string`
**Returns:** `Trace`

### `toString`
```ts
toString(value: Trace): TraceValues
```
**Parameters:**
- `value: Trace`
**Returns:** `TraceValues`

### `fromString`
```ts
fromString(value: string): TraceFormat
```
**Parameters:**
- `value: string`
**Returns:** `TraceFormat`

### `is`
```ts
is(value: any): value is IdCancellationReceiverStrategy
```
**Parameters:**
- `value: any`
**Returns:** `value is IdCancellationReceiverStrategy`

### `is`
```ts
is(value: any): value is CancellationSenderStrategy
```
**Parameters:**
- `value: any`
**Returns:** `value is CancellationSenderStrategy`

### `is`
```ts
is(value: any): value is CancellationStrategy
```
**Parameters:**
- `value: any`
**Returns:** `value is CancellationStrategy`

### `is`
```ts
is(value: any): value is MessageStrategy
```
**Parameters:**
- `value: any`
**Returns:** `value is MessageStrategy`

## ral.d

### `install`
```ts
install(ral: RAL): void
```
**Parameters:**
- `ral: RAL`

## messageReader.d

### `is`
```ts
is(value: any): value is MessageReader
```
**Parameters:**
- `value: any`
**Returns:** `value is MessageReader`

## messageWriter.d

### `is`
```ts
is(value: any): value is MessageWriter
```
**Parameters:**
- `value: any`
**Returns:** `value is MessageWriter`
