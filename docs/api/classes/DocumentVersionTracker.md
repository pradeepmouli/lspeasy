[**lspeasy v1.0.0**](../README.md)

***

[lspeasy](../README.md) / DocumentVersionTracker

# Class: DocumentVersionTracker

Defined in: [packages/core/src/utils/document.ts:11](https://github.com/pradeepmouli/lspeasy/blob/9cfbcabb7e5a7111a570b29f368656ea6b98ee25/packages/core/src/utils/document.ts#L11)

Tracks per-document versions for change notifications.

## Constructors

### Constructor

> **new DocumentVersionTracker**(): `DocumentVersionTracker`

#### Returns

`DocumentVersionTracker`

## Methods

### close()

> **close**(`uri`): `void`

Defined in: [packages/core/src/utils/document.ts:41](https://github.com/pradeepmouli/lspeasy/blob/9cfbcabb7e5a7111a570b29f368656ea6b98ee25/packages/core/src/utils/document.ts#L41)

Stops tracking a document URI.

#### Parameters

##### uri

`string`

#### Returns

`void`

***

### currentVersion()

> **currentVersion**(`uri`): `number` \| `undefined`

Defined in: [packages/core/src/utils/document.ts:34](https://github.com/pradeepmouli/lspeasy/blob/9cfbcabb7e5a7111a570b29f368656ea6b98ee25/packages/core/src/utils/document.ts#L34)

Returns the current tracked version, if any.

#### Parameters

##### uri

`string`

#### Returns

`number` \| `undefined`

***

### nextVersion()

> **nextVersion**(`uri`): `number`

Defined in: [packages/core/src/utils/document.ts:24](https://github.com/pradeepmouli/lspeasy/blob/9cfbcabb7e5a7111a570b29f368656ea6b98ee25/packages/core/src/utils/document.ts#L24)

Increments and returns the next document version.

#### Parameters

##### uri

`string`

#### Returns

`number`

***

### open()

> **open**(`uri`, `initialVersion?`): `void`

Defined in: [packages/core/src/utils/document.ts:17](https://github.com/pradeepmouli/lspeasy/blob/9cfbcabb7e5a7111a570b29f368656ea6b98ee25/packages/core/src/utils/document.ts#L17)

Starts tracking a document URI with an optional initial version.

#### Parameters

##### uri

`string`

##### initialVersion?

`number` = `0`

#### Returns

`void`
