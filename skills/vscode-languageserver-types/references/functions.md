# Functions

## main.d

### `is`
```ts
is(value: any): value is string
```
**Parameters:**
- `value: any`
**Returns:** `value is string`

### `is`
```ts
is(value: any): value is string
```
**Parameters:**
- `value: any`
**Returns:** `value is string`

### `is`
```ts
is(value: any): value is number
```
**Parameters:**
- `value: any`
**Returns:** `value is number`

### `is`
```ts
is(value: any): value is number
```
**Parameters:**
- `value: any`
**Returns:** `value is number`

### `create`
Creates a new Position literal from the given line and character.
```ts
create(line: number, character: number): Position
```
**Parameters:**
- `line: number` — The position's line.
- `character: number` — The position's character.
**Returns:** `Position`

### `is`
Checks whether the given literal conforms to the Position interface.
```ts
is(value: any): value is Position
```
**Parameters:**
- `value: any`
**Returns:** `value is Position`

### `create`
Create a new Range literal.
```ts
create(start: Position, end: Position): Range
```
**Parameters:**
- `start: Position` — The range's start position.
- `end: Position` — The range's end position.
**Returns:** `Range`
**Overloads:**
```ts
create(startLine: number, startCharacter: number, endLine: number, endCharacter: number): Range
```

### `is`
Checks whether the given literal conforms to the Range interface.
```ts
is(value: any): value is Range
```
**Parameters:**
- `value: any`
**Returns:** `value is Range`

### `create`
Creates a Location literal.
```ts
create(uri: string, range: Range): Location
```
**Parameters:**
- `uri: string` — The location's uri.
- `range: Range` — The location's range.
**Returns:** `Location`

### `is`
Checks whether the given literal conforms to the Location interface.
```ts
is(value: any): value is Location
```
**Parameters:**
- `value: any`
**Returns:** `value is Location`

### `create`
Creates a LocationLink literal.
```ts
create(targetUri: string, targetRange: Range, targetSelectionRange: Range, originSelectionRange?: Range): LocationLink
```
**Parameters:**
- `targetUri: string` — The definition's uri.
- `targetRange: Range` — The full range of the definition.
- `targetSelectionRange: Range` — The span of the symbol definition at the target.
- `originSelectionRange: Range` (optional) — The span of the symbol being defined in the originating source file.
**Returns:** `LocationLink`

### `is`
Checks whether the given literal conforms to the LocationLink interface.
```ts
is(value: any): value is LocationLink
```
**Parameters:**
- `value: any`
**Returns:** `value is LocationLink`

### `create`
Creates a new Color literal.
```ts
create(red: number, green: number, blue: number, alpha: number): Color
```
**Parameters:**
- `red: number`
- `green: number`
- `blue: number`
- `alpha: number`
**Returns:** `Color`

### `is`
Checks whether the given literal conforms to the Color interface.
```ts
is(value: any): value is Color
```
**Parameters:**
- `value: any`
**Returns:** `value is Color`

### `create`
Creates a new ColorInformation literal.
```ts
create(range: Range, color: Color): ColorInformation
```
**Parameters:**
- `range: Range`
- `color: Color`
**Returns:** `ColorInformation`

### `is`
Checks whether the given literal conforms to the ColorInformation interface.
```ts
is(value: any): value is ColorInformation
```
**Parameters:**
- `value: any`
**Returns:** `value is ColorInformation`

### `create`
Creates a new ColorInformation literal.
```ts
create(label: string, textEdit?: TextEdit, additionalTextEdits?: TextEdit[]): ColorPresentation
```
**Parameters:**
- `label: string`
- `textEdit: TextEdit` (optional)
- `additionalTextEdits: TextEdit[]` (optional)
**Returns:** `ColorPresentation`

### `is`
Checks whether the given literal conforms to the ColorInformation interface.
```ts
is(value: any): value is ColorPresentation
```
**Parameters:**
- `value: any`
**Returns:** `value is ColorPresentation`

### `create`
Creates a new FoldingRange literal.
```ts
create(startLine: number, endLine: number, startCharacter?: number, endCharacter?: number, kind?: string, collapsedText?: string): FoldingRange
```
**Parameters:**
- `startLine: number`
- `endLine: number`
- `startCharacter: number` (optional)
- `endCharacter: number` (optional)
- `kind: string` (optional)
- `collapsedText: string` (optional)
**Returns:** `FoldingRange`

