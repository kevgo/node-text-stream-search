# Development Guide

- run all tests: <code type="npm/script-call">npm run test</code>
- run unit tests: <code type="npm/script-call">npm run unit</code>
- run linters: <code type="npm/script-call">npm run lint</code>
- fix all auto-fixable issues: <code type="npm/script-call">npm run fix</code>
- check documentation: <code type="npm/script-call">npm run doc</code>

#### Deploy a new version

- update the version in `package.json` and commit to `main`
- run `npm publish`
