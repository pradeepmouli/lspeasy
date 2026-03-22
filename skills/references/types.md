# Types & Enums

## Types

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

### `LSPErrorCodes`
```ts
integer
```

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

### `Location`
Represents a location inside a resource, such as a line
inside a text file.

### `LocationLink`
Represents the connection of two locations. Provides additional metadata over normal Location locations,
including an origin range.

### `Color`
Represents a color in RGBA space.

### `ColorInformation`
Represents a color range from a document.

### `ColorPresentation`

### `FoldingRangeKind`
A predefined folding range kind.

The type is a string since the value set is extensible
```ts
string
```

### `FoldingRange`
Represents a folding range. To be valid, start and end line must be bigger than zero and smaller
than the number of lines in the document. Clients are free to ignore invalid ranges.

### `DiagnosticRelatedInformation`
Represents a related message and source code location for a diagnostic. This should be
used to point to code locations that cause or related to a diagnostics, e.g when duplicating
a symbol in a scope.

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

### `Diagnostic`
Represents a diagnostic, such as a compiler error or warning. Diagnostic objects
are only valid in the scope of a resource.

### `Command`
Represents a reference to a command. Provides a title which
will be used to represent a command in the UI and, optionally,
an array of arguments which will be passed to the command handler
function when invoked.

### `TextEdit`
A text edit applicable to a text document.

### `ChangeAnnotation`
Additional information that describes document changes.

### `ChangeAnnotationIdentifier`
An identifier to refer to a change annotation stored with a workspace edit.
```ts
string
```

### `AnnotatedTextEdit`
A special text edit with an additional change annotation.

### `TextDocumentEdit`
Describes textual changes on a text document. A TextDocumentEdit describes all changes
on a document version Si and after they are applied move the document to version Si+1.
So the creator of a TextDocumentEdit doesn't need to sort the array of edits or do any
kind of ordering. However the edits must be non overlapping.

### `CreateFileOptions`
Options to create a file.

### `CreateFile`
Create file operation.

### `RenameFileOptions`
Rename file options

### `RenameFile`
Rename file operation

### `DeleteFileOptions`
Delete file options

### `DeleteFile`
Delete file operation

### `TextEditChange`
A change to capture text edits for existing resources.

### `TextDocumentIdentifier`
A literal to identify a text document in the client.

### `VersionedTextDocumentIdentifier`
A text document identifier to denote a specific version of a text document.

### `OptionalVersionedTextDocumentIdentifier`
A text document identifier to optionally denote a specific version of a text document.

### `TextDocumentItem`
An item to transfer a text document from the client to the
server.

### `MarkupKind`
```ts
"plaintext" | "markdown"
```

### `MarkupContent`
A `MarkupContent` literal represents a string value which content is interpreted base on its
kind flag. Currently the protocol supports `plaintext` and `markdown` as markup kinds.

If the kind is `markdown` then the value can contain fenced code blocks like in GitHub issues.
See https://help.github.com/articles/creating-and-highlighting-code-blocks/#syntax-highlighting

