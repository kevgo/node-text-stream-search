# Text Stream Search Developer Guidelines


## Setup

* add `./bin/` to your PATH
* run `bin/setup`


## Run tests

* run all tests: `$ spec`
* run linters: `$ lint`


## Update dependencies

```
$ update
```


## Deploy a new version

```
$ yarn version
$ git push
$ git push --tags // CI will publish to NPM
```