### `is`
Checks whether the given literal conforms to the FoldingRange interface.
```ts
is(value: any): value is FoldingRange
```
**Parameters:**
- `value: any`
**Returns:** `value is FoldingRange`

### `create`
Creates a new DiagnosticRelatedInformation literal.
```ts
create(location: Location, message: string): DiagnosticRelatedInformation
```
**Parameters:**
- `location: Location`
- `message: string`
**Returns:** `DiagnosticRelatedInformation`

### `is`
Checks whether the given literal conforms to the DiagnosticRelatedInformation interface.
```ts
is(value: any): value is DiagnosticRelatedInformation
```
**Parameters:**
- `value: any`
**Returns:** `value is DiagnosticRelatedInformation`

### `is`
```ts
is(value: any): value is CodeDescription
```
**Parameters:**
- `value: any`
**Returns:** `value is CodeDescription`

### `create`
Creates a new Diagnostic literal.
```ts
create(range: Range, message: string, severity?: DiagnosticSeverity, code?: string | number, source?: string, relatedInformation?: DiagnosticRelatedInformation[]): Diagnostic
```
**Parameters:**
- `range: Range`
- `message: string`
- `severity: DiagnosticSeverity` (optional)
- `code: string | number` (optional)
- `source: string` (optional)
- `relatedInformation: DiagnosticRelatedInformation[]` (optional)
**Returns:** `Diagnostic`

### `is`
Checks whether the given literal conforms to the Diagnostic interface.
```ts
is(value: any): value is Diagnostic
```
**Parameters:**
- `value: any`
**Returns:** `value is Diagnostic`

### `create`
Creates a new Command literal.
```ts
create(title: string, command: string, args: any[]): Command
```
**Parameters:**
- `title: string`
- `command: string`
- `args: any[]`
**Returns:** `Command`

### `is`
Checks whether the given literal conforms to the Command interface.
```ts
is(value: any): value is Command
```
**Parameters:**
- `value: any`
**Returns:** `value is Command`

### `replace`
Creates a replace text edit.
```ts
replace(range: Range, newText: string): TextEdit
```
**Parameters:**
- `range: Range` — The range of text to be replaced.
- `newText: string` — The new text.
**Returns:** `TextEdit`

### `insert`
Creates an insert text edit.
```ts
insert(position: Position, newText: string): TextEdit
```
**Parameters:**
- `position: Position` — The position to insert the text at.
- `newText: string` — The text to be inserted.
**Returns:** `TextEdit`

### `del`
Creates a delete text edit.
```ts
del(range: Range): TextEdit
```
**Parameters:**
- `range: Range` — The range of text to be deleted.
**Returns:** `TextEdit`

### `is`
```ts
is(value: any): value is TextEdit
```
**Parameters:**
- `value: any`
**Returns:** `value is TextEdit`

### `create`
```ts
create(label: string, needsConfirmation?: boolean, description?: string): ChangeAnnotation
```
**Parameters:**
- `label: string`
- `needsConfirmation: boolean` (optional)
- `description: string` (optional)
**Returns:** `ChangeAnnotation`

### `is`
```ts
is(value: any): value is ChangeAnnotation
```
**Parameters:**
- `value: any`
**Returns:** `value is ChangeAnnotation`

### `is`
```ts
is(value: any): value is string
```
**Parameters:**
- `value: any`
**Returns:** `value is string`

### `replace`
Creates an annotated replace text edit.
```ts
replace(range: Range, newText: string, annotation: string): AnnotatedTextEdit
```
**Parameters:**
- `range: Range` — The range of text to be replaced.
- `newText: string` — The new text.
- `annotation: string` — The annotation.
**Returns:** `AnnotatedTextEdit`

### `insert`
Creates an annotated insert text edit.
```ts
insert(position: Position, newText: string, annotation: string): AnnotatedTextEdit
```
**Parameters:**
- `position: Position` — The position to insert the text at.
- `newText: string` — The text to be inserted.
- `annotation: string` — The annotation.
**Returns:** `AnnotatedTextEdit`

