# Text Stream Search Developer Guidelines

## Setup

- add `./bin/` to your PATH
- run <code textrun="verify-make-command">make setup</code>

## Run tests

- run all tests: <code textrun="verify-make-command">make test</code>
- run linters: <code textrun="verify-make-command">make lint</code>

## Update dependencies

<pre textrun="verify-make-command">
make upgrade
</pre>

## Deploy a new version

```
$ yarn version
$ git push
$ git push --tags // CI will publish to NPM
```
