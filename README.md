# Node.js Text Stream Search

> Searches for occurrences of a given search term in a Node.js text stream

[![Circle CI](https://circleci.com/gh/kevgo/node-text-stream-search.svg?style=shield)](https://circleci.com/gh/kevgo/node-text-stream-search)

Simple and robust way to scan text streams for text. This works with anything
that emits `data` events with text in the form of Buffers or strings.

```javascript
import StreamSearch from "text-stream-search"

const streamSearch = new TextStreamSearch(myStream)

// wait until the stream contains "hello"
await streamSearch.waitForText("hello")

// capture data from the stream
const matching = await streamSearch.waitForRegex("listening at port \\d+")
// matching contains something like "listening at port 3000"
```

## Related Projects

- [StreamSnitch](https://github.com/dmotz/stream-snitch): does the same thing
  with regular expressions, but is buggy and blocks the event queue

## Development

### Run tests

- run all tests: <code textrun="verify-make-command">make test</code>
- run unit tests: <code textrun="verify-make-command">make unit</code>
- run linters: <code textrun="verify-make-command">make lint</code>
- fix formatting issues: <code textrun="verify-make-command">make lint</code>
- see all available make commands: <code textrun="verify-make-command">make
  help</code>

### Deploy a new version

```
$ yarn version
$ git push
$ git push --tags // CI will publish to NPM
```