Here is an example how such a string can be constructed using JavaScript / TypeScript:
```ts
let markdown: MarkdownContent = {
 kind: MarkupKind.Markdown,
 value: [
   '# Header',
   'Some text',
   '```typescript',
   'someCode();',
   '```'
 ].join('\n')
};
```

*Please Note* that clients might sanitize the return markdown. A client could decide to
remove HTML from the markdown to avoid script execution.

### `CompletionItemKind`
```ts
1 | 2 | 3 | 4 | 5 | 6 | 7 | 8 | 9 | 10 | 11 | 12 | 13 | 14 | 15 | 16 | 17 | 18 | 19 | 20 | 21 | 22 | 23 | 24 | 25
```

### `InsertTextFormat`
```ts
1 | 2
```

### `CompletionItemTag`
```ts
1
```

### `InsertReplaceEdit`
A special text edit to provide an insert and a replace operation.

### `InsertTextMode`
```ts
1 | 2
```

### `CompletionItemLabelDetails`
Additional details for a completion item label.

### `CompletionItem`
A completion item represents a text snippet that is
proposed to complete text that is being typed.

### `CompletionList`
Represents a collection of CompletionItem completion items to be presented
in the editor.

### `MarkedString`
MarkedString can be used to render human readable text. It is either a markdown string
or a code-block that provides a language and a code snippet. The language identifier
is semantically equal to the optional language identifier in fenced code blocks in GitHub
issues. See https://help.github.com/articles/creating-and-highlighting-code-blocks/#syntax-highlighting

The pair of a language and a value is an equivalent to markdown:
```${language}
${value}
```

Note that markdown strings will be sanitized - that means html will be escaped.
```ts
string | { language: string; value: string }
```

### `Hover`
The result of a hover request.

### `ParameterInformation`
Represents a parameter of a callable-signature. A parameter can
have a label and a doc-comment.

### `SignatureInformation`
Represents the signature of something callable. A signature
can have a label, like a function-name, a doc-comment, and
a set of parameters.

### `SignatureHelp`
Signature help represents the signature of something
callable. There can be multiple signature but only one
active and only one active parameter.

### `Definition`
The definition of a symbol represented as one or many Location locations.
For most programming languages there is only one location at which a symbol is
defined.

Servers should prefer returning `DefinitionLink` over `Definition` if supported
by the client.
```ts
Location | Location[]
```

### `DefinitionLink`
Information about where a symbol is defined.

Provides additional metadata over normal Location location definitions, including the range of
the defining symbol
```ts
LocationLink
```

### `Declaration`
The declaration of a symbol representation as one or many Location locations.
```ts
Location | Location[]
```

### `DeclarationLink`
Information about where a symbol is declared.

Provides additional metadata over normal Location location declarations, including the range of
the declaring symbol.

Servers should prefer returning `DeclarationLink` over `Declaration` if supported
by the client.
```ts
LocationLink
```

### `ReferenceContext`
Value-object that contains additional information when
requesting references.

### `DocumentHighlightKind`
```ts
1 | 2 | 3
```

### `DocumentHighlight`
A document highlight is a range inside a text document which deserves
special attention. Usually a document highlight is visualized by changing
the background color of its range.

### `SymbolKind`
```ts
1 | 2 | 3 | 4 | 5 | 6 | 7 | 8 | 9 | 10 | 11 | 12 | 13 | 14 | 15 | 16 | 17 | 18 | 19 | 20 | 21 | 22 | 23 | 24 | 25 | 26
```

### `SymbolTag`
```ts
1
```

### `BaseSymbolInformation`
A base for all symbol information.

### `SymbolInformation`
Represents information about programming constructs like variables, classes,
interfaces etc.

### `WorkspaceSymbol`
A special workspace symbol that supports locations without a range.

See also SymbolInformation.

### `DocumentSymbol`
Represents programming constructs like variables, classes, interfaces etc.
that appear in a document. Document symbols can be hierarchical and they
have two ranges: one that encloses its definition and one that points to
its most interesting range, e.g. the range of an identifier.

### `CodeActionKind`
The kind of a code action.

Kinds are a hierarchical list of identifiers separated by `.`, e.g. `"refactor.extract.function"`.

The set of kinds is open and client needs to announce the kinds it supports to the server during
initialization.
```ts
string
```

### `CodeActionTriggerKind`
```ts
1 | 2
```

### `CodeActionContext`
Contains additional diagnostic information about the context in which
a CodeActionProvider.provideCodeActions code action is run.

### `CodeAction`
A code action represents a change that can be performed in code, e.g. to fix a problem or
to refactor code.

A CodeAction must set either `edit` and/or a `command`. If both are supplied, the `edit` is applied first, then the `command` is executed.

### `CodeLens`
A code lens represents a Command command that should be shown along with
source text, like the number of references, a way to run tests, etc.

A code lens is _unresolved_ when no command is associated to it. For performance
reasons the creation of a code lens and resolving should be done in two stages.

### `FormattingOptions`
Value-object describing what options formatting should use.

### `DocumentLink`
A document link is a range in a text document that links to an internal or external resource, like another
text document or a web site.

### `SelectionRange`
A selection range represents a part of a selection hierarchy. A selection range
may have a parent selection range that contains it.

### `CallHierarchyItem`
Represents programming constructs like functions or constructors in the context
of call hierarchy.

### `CallHierarchyIncomingCall`
Represents an incoming call, e.g. a caller of a method or constructor.

### `CallHierarchyOutgoingCall`
Represents an outgoing call, e.g. calling a getter from a method or a method from a constructor etc.

### `SemanticTokensLegend`

### `SemanticTokens`

### `SemanticTokensEdit`

### `SemanticTokensDelta`

### `TypeHierarchyItem`

### `InlineValueText`
Provide inline value as text.

### `InlineValueVariableLookup`
Provide inline value through a variable lookup.
If only a range is specified, the variable name will be extracted from the underlying document.
An optional variable name can be used to override the extracted name.

### `InlineValueEvaluatableExpression`
Provide an inline value through an expression evaluation.
If only a range is specified, the expression will be extracted from the underlying document.
An optional expression can be used to override the extracted expression.

### `InlineValue`
Inline value information can be provided by different means:
- directly as a text value (class InlineValueText).
- as a name to use for a variable lookup (class InlineValueVariableLookup)
- as an evaluatable expression (class InlineValueEvaluatableExpression)
The InlineValue types combines all inline value types into one type.
```ts
InlineValueText | InlineValueVariableLookup | InlineValueEvaluatableExpression
```

### `InlineValueContext`

### `InlayHintKind`
```ts
1 | 2
```

### `InlayHintLabelPart`
An inlay hint label part allows for interactive and composite labels
of inlay hints.

### `InlayHint`
Inlay hint information.

### `StringValue`
A string value used as a snippet is a template which allows to insert text
and to control the editor cursor when insertion happens.

A snippet can define tab stops and placeholders with `$1`, `$2`
and `${3:foo}`. `$0` defines the final tab stop, it defaults to
the end of the snippet. Variables are defined with `$name` and
`${name:default value}`.

### `InlineCompletionItem`
An inline completion item represents a text snippet that is proposed inline to complete text that is being typed.

### `InlineCompletionList`
Represents a collection of InlineCompletionItem inline completion items to be presented in the editor.

### `InlineCompletionTriggerKind`
```ts
0 | 1
```

### `SelectedCompletionInfo`
Describes the currently selected completion item.

### `InlineCompletionContext`
Provides information about the context in which an inline completion was requested.

### `TextDocument`
A simple text document. Not to be implemented. The document keeps the content
as string.


<!-- truncated -->
