# Node.js Text Stream Search
> Searches for occurrences of a given search term in a Node.js text stream

[![Circle CI](https://circleci.com/gh/Originate/node-text-stream-search.svg?style=shield)](https://circleci.com/gh/Originate/node-text-stream-search)
[![Dependency Status](https://david-dm.org/originate/node-text-stream-search.svg)](https://david-dm.org/originate/node-text-stream-search)
[![devDependency Status](https://david-dm.org/originate/node-text-stream-search/dev-status.svg)](https://david-dm.org/originate/node-text-stream-search#info=devDependencies)
<a href="https://github.com/feross/standard">
  <img src="https://cdn.rawgit.com/feross/standard/master/sticker.svg" alt="Standard JavaScript" width="100">
</a>


Simple and robust way to scan text streams for text.
This works with anything that emits `data` events with Buffers or strings.


```javascript

import StreamSearch from 'text-stream-search'

const streamSearch = new TextStreamSearch(myStream)
await streamSearch.waitForText('hello')
await streamSearch.waitForRegex('listening at port \d+')

```

More use cases are described [here](features/wait.feature).


## Related Projects

* [StreamSnitch](https://github.com/dmotz/stream-snitch): does the same thing with regular expressions,
  but is buggy and blocks the event queue


## Development

See our [developer guidelines](CONTRIBUTING.md)