### `del`
Creates an annotated delete text edit.
```ts
del(range: Range, annotation: string): AnnotatedTextEdit
```
**Parameters:**
- `range: Range` — The range of text to be deleted.
- `annotation: string` — The annotation.
**Returns:** `AnnotatedTextEdit`

### `is`
```ts
is(value: any): value is AnnotatedTextEdit
```
**Parameters:**
- `value: any`
**Returns:** `value is AnnotatedTextEdit`

### `create`
Creates a new `TextDocumentEdit`
```ts
create(textDocument: OptionalVersionedTextDocumentIdentifier, edits: (TextEdit | AnnotatedTextEdit)[]): TextDocumentEdit
```
**Parameters:**
- `textDocument: OptionalVersionedTextDocumentIdentifier`
- `edits: (TextEdit | AnnotatedTextEdit)[]`
**Returns:** `TextDocumentEdit`

### `is`
```ts
is(value: any): value is TextDocumentEdit
```
**Parameters:**
- `value: any`
**Returns:** `value is TextDocumentEdit`

### `create`
```ts
create(uri: string, options?: CreateFileOptions, annotation?: string): CreateFile
```
**Parameters:**
- `uri: string`
- `options: CreateFileOptions` (optional)
- `annotation: string` (optional)
**Returns:** `CreateFile`

### `is`
```ts
is(value: any): value is CreateFile
```
**Parameters:**
- `value: any`
**Returns:** `value is CreateFile`

### `create`
```ts
create(oldUri: string, newUri: string, options?: RenameFileOptions, annotation?: string): RenameFile
```
**Parameters:**
- `oldUri: string`
- `newUri: string`
- `options: RenameFileOptions` (optional)
- `annotation: string` (optional)
**Returns:** `RenameFile`

### `is`
```ts
is(value: any): value is RenameFile
```
**Parameters:**
- `value: any`
**Returns:** `value is RenameFile`

### `create`
```ts
create(uri: string, options?: DeleteFileOptions, annotation?: string): DeleteFile
```
**Parameters:**
- `uri: string`
- `options: DeleteFileOptions` (optional)
- `annotation: string` (optional)
**Returns:** `DeleteFile`

### `is`
```ts
is(value: any): value is DeleteFile
```
**Parameters:**
- `value: any`
**Returns:** `value is DeleteFile`

### `create`
Creates a new TextDocumentIdentifier literal.
```ts
create(uri: string): TextDocumentIdentifier
```
**Parameters:**
- `uri: string` — The document's uri.
**Returns:** `TextDocumentIdentifier`

### `is`
Checks whether the given literal conforms to the TextDocumentIdentifier interface.
```ts
is(value: any): value is TextDocumentIdentifier
```
**Parameters:**
- `value: any`
**Returns:** `value is TextDocumentIdentifier`

### `create`
Creates a new VersionedTextDocumentIdentifier literal.
```ts
create(uri: string, version: number): VersionedTextDocumentIdentifier
```
**Parameters:**
- `uri: string` — The document's uri.
- `version: number` — The document's version.
**Returns:** `VersionedTextDocumentIdentifier`

### `is`
Checks whether the given literal conforms to the VersionedTextDocumentIdentifier interface.
```ts
is(value: any): value is VersionedTextDocumentIdentifier
```
**Parameters:**
- `value: any`
**Returns:** `value is VersionedTextDocumentIdentifier`

### `create`
Creates a new OptionalVersionedTextDocumentIdentifier literal.
```ts
create(uri: string, version: number | null): OptionalVersionedTextDocumentIdentifier
```
**Parameters:**
- `uri: string` — The document's uri.
- `version: number | null` — The document's version.
**Returns:** `OptionalVersionedTextDocumentIdentifier`

### `is`
Checks whether the given literal conforms to the OptionalVersionedTextDocumentIdentifier interface.
```ts
is(value: any): value is OptionalVersionedTextDocumentIdentifier
```
**Parameters:**
- `value: any`
**Returns:** `value is OptionalVersionedTextDocumentIdentifier`

