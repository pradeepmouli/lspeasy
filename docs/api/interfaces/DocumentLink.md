[**lspeasy v1.0.0**](../README.md)

***

[lspeasy](../README.md) / DocumentLink

# Interface: DocumentLink

Defined in: node\_modules/.pnpm/vscode-languageserver-types@3.17.5/node\_modules/vscode-languageserver-types/lib/esm/main.d.ts:2360

A document link is a range in a text document that links to an internal or external resource, like another
text document or a web site.

## Properties

### data?

> `optional` **data?**: `any`

Defined in: node\_modules/.pnpm/vscode-languageserver-types@3.17.5/node\_modules/vscode-languageserver-types/lib/esm/main.d.ts:2383

A data entry field that is preserved on a document link between a
DocumentLinkRequest and a DocumentLinkResolveRequest.

***

### range

> **range**: [`Range`](Range.md)

Defined in: node\_modules/.pnpm/vscode-languageserver-types@3.17.5/node\_modules/vscode-languageserver-types/lib/esm/main.d.ts:2364

The range this link applies to.

***

### target?

> `optional` **target?**: `string`

Defined in: node\_modules/.pnpm/vscode-languageserver-types@3.17.5/node\_modules/vscode-languageserver-types/lib/esm/main.d.ts:2368

The uri this link points to. If missing a resolve request is sent later.

***

### tooltip?

> `optional` **tooltip?**: `string`

Defined in: node\_modules/.pnpm/vscode-languageserver-types@3.17.5/node\_modules/vscode-languageserver-types/lib/esm/main.d.ts:2378

The tooltip text when you hover over this link.

If a tooltip is provided, is will be displayed in a string that includes instructions on how to
trigger the link, such as `{0} (ctrl + click)`. The specific instructions vary depending on OS,
user settings, and localization.

#### Since

3.15.0
