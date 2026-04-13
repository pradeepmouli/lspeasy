[**lspeasy v1.0.0**](../README.md)

***

[lspeasy](../README.md) / ShowDocumentParams

# Interface: ShowDocumentParams

Defined in: node\_modules/.pnpm/vscode-languageserver-protocol@3.17.5/node\_modules/vscode-languageserver-protocol/lib/common/protocol.showDocument.d.ts:21

Params to show a resource in the UI.

## Since

3.16.0

## Properties

### external?

> `optional` **external?**: `boolean`

Defined in: node\_modules/.pnpm/vscode-languageserver-protocol@3.17.5/node\_modules/vscode-languageserver-protocol/lib/common/protocol.showDocument.d.ts:31

Indicates to show the resource in an external program.
To show, for example, `https://code.visualstudio.com/`
in the default WEB browser set `external` to `true`.

***

### selection?

> `optional` **selection?**: [`Range`](Range.md)

Defined in: node\_modules/.pnpm/vscode-languageserver-protocol@3.17.5/node\_modules/vscode-languageserver-protocol/lib/common/protocol.showDocument.d.ts:45

An optional selection range if the document is a text
document. Clients might ignore the property if an
external program is started or the file is not a text
file.

***

### takeFocus?

> `optional` **takeFocus?**: `boolean`

Defined in: node\_modules/.pnpm/vscode-languageserver-protocol@3.17.5/node\_modules/vscode-languageserver-protocol/lib/common/protocol.showDocument.d.ts:38

An optional property to indicate whether the editor
showing the document should take focus or not.
Clients might ignore this property if an external
program is started.

***

### uri

> **uri**: `string`

Defined in: node\_modules/.pnpm/vscode-languageserver-protocol@3.17.5/node\_modules/vscode-languageserver-protocol/lib/common/protocol.showDocument.d.ts:25

The uri to show.
