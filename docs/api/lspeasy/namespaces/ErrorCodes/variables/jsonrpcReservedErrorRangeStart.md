[**lspeasy v1.0.0**](../../../../README.md)

***

[lspeasy](../../../../README.md) / [ErrorCodes](../README.md) / jsonrpcReservedErrorRangeStart

# Variable: jsonrpcReservedErrorRangeStart

> `const` **jsonrpcReservedErrorRangeStart**: `-32099`

Defined in: node\_modules/.pnpm/vscode-jsonrpc@8.2.0/node\_modules/vscode-jsonrpc/lib/common/messages.d.ts:42

This is the start range of JSON RPC reserved error codes.
It doesn't denote a real error code. No application error codes should
be defined between the start and end range. For backwards
compatibility the `ServerNotInitialized` and the `UnknownErrorCode`
are left in the range.

## Since

3.16.0
