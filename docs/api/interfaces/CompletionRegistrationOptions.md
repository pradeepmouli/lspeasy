[**lspeasy v1.0.0**](../README.md)

***

[lspeasy](../README.md) / CompletionRegistrationOptions

# Interface: CompletionRegistrationOptions

Defined in: node\_modules/.pnpm/vscode-languageserver-protocol@3.17.5/node\_modules/vscode-languageserver-protocol/lib/common/protocol.d.ts:2053

Registration options for a [CompletionRequest](../lspeasy/namespaces/CompletionRequest/README.md).

## Extends

- [`TextDocumentRegistrationOptions`](TextDocumentRegistrationOptions.md).[`CompletionOptions`](CompletionOptions.md)

## Properties

### allCommitCharacters?

> `optional` **allCommitCharacters?**: `string`[]

Defined in: node\_modules/.pnpm/vscode-languageserver-protocol@3.17.5/node\_modules/vscode-languageserver-protocol/lib/common/protocol.d.ts:2027

The list of all possible characters that commit a completion. This field can be used
if clients don't support individual commit characters per completion item. See
`ClientCapabilities.textDocument.completion.completionItem.commitCharactersSupport`

If a server provides both `allCommitCharacters` and commit characters on an individual
completion item the ones on the completion item win.

#### Since

3.2.0

#### Inherited from

[`CompletionOptions`](CompletionOptions.md).[`allCommitCharacters`](CompletionOptions.md#allcommitcharacters)

***

### completionItem?

> `optional` **completionItem?**: `object`

Defined in: node\_modules/.pnpm/vscode-languageserver-protocol@3.17.5/node\_modules/vscode-languageserver-protocol/lib/common/protocol.d.ts:2039

The server supports the following `CompletionItem` specific
capabilities.

#### labelDetailsSupport?

> `optional` **labelDetailsSupport?**: `boolean`

The server has support for completion item label
details (see also `CompletionItemLabelDetails`) when
receiving a completion item in a resolve call.

##### Since

3.17.0

#### Since

3.17.0

#### Inherited from

[`CompletionOptions`](CompletionOptions.md).[`completionItem`](CompletionOptions.md#completionitem)

***

### documentSelector

> **documentSelector**: [`DocumentSelector`](../type-aliases/DocumentSelector.md) \| `null`

Defined in: node\_modules/.pnpm/vscode-languageserver-protocol@3.17.5/node\_modules/vscode-languageserver-protocol/lib/common/protocol.d.ts:774

A document selector to identify the scope of the registration. If set to null
the document selector provided on the client side will be used.

#### Inherited from

[`TextDocumentRegistrationOptions`](TextDocumentRegistrationOptions.md).[`documentSelector`](TextDocumentRegistrationOptions.md#documentselector)

***

### resolveProvider?

> `optional` **resolveProvider?**: `boolean`

Defined in: node\_modules/.pnpm/vscode-languageserver-protocol@3.17.5/node\_modules/vscode-languageserver-protocol/lib/common/protocol.d.ts:2032

The server provides support to resolve additional
information for a completion item.

#### Inherited from

[`CompletionOptions`](CompletionOptions.md).[`resolveProvider`](CompletionOptions.md#resolveprovider)

***

### triggerCharacters?

> `optional` **triggerCharacters?**: `string`[]

Defined in: node\_modules/.pnpm/vscode-languageserver-protocol@3.17.5/node\_modules/vscode-languageserver-protocol/lib/common/protocol.d.ts:2016

Most tools trigger completion request automatically without explicitly requesting
it using a keyboard shortcut (e.g. Ctrl+Space). Typically they do so when the user
starts to type an identifier. For example if the user types `c` in a JavaScript file
code complete will automatically pop up present `console` besides others as a
completion item. Characters that make up identifiers don't need to be listed here.

If code complete should automatically be trigger on characters not being valid inside
an identifier (for example `.` in JavaScript) list them in `triggerCharacters`.

#### Inherited from

[`CompletionOptions`](CompletionOptions.md).[`triggerCharacters`](CompletionOptions.md#triggercharacters)

***

### workDoneProgress?

> `optional` **workDoneProgress?**: `boolean`

Defined in: node\_modules/.pnpm/vscode-languageserver-protocol@3.17.5/node\_modules/vscode-languageserver-protocol/lib/common/protocol.d.ts:793

#### Inherited from

[`CompletionOptions`](CompletionOptions.md).[`workDoneProgress`](CompletionOptions.md#workdoneprogress)
