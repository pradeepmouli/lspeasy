[**lspeasy v1.0.0**](../README.md)

***

[lspeasy](../README.md) / MarkdownClientCapabilities

# Interface: MarkdownClientCapabilities

Defined in: node\_modules/.pnpm/vscode-languageserver-protocol@3.17.5/node\_modules/vscode-languageserver-protocol/lib/common/protocol.d.ts:590

Client capabilities specific to the used markdown parser.

## Since

3.16.0

## Properties

### allowedTags?

> `optional` **allowedTags?**: `string`[]

Defined in: node\_modules/.pnpm/vscode-languageserver-protocol@3.17.5/node\_modules/vscode-languageserver-protocol/lib/common/protocol.d.ts:605

A list of HTML tags that the client allows / supports in
Markdown.

#### Since

3.17.0

***

### parser

> **parser**: `string`

Defined in: node\_modules/.pnpm/vscode-languageserver-protocol@3.17.5/node\_modules/vscode-languageserver-protocol/lib/common/protocol.d.ts:594

The name of the parser.

***

### version?

> `optional` **version?**: `string`

Defined in: node\_modules/.pnpm/vscode-languageserver-protocol@3.17.5/node\_modules/vscode-languageserver-protocol/lib/common/protocol.d.ts:598

The version of the parser.
