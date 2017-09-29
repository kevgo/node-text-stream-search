# Text Stream Search Developer Guidelines


## Setup

* `npm i`
* add `./bin/` to your PATH


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
