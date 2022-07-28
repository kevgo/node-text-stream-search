build: clean    # builds for the current platform
	${CURDIR}/node_modules/.bin/tsc -p tsconfig-build.json

clean:   # removes all build artifacts
	rm -rf dist

coverage:  # measures test coverage
	${CURDIR}/node_modules/.bin/nyc node_modules/.bin/mocha --require source-map-support/register test/*.ts
	${CURDIR}/node_modules/.bin/nyc report --reporter=text-lcov | node_modules/.bin/coveralls

docs: build   # runs the documentation tests
	${CURDIR}/node_modules/.bin/text-run --offline --format=dot

fix:  # fixes the fixable issues in the code base
	${CURDIR}/node_modules/.bin/prettier --write .
	${CURDIR}/node_modules/.bin/eslint --ext=.ts --fix .

help:   # prints all make targets
	cat Makefile | grep '^[^ ]*:' | grep -v '.PHONY' | grep -v '.SILENT:' | grep -v help | sed 's/:.*#/#/' | column -s "#" -t

lint:   # lints all files
	${CURDIR}/node_modules/.bin/eslint --ext=.ts .
	${CURDIR}/node_modules/.bin/prettier --check .
	${CURDIR}/node_modules/.bin/tsc --noEmit

test: lint unit docs   # runs all tests
.PHONY: test

unit:   # runs the unit tests
	${CURDIR}/node_modules/.bin/mocha --reporter dot test/*.ts

update:  # update dependencies
	yarn upgrade --latest


.DEFAULT_GOAL := help
