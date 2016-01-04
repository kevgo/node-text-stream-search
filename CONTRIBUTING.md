# Text Stream Search Developer Guidelines


## Setup

* `npm i`
* add `./bin/` to your PATH


## Run tests

```
npm test
```

The spec runs against the compiled output in `lib`,
not the source code in `src`,
so make sure you have [bin/watch](bin/watch) running in the background.


## Update dependencies

```
npm run update
```


## Deploy a new version

```
npm version <patch|minor|major>
npm publish
```
