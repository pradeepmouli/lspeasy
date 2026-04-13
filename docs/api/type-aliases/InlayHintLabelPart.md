[**lspeasy v1.0.0**](../README.md)

***

[lspeasy](../README.md) / InlayHintLabelPart

# Type Alias: InlayHintLabelPart

> **InlayHintLabelPart** = `object`

Defined in: node\_modules/.pnpm/vscode-languageserver-types@3.17.5/node\_modules/vscode-languageserver-types/lib/esm/main.d.ts:2818

An inlay hint label part allows for interactive and composite labels
of inlay hints.

## Since

3.17.0

## Properties

### command?

> `optional` **command?**: [`Command`](../interfaces/Command.md)

Defined in: node\_modules/.pnpm/vscode-languageserver-types@3.17.5/node\_modules/vscode-languageserver-types/lib/esm/main.d.ts:2849

An optional command for this label part.

Depending on the client capability `inlayHint.resolveSupport` clients
might resolve this property late using the resolve request.

***

### location?

> `optional` **location?**: [`Location`](../interfaces/Location.md)

Defined in: node\_modules/.pnpm/vscode-languageserver-types@3.17.5/node\_modules/vscode-languageserver-types/lib/esm/main.d.ts:2842

An optional source code location that represents this
label part.

The editor will use this location for the hover and for code navigation
features: This part will become a clickable link that resolves to the
definition of the symbol at the given location (not necessarily the
location itself), it shows the hover that shows at the given location,
and it shows a context menu with further code navigation commands.

Depending on the client capability `inlayHint.resolveSupport` clients
might resolve this property late using the resolve request.

***

### tooltip?

> `optional` **tooltip?**: `string` \| [`MarkupContent`](../interfaces/MarkupContent.md)

Defined in: node\_modules/.pnpm/vscode-languageserver-types@3.17.5/node\_modules/vscode-languageserver-types/lib/esm/main.d.ts:2828

The tooltip text when you hover over this label part. Depending on
the client capability `inlayHint.resolveSupport` clients might resolve
this property late using the resolve request.

***

### value

> **value**: `string`

Defined in: node\_modules/.pnpm/vscode-languageserver-types@3.17.5/node\_modules/vscode-languageserver-types/lib/esm/main.d.ts:2822

The value of this label part.