### `create`
Creates a new TextDocumentItem literal.
```ts
create(uri: string, languageId: string, version: number, text: string): TextDocumentItem
```
**Parameters:**
- `uri: string` — The document's uri.
- `languageId: string` — The document's language identifier.
- `version: number` — The document's version number.
- `text: string` — The document's text.
**Returns:** `TextDocumentItem`

### `is`
Checks whether the given literal conforms to the TextDocumentItem interface.
```ts
is(value: any): value is TextDocumentItem
```
**Parameters:**
- `value: any`
**Returns:** `value is TextDocumentItem`

### `is`
Checks whether the given value is a value of the MarkupKind type.
```ts
is(value: any): value is MarkupKind
```
**Parameters:**
- `value: any`
**Returns:** `value is MarkupKind`

### `is`
Checks whether the given value conforms to the MarkupContent interface.
```ts
is(value: any): value is MarkupContent
```
**Parameters:**
- `value: any`
**Returns:** `value is MarkupContent`

### `create`
Creates a new insert / replace edit
```ts
create(newText: string, insert: Range, replace: Range): InsertReplaceEdit
```
**Parameters:**
- `newText: string`
- `insert: Range`
- `replace: Range`
**Returns:** `InsertReplaceEdit`

### `is`
Checks whether the given literal conforms to the InsertReplaceEdit interface.
```ts
is(value: TextEdit | InsertReplaceEdit): value is InsertReplaceEdit
```
**Parameters:**
- `value: TextEdit | InsertReplaceEdit`
**Returns:** `value is InsertReplaceEdit`

### `is`
```ts
is(value: any): value is CompletionItemLabelDetails
```
**Parameters:**
- `value: any`
**Returns:** `value is CompletionItemLabelDetails`

### `create`
Create a completion item and seed it with a label.
```ts
create(label: string): CompletionItem
```
**Parameters:**
- `label: string` — The completion item's label
**Returns:** `CompletionItem`

### `create`
Creates a new completion list.
```ts
create(items?: CompletionItem[], isIncomplete?: boolean): CompletionList
```
**Parameters:**
- `items: CompletionItem[]` (optional) — The completion items.
- `isIncomplete: boolean` (optional) — The list is not complete.
**Returns:** `CompletionList`

### `fromPlainText`
Creates a marked string from plain text.
```ts
fromPlainText(plainText: string): string
```
**Parameters:**
- `plainText: string` — The plain text.
**Returns:** `string`

### `is`
Checks whether the given value conforms to the MarkedString type.
```ts
is(value: any): value is MarkedString
```
**Parameters:**
- `value: any`
**Returns:** `value is MarkedString`

### `is`
Checks whether the given value conforms to the Hover interface.
```ts
is(value: any): value is Hover
```
**Parameters:**
- `value: any`
**Returns:** `value is Hover`

### `create`
Creates a new parameter information literal.
```ts
create(label: string | [number, number], documentation?: string): ParameterInformation
```
**Parameters:**
- `label: string | [number, number]` — A label string.
- `documentation: string` (optional) — A doc string.
**Returns:** `ParameterInformation`

### `create`
```ts
create(label: string, documentation?: string, parameters: ParameterInformation[]): SignatureInformation
```
**Parameters:**
- `label: string`
- `documentation: string` (optional)
- `parameters: ParameterInformation[]`
**Returns:** `SignatureInformation`

### `create`
Create a DocumentHighlight object.
```ts
create(range: Range, kind?: DocumentHighlightKind): DocumentHighlight
```
**Parameters:**
- `range: Range` — The range the highlight applies to.
- `kind: DocumentHighlightKind` (optional) — The highlight kind
**Returns:** `DocumentHighlight`

### `create`
Creates a new symbol information literal.
```ts
create(name: string, kind: SymbolKind, range: Range, uri: string, containerName?: string): SymbolInformation
```
**Parameters:**
- `name: string` — The name of the symbol.
- `kind: SymbolKind` — The kind of the symbol.
- `range: Range` — The range of the location of the symbol.
- `uri: string` — The resource of the location of symbol.
- `containerName: string` (optional) — The name of the symbol containing the symbol.
**Returns:** `SymbolInformation`

### `create`
Create a new workspace symbol.
```ts

<!-- truncated -->
