# Text Search in Node.JS Streams

[![Circle CI](https://circleci.com/gh/kevgo/node-text-stream-search.svg?style=shield)](https://circleci.com/gh/kevgo/node-text-stream-search)
[![Code Coverage](https://coveralls.io/repos/github/kevgo/node-text-stream-search/badge.svg?branch=master)](https://coveralls.io/github/kevgo/node-text-stream-search?branch=master)

This micro-library (no dependencies) searches for occurrences of a given search
term (string or Regex) in a Node.js stream, i.e. anything that emits `data`
events with Buffers or strings.

```javascript
import { StreamSearch } from "text-stream-search"

const streamSearch = new TextStreamSearch(myStream)

// wait until myStream contains "hello"
await streamSearch.waitForText("hello")

// capture data from the stream
const matchText = await streamSearch.waitForRegex("listening at port \\d+.")
// matchingText contains something like "listening at port 3000."
```

## Related projects

- [StreamSnitch](https://github.com/dmotz/stream-snitch): does the same thing
  with regular expressions, but is buggy and blocks the event queue

## Development

- run all tests: <code textrun="verify-make-command">make test</code>
- run unit tests: <code textrun="verify-make-command">make unit</code>
- run linters: <code textrun="verify-make-command">make lint</code>
- fix formatting issues: <code textrun="verify-make-command">make lint</code>
- see all available make commands: <code textrun="verify-make-command">make
  help</code>

#### Deploy a new version

- update the version in `package.json` and commit to `master`
- run `npm publish`
