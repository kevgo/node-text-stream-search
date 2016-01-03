# Node.js Text Stream Search
> Searches for occurrences of a given search term in a Node.js text stream

[![Circle CI](https://circleci.com/gh/Originate/node-text-stream-search.svg?style=shield)](https://circleci.com/gh/Originate/node-text-stream-search)

Super simple and robust way to reliably recognize text in text streams.


```javascript

streamSearch = require('text-stream-search');

new TextStreamSearch(@stream).wait('hello', function() { console.log('found hello') });

// Now if the stream contains the someting including the word "hello",
// the callback above is called exactly once.
```

More information about:
* the [wait](features/wait.feature) command


## Related Projects

* [StreamSnitch](https://github.com/dmotz/stream-snitch): does the same thing with regular expressions,
  but is buggy and blocks the event queue
