[**lspeasy v1.0.0**](../README.md)

***

[lspeasy](../README.md) / PartialResultParams

# Interface: PartialResultParams

Defined in: [packages/core/src/protocol/partial.ts:12](https://github.com/pradeepmouli/lspeasy/blob/1dc2e704391f3b32ce8185dadf1a265a4beb41d3/packages/core/src/protocol/partial.ts#L12)

A parameter literal used to pass a partial result token.

## Properties

### partialResultToken?

> `optional` **partialResultToken?**: [`ProgressToken`](../type-aliases/ProgressToken.md)

Defined in: [packages/core/src/protocol/partial.ts:17](https://github.com/pradeepmouli/lspeasy/blob/1dc2e704391f3b32ce8185dadf1a265a4beb41d3/packages/core/src/protocol/partial.ts#L17)

An optional token that a server can use to report partial results
(e.g., streaming) to the client.
