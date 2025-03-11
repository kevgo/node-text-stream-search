build: node_modules dist    # builds the codebase

clean:   # removes all build artifacts
	rm -rf dist

coverage: node_modules  # measures test coverage
	${CURDIR}/node_modules/.bin/nyc node_modules/.bin/mocha --require source-map-support/register test/*.ts
	${CURDIR}/node_modules/.bin/nyc report --reporter=text-lcov | node_modules/.bin/coveralls

docs: node_modules build   # runs the documentation tests
	${CURDIR}/node_modules/.bin/text-run --offline --format=dot

fix: node_modules  # fixes the fixable issues in the code base
	npm exec -- dprint fmt
	${CURDIR}/node_modules/.bin/eslint --ext=.ts --fix .

help:   # prints all make targets
	@cat Makefile | grep '^[^ ]*:' | grep -v '.PHONY' | grep -v '.SILENT:' | grep -v help | grep '#' | sed 's/:.*#/#/' | column -s "#" -t

lint: node_modules tools/actionlint  # lints all files
	${CURDIR}/node_modules/.bin/eslint --ext=.ts .
	npm exec -- dprint check
	${CURDIR}/node_modules/.bin/tsc --noEmit
	${CURDIR}/tools/actionlint

test: node_modules build lint unit docs   # runs all tests
.PHONY: test

unit: node_modules   # runs the unit tests
	env NODE_NO_WARNINGS=1 ${CURDIR}/node_modules/.bin/mocha --reporter dot test/*.ts

update:  # update dependencies
	npm exec -- npm-check-updates -u
	npm install


#### helper tasks

dist: $(shell find src -type f)
	${CURDIR}/node_modules/.bin/tsc -p tsconfig-build.json
	touch dist

node_modules: package.json package-lock.json
	npm install
	touch node_modules

tools/actionlint:
	curl -s https://raw.githubusercontent.com/rhysd/actionlint/main/scripts/download-actionlint.bash | bash
	mkdir -p tools
	mv actionlint tools


.SILENT:
.DEFAULT_GOAL := help
