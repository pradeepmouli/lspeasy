[**lspeasy v1.0.0**](../README.md)

***

[lspeasy](../README.md) / LinkedMap

# Class: LinkedMap\<K, V\>

Defined in: node\_modules/.pnpm/vscode-jsonrpc@8.2.0/node\_modules/vscode-jsonrpc/lib/common/linkedMap.d.ts:9

## Extended by

- [`LRUCache`](LRUCache.md)

## Type Parameters

### K

`K`

### V

`V`

## Implements

- `Map`\<`K`, `V`\>

## Constructors

### Constructor

> **new LinkedMap**\<`K`, `V`\>(): `LinkedMap`\<`K`, `V`\>

Defined in: node\_modules/.pnpm/vscode-jsonrpc@8.2.0/node\_modules/vscode-jsonrpc/lib/common/linkedMap.d.ts:16

#### Returns

`LinkedMap`\<`K`, `V`\>

## Properties

### \[toStringTag\]

> `readonly` **\[toStringTag\]**: `"LinkedMap"` = `"LinkedMap"`

Defined in: node\_modules/.pnpm/vscode-jsonrpc@8.2.0/node\_modules/vscode-jsonrpc/lib/common/linkedMap.d.ts:10

#### Implementation of

`Map.[toStringTag]`

## Accessors

### first

#### Get Signature

> **get** **first**(): `V` \| `undefined`

Defined in: node\_modules/.pnpm/vscode-jsonrpc@8.2.0/node\_modules/vscode-jsonrpc/lib/common/linkedMap.d.ts:20

##### Returns

`V` \| `undefined`

***

### last

#### Get Signature

> **get** **last**(): `V` \| `undefined`

Defined in: node\_modules/.pnpm/vscode-jsonrpc@8.2.0/node\_modules/vscode-jsonrpc/lib/common/linkedMap.d.ts:21

##### Returns

`V` \| `undefined`

***

### size

#### Get Signature

> **get** **size**(): `number`

Defined in: node\_modules/.pnpm/vscode-jsonrpc@8.2.0/node\_modules/vscode-jsonrpc/lib/common/linkedMap.d.ts:19

##### Returns

`number`

the number of elements in the Map.

#### Implementation of

`Map.size`

## Methods

### \[iterator\]()

> **\[iterator\]**(): `IterableIterator`\<\[`K`, `V`\]\>

Defined in: node\_modules/.pnpm/vscode-jsonrpc@8.2.0/node\_modules/vscode-jsonrpc/lib/common/linkedMap.d.ts:32

#### Returns

`IterableIterator`\<\[`K`, `V`\]\>

#### Implementation of

`Map.[iterator]`

***

### clear()

> **clear**(): `void`

Defined in: node\_modules/.pnpm/vscode-jsonrpc@8.2.0/node\_modules/vscode-jsonrpc/lib/common/linkedMap.d.ts:17

#### Returns

`void`

#### Implementation of

`Map.clear`

***

### delete()

> **delete**(`key`): `boolean`

Defined in: node\_modules/.pnpm/vscode-jsonrpc@8.2.0/node\_modules/vscode-jsonrpc/lib/common/linkedMap.d.ts:25

#### Parameters

##### key

`K`

#### Returns

`boolean`

true if an element in the Map existed and has been removed, or false if the element does not exist.

#### Implementation of

`Map.delete`

***

### entries()

> **entries**(): `IterableIterator`\<\[`K`, `V`\]\>

Defined in: node\_modules/.pnpm/vscode-jsonrpc@8.2.0/node\_modules/vscode-jsonrpc/lib/common/linkedMap.d.ts:31

Returns an iterable of key, value pairs for every entry in the map.

#### Returns

`IterableIterator`\<\[`K`, `V`\]\>

#### Implementation of

`Map.entries`

***

### forEach()

> **forEach**(`callbackfn`, `thisArg?`): `void`

Defined in: node\_modules/.pnpm/vscode-jsonrpc@8.2.0/node\_modules/vscode-jsonrpc/lib/common/linkedMap.d.ts:28

Executes a provided function once per each key/value pair in the Map, in insertion order.

#### Parameters

##### callbackfn

(`value`, `key`, `map`) => `void`

##### thisArg?

`any`

