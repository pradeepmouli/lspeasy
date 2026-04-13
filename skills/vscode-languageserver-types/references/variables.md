# Variables & Constants

## main.d

### `MIN_VALUE`
```ts
const MIN_VALUE: -2147483648
```

### `MAX_VALUE`
```ts
const MAX_VALUE: 2147483647
```

### `MIN_VALUE`
```ts
const MIN_VALUE: 0
```

### `MAX_VALUE`
```ts
const MAX_VALUE: 2147483647
```

### `Comment`
Folding range for a comment
```ts
const Comment: "comment"
```

### `Imports`
Folding range for an import or include
```ts
const Imports: "imports"
```

### `Region`
Folding range for a region (e.g. `#region`)
```ts
const Region: "region"
```

### `Error`
Reports an error.
```ts
const Error: 1
```

### `Warning`
Reports a warning.
```ts
const Warning: 2
```

### `Information`
Reports an information.
```ts
const Information: 3
```

### `Hint`
Reports a hint.
```ts
const Hint: 4
```

### `Unnecessary`
Unused or unnecessary code.

Clients are allowed to render diagnostics with this tag faded out instead of having
an error squiggle.
```ts
const Unnecessary: 1
```

### `Deprecated`
Deprecated or obsolete code.

Clients are allowed to rendered diagnostics with this tag strike through.
```ts
const Deprecated: 2
```

### `PlainText`
Plain text is supported as a content format
```ts
const PlainText: "plaintext"
```

### `Markdown`
Markdown is supported as a content format
```ts
const Markdown: "markdown"
```

### `Text`
```ts
const Text: 1
```

### `Method`
```ts
const Method: 2
```

### `Function`
```ts
const Function: 3
```

### `Constructor`
```ts
const Constructor: 4
```

### `Field`
```ts
const Field: 5
```

### `Variable`
```ts
const Variable: 6
```

### `Class`
```ts
const Class: 7
```

### `Interface`
```ts
const Interface: 8
```

### `Module`
```ts
const Module: 9
```

### `Property`
```ts
const Property: 10
```

### `Unit`
```ts
const Unit: 11
```

### `Value`
```ts
const Value: 12
```

### `Enum`
```ts
const Enum: 13
```

### `Keyword`
```ts
const Keyword: 14
```

### `Snippet`
```ts
const Snippet: 15
```

### `Color`
```ts
const Color: 16
```

### `File`
```ts
const File: 17
```

### `Reference`
```ts
const Reference: 18
```

### `Folder`
```ts
const Folder: 19
```

### `EnumMember`
```ts
const EnumMember: 20
```

### `Constant`
```ts
const Constant: 21
```

### `Struct`
```ts
const Struct: 22
```

### `Event`
```ts
const Event: 23
```

### `Operator`
```ts
const Operator: 24
```

### `TypeParameter`
```ts
const TypeParameter: 25
```

### `PlainText`
The primary text to be inserted is treated as a plain string.
```ts
const PlainText: 1
```

### `Snippet`
The primary text to be inserted is treated as a snippet.

A snippet can define tab stops and placeholders with `$1`, `$2`
and `${3:foo}`. `$0` defines the final tab stop, it defaults to
the end of the snippet. Placeholders with equal identifiers are linked,
that is typing in one will update others too.

See also: https://microsoft.github.io/language-server-protocol/specifications/specification-current/#snippet_syntax
```ts
const Snippet: 2
```

### `Deprecated`
Render a completion as obsolete, usually using a strike-out.
```ts
const Deprecated: 1
```

### `asIs`
The insertion or replace strings is taken as it is. If the
value is multi line the lines below the cursor will be
inserted using the indentation defined in the string value.
The client will not apply any kind of adjustments to the
string.
```ts
const asIs: 1
```

### `adjustIndentation`
The editor adjusts leading whitespace of new lines so that
they match the indentation up to the cursor of the line for
which the item is accepted.

Consider a line like this: <2tabs><cursor><3tabs>foo. Accepting a
multi line completion item is indented using 2 tabs and all
following lines inserted will be indented using 2 tabs as well.
```ts
const adjustIndentation: 2
```

