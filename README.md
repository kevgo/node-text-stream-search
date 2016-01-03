# Node.js Text Stream Search
> Searches for occurrences of a given search term in a Node.js text stream

[![Circle CI](https://circleci.com/gh/Originate/node-text-stream-search.svg?style=shield)](https://circleci.com/gh/Originate/node-text-stream-search)

This is a super simple and robust tool to reliably recognize search text in text streams.


```javascript

streamSearch = require('text-stream-search');


```

Cannot use StreamSnitch because it is buggy and blocks the event queue.
