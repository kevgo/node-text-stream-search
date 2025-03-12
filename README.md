# Text Search in Node.JS Streams

[![tests](https://github.com/kevgo/node-text-stream-search/actions/workflows/test.yml/badge.svg)](https://github.com/kevgo/node-text-stream-search/actions/workflows/test.yml)
[![Code Coverage](https://coveralls.io/repos/github/kevgo/node-text-stream-search/badge.svg?branch=main)](https://coveralls.io/github/kevgo/node-text-stream-search?branch=main)
[![0 dependencies](https://img.shields.io/badge/dependencies-0-brightgreen.svg)](https://github.com/kevgo/node-text-stream-search/blob/main/package.json)
[![install size](https://packagephobia.now.sh/badge?p=text-stream-search)](https://packagephobia.now.sh/result?p=text-stream-search)

This micro-library (no dependencies) searches for occurrences of a given search
term (string or Regex) in a Node.js stream, i.e. anything that emits `data`
events with Buffers or strings.

```javascript
import TextStreamSearch from "text-stream-search"

const streamSearch = new TextStreamSearch(myStream)

// wait until myStream contains "hello"
await streamSearch.waitForText("hello")

// capture data from the stream
const matchText = await streamSearch.waitForRegex("listening at port \\d+.")
// matchingText contains something like "listening at port 3000."

// access the captured stream content
const text = streamSearch.fullText()
```

For a working example see [the end-to-end test](./test/fulltext.test.ts).

## Related projects

- [StreamSnitch](https://github.com/dmotz/stream-snitch): does the same thing
  with regular expressions, but is buggy and blocks the event queue
