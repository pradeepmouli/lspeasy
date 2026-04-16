# Types & Enums

## types

### `TextDocumentContentParams`
```ts
unknown
```

### `TextDocumentContent`
```ts
unknown
```

### `TextDocumentContentResult`
```ts
unknown
```

### `TextDocumentContentRegistrationOptions`
```ts
unknown
```

### `TextDocumentContentRefreshParams`
```ts
unknown
```

### `CancelParams`

### `ProgressParams`

## api.d

### `LSPErrorCodes`
```ts
integer
```

## main.d

### `DocumentUri`
A tagging type for string properties that are actually document URIs.
```ts
string
```

### `URI`
A tagging type for string properties that are actually URIs
```ts
string
```

### `integer`
Defines an integer in the range of -2^31 to 2^31 - 1.
```ts
number
```

### `uinteger`
Defines an unsigned integer in the range of 0 to 2^31 - 1.
```ts
number
```

### `decimal`
Defines a decimal number. Since decimal numbers are very
rare in the language server specification we denote the
exact range with every decimal using the mathematics
interval notations (e.g. [0, 1] denotes all decimals d with
0 <= d <= 1.
```ts
number
```

### `LSPAny`
The LSP any type.

In the current implementation we map LSPAny to any. This is due to the fact
that the TypeScript compilers can't infer string access signatures for
interface correctly (it can though for types). See the following issue for
details: https://github.com/microsoft/TypeScript/issues/15300.

When the issue is addressed LSPAny can be defined as follows:

```ts
export type LSPAny = LSPObject | LSPArray | string | integer | uinteger | decimal | boolean | null | undefined;
export type LSPObject = { [key: string]: LSPAny };
export type LSPArray = LSPAny[];
```

Please note that strictly speaking a property with the value `undefined`
can't be converted into JSON preserving the property name. However for
convenience it is allowed and assumed that all these properties are
optional as well.
```ts
any
```

### `LSPObject`
```ts
object
```

### `LSPArray`
```ts
any[]
```

### `Position`
Position in a text document expressed as zero-based line and character
offset. Prior to 3.17 the offsets were always based on a UTF-16 string
representation. So a string of the form `a𐐀b` the character offset of the
character `a` is 0, the character offset of `𐐀` is 1 and the character
offset of b is 3 since `𐐀` is represented using two code units in UTF-16.
Since 3.17 clients and servers can agree on a different string encoding
representation (e.g. UTF-8). The client announces it's supported encoding
via the client capability [`general.positionEncodings`](https://microsoft.github.io/language-server-protocol/specifications/specification-current/#clientCapabilities).
The value is an array of position encodings the client supports, with
decreasing preference (e.g. the encoding at index `0` is the most preferred
one). To stay backwards compatible the only mandatory encoding is UTF-16
represented via the string `utf-16`. The server can pick one of the
encodings offered by the client and signals that encoding back to the
client via the initialize result's property
[`capabilities.positionEncoding`](https://microsoft.github.io/language-server-protocol/specifications/specification-current/#serverCapabilities). If the string value
`utf-16` is missing from the client's capability `general.positionEncodings`
servers can safely assume that the client supports UTF-16. If the server
omits the position encoding in its initialize result the encoding defaults
to the string value `utf-16`. Implementation considerations: since the
conversion from one encoding into another requires the content of the
file / line the conversion is best done where the file is read which is
usually on the server side.

Positions are line end character agnostic. So you can not specify a position
that denotes `\r|\n` or `\n|` where `|` represents the character offset.
**Properties:**
- `line: number` — Line position in a document (zero-based).

If a line number is greater than the number of lines in a document, it defaults back to the number of lines in the document.
If a line number is negative, it defaults to 0.
- `character: number` — Character offset on a line in a document (zero-based).

The meaning of this offset is determined by the negotiated
`PositionEncodingKind`.

If the character value is greater than the line length it defaults back to the
line length.

### `Range`
A range in a text document expressed as (zero-based) start and end positions.

If you want to specify a range that contains a line including the line ending
character(s) then use an end position denoting the start of the next line.
For example:
```ts
{
    start: { line: 5, character: 23 }
    end : { line 6, character : 0 }
}
```
**Properties:**
- `start: Position` — The range's start position.
- `end: Position` — The range's end position.

### `Location`
Represents a location inside a resource, such as a line
inside a text file.
**Properties:**
- `uri: string`
- `range: Range`

### `LocationLink`
Represents the connection of two locations. Provides additional metadata over normal Location locations,
including an origin range.
**Properties:**
- `originSelectionRange: Range` (optional) — Span of the origin of this link.

Used as the underlined span for mouse interaction. Defaults to the word range at
the definition position.
- `targetUri: string` — The target resource identifier of this link.
- `targetRange: Range` — The full target range of this link. If the target for example is a symbol then target range is the
range enclosing this symbol not including leading/trailing whitespace but everything else
like comments. This information is typically used to highlight the range in the editor.
- `targetSelectionRange: Range` — The range that should be selected and revealed when this link is being followed, e.g the name of a function.
Must be contained by the `targetRange`. See also `DocumentSymbol#range`

### `Color`
Represents a color in RGBA space.
**Properties:**
- `red: number` — The red component of this color in the range [0-1].
- `green: number` — The green component of this color in the range [0-1].
- `blue: number` — The blue component of this color in the range [0-1].
- `alpha: number` — The alpha component of this color in the range [0-1].

### `ColorInformation`
Represents a color range from a document.
**Properties:**
- `range: Range` — The range in the document where this color appears.
- `color: Color` — The actual color value for this color range.

### `ColorPresentation`
**Properties:**
- `label: string` — The label of this color presentation. It will be shown on the color
picker header. By default this is also the text that is inserted when selecting
this color presentation.
- `textEdit: TextEdit` (optional) — An TextEdit edit which is applied to a document when selecting
this presentation for the color.  When `falsy` the ColorPresentation.label label
is used.
- `additionalTextEdits: TextEdit[]` (optional) — An optional array of additional TextEdit text edits that are applied when
selecting this color presentation. Edits must not overlap with the main ColorPresentation.textEdit edit nor with themselves.

### `FoldingRangeKind`
A predefined folding range kind.

The type is a string since the value set is extensible
```ts
string
```

### `FoldingRange`
Represents a folding range. To be valid, start and end line must be bigger than zero and smaller
than the number of lines in the document. Clients are free to ignore invalid ranges.
**Properties:**
- `startLine: number` — The zero-based start line of the range to fold. The folded area starts after the line's last character.
To be valid, the end must be zero or larger and smaller than the number of lines in the document.
- `startCharacter: number` (optional) — The zero-based character offset from where the folded range starts. If not defined, defaults to the length of the start line.
- `endLine: number` — The zero-based end line of the range to fold. The folded area ends with the line's last character.
To be valid, the end must be zero or larger and smaller than the number of lines in the document.
- `endCharacter: number` (optional) — The zero-based character offset before the folded range ends. If not defined, defaults to the length of the end line.
- `kind: string` (optional) — Describes the kind of the folding range such as `comment' or 'region'. The kind
is used to categorize folding ranges and used by commands like 'Fold all comments'.
See FoldingRangeKind for an enumeration of standardized kinds.
- `collapsedText: string` (optional) — The text that the client should show when the specified range is
collapsed. If not defined or not supported by the client, a default
will be chosen by the client.

### `DiagnosticRelatedInformation`
Represents a related message and source code location for a diagnostic. This should be
used to point to code locations that cause or related to a diagnostics, e.g when duplicating
a symbol in a scope.
**Properties:**
- `location: Location` — The location of this related diagnostic information.
- `message: string` — The message of this related diagnostic information.

### `DiagnosticSeverity`
```ts
1 | 2 | 3 | 4
```

### `DiagnosticTag`
```ts
1 | 2
```

### `CodeDescription`
Structure to capture a description for an error code.
**Properties:**
- `href: string` — An URI to open with more information about the diagnostic error.

### `Diagnostic`
Represents a diagnostic, such as a compiler error or warning. Diagnostic objects
are only valid in the scope of a resource.
**Properties:**
- `range: Range` — The range at which the message applies
- `severity: DiagnosticSeverity` (optional) — The diagnostic's severity. Can be omitted. If omitted it is up to the
client to interpret diagnostics as error, warning, info or hint.
- `code: string | number` (optional) — The diagnostic's code, which usually appear in the user interface.
- `codeDescription: CodeDescription` (optional) — An optional property to describe the error code.
Requires the code field (above) to be present/not null.
- `source: string` (optional) — A human-readable string describing the source of this
diagnostic, e.g. 'typescript' or 'super lint'. It usually
appears in the user interface.
- `message: string` — The diagnostic's message. It usually appears in the user interface
- `tags: DiagnosticTag[]` (optional) — Additional metadata about the diagnostic.
- `relatedInformation: DiagnosticRelatedInformation[]` (optional) — An array of related diagnostic information, e.g. when symbol-names within
a scope collide all definitions can be marked via this property.
- `data: any` (optional) — A data entry field that is preserved between a `textDocument/publishDiagnostics`
notification and `textDocument/codeAction` request.

### `Command`
Represents a reference to a command. Provides a title which
will be used to represent a command in the UI and, optionally,
an array of arguments which will be passed to the command handler
function when invoked.
**Properties:**
- `title: string` — Title of the command, like `save`.
- `command: string` — The identifier of the actual command handler.
- `arguments: any[]` (optional) — Arguments that the command handler should be
invoked with.

### `TextEdit`
A text edit applicable to a text document.
**Properties:**
- `range: Range` — The range of the text document to be manipulated. To insert
text into a document create a range where start === end.
- `newText: string` — The string to be inserted. For delete operations use an
empty string.

### `ChangeAnnotation`
Additional information that describes document changes.
**Properties:**
- `label: string` — A human-readable string describing the actual change. The string
is rendered prominent in the user interface.
- `needsConfirmation: boolean` (optional) — A flag which indicates that user confirmation is needed
before applying the change.
- `description: string` (optional) — A human-readable string which is rendered less prominent in
the user interface.

### `ChangeAnnotationIdentifier`
An identifier to refer to a change annotation stored with a workspace edit.
```ts
string
```

### `AnnotatedTextEdit`
A special text edit with an additional change annotation.
**Properties:**
- `annotationId: string` — The actual identifier of the change annotation
- `range: Range` — The range of the text document to be manipulated. To insert
text into a document create a range where start === end.
- `newText: string` — The string to be inserted. For delete operations use an
empty string.

### `TextDocumentEdit`
Describes textual changes on a text document. A TextDocumentEdit describes all changes
on a document version Si and after they are applied move the document to version Si+1.
So the creator of a TextDocumentEdit doesn't need to sort the array of edits or do any
kind of ordering. However the edits must be non overlapping.
**Properties:**
- `textDocument: OptionalVersionedTextDocumentIdentifier` — The text document to change.
- `edits: (TextEdit | AnnotatedTextEdit)[]` — The edits to be applied.

### `CreateFileOptions`
Options to create a file.
**Properties:**
- `overwrite: boolean` (optional) — Overwrite existing file. Overwrite wins over `ignoreIfExists`
- `ignoreIfExists: boolean` (optional) — Ignore if exists.

### `CreateFile`
Create file operation.
**Properties:**
- `kind: "create"` — A create
- `uri: string` — The resource to create.
- `options: CreateFileOptions` (optional) — Additional options
- `annotationId: string` (optional) — An optional annotation identifier describing the operation.

### `RenameFileOptions`
Rename file options
**Properties:**
- `overwrite: boolean` (optional) — Overwrite target if existing. Overwrite wins over `ignoreIfExists`
- `ignoreIfExists: boolean` (optional) — Ignores if target exists.

### `RenameFile`
Rename file operation
**Properties:**
- `kind: "rename"` — A rename
- `oldUri: string` — The old (existing) location.
- `newUri: string` — The new location.
- `options: RenameFileOptions` (optional) — Rename options.
- `annotationId: string` (optional) — An optional annotation identifier describing the operation.

### `DeleteFileOptions`
Delete file options
**Properties:**
- `recursive: boolean` (optional) — Delete the content recursively if a folder is denoted.
- `ignoreIfNotExists: boolean` (optional) — Ignore the operation if the file doesn't exist.

### `DeleteFile`
Delete file operation
**Properties:**
- `kind: "delete"` — A delete
- `uri: string` — The file to delete.
- `options: DeleteFileOptions` (optional) — Delete options.
- `annotationId: string` (optional) — An optional annotation identifier describing the operation.

### `TextEditChange`
A change to capture text edits for existing resources.

### `TextDocumentIdentifier`
A literal to identify a text document in the client.
**Properties:**
- `uri: string` — The text document's uri.

### `VersionedTextDocumentIdentifier`
A text document identifier to denote a specific version of a text document.
**Properties:**
- `version: number` — The version number of this document.
- `uri: string` — The text document's uri.

### `OptionalVersionedTextDocumentIdentifier`
A text document identifier to optionally denote a specific version of a text document.
**Properties:**
- `version: number | null` — The version number of this document. If a versioned text document identifier
is sent from the server to the client and the file is not open in the editor
(the server has not received an open notification before) the server can send
`null` to indicate that the version is unknown and the content on disk is the
truth (as specified with document content ownership).
- `uri: string` — The text document's uri.

### `TextDocumentItem`
An item to transfer a text document from the client to the
server.
**Properties:**
- `uri: string` — The text document's uri.
- `languageId: string` — The text document's language identifier.
- `version: number` — The version number of this document (it will increase after each
change, including undo/redo).

<!-- truncated -->
