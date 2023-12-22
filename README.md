# webext-ttl-cache

TTL cache for web extensions.

## Usage

```js
import { get, set, del, clear, keys, has } from 'webext-ttl-cache';

async function demo () {
  await set('foo', 'bar', 1000); // 1000ms TTL
  const value = await get('foo'); // 'bar'
  await has('foo'); // true
  const myKeys = await keys(); // ['foo']
  await del('foo'); // delete 'foo'
  await clear(); // delete all keys
}

```

## Caution

This is an early stage project. Use at your own risk.
