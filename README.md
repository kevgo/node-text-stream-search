# Node.js Text Stream Search

> Searches for occurrences of a given search term in a Node.js text stream

[![Circle CI](https://circleci.com/gh/kevgo/node-text-stream-search.svg?style=shield)](https://circleci.com/gh/kevgo/node-text-stream-search)
[![Dependency Status](https://david-dm.org/originate/node-text-stream-search.svg)](https://david-dm.org/originate/node-text-stream-search)
[![devDependency Status](https://david-dm.org/originate/node-text-stream-search/dev-status.svg)](https://david-dm.org/originate/node-text-stream-search#info=devDependencies)

Simple and robust way to scan text streams for text.
This works with anything that emits `data` events with text
in the form of Buffers or strings.

```javascript
import StreamSearch from "text-stream-search"

const streamSearch = new TextStreamSearch(myStream)
await streamSearch.waitForText("hello")
const matching = await streamSearch.waitForRegex("listening at port \\d+")
// matching contains something like "listening at port 3000"
```

More use cases are described [here](features/wait.feature).

## Related Projects

- [StreamSnitch](https://github.com/dmotz/stream-snitch): does the same thing with regular expressions,
  but is buggy and blocks the event queue

## Development

See our [developer guidelines](CONTRIBUTING.md)
