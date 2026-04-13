[**lspeasy v1.0.0**](../README.md)

***

[lspeasy](../README.md) / WorkDoneProgressReport

# Interface: WorkDoneProgressReport

Defined in: node\_modules/.pnpm/vscode-languageserver-protocol@3.17.5/node\_modules/vscode-languageserver-protocol/lib/common/protocol.progress.d.ts:37

## Properties

### cancellable?

> `optional` **cancellable?**: `boolean`

Defined in: node\_modules/.pnpm/vscode-languageserver-protocol@3.17.5/node\_modules/vscode-languageserver-protocol/lib/common/protocol.progress.d.ts:45

Controls enablement state of a cancel button.

Clients that don't support cancellation or don't support controlling the button's
enablement state are allowed to ignore the property.

***

### kind

> **kind**: `"report"`

Defined in: node\_modules/.pnpm/vscode-languageserver-protocol@3.17.5/node\_modules/vscode-languageserver-protocol/lib/common/protocol.progress.d.ts:38

***

### message?

> `optional` **message?**: `string`

Defined in: node\_modules/.pnpm/vscode-languageserver-protocol@3.17.5/node\_modules/vscode-languageserver-protocol/lib/common/protocol.progress.d.ts:53

Optional, more detailed associated progress message. Contains
complementary information to the `title`.

Examples: "3/25 files", "project/src/module2", "node_modules/some_dep".
If unset, the previous progress message (if any) is still valid.

***

### percentage?

> `optional` **percentage?**: `number`

Defined in: node\_modules/.pnpm/vscode-languageserver-protocol@3.17.5/node\_modules/vscode-languageserver-protocol/lib/common/protocol.progress.d.ts:62

Optional progress percentage to display (value 100 is considered 100%).
If not provided infinite progress is assumed and clients are allowed
to ignore the `percentage` value in subsequent in report notifications.

The value should be steadily rising. Clients are free to ignore values
that are not following this rule. The value range is [0, 100]
