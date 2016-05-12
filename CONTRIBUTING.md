# Text Stream Search Developer Guidelines


## Setup

* `npm i`
* add `./bin/` to your PATH


## Run tests

```
$ spec
$ lint
```

The spec runs against the compiled output in `dist`,
not the source code in `src`,
so make sure you have [bin/watch](bin/watch) running in the background.


## Update dependencies

```
$ update
```


## Deploy a new version

```
$ publish <patch|minor|major>
```
