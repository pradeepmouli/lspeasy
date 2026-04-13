[**lspeasy v1.0.0**](../README.md)

***

[lspeasy](../README.md) / CompletionItem

# Interface: CompletionItem

Defined in: node\_modules/.pnpm/vscode-languageserver-types@3.17.5/node\_modules/vscode-languageserver-types/lib/esm/main.d.ts:1336

A completion item represents a text snippet that is
proposed to complete text that is being typed.

## Properties

### additionalTextEdits?

> `optional` **additionalTextEdits?**: [`TextEdit`](TextEdit.md)[]

Defined in: node\_modules/.pnpm/vscode-languageserver-types@3.17.5/node\_modules/vscode-languageserver-types/lib/esm/main.d.ts:1474

An optional array of additional [text edits](TextEdit.md) that are applied when
selecting this completion. Edits must not overlap (including the same insert position)
with the main [edit](#textedit) nor with themselves.

Additional text edits should be used to change text unrelated to the current cursor position
(for example adding an import statement at the top of the file if the completion item will
insert an unqualified type).

***

### command?

> `optional` **command?**: [`Command`](Command.md)

Defined in: node\_modules/.pnpm/vscode-languageserver-types@3.17.5/node\_modules/vscode-languageserver-types/lib/esm/main.d.ts:1486

An optional [command](Command.md) that is executed *after* inserting this completion. *Note* that
additional modifications to the current document should be described with the
[additionalTextEdits](#additionaltextedits)-property.

***

### commitCharacters?

> `optional` **commitCharacters?**: `string`[]

Defined in: node\_modules/.pnpm/vscode-languageserver-types@3.17.5/node\_modules/vscode-languageserver-types/lib/esm/main.d.ts:1480

An optional set of characters that when pressed while this completion is active will accept it first and
then type that character. *Note* that all commit characters should have `length=1` and that superfluous
characters will be ignored.

***

### data?

> `optional` **data?**: `any`

Defined in: node\_modules/.pnpm/vscode-languageserver-types@3.17.5/node\_modules/vscode-languageserver-types/lib/esm/main.d.ts:1491

A data entry field that is preserved on a completion item between a
[CompletionRequest](../lspeasy/namespaces/CompletionRequest/README.md) and a [CompletionResolveRequest](../lspeasy/namespaces/CompletionResolveRequest/README.md).

***

### ~~deprecated?~~

> `optional` **deprecated?**: `boolean`

Defined in: node\_modules/.pnpm/vscode-languageserver-types@3.17.5/node\_modules/vscode-languageserver-types/lib/esm/main.d.ts:1377

Indicates if this item is deprecated.

#### Deprecated

Use `tags` instead.

***

### detail?

> `optional` **detail?**: `string`

Defined in: node\_modules/.pnpm/vscode-languageserver-types@3.17.5/node\_modules/vscode-languageserver-types/lib/esm/main.d.ts:1368

A human-readable string with additional information
about this item, like type or symbol information.

***

### documentation?

> `optional` **documentation?**: `string` \| [`MarkupContent`](MarkupContent.md)

Defined in: node\_modules/.pnpm/vscode-languageserver-types@3.17.5/node\_modules/vscode-languageserver-types/lib/esm/main.d.ts:1372

A human-readable string that represents a doc-comment.

***

### filterText?

> `optional` **filterText?**: `string`

Defined in: node\_modules/.pnpm/vscode-languageserver-types@3.17.5/node\_modules/vscode-languageserver-types/lib/esm/main.d.ts:1397

A string that should be used when filtering a set of
completion items. When `falsy` the [label](#label)
is used.

***

### insertText?

> `optional` **insertText?**: `string`

Defined in: node\_modules/.pnpm/vscode-languageserver-types@3.17.5/node\_modules/vscode-languageserver-types/lib/esm/main.d.ts:1411

A string that should be inserted into a document when selecting
this completion. When `falsy` the [label](#label)
is used.

The `insertText` is subject to interpretation by the client side.
Some tools might not take the string literally. For example
VS Code when code complete is requested in this example
`con<cursor position>` and a completion item with an `insertText` of
`console` is provided it will only insert `sole`. Therefore it is
recommended to use `textEdit` instead since it avoids additional client
side interpretation.

***

### insertTextFormat?

> `optional` **insertTextFormat?**: [`InsertTextFormat`](../type-aliases/InsertTextFormat.md)

Defined in: node\_modules/.pnpm/vscode-languageserver-types@3.17.5/node\_modules/vscode-languageserver-types/lib/esm/main.d.ts:1420

The format of the insert text. The format applies to both the
`insertText` property and the `newText` property of a provided
`textEdit`. If omitted defaults to `InsertTextFormat.PlainText`.

Please note that the insertTextFormat doesn't apply to
`additionalTextEdits`.

***

### insertTextMode?

> `optional` **insertTextMode?**: [`InsertTextMode`](../type-aliases/InsertTextMode.md)

Defined in: node\_modules/.pnpm/vscode-languageserver-types@3.17.5/node\_modules/vscode-languageserver-types/lib/esm/main.d.ts:1428

How whitespace and indentation is handled during completion
item insertion. If not provided the clients default value depends on
the `textDocument.completion.insertTextMode` client capability.

#### Since

3.16.0

***

### kind?

> `optional` **kind?**: [`CompletionItemKind`](../type-aliases/CompletionItemKind.md)

Defined in: node\_modules/.pnpm/vscode-languageserver-types@3.17.5/node\_modules/vscode-languageserver-types/lib/esm/main.d.ts:1357

The kind of this completion item. Based of the kind
an icon is chosen by the editor.

***

### label

> **label**: `string`

Defined in: node\_modules/.pnpm/vscode-languageserver-types@3.17.5/node\_modules/vscode-languageserver-types/lib/esm/main.d.ts:1346

The label of this completion item.

The label property is also by default the text that
is inserted when selecting this completion.

If label details are provided the label itself should
be an unqualified name of the completion item.

***

### labelDetails?

> `optional` **labelDetails?**: [`CompletionItemLabelDetails`](CompletionItemLabelDetails.md)

Defined in: node\_modules/.pnpm/vscode-languageserver-types@3.17.5/node\_modules/vscode-languageserver-types/lib/esm/main.d.ts:1352

Additional details for the label

#### Since

3.17.0

***

### preselect?

> `optional` **preselect?**: `boolean`

Defined in: node\_modules/.pnpm/vscode-languageserver-types@3.17.5/node\_modules/vscode-languageserver-types/lib/esm/main.d.ts:1385

Select this item when showing.

*Note* that only one completion item can be selected and that the
tool / client decides which item that is. The rule is that the *first*
item of those that match best is selected.

***

### sortText?

> `optional` **sortText?**: `string`

Defined in: node\_modules/.pnpm/vscode-languageserver-types@3.17.5/node\_modules/vscode-languageserver-types/lib/esm/main.d.ts:1391

A string that should be used when comparing this item
with other items. When `falsy` the [label](#label)
is used.

***

### tags?

> `optional` **tags?**: `1`[]

Defined in: node\_modules/.pnpm/vscode-languageserver-types@3.17.5/node\_modules/vscode-languageserver-types/lib/esm/main.d.ts:1363

Tags for this completion item.

#### Since

3.15.0

***

### textEdit?

> `optional` **textEdit?**: [`TextEdit`](TextEdit.md) \| [`InsertReplaceEdit`](InsertReplaceEdit.md)

Defined in: node\_modules/.pnpm/vscode-languageserver-types@3.17.5/node\_modules/vscode-languageserver-types/lib/esm/main.d.ts:1451

An [edit](TextEdit.md) which is applied to a document when selecting
this completion. When an edit is provided the value of
[insertText](#inserttext) is ignored.

Most editors support two different operations when accepting a completion
item. One is to insert a completion text and the other is to replace an
existing text with a completion text. Since this can usually not be
predetermined by a server it can report both ranges. Clients need to
signal support for `InsertReplaceEdits` via the
`textDocument.completion.insertReplaceSupport` client capability
property.

*Note 1:* The text edit's range as well as both ranges from an insert
replace edit must be a [single line] and they must contain the position
at which completion has been requested.
*Note 2:* If an `InsertReplaceEdit` is returned the edit's insert range
must be a prefix of the edit's replace range, that means it must be
contained and starting at the same position.

#### Since

3.16.0 additional type `InsertReplaceEdit`

***

### textEditText?

> `optional` **textEditText?**: `string`

Defined in: node\_modules/.pnpm/vscode-languageserver-types@3.17.5/node\_modules/vscode-languageserver-types/lib/esm/main.d.ts:1464

The edit text used if the completion item is part of a CompletionList and
CompletionList defines an item default for the text edit range.

Clients will only honor this property if they opt into completion list
item defaults using the capability `completionList.itemDefaults`.

If not provided and a list's default range is provided the label
property is used as a text.

#### Since

3.17.0
