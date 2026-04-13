[**lspeasy v1.0.0**](../README.md)

***

[lspeasy](../README.md) / LRUCache

# Class: LRUCache\<K, V\>

Defined in: node\_modules/.pnpm/vscode-jsonrpc@8.2.0/node\_modules/vscode-jsonrpc/lib/common/linkedMap.d.ts:41

## Extends

- [`LinkedMap`](LinkedMap.md)\<`K`, `V`\>

## Type Parameters

### K

`K`

### V

`V`

## Constructors

### Constructor

> **new LRUCache**\<`K`, `V`\>(`limit`, `ratio?`): `LRUCache`\<`K`, `V`\>

Defined in: node\_modules/.pnpm/vscode-jsonrpc@8.2.0/node\_modules/vscode-jsonrpc/lib/common/linkedMap.d.ts:44

#### Parameters

##### limit

`number`

##### ratio?

`number`

#### Returns

`LRUCache`\<`K`, `V`\>

#### Overrides

[`LinkedMap`](LinkedMap.md).[`constructor`](LinkedMap.md#constructor)

## Properties

### \[toStringTag\]

> `readonly` **\[toStringTag\]**: `"LinkedMap"` = `"LinkedMap"`

Defined in: node\_modules/.pnpm/vscode-jsonrpc@8.2.0/node\_modules/vscode-jsonrpc/lib/common/linkedMap.d.ts:10

#### Inherited from

[`LinkedMap`](LinkedMap.md).[`[toStringTag]`](LinkedMap.md#tostringtag)

## Accessors

### first

#### Get Signature

> **get** **first**(): `V` \| `undefined`

Defined in: node\_modules/.pnpm/vscode-jsonrpc@8.2.0/node\_modules/vscode-jsonrpc/lib/common/linkedMap.d.ts:20

##### Returns

`V` \| `undefined`

#### Inherited from

[`LinkedMap`](LinkedMap.md).[`first`](LinkedMap.md#first)

***

### last

#### Get Signature

> **get** **last**(): `V` \| `undefined`

Defined in: node\_modules/.pnpm/vscode-jsonrpc@8.2.0/node\_modules/vscode-jsonrpc/lib/common/linkedMap.d.ts:21

##### Returns

`V` \| `undefined`

#### Inherited from

[`LinkedMap`](LinkedMap.md).[`last`](LinkedMap.md#last)

***

### limit

#### Get Signature

> **get** **limit**(): `number`

Defined in: node\_modules/.pnpm/vscode-jsonrpc@8.2.0/node\_modules/vscode-jsonrpc/lib/common/linkedMap.d.ts:45

##### Returns

`number`

#### Set Signature

> **set** **limit**(`limit`): `void`

Defined in: node\_modules/.pnpm/vscode-jsonrpc@8.2.0/node\_modules/vscode-jsonrpc/lib/common/linkedMap.d.ts:46

##### Parameters

###### limit

`number`

##### Returns

`void`

***

### ratio

#### Get Signature

> **get** **ratio**(): `number`

Defined in: node\_modules/.pnpm/vscode-jsonrpc@8.2.0/node\_modules/vscode-jsonrpc/lib/common/linkedMap.d.ts:47

##### Returns

`number`

#### Set Signature

> **set** **ratio**(`ratio`): `void`

Defined in: node\_modules/.pnpm/vscode-jsonrpc@8.2.0/node\_modules/vscode-jsonrpc/lib/common/linkedMap.d.ts:48

##### Parameters

###### ratio

`number`

##### Returns

`void`

***

### size

#### Get Signature

> **get** **size**(): `number`

Defined in: node\_modules/.pnpm/vscode-jsonrpc@8.2.0/node\_modules/vscode-jsonrpc/lib/common/linkedMap.d.ts:19

##### Returns

`number`

the number of elements in the Map.

#### Inherited from

[`LinkedMap`](LinkedMap.md).[`size`](LinkedMap.md#size)

## Methods

### \[iterator\]()

> **\[iterator\]**(): `IterableIterator`\<\[`K`, `V`\]\>

Defined in: node\_modules/.pnpm/vscode-jsonrpc@8.2.0/node\_modules/vscode-jsonrpc/lib/common/linkedMap.d.ts:32

#### Returns

`IterableIterator`\<\[`K`, `V`\]\>

#### Inherited from

[`LinkedMap`](LinkedMap.md).[`[iterator]`](LinkedMap.md#iterator)

***

### clear()

> **clear**(): `void`

Defined in: node\_modules/.pnpm/vscode-jsonrpc@8.2.0/node\_modules/vscode-jsonrpc/lib/common/linkedMap.d.ts:17

#### Returns

`void`

#### Inherited from

[`LinkedMap`](LinkedMap.md).[`clear`](LinkedMap.md#clear)

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

#### Inherited from

[`LinkedMap`](LinkedMap.md).[`delete`](LinkedMap.md#delete)

***

### entries()

> **entries**(): `IterableIterator`\<\[`K`, `V`\]\>

Defined in: node\_modules/.pnpm/vscode-jsonrpc@8.2.0/node\_modules/vscode-jsonrpc/lib/common/linkedMap.d.ts:31

Returns an iterable of key, value pairs for every entry in the map.

#### Returns

`IterableIterator`\<\[`K`, `V`\]\>

#### Inherited from

[`LinkedMap`](LinkedMap.md).[`entries`](LinkedMap.md#entries)

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

#### Inherited from

[`LinkedMap`](LinkedMap.md).[`forEach`](LinkedMap.md#foreach)

***

### fromJSON()

> **fromJSON**(`data`): `void`

Defined in: node\_modules/.pnpm/vscode-jsonrpc@8.2.0/node\_modules/vscode-jsonrpc/lib/common/linkedMap.d.ts:39

#### Parameters

##### data

\[`K`, `V`\][]

#### Returns

`void`

#### Inherited from

[`LinkedMap`](LinkedMap.md).[`fromJSON`](LinkedMap.md#fromjson)

***

### get()

> **get**(`key`, `touch?`): `V` \| `undefined`

Defined in: node\_modules/.pnpm/vscode-jsonrpc@8.2.0/node\_modules/vscode-jsonrpc/lib/common/linkedMap.d.ts:49

Returns a specified element from the Map object. If the value that is associated to the provided key is an object, then you will get a reference to that object and any change made to that object will effectively modify it inside the Map.

#### Parameters

##### key

`K`

##### touch?

[`Touch`](../type-aliases/Touch.md)

#### Returns

`V` \| `undefined`

Returns the element associated with the specified key. If no element is associated with the specified key, undefined is returned.

#### Overrides

[`LinkedMap`](LinkedMap.md).[`get`](LinkedMap.md#get)

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

#### Inherited from

[`LinkedMap`](LinkedMap.md).[`has`](LinkedMap.md#has)

***

### isEmpty()

> **isEmpty**(): `boolean`

Defined in: node\_modules/.pnpm/vscode-jsonrpc@8.2.0/node\_modules/vscode-jsonrpc/lib/common/linkedMap.d.ts:18

#### Returns

`boolean`

#### Inherited from

[`LinkedMap`](LinkedMap.md).[`isEmpty`](LinkedMap.md#isempty)

***

### keys()

> **keys**(): `IterableIterator`\<`K`\>

Defined in: node\_modules/.pnpm/vscode-jsonrpc@8.2.0/node\_modules/vscode-jsonrpc/lib/common/linkedMap.d.ts:29

Returns an iterable of keys in the map

#### Returns

`IterableIterator`\<`K`\>

#### Inherited from

[`LinkedMap`](LinkedMap.md).[`keys`](LinkedMap.md#keys)

***

### peek()

> **peek**(`key`): `V` \| `undefined`

Defined in: node\_modules/.pnpm/vscode-jsonrpc@8.2.0/node\_modules/vscode-jsonrpc/lib/common/linkedMap.d.ts:50

#### Parameters

##### key

`K`

#### Returns

`V` \| `undefined`

***

### remove()

> **remove**(`key`): `V` \| `undefined`

Defined in: node\_modules/.pnpm/vscode-jsonrpc@8.2.0/node\_modules/vscode-jsonrpc/lib/common/linkedMap.d.ts:26

#### Parameters

##### key

`K`

#### Returns

`V` \| `undefined`

#### Inherited from

[`LinkedMap`](LinkedMap.md).[`remove`](LinkedMap.md#remove)

***

### set()

> **set**(`key`, `value`): `this`

Defined in: node\_modules/.pnpm/vscode-jsonrpc@8.2.0/node\_modules/vscode-jsonrpc/lib/common/linkedMap.d.ts:51

Adds a new element with a specified key and value to the Map. If an element with the same key already exists, the element will be updated.

#### Parameters

##### key

`K`

##### value

`V`

#### Returns

`this`

#### Overrides

[`LinkedMap`](LinkedMap.md).[`set`](LinkedMap.md#set)

***

### shift()

> **shift**(): `V` \| `undefined`

Defined in: node\_modules/.pnpm/vscode-jsonrpc@8.2.0/node\_modules/vscode-jsonrpc/lib/common/linkedMap.d.ts:27

#### Returns

`V` \| `undefined`

#### Inherited from

[`LinkedMap`](LinkedMap.md).[`shift`](LinkedMap.md#shift)

***

### toJSON()

> **toJSON**(): \[`K`, `V`\][]

Defined in: node\_modules/.pnpm/vscode-jsonrpc@8.2.0/node\_modules/vscode-jsonrpc/lib/common/linkedMap.d.ts:38

#### Returns

\[`K`, `V`\][]

#### Inherited from

[`LinkedMap`](LinkedMap.md).[`toJSON`](LinkedMap.md#tojson)

***

### trimOld()

> `protected` **trimOld**(`newSize`): `void`

Defined in: node\_modules/.pnpm/vscode-jsonrpc@8.2.0/node\_modules/vscode-jsonrpc/lib/common/linkedMap.d.ts:33

#### Parameters

##### newSize

`number`

#### Returns

`void`

#### Inherited from

[`LinkedMap`](LinkedMap.md).[`trimOld`](LinkedMap.md#trimold)

***

### values()

> **values**(): `IterableIterator`\<`V`\>

Defined in: node\_modules/.pnpm/vscode-jsonrpc@8.2.0/node\_modules/vscode-jsonrpc/lib/common/linkedMap.d.ts:30

Returns an iterable of values in the map

#### Returns

`IterableIterator`\<`V`\>

#### Inherited from

[`LinkedMap`](LinkedMap.md).[`values`](LinkedMap.md#values)
