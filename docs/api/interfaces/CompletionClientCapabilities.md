[**lspeasy v1.0.0**](../README.md)

***

[lspeasy](../README.md) / CompletionClientCapabilities

# Interface: CompletionClientCapabilities

Defined in: node\_modules/.pnpm/vscode-languageserver-protocol@3.17.5/node\_modules/vscode-languageserver-protocol/lib/common/protocol.d.ts:1824

Completion client capabilities

## Properties

### completionItem?

> `optional` **completionItem?**: `object`

Defined in: node\_modules/.pnpm/vscode-languageserver-protocol@3.17.5/node\_modules/vscode-languageserver-protocol/lib/common/protocol.d.ts:1833

The client supports the following `CompletionItem` specific
capabilities.

#### commitCharactersSupport?

> `optional` **commitCharactersSupport?**: `boolean`

Client supports commit characters on a completion item.

#### deprecatedSupport?

> `optional` **deprecatedSupport?**: `boolean`

Client supports the deprecated property on a completion item.

#### documentationFormat?

> `optional` **documentationFormat?**: [`MarkupKind`](../type-aliases/MarkupKind.md)[]

Client supports the following content formats for the documentation
property. The order describes the preferred format of the client.

#### insertReplaceSupport?

> `optional` **insertReplaceSupport?**: `boolean`

Client support insert replace edit to control different behavior if a
completion item is inserted in the text or should replace text.

##### Since

3.16.0

#### insertTextModeSupport?

> `optional` **insertTextModeSupport?**: `object`

The client supports the `insertTextMode` property on
a completion item to override the whitespace handling mode
as defined by the client (see `insertTextMode`).

##### Since

3.16.0

##### insertTextModeSupport.valueSet

> **valueSet**: [`InsertTextMode`](../type-aliases/InsertTextMode.md)[]

#### labelDetailsSupport?

> `optional` **labelDetailsSupport?**: `boolean`

The client has support for completion item label
details (see also `CompletionItemLabelDetails`).

##### Since

3.17.0

#### preselectSupport?

> `optional` **preselectSupport?**: `boolean`

Client supports the preselect property on a completion item.

#### resolveSupport?

> `optional` **resolveSupport?**: `object`

Indicates which properties a client can resolve lazily on a completion
item. Before version 3.16.0 only the predefined properties `documentation`
and `details` could be resolved lazily.

##### Since

3.16.0

##### resolveSupport.properties

> **properties**: `string`[]

The properties that a client can resolve lazily.

#### snippetSupport?

> `optional` **snippetSupport?**: `boolean`

Client supports snippets as insert text.

A snippet can define tab stops and placeholders with `$1`, `$2`
and `${3:foo}`. `$0` defines the final tab stop, it defaults to
the end of the snippet. Placeholders with equal identifiers are linked,
that is typing in one will update others too.

#### tagSupport?

> `optional` **tagSupport?**: `object`

Client supports the tag property on a completion item. Clients supporting
tags have to handle unknown tags gracefully. Clients especially need to
preserve unknown tags when sending a completion item back to the server in
a resolve call.

##### Since

3.15.0

##### tagSupport.valueSet

> **valueSet**: `1`[]

The tags supported by the client.

***

### completionItemKind?

> `optional` **completionItemKind?**: `object`

Defined in: node\_modules/.pnpm/vscode-languageserver-protocol@3.17.5/node\_modules/vscode-languageserver-protocol/lib/common/protocol.d.ts:1912

#### valueSet?

> `optional` **valueSet?**: [`CompletionItemKind`](../type-aliases/CompletionItemKind.md)[]

The completion item kind values the client supports. When this
property exists the client also guarantees that it will
handle values outside its set gracefully and falls back
to a default value when unknown.

If this property is not present the client only supports
the completion items kinds from `Text` to `Reference` as defined in
the initial version of the protocol.

***

### completionList?

> `optional` **completionList?**: `object`

Defined in: node\_modules/.pnpm/vscode-languageserver-protocol@3.17.5/node\_modules/vscode-languageserver-protocol/lib/common/protocol.d.ts:1944

The client supports the following `CompletionList` specific
capabilities.

#### itemDefaults?

> `optional` **itemDefaults?**: `string`[]

The client supports the following itemDefaults on
a completion list.

The value lists the supported property names of the
`CompletionList.itemDefaults` object. If omitted
no properties are supported.

##### Since

3.17.0

#### Since

3.17.0

***

### contextSupport?

> `optional` **contextSupport?**: `boolean`

Defined in: node\_modules/.pnpm/vscode-languageserver-protocol@3.17.5/node\_modules/vscode-languageserver-protocol/lib/common/protocol.d.ts:1937

The client supports to send additional context information for a
`textDocument/completion` request.

***

### dynamicRegistration?

> `optional` **dynamicRegistration?**: `boolean`

Defined in: node\_modules/.pnpm/vscode-languageserver-protocol@3.17.5/node\_modules/vscode-languageserver-protocol/lib/common/protocol.d.ts:1828

Whether completion supports dynamic registration.

***

### insertTextMode?

> `optional` **insertTextMode?**: [`InsertTextMode`](../type-aliases/InsertTextMode.md)

Defined in: node\_modules/.pnpm/vscode-languageserver-protocol@3.17.5/node\_modules/vscode-languageserver-protocol/lib/common/protocol.d.ts:1932

Defines how the client handles whitespace and indentation
when accepting a completion item that uses multi line
text in either `insertText` or `textEdit`.

#### Since

3.17.0