#### Returns

`void`

#### Implementation of

`Map.forEach`

***

### fromJSON()

> **fromJSON**(`data`): `void`

Defined in: node\_modules/.pnpm/vscode-jsonrpc@8.2.0/node\_modules/vscode-jsonrpc/lib/common/linkedMap.d.ts:39

#### Parameters

##### data

\[`K`, `V`\][]

#### Returns

`void`

***

### get()

> **get**(`key`, `touch?`): `V` \| `undefined`

Defined in: node\_modules/.pnpm/vscode-jsonrpc@8.2.0/node\_modules/vscode-jsonrpc/lib/common/linkedMap.d.ts:23

Returns a specified element from the Map object. If the value that is associated to the provided key is an object, then you will get a reference to that object and any change made to that object will effectively modify it inside the Map.

#### Parameters

##### key

`K`

##### touch?

[`Touch`](../type-aliases/Touch.md)

#### Returns

`V` \| `undefined`

Returns the element associated with the specified key. If no element is associated with the specified key, undefined is returned.

#### Implementation of

`Map.get`

***

### has()

> **has**(`key`): `boolean`

Defined in: node\_modules/.pnpm/vscode-jsonrpc@8.2.0/node\_modules/vscode-jsonrpc/lib/common/linkedMap.d.ts:22

#### Parameters

##### key

`K`

#### Returns

`boolean`

boolean indicating whether an element with the specified key exists or not.

#### Implementation of

`Map.has`

***

### isEmpty()

> **isEmpty**(): `boolean`

Defined in: node\_modules/.pnpm/vscode-jsonrpc@8.2.0/node\_modules/vscode-jsonrpc/lib/common/linkedMap.d.ts:18

#### Returns

`boolean`

***

### keys()

> **keys**(): `IterableIterator`\<`K`\>

Defined in: node\_modules/.pnpm/vscode-jsonrpc@8.2.0/node\_modules/vscode-jsonrpc/lib/common/linkedMap.d.ts:29

Returns an iterable of keys in the map

#### Returns

`IterableIterator`\<`K`\>

#### Implementation of

`Map.keys`

***

### remove()

> **remove**(`key`): `V` \| `undefined`

Defined in: node\_modules/.pnpm/vscode-jsonrpc@8.2.0/node\_modules/vscode-jsonrpc/lib/common/linkedMap.d.ts:26

#### Parameters

##### key

`K`

#### Returns

`V` \| `undefined`

***

### set()

> **set**(`key`, `value`, `touch?`): `this`

Defined in: node\_modules/.pnpm/vscode-jsonrpc@8.2.0/node\_modules/vscode-jsonrpc/lib/common/linkedMap.d.ts:24

Adds a new element with a specified key and value to the Map. If an element with the same key already exists, the element will be updated.

#### Parameters

##### key

`K`

##### value

`V`

##### touch?

[`Touch`](../type-aliases/Touch.md)

#### Returns

`this`

#### Implementation of

`Map.set`

***

### shift()

> **shift**(): `V` \| `undefined`

Defined in: node\_modules/.pnpm/vscode-jsonrpc@8.2.0/node\_modules/vscode-jsonrpc/lib/common/linkedMap.d.ts:27

#### Returns

`V` \| `undefined`

***

### toJSON()

> **toJSON**(): \[`K`, `V`\][]

Defined in: node\_modules/.pnpm/vscode-jsonrpc@8.2.0/node\_modules/vscode-jsonrpc/lib/common/linkedMap.d.ts:38

#### Returns

\[`K`, `V`\][]

***

### trimOld()

> `protected` **trimOld**(`newSize`): `void`

Defined in: node\_modules/.pnpm/vscode-jsonrpc@8.2.0/node\_modules/vscode-jsonrpc/lib/common/linkedMap.d.ts:33

#### Parameters

##### newSize

`number`

#### Returns

`void`

***

### values()

> **values**(): `IterableIterator`\<`V`\>

Defined in: node\_modules/.pnpm/vscode-jsonrpc@8.2.0/node\_modules/vscode-jsonrpc/lib/common/linkedMap.d.ts:30

Returns an iterable of values in the map

#### Returns

`IterableIterator`\<`V`\>

#### Implementation of

`Map.values`
