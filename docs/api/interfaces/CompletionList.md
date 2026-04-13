[**lspeasy v1.0.0**](../README.md)

***

[lspeasy](../README.md) / CompletionList

# Interface: CompletionList

Defined in: node\_modules/.pnpm/vscode-languageserver-types@3.17.5/node\_modules/vscode-languageserver-types/lib/esm/main.d.ts:1508

Represents a collection of [completion items](CompletionItem.md) to be presented
in the editor.

## Properties

### isIncomplete

> **isIncomplete**: `boolean`

Defined in: node\_modules/.pnpm/vscode-languageserver-types@3.17.5/node\_modules/vscode-languageserver-types/lib/esm/main.d.ts:1515

This list it not complete. Further typing results in recomputing this list.

Recomputed lists have all their items replaced (not appended) in the
incomplete completion sessions.

***

### itemDefaults?

> `optional` **itemDefaults?**: `object`

Defined in: node\_modules/.pnpm/vscode-languageserver-types@3.17.5/node\_modules/vscode-languageserver-types/lib/esm/main.d.ts:1531

In many cases the items of an actual completion result share the same
value for properties like `commitCharacters` or the range of a text
edit. A completion list can therefore define item defaults which will
be used if a completion item itself doesn't specify the value.

If a completion list specifies a default value and a completion item
also specifies a corresponding value the one from the item is used.

Servers are only allowed to return default values if the client
signals support for this via the `completionList.itemDefaults`
capability.

#### commitCharacters?

> `optional` **commitCharacters?**: `string`[]

A default commit character set.

##### Since

3.17.0

#### data?

> `optional` **data?**: `any`

A default data value.

##### Since

3.17.0

#### editRange?

> `optional` **editRange?**: [`Range`](Range.md) \| \{ `insert`: [`Range`](Range.md); `replace`: [`Range`](Range.md); \}

A default edit range.

##### Since

3.17.0

#### insertTextFormat?

> `optional` **insertTextFormat?**: [`InsertTextFormat`](../type-aliases/InsertTextFormat.md)

A default insert text format.

##### Since

3.17.0

#### insertTextMode?

> `optional` **insertTextMode?**: [`InsertTextMode`](../type-aliases/InsertTextMode.md)

A default insert text mode.

##### Since

3.17.0

#### Since

3.17.0

***

### items

> **items**: [`CompletionItem`](CompletionItem.md)[]

Defined in: node\_modules/.pnpm/vscode-languageserver-types@3.17.5/node\_modules/vscode-languageserver-types/lib/esm/main.d.ts:1569

The completion items.