### `Text`
A textual occurrence.
```ts
const Text: 1
```

### `Read`
Read-access of a symbol, like reading a variable.
```ts
const Read: 2
```

### `Write`
Write-access of a symbol, like writing to a variable.
```ts
const Write: 3
```

### `File`
```ts
const File: 1
```

### `Module`
```ts
const Module: 2
```

### `Namespace`
```ts
const Namespace: 3
```

### `Package`
```ts
const Package: 4
```

### `Class`
```ts
const Class: 5
```

### `Method`
```ts
const Method: 6
```

### `Property`
```ts
const Property: 7
```

### `Field`
```ts
const Field: 8
```

### `Constructor`
```ts
const Constructor: 9
```

### `Enum`
```ts
const Enum: 10
```

### `Interface`
```ts
const Interface: 11
```

### `Function`
```ts
const Function: 12
```

### `Variable`
```ts
const Variable: 13
```

### `Constant`
```ts
const Constant: 14
```

### `String`
```ts
const String: 15
```

### `Number`
```ts
const Number: 16
```

### `Boolean`
```ts
const Boolean: 17
```

### `Array`
```ts
const Array: 18
```

### `Object`
```ts
const Object: 19
```

### `Key`
```ts
const Key: 20
```

### `Null`
```ts
const Null: 21
```

### `EnumMember`
```ts
const EnumMember: 22
```

### `Struct`
```ts
const Struct: 23
```

### `Event`
```ts
const Event: 24
```

### `Operator`
```ts
const Operator: 25
```

### `TypeParameter`
```ts
const TypeParameter: 26
```

### `Deprecated`
Render a symbol as obsolete, usually using a strike-out.
```ts
const Deprecated: 1
```

### `Empty`
Empty kind.
```ts
const Empty: ""
```

### `QuickFix`
Base kind for quickfix actions: 'quickfix'
```ts
const QuickFix: "quickfix"
```

### `Refactor`
Base kind for refactoring actions: 'refactor'
```ts
const Refactor: "refactor"
```

### `RefactorExtract`
Base kind for refactoring extraction actions: 'refactor.extract'

Example extract actions:

- Extract method
- Extract function
- Extract variable
- Extract interface from class
- ...
```ts
const RefactorExtract: "refactor.extract"
```

### `RefactorInline`
Base kind for refactoring inline actions: 'refactor.inline'

Example inline actions:

- Inline function
- Inline variable
- Inline constant
- ...
```ts
const RefactorInline: "refactor.inline"
```

### `RefactorRewrite`
Base kind for refactoring rewrite actions: 'refactor.rewrite'

Example rewrite actions:

- Convert JavaScript function to class
- Add or remove parameter
- Encapsulate field
- Make method static
- Move method to base class
- ...
```ts
const RefactorRewrite: "refactor.rewrite"
```

### `Source`
Base kind for source actions: `source`

Source code actions apply to the entire file.
```ts
const Source: "source"
```

### `SourceOrganizeImports`
Base kind for an organize imports source action: `source.organizeImports`
```ts
const SourceOrganizeImports: "source.organizeImports"
```

### `SourceFixAll`
Base kind for auto-fix source actions: `source.fixAll`.

Fix all actions automatically fix errors that have a clear fix that do not require user input.
They should not suppress errors or perform unsafe fixes such as generating new types or classes.
```ts
const SourceFixAll: "source.fixAll"
```

### `Invoked`
Code actions were explicitly requested by the user or by an extension.
```ts
const Invoked: 1
```

### `Automatic`
Code actions were requested automatically.

This typically happens when current selection in a file changes, but can
also be triggered when file content changes.
```ts
const Automatic: 2
```

### `Type`
An inlay hint that for a type annotation.
```ts
const Type: 1
```

### `Parameter`
An inlay hint that is for a parameter.
```ts
const Parameter: 2
```

### `Invoked`
Completion was triggered explicitly by a user gesture.
```ts
const Invoked: 0
```

### `Automatic`
Completion was triggered automatically while editing.
```ts
const Automatic: 1
```
